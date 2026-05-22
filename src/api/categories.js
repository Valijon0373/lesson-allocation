import { apiRequest, unwrapPayload } from "./client"
import { mezonError, mezonLog, mezonWarn } from "./mezonDebug"

/**
 * Backend «Category» = UI dagi Mezon.
 *
 * CategoryResponse (GET): id, name, maxBall, status, fileUpload, createdAt, updatedAt, createdUser
 * CategoryDTO (POST/PUT): name, maxBall, criteriaId, isFileUpload
 *
 * @typedef {{ id: string, sectionId: string, title: string, maxScore: number, requiredDocs: string[], collected: number, status: 'approved'|'pending' }} CriterionRow
 */

/** CategoryDTO — mezon saqlash/tahrirlash (criteriaId = tanlangan bo'lim id) */
function buildCategorySaveBody(body, criteriaId) {
  const criteriaIdNum = Number(criteriaId)
  return {
    name: body.title.trim(),
    maxBall: body.maxScore,
    criteriaId: criteriaIdNum,
    isFileUpload: false,
    status: "ACTIVE",
  }
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function parseCriteriaId(value) {
  if (value == null || value === "") return null
  const n = Number(value)
  if (Number.isFinite(n) && n > 0) return String(Math.trunc(n))
  const s = String(value).trim()
  return s || null
}

/**
 * @param {unknown} item
 * @param {string | null} [fallbackSectionId]
 * @returns {CriterionRow | null}
 */
export function mapCriterion(item, fallbackSectionId = null) {
  if (!item || typeof item !== "object") return null

  const raw = /** @type {Record<string, unknown>} */ (item)
  const id = raw.id ?? raw.categoryId ?? raw.category_id
  if (id == null) {
    mezonWarn("mapCriterion: id yo'q, qator tashlandi", raw)
    return null
  }

  const criteriaRef =
    raw.criteria && typeof raw.criteria === "object"
      ? /** @type {Record<string, unknown>} */ (raw.criteria)
      : null

  const sectionId =
    parseCriteriaId(raw.criteriaId) ??
    parseCriteriaId(raw.criteria_id) ??
    parseCriteriaId(raw.criterionId) ??
    parseCriteriaId(raw.criterion_id) ??
    parseCriteriaId(criteriaRef?.id) ??
    parseCriteriaId(raw.sectionId) ??
    parseCriteriaId(raw.section_id) ??
    fallbackSectionId

  const title =
    (typeof raw.name === "string" ? raw.name : null) ??
    raw.title ??
    raw.categoryName ??
    raw.category_name ??
    ""

  const maxRaw = raw.maxBall ?? raw.max_ball ?? raw.maxScore ?? raw.max_score
  const maxScore = Number(maxRaw)
  const safeMax = Number.isFinite(maxScore) && maxScore > 0 ? maxScore : 1

  const requiredDocs = Array.isArray(raw.requiredDocs)
    ? raw.requiredDocs.map(String)
    : Array.isArray(raw.required_docs)
      ? raw.required_docs.map(String)
      : []

  const collectedRaw = raw.collected ?? raw.collectedScore ?? raw.collected_score
  const collected = Number(collectedRaw)
  const status = raw.status === "approved" || raw.status === "ACTIVE" ? "approved" : "pending"

  return {
    id: String(id),
    sectionId: sectionId ?? "",
    title: String(title).trim() || "Mezon",
    maxScore: safeMax,
    requiredDocs,
    collected: Number.isFinite(collected) ? collected : 0,
    status,
  }
}

/**
 * @param {CriterionRow[]} rows
 * @param {{ id: string }[]} [sections]
 * @returns {CriterionRow[]}
 */
export function attachOrphanCriterionRows(rows, sections = []) {
  if (sections.length === 0) return rows
  const sectionIds = new Set(sections.map((s) => s.id))
  const onlySectionId = sections.length === 1 ? sections[0].id : null

  return rows.map((row) => {
    if (row.sectionId && sectionIds.has(row.sectionId)) return row
    if (onlySectionId) return { ...row, sectionId: onlySectionId }
    return row
  })
}

/**
 * @param {unknown} payload
 * @param {string | null} [fallbackSectionId]
 * @returns {CriterionRow[]}
 */
function mapCriterionList(payload, fallbackSectionId = null) {
  const data = unwrapPayload(payload)
  const list = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []
  return list.map((item) => mapCriterion(item, fallbackSectionId)).filter(Boolean)
}

/**
 * @param {unknown} payload
 * @param {string | null} [fallbackSectionId]
 * @returns {CriterionRow}
 */
function mapCriterionOne(payload, fallbackSectionId = null) {
  const data = unwrapPayload(payload)
  const item = Array.isArray(data) ? data[0] : data
  const mapped = mapCriterion(item, fallbackSectionId)
  if (!mapped) throw new Error("Mezon ma'lumotlari noto'g'ri formatda qaytdi")
  return mapped
}

/**
 * @param {unknown} payload
 * @param {string | null} [fallbackSectionId]
 * @returns {CriterionRow | null}
 */
function tryMapCriterion(payload, fallbackSectionId = null) {
  if (payload == null) return null

  const direct = mapCriterion(payload, fallbackSectionId)
  if (direct) {
    return direct.sectionId ? direct : { ...direct, sectionId: fallbackSectionId ?? direct.sectionId }
  }

  const data = unwrapPayload(payload)
  if (data !== payload) {
    const nested = mapCriterion(data, fallbackSectionId)
    if (nested) return nested
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = /** @type {Record<string, unknown>} */ (data)
    const id = obj.id ?? obj.categoryId
    if (id != null) {
      return mapCriterion(
        {
          id,
          name: obj.name ?? obj.title,
          maxBall: obj.maxBall ?? obj.max_ball,
          criteriaId: obj.criteriaId ?? obj.criteria_id ?? fallbackSectionId,
        },
        fallbackSectionId
      )
    }
  }

  return null
}

/**
 * GET /api/categories/all — barcha mezonlar.
 * @param {{ id: string }[]} [sections]
 * @returns {Promise<CriterionRow[]>}
 */
export async function fetchAllCriterionRows(sections = []) {
  mezonLog("GET /api/categories/all — yuklanmoqda", { boLimlar: sections.map((s) => ({ id: s.id, title: s.title })) })
  try {
    const json = await apiRequest("/api/categories/all")
    const data = unwrapPayload(json)
    const rawList = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []
    const onlySectionId = sections.length === 1 ? sections[0].id : null
    const rows = mapCriterionList(json, onlySectionId)
    const attached = attachOrphanCriterionRows(rows, sections)

    mezonLog("GET /api/categories/all — javob", {
      serverdanKelgan: rawList.length,
      mapQilindi: rows.length,
      koRsatiladi: attached.length,
      namuna: rawList[0] ?? null,
    })

    if (rawList.length > 0 && attached.length === 0) {
      mezonWarn(
        "Serverdan mezon keldi, lekin criteriaId yo'q — ro'yxatda ko'rinmasligi mumkin",
        rawList.slice(0, 3)
      )
    }

    return attached
  } catch (err) {
    mezonError("GET /api/categories/all — xato", err)
    throw err
  }
}

/**
 * GET /api/categories/{id} — bitta mezon.
 * @param {string | number} id
 * @param {string | null} [fallbackSectionId]
 * @returns {Promise<CriterionRow>}
 */
export async function fetchCriterionRowById(id, fallbackSectionId = null) {
  const json = await apiRequest(`/api/categories/${encodeURIComponent(String(id))}`)
  return mapCriterionOne(json, fallbackSectionId)
}

/**
 * POST /api/categories/save — mezon qo'shish.
 * @param {{ sectionId: string, title: string, maxScore: number }} body
 * @returns {Promise<CriterionRow>}
 */
export async function saveCriterionRow(body) {
  const criteriaId = parseCriteriaId(body.sectionId)
  if (!criteriaId) {
    mezonError("Saqlash to'xtatildi: bo'lim (criteriaId) tanlanmagan", new Error("criteriaId yo'q"), { body })
    throw new Error("Avval bo'lim tanlang")
  }

  const criteriaIdNum = Number(criteriaId)
  if (!Number.isFinite(criteriaIdNum) || criteriaIdNum <= 0) {
    throw new Error("Bo'lim identifikatori noto'g'ri")
  }

  const payload = buildCategorySaveBody(body, criteriaId)
  const url = "/api/categories/save"
  mezonLog("POST " + url + " — yuborilmoqda", payload)

  try {
    const json = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify(payload),
    })

    mezonLog("POST " + url + " — muvaffaqiyat", json)

    const mapped = tryMapCriterion(json, criteriaId)
    if (mapped) {
      const row = mapped.sectionId ? mapped : { ...mapped, sectionId: criteriaId }
      mezonLog("POST " + url + " — map natija", row)
      return row
    }

    mezonWarn("POST " + url + " — javob map bo'lmadi, vaqtinchalik qator", { json, criteriaId })
    return {
      id: `tmp-${Date.now()}`,
      sectionId: criteriaId,
      title: body.title,
      maxScore: body.maxScore,
      requiredDocs: [],
      collected: 0,
      status: "pending",
    }
  } catch (err) {
    mezonError("POST " + url + " — server rad etdi (qo'shilmadi)", err, { yuborilganBody: payload })
    throw err
  }
}

/**
 * PUT /api/categories/update/{id} — mezonni tahrirlash.
 * @param {string | number} id
 * @param {{ sectionId: string, title: string, maxScore: number }} body
 * @returns {Promise<CriterionRow>}
 */
export async function updateCriterionRow(id, body) {
  const criteriaId = parseCriteriaId(body.sectionId)
  if (!criteriaId) throw new Error("Avval bo'lim tanlang")

  const payload = buildCategorySaveBody(body, criteriaId)
  const url = `/api/categories/update/${encodeURIComponent(String(id))}`
  mezonLog("PUT " + url, payload)

  try {
    const json = await apiRequest(url, {
      method: "PUT",
      body: JSON.stringify(payload),
    })

    const mapped = tryMapCriterion(json, criteriaId)
    if (mapped) {
      return mapped.sectionId ? mapped : { ...mapped, sectionId: criteriaId }
    }

    return {
      id: String(id),
      sectionId: criteriaId,
      title: body.title,
      maxScore: body.maxScore,
      requiredDocs: [],
      collected: 0,
      status: "pending",
    }
  } catch (err) {
    mezonError("PUT " + url + " — xato", err, { payload })
    throw err
  }
}

/**
 * DELETE /api/categories/delete/{id} — mezonni o'chirish.
 * @param {string | number} id
 * @returns {Promise<void>}
 */
export async function deleteCriterionRow(id) {
  const url = `/api/categories/delete/${encodeURIComponent(String(id))}`
  mezonLog("DELETE " + url)
  try {
    await apiRequest(url, { method: "DELETE" })
    mezonLog("DELETE " + url + " — OK")
  } catch (err) {
    mezonError("DELETE " + url + " — xato", err)
    throw err
  }
}
