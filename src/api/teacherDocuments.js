import { apiRequest, unwrapPayload } from "./client"
import { getFileDownloadUrl } from "./files"

/**
 * @typedef {{
 *   id: string,
 *   teacherDocumentId: string,
 *   teacherId: string,
 *   criterionId: string,
 *   evidenceType: "file" | "link" | "video",
 *   fileName: string,
 *   fileSize: number,
 *   fileType: string,
 *   fileDataUrl: string,
 *   url: string,
 *   comment: string,
 *   uploadedAt: string,
 * }} TeacherSubmission
 */

/**
 * @typedef {{
 *   submissions: TeacherSubmission[],
 *   documentIdByCriterion: Record<string, string>,
 * }} TeacherDocumentsPayload
 */

/**
 * @param {unknown} type
 * @returns {"file" | "link" | "video"}
 */
function mapResourceEvidenceType(type) {
  const normalized = String(type ?? "").toUpperCase()
  if (normalized === "LINK") return "video"
  if (normalized === "RESOURCE") return "link"
  return "file"
}

/**
 * @param {"file" | "link" | "video"} evidenceType
 * @returns {"FILE" | "LINK" | "RESOURCE"}
 */
function mapApiResourceType(evidenceType) {
  if (evidenceType === "video") return "LINK"
  if (evidenceType === "link") return "RESOURCE"
  return "FILE"
}

/**
 * @param {unknown} resource
 * @param {string} teacherId
 * @param {string} criterionId
 * @param {string} teacherDocumentId
 * @returns {TeacherSubmission | null}
 */
function mapResourceSubmission(resource, teacherId, criterionId, teacherDocumentId) {
  if (!resource || typeof resource !== "object") return null
  const raw = /** @type {Record<string, unknown>} */ (resource)
  const id = raw.id ?? raw.resourceId
  if (id == null || !criterionId) return null

  const evidenceType = mapResourceEvidenceType(raw.type)
  const link = String(raw.link ?? raw.url ?? "")
  const fileName =
    evidenceType === "video"
      ? "Video link"
      : evidenceType === "link"
        ? "Web link"
        : link
          ? link.split("/").pop() || "Hujjat"
          : "Hujjat"

  return {
    id: String(id),
    teacherDocumentId,
    teacherId,
    criterionId,
    evidenceType,
    fileName,
    fileSize: 0,
    fileType: evidenceType === "file" ? "application/octet-stream" : "url",
    fileDataUrl: "",
    url: evidenceType === "file" && link ? link : evidenceType === "file" ? getFileDownloadUrl(fileName) : link,
    comment: String(raw.description ?? raw.comment ?? ""),
    uploadedAt: String(raw.uploadedAt ?? raw.createdAt ?? new Date().toISOString()),
  }
}

/**
 * @param {unknown} payload
 * @param {string} teacherId
 * @returns {TeacherDocumentsPayload}
 */
function extractTeacherDocuments(payload, teacherId) {
  const data = unwrapPayload(payload)
  const list = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []
  /** @type {TeacherSubmission[]} */
  const submissions = []
  /** @type {Record<string, string>} */
  const documentIdByCriterion = {}

  for (const item of list) {
    if (!item || typeof item !== "object") continue
    const doc = /** @type {Record<string, unknown>} */ (item)
    const teacherDocumentId = doc.id ?? doc.teacherDocumentId ?? doc.documentId
    const category = doc.category
    const categoryObj = category && typeof category === "object" ? /** @type {Record<string, unknown>} */ (category) : null
    const criterionId = String(
      categoryObj?.id ??
        doc.categoryId ??
        doc.criterionId ??
        doc.criteriaId ??
        "",
    ).trim()

    if (teacherDocumentId != null && criterionId) {
      documentIdByCriterion[criterionId] = String(teacherDocumentId)
    }

    const resources = Array.isArray(doc.resources) ? doc.resources : []
    for (const resource of resources) {
      const mapped = mapResourceSubmission(
        resource,
        teacherId,
        criterionId,
        String(teacherDocumentId ?? ""),
      )
      if (mapped) submissions.push(mapped)
    }
  }

  return { submissions, documentIdByCriterion }
}

/**
 * @param {unknown} data
 * @param {{
 *   teacherDocumentId: string,
 *   teacherId: string,
 *   criterionId: string,
 *   evidenceType: "file" | "link" | "video",
 *   file?: File,
 *   url?: string,
 *   comment?: string,
 * }} body
 * @returns {TeacherSubmission | null}
 */
function mapSaveResponse(data, body) {
  const raw = data && typeof data === "object" ? /** @type {Record<string, unknown>} */ (data) : {}
  const id = raw.id ?? raw.resourceId
  const link = String(raw.link ?? raw.url ?? body.url ?? "")

  return {
    id: id != null ? String(id) : crypto.randomUUID(),
    teacherDocumentId: String(body.teacherDocumentId),
    teacherId: String(body.teacherId),
    criterionId: String(body.criterionId),
    evidenceType: body.evidenceType,
    fileName:
      body.file?.name ??
      (body.evidenceType === "video" ? "Video link" : body.evidenceType === "link" ? "Web link" : "Hujjat"),
    fileSize: body.file?.size ?? 0,
    fileType: body.file?.type ?? (body.evidenceType === "file" ? "application/octet-stream" : "url"),
    fileDataUrl: "",
    url:
      body.evidenceType === "file"
        ? link || getFileDownloadUrl(body.file?.name ?? "Hujjat")
        : link || String(body.url ?? ""),
    comment: String(body.comment ?? raw.description ?? ""),
    uploadedAt: new Date().toISOString(),
  }
}

/**
 * @param {string} teacherId
 * @returns {Promise<TeacherDocumentsPayload>}
 */
export async function fetchTeacherDocuments(teacherId) {
  const json = await apiRequest(`/api/documents/${encodeURIComponent(String(teacherId))}/all`)
  return extractTeacherDocuments(json, teacherId)
}

/**
 * POST /api/documents/{teacherDocumentId}/save — multipart/form-data
 * @param {{
 *   teacherDocumentId: string,
 *   teacherId: string,
 *   criterionId: string,
 *   evidenceType: "file" | "link" | "video",
 *   file?: File,
 *   url?: string,
 *   comment?: string,
 * }} body
 * @returns {Promise<TeacherSubmission>}
 */
export async function saveTeacherDocument(body) {
  const teacherDocumentId = String(body.teacherDocumentId ?? "").trim()
  if (!teacherDocumentId) {
    throw new Error("Ushbu mezon uchun hujjat identifikatori topilmadi. Sahifani yangilab qayta urinib ko'ring.")
  }

  const formData = new FormData()
  formData.append("description", body.comment ?? "")
  formData.append("type", mapApiResourceType(body.evidenceType))

  if (body.evidenceType === "file") {
    if (!body.file) throw new Error("Fayl tanlanmagan")
    formData.append("file", body.file)
  } else if (body.evidenceType === "video") {
    formData.append("videoLink", body.url ?? "")
  } else {
    formData.append("resourceLink", body.url ?? "")
  }

  const json = await apiRequest(`/api/documents/${encodeURIComponent(teacherDocumentId)}/save`, {
    method: "POST",
    body: formData,
  })

  return mapSaveResponse(unwrapPayload(json), body)
}

/**
 * DELETE /api/documents/delete/{resourceId}
 * @param {string} resourceId
 */
export async function deleteTeacherResource(resourceId) {
  await apiRequest(`/api/documents/delete/${encodeURIComponent(String(resourceId))}`, { method: "DELETE" })
}
