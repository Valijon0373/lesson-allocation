import { apiRequest, unwrapPayload } from "./client"

/**
 * @typedef {{ id: string, nameUz: string }} FacultyRow
 */

/**
 * @param {unknown} item
 * @returns {FacultyRow | null}
 */
export function mapFaculty(item) {
  if (!item || typeof item !== "object") return null

  const raw = /** @type {Record<string, unknown>} */ (item)
  const id = raw.id ?? raw.facultyId ?? raw.faculty_id
  if (id == null) return null

  const nameUz =
    raw.nameUz ?? raw.name_uz ?? raw.name ?? raw.title ?? raw.facultyName ?? raw.faculty_name ?? ""

  return {
    id: String(id),
    nameUz: String(nameUz),
  }
}

/**
 * @param {unknown} payload
 * @returns {FacultyRow[]}
 */
function mapFacultyList(payload) {
  const data = unwrapPayload(payload)
  const list = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []
  return list.map(mapFaculty).filter(Boolean)
}

/**
 * @param {unknown} payload
 * @returns {FacultyRow}
 */
function mapFacultyOne(payload) {
  const data = unwrapPayload(payload)
  const item = Array.isArray(data) ? data[0] : data
  const mapped = mapFaculty(item)
  if (!mapped) throw new Error("Fakultet ma'lumotlari noto'g'ri formatda qaytdi")
  return mapped
}

/** @returns {Promise<FacultyRow[]>} */
export async function fetchAllFaculties() {
  const json = await apiRequest("/api/faculties/all")
  return mapFacultyList(json)
}

/** @param {string | number} id @returns {Promise<FacultyRow>} */
export async function fetchFacultyById(id) {
  const json = await apiRequest(`/api/faculties/${encodeURIComponent(String(id))}`)
  return mapFacultyOne(json)
}

/** @param {unknown} payload @returns {FacultyRow | null} */
function tryMapFaculty(payload) {
  if (payload == null) return null
  const direct = mapFaculty(payload)
  if (direct) return direct
  const data = unwrapPayload(payload)
  if (data !== payload) return mapFaculty(data)
  return null
}

/** @param {{ nameUz: string }} body @returns {Promise<FacultyRow>} */
export async function saveFaculty(body) {
  const json = await apiRequest("/api/faculties/save", {
    method: "POST",
    body: JSON.stringify({ name: body.nameUz }),
  })
  const mapped = tryMapFaculty(json)
  if (mapped) return mapped
  return { id: String(Date.now()), nameUz: body.nameUz }
}

/** @param {string | number} id @param {{ nameUz: string }} body @returns {Promise<FacultyRow>} */
export async function updateFaculty(id, body) {
  const json = await apiRequest(`/api/faculties/update/${encodeURIComponent(String(id))}`, {
    method: "PUT",
    body: JSON.stringify({ name: body.nameUz }),
  })
  const mapped = tryMapFaculty(json)
  if (mapped) return mapped
  return { id: String(id), nameUz: body.nameUz }
}

/** @param {string | number} id @returns {Promise<void>} */
export async function deleteFaculty(id) {
  await apiRequest(`/api/faculties/delete/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  })
}
