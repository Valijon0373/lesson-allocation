import { apiRequest, unwrapPayload } from "./client"

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "")

/**
 * @param {string} path
 */
function buildFileUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return API_BASE ? `${API_BASE}${normalized}` : normalized
}

/**
 * GET /api/files/download/{fileName}
 * @param {string} fileName
 */
export function getFileDownloadUrl(fileName) {
  return buildFileUrl(`/api/files/download/${encodeURIComponent(String(fileName))}`)
}

/**
 * POST /api/files/upload
 * @param {File} file
 * @returns {Promise<{ fileName: string, url: string }>}
 */
export async function uploadFile(file) {
  const body = new FormData()
  body.append("file", file)
  const json = await apiRequest("/api/files/upload", { method: "POST", body })
  const data = /** @type {Record<string, unknown>} */ (unwrapPayload(json) ?? {})
  const fileName = String(data.fileName ?? data.filename ?? data.name ?? data.storedName ?? file.name)
  const url = data.url ?? data.path ?? data.downloadUrl
  return {
    fileName,
    url: url ? String(url) : getFileDownloadUrl(fileName),
  }
}

/**
 * DELETE /api/files/{fileName}
 * @param {string} fileName
 */
export async function deleteFile(fileName) {
  await apiRequest(`/api/files/${encodeURIComponent(String(fileName))}`, { method: "DELETE" })
}
