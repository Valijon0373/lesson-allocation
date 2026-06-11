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
 *   evaluationsByCriterion: Record<string, { score: number, comment: string, status: "approved" | "pending", scoredBy: string }>,
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
  const serverFileName = String(raw.fileName ?? raw.fileNameOnServer ?? "")
  const resolvedFileName =
    evidenceType === "video"
      ? "Video link"
      : evidenceType === "link"
        ? "Web link"
        : serverFileName
          ? serverFileName
          : link
            ? link.split("/").pop() || "Hujjat"
            : "Hujjat"

  const resolvedFileDataUrl = String(raw.fileDataUrl ?? raw.fileUrl ?? raw.downloadUrl ?? "")

  return {
    id: String(id),
    teacherDocumentId,
    teacherId,
    criterionId,
    evidenceType,
    fileName: resolvedFileName,
    fileSize: Number(raw.fileSize ?? raw.size ?? 0),
    fileType: evidenceType === "file"
      ? (String(raw.fileType ?? raw.mimeType ?? "") || "application/octet-stream")
      : "url",
    fileDataUrl: resolvedFileDataUrl,
    url: evidenceType === "file"
      ? (link || resolvedFileDataUrl || getFileDownloadUrl(resolvedFileName))
      : link,
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
  /** @type {Record<string, { score: number, comment: string, status: "approved" | "pending" }>} */
  const evaluationsByCriterion = {}

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

      const scoredRaw = doc.scoredBall ?? doc.scored_ball ?? doc.ball ?? doc.score
      const scoredBall = Number(scoredRaw)
      const expertComment = String(doc.expertComment ?? doc.expert_comment ?? doc.comment ?? "")
      const hasScore = scoredRaw != null && scoredRaw !== "" && Number.isFinite(scoredBall)
      const scoredTime = doc.scoredTime ?? doc.scored_time
      const scoredBy =
        doc.scoredBy ??
        doc.scored_by ??
        doc.expertName ??
        doc.expert_name ??
        doc.evaluatorName ??
        doc.evaluatorFullName ??
        (typeof doc.scoredByUser === "object" && doc.scoredByUser
          ? doc.scoredByUser.fullName ?? doc.scoredByUser.fio ?? doc.scoredByUser.name
          : undefined) ??
        ""

      evaluationsByCriterion[criterionId] = {
        score: hasScore ? scoredBall : 0,
        comment: expertComment,
        status: hasScore || scoredTime ? "approved" : "pending",
        scoredBy: String(scoredBy ?? ""),
      }
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

  return { submissions, documentIdByCriterion, evaluationsByCriterion }
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
  const serverFileName = String(raw.fileName ?? raw.fileNameOnServer ?? "")
  const resolvedFileDataUrl = String(raw.fileDataUrl ?? raw.fileUrl ?? raw.downloadUrl ?? "")

  const resolvedFileName =
    serverFileName ||
    body.file?.name ||
    (body.evidenceType === "video" ? "Video link" : body.evidenceType === "link" ? "Web link" : "Hujjat")

  return {
    id: id != null ? String(id) : crypto.randomUUID(),
    teacherDocumentId: String(body.teacherDocumentId),
    teacherId: String(body.teacherId),
    criterionId: String(body.criterionId),
    evidenceType: body.evidenceType,
    fileName: resolvedFileName,
    fileSize: body.file?.size ?? Number(raw.fileSize ?? raw.size ?? 0),
    fileType: body.file?.type ??
      (String(raw.fileType ?? raw.mimeType ?? "") || (body.evidenceType === "file" ? "application/octet-stream" : "url")),
    fileDataUrl: resolvedFileDataUrl,
    url:
      body.evidenceType === "file"
        ? (link || resolvedFileDataUrl || getFileDownloadUrl(resolvedFileName))
        : (link || String(body.url ?? "")),
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
    throw new Error("Ushbu mezon uchun hujjat topilmadi. Sahifani yangilab qayta urinib ko'ring.")
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

/**
 * PUT /api/teacher/documents/set/ball — mezon hujjatiga ball qo'yish (Komissiya).
 * @param {{ documentId: string | number, ball: number, comment?: string, scoredBy?: string }} body
 */
export async function setDocumentBall(body) {
  const documentIdRaw = body.documentId
  const documentId = /^\d+$/.test(String(documentIdRaw))
    ? Number(documentIdRaw)
    : documentIdRaw

  await apiRequest("/api/teacher/documents/set/ball", {
    method: "PUT",
    body: JSON.stringify({
      documentId,
      ball: body.ball,
      comment: body.comment ?? "",
      scoredBy: body.scoredBy ?? "",
    }),
  })
}