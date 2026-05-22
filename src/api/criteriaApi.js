import { apiRequest, unwrapPayload } from "./client"

/**
 * Backend «Criteria» = UI dagi Bo'lim (ota guruh).
 *
 * CriteriaResponse (GET): id, criteria, maxBall, status, createdAt, updatedAt, createdUser
 * CriteriaDTO (POST/PUT): name, maxBall
 *
 * @typedef {{ id: string, title: string, maxScore: number }} SectionRow
 */

/** CriteriaDTO — saqlash/tahrirlash */
function buildCriteriaSaveBody(body) {
  return {
    name: body.title.trim(),
    maxBall: body.maxScore,
    status: "ACTIVE",
  }
}

/**
 * CriteriaResponse → UI bo'limi (nom javobda `criteria` maydonida).
 * @param {unknown} item
 * @returns {SectionRow | null}
 */
export function mapSection(item) {
  if (!item || typeof item !== "object") return null

  const raw = /** @type {Record<string, unknown>} */ (item)
  const id = raw.id ?? raw.criteriaId ?? raw.criteria_id
  if (id == null) return null

  const title =
    (typeof raw.criteria === "string" ? raw.criteria : null) ??
    raw.name ??
    raw.title ??
    raw.criterionName ??
    raw.criterion_name ??
    ""

  const maxRaw = raw.maxBall ?? raw.max_ball ?? raw.maxScore ?? raw.max_score
  const maxScore = Number(maxRaw)
  const safeMax = Number.isFinite(maxScore) && maxScore > 0 ? maxScore : 20

  return {
    id: String(id),
    title: String(title).trim() || "Bo'lim",
    maxScore: safeMax,
  }
}

/**
 * @param {unknown} payload
 * @returns {SectionRow[]}
 */
function mapSectionList(payload) {
  const data = unwrapPayload(payload)
  const list = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []
  return list.map(mapSection).filter(Boolean)
}

/**
 * @param {unknown} payload
 * @returns {SectionRow}
 */
function mapSectionOne(payload) {
  const data = unwrapPayload(payload)
  const item = Array.isArray(data) ? data[0] : data
  const mapped = mapSection(item)
  if (!mapped) throw new Error("Bo'lim ma'lumotlari noto'g'ri formatda qaytdi")
  return mapped
}

/**
 * GET /api/criteria/all — barcha bo'limlar.
 * @returns {Promise<SectionRow[]>}
 */
export async function fetchAllSections() {
  const json = await apiRequest("/api/criteria/all")
  return mapSectionList(json)
}

/** @param {string | number} id @returns {Promise<SectionRow>} */
export async function fetchSectionById(id) {
  const json = await apiRequest(`/api/criteria/${encodeURIComponent(String(id))}`)
  return mapSectionOne(json)
}

/** @param {unknown} payload @returns {SectionRow | null} */
function tryMapSection(payload) {
  if (payload == null) return null
  const direct = mapSection(payload)
  if (direct) return direct
  const data = unwrapPayload(payload)
  if (data !== payload) return mapSection(data)
  return null
}

/**
 * POST /api/criteria/save — yangi bo'lim.
 * @param {{ title: string, maxScore: number }} body
 * @returns {Promise<SectionRow>}
 */
export async function saveSection(body) {
  const json = await apiRequest("/api/criteria/save", {
    method: "POST",
    body: JSON.stringify(buildCriteriaSaveBody(body)),
  })
  const mapped = tryMapSection(json)
  if (mapped) return mapped
  return {
    id: `tmp-${Date.now()}`,
    title: body.title,
    maxScore: body.maxScore,
  }
}

/**
 * PUT /api/criteria/update/{id} — bo'limni tahrirlash.
 * @param {string | number} id
 * @param {{ title: string, maxScore: number }} body
 * @returns {Promise<SectionRow>}
 */
export async function updateSection(id, body) {
  const json = await apiRequest(`/api/criteria/update/${encodeURIComponent(String(id))}`, {
    method: "PUT",
    body: JSON.stringify(buildCriteriaSaveBody(body)),
  })
  const mapped = tryMapSection(json)
  if (mapped) return mapped
  return {
    id: String(id),
    title: body.title,
    maxScore: body.maxScore,
  }
}

/**
 * DELETE /api/criteria/delete/{id} — bo'limni o'chirish.
 * @param {string | number} id
 * @returns {Promise<void>}
 */
export async function deleteSection(id) {
  await apiRequest(`/api/criteria/delete/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  })
}
