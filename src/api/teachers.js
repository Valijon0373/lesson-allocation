import { apiRequest, unwrapPayload } from "./client"

/**
 * @typedef {{ id: string, fio: string, login: string, facultyId: string, departmentId: string, fakultet?: string, kafedra?: string, password?: string }} TeacherRow
 */

/**
 * @param {unknown} item
 * @param {Record<string, string>} [facultyNames]
 * @param {Record<string, string>} [departmentNames]
 * @returns {TeacherRow | null}
 */
export function mapTeacher(item, facultyNames, departmentNames) {
  if (!item || typeof item !== "object") return null

  const raw = /** @type {Record<string, unknown>} */ (item)
  const id = raw.id ?? raw.teacherId ?? raw.teacher_id
  const login = raw.username ?? raw.login
  if (id == null || login == null) return null

  const facultyId = raw.facultyId ?? raw.faculty_id ?? raw.faculty?.id ?? raw.faculty ?? ""
  const departmentId =
    raw.departmentId ?? raw.department_id ?? raw.department?.id ?? raw.department ?? ""

  const fid = String(facultyId)
  const did = String(departmentId)

  const fakultet =
    raw.facultyName ??
    raw.faculty_name ??
    (typeof raw.faculty === "object" && raw.faculty
      ? /** @type {Record<string, unknown>} */ (raw.faculty).nameUz ??
        /** @type {Record<string, unknown>} */ (raw.faculty).name
      : undefined) ??
    facultyNames?.[fid] ??
    ""

  const kafedra =
    raw.departmentName ??
    raw.department_name ??
    (typeof raw.department === "object" && raw.department
      ? /** @type {Record<string, unknown>} */ (raw.department).nameUz ??
        /** @type {Record<string, unknown>} */ (raw.department).name
      : undefined) ??
    departmentNames?.[did] ??
    ""

  return {
    id: String(id),
    fio: String(raw.fullName ?? raw.fio ?? raw.name ?? ""),
    login: String(login),
    facultyId: fid,
    departmentId: did,
    fakultet: String(fakultet),
    kafedra: String(kafedra),
  }
}

/**
 * @param {unknown} payload
 * @param {Record<string, string>} [facultyNames]
 * @param {Record<string, string>} [departmentNames]
 * @returns {TeacherRow[]}
 */
function mapTeacherList(payload, facultyNames, departmentNames) {
  const data = unwrapPayload(payload)
  const list = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []
  return list.map((item) => mapTeacher(item, facultyNames, departmentNames)).filter(Boolean)
}

/**
 * @param {unknown} payload
 * @param {Record<string, string>} [facultyNames]
 * @param {Record<string, string>} [departmentNames]
 * @returns {TeacherRow}
 */
function mapTeacherOne(payload, facultyNames, departmentNames) {
  const data = unwrapPayload(payload)
  const item = Array.isArray(data) ? data[0] : data
  const mapped = mapTeacher(item, facultyNames, departmentNames)
  if (!mapped) throw new Error("O'qituvchi ma'lumotlari noto'g'ri formatda qaytdi")
  return mapped
}

/** @param {unknown} payload @param {Record<string, string>} [facultyNames] @param {Record<string, string>} [departmentNames] @returns {TeacherRow | null} */
function tryMapTeacher(payload, facultyNames, departmentNames) {
  if (payload == null) return null
  const direct = mapTeacher(payload, facultyNames, departmentNames)
  if (direct) return direct
  const data = unwrapPayload(payload)
  if (data !== payload) return mapTeacher(data, facultyNames, departmentNames)
  return null
}

/** @param {Record<string, string>} [facultyNames] @param {Record<string, string>} [departmentNames] @returns {Promise<TeacherRow[]>} */
export async function fetchAllTeachers(facultyNames, departmentNames) {
  const json = await apiRequest("/api/teachers/all")
  return mapTeacherList(json, facultyNames, departmentNames)
}

/** @param {string | number} id @param {Record<string, string>} [facultyNames] @param {Record<string, string>} [departmentNames] @returns {Promise<TeacherRow>} */
export async function fetchTeacherById(id, facultyNames, departmentNames) {
  const json = await apiRequest(`/api/teachers/${encodeURIComponent(String(id))}`)
  return mapTeacherOne(json, facultyNames, departmentNames)
}

/**
 * @param {{ fio: string, login: string, password: string, facultyId: string, departmentId: string }} body
 * @param {Record<string, string>} [facultyNames]
 * @param {Record<string, string>} [departmentNames]
 * @returns {Promise<TeacherRow>}
 */
export async function saveTeacher(body, facultyNames, departmentNames) {
  const json = await apiRequest("/api/teachers/save", {
    method: "POST",
    body: JSON.stringify({
      fullName: body.fio,
      fio: body.fio,
      username: body.login,
      login: body.login,
      password: body.password,
      facultyId: body.facultyId,
      departmentId: body.departmentId,
    }),
  })
  const mapped = tryMapTeacher(json, facultyNames, departmentNames)
  if (mapped) return mapped
  return {
    id: String(Date.now()),
    fio: body.fio,
    login: body.login,
    facultyId: body.facultyId,
    departmentId: body.departmentId,
    fakultet: facultyNames?.[body.facultyId] ?? "",
    kafedra: departmentNames?.[body.departmentId] ?? "",
  }
}

/**
 * @param {string | number} id
 * @param {{ fio: string, login: string, facultyId: string, departmentId: string, password?: string }} body
 * @param {Record<string, string>} [facultyNames]
 * @param {Record<string, string>} [departmentNames]
 * @returns {Promise<TeacherRow>}
 */
export async function updateTeacher(id, body, facultyNames, departmentNames) {
  const payload = {
    fullName: body.fio,
    fio: body.fio,
    username: body.login,
    login: body.login,
    facultyId: body.facultyId,
    departmentId: body.departmentId,
  }
  if (body.password) payload.password = body.password

  const json = await apiRequest(`/api/teachers/update/${encodeURIComponent(String(id))}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
  const mapped = tryMapTeacher(json, facultyNames, departmentNames)
  if (mapped) return mapped
  return {
    id: String(id),
    fio: body.fio,
    login: body.login,
    facultyId: body.facultyId,
    departmentId: body.departmentId,
    fakultet: facultyNames?.[body.facultyId] ?? "",
    kafedra: departmentNames?.[body.departmentId] ?? "",
  }
}

/** @param {string | number} id @returns {Promise<void>} */
export async function deleteTeacher(id) {
  await apiRequest(`/api/teachers/delete/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  })
}
