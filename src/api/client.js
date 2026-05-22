import { isPublicAuthPath, notifySessionExpired } from "./session"

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "")

function buildUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return API_BASE ? `${API_BASE}${normalized}` : normalized
}

function getAuthHeaders() {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("authToken") || ""
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * @param {unknown} json
 */
export function unwrapPayload(json) {
  if (json == null) return json
  if (Array.isArray(json)) return json
  if (typeof json !== "object") return json

  const obj = /** @type {Record<string, unknown>} */ (json)
  if (obj.data != null) return obj.data
  if (obj.content != null) return obj.content
  if (obj.result != null) return obj.result
  if (obj.body != null) return obj.body
  return json
}

/**
 * @param {unknown} raw
 */
export function formatApiErrorMessage(raw) {
  const message = String(raw ?? "").trim()
  if (!message) return "So'rov bajarilmadi"

  if (/null value in column "status".*relation "categories"/i.test(message)) {
    return "Server kategoriyani saqlay olmadi: status maydoni to'ldirilmagan. Backend yangilangan bo'lsa, sahifani yangilab qayta urinib ko'ring."
  }

  if (message.length > 280) {
    const short = message.split("Detail:")[0]?.trim() || message.slice(0, 280)
    return short.endsWith("...") ? short : `${short}...`
  }

  return message
}

/**
 * @param {Response} res
 */
async function parseError(res) {
  try {
    const json = await res.json()
    if (typeof json === "object" && json && "message" in json) return formatApiErrorMessage(json.message)
    if (typeof json === "object" && json && "error" in json) return formatApiErrorMessage(json.error)
    return formatApiErrorMessage(JSON.stringify(json))
  } catch {
    return formatApiErrorMessage(res.statusText || `HTTP ${res.status}`)
  }
}

/**
 * @param {string} path
 * @param {RequestInit} [options]
 */
export async function apiRequest(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...getAuthHeaders(),
    ...(options.headers ?? {}),
  }

  if (options.body != null && !(options.body instanceof FormData) && !("Content-Type" in headers)) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(buildUrl(path), { ...options, headers })

  if (!res.ok) {
    const hadToken = Boolean(getAuthHeaders().Authorization)
    if (res.status === 401 && hadToken && !isPublicAuthPath(path)) {
      notifySessionExpired()
    }
    throw new Error(await parseError(res))
  }

  if (res.status === 204) return null

  const text = await res.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
