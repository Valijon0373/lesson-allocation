export const SESSION_EXPIRED_EVENT = "auth:session-expired"

const AUTH_STORAGE_KEYS = [
  "accessToken",
  "authToken",
  "refreshToken",
  "authUsername",
  "authRoles",
]

export function clearAuthStorage() {
  for (const key of AUTH_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
}

/** @param {string} path */
export function isPublicAuthPath(path) {
  return /\/api\/auth\/login\b/.test(path)
}

export function notifySessionExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
  }
}
