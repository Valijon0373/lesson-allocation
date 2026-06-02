import { apiRequest, unwrapPayload } from "./client"

/**
 * @typedef {{
 *   id: string,
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
 * @param {unknown} item
 * @returns {TeacherSubmission | null}
 */
function mapSubmission(item) {
  if (!item || typeof item !== "object") return null
  const raw = /** @type {Record<string, unknown>} */ (item)
  const id = raw.id ?? raw.documentId ?? raw.teacherDocumentId ?? raw.teacher_document_id
  const teacherId = raw.teacherId ?? raw.teacher_id ?? raw.userId ?? raw.user_id
  const criterionId = raw.criterionId ?? raw.criteriaId ?? raw.criteria_id ?? raw.mezonId ?? raw.mezon_id
  if (id == null || teacherId == null || criterionId == null) return null

  return {
    id: String(id),
    teacherId: String(teacherId),
    criterionId: String(criterionId),
    evidenceType: String(raw.evidenceType ?? raw.type ?? "file") === "video" ? "video" : String(raw.evidenceType ?? raw.type ?? "file") === "link" ? "link" : "file",
    fileName: String(raw.fileName ?? raw.filename ?? raw.name ?? "Hujjat"),
    fileSize: Number(raw.fileSize ?? raw.size ?? 0) || 0,
    fileType: String(raw.fileType ?? raw.mimeType ?? raw.contentType ?? "application/octet-stream"),
    fileDataUrl: String(raw.fileDataUrl ?? raw.dataUrl ?? raw.fileData ?? ""),
    url: String(raw.url ?? raw.link ?? ""),
    comment: String(raw.comment ?? raw.izoh ?? ""),
    uploadedAt: String(raw.uploadedAt ?? raw.createdAt ?? new Date().toISOString()),
  }
}

/**
 * @param {unknown} payload
 * @returns {TeacherSubmission[]}
 */
function mapSubmissionList(payload) {
  const data = unwrapPayload(payload)
  const list = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []
  return list.map(mapSubmission).filter(Boolean)
}

/**
 * @param {File} file
 * @returns {Promise<{ fileName: string, url?: string }>}
 */
export async function uploadTeacherFile(file) {
  const body = new FormData()
  body.append("file", file)
  const json = await apiRequest("/api/files/upload", { method: "POST", body })
  const data = /** @type {Record<string, unknown>} */ (unwrapPayload(json) ?? {})
  const fileName = data.fileName ?? data.filename ?? data.name ?? data.storedName ?? file.name
  const url = data.url ?? data.path ?? data.downloadUrl
  return {
    fileName: String(fileName),
    url: url ? String(url) : undefined,
  }
}

/**
 * @param {{
 *   teacherId: string,
 *   criterionId: string,
 *   evidenceType: "file" | "link" | "video",
 *   fileName?: string,
 *   fileSize?: number,
 *   fileType?: string,
 *   url?: string,
 *   comment?: string,
 * }} body
 * @returns {Promise<TeacherSubmission | null>}
 */
export async function saveTeacherDocument(body) {
  const json = await apiRequest(`/api/documents/${encodeURIComponent(String(body.criterionId))}/save`, {
    method: "POST",
    body: JSON.stringify({
      teacherId: body.teacherId,
      criteriaId: body.criterionId,
      criterionId: body.criterionId,
      type: body.evidenceType,
      evidenceType: body.evidenceType,
      fileName: body.fileName ?? "",
      fileSize: body.fileSize ?? 0,
      fileType: body.fileType ?? "application/octet-stream",
      url: body.url ?? "",
      comment: body.comment ?? "",
    }),
  })
  const mapped = mapSubmission(unwrapPayload(json))
  return mapped
}

/**
 * @param {string} teacherId
 * @returns {Promise<TeacherSubmission[]>}
 */
export async function fetchTeacherDocuments(teacherId) {
  const json = await apiRequest(`/api/documents/${encodeURIComponent(String(teacherId))}/all`)
  return mapSubmissionList(json)
}
