import { apiRequest } from "./client"
import { extractApiRoles, normalizeApiRoleToken, parseRolesFromAccessToken } from "./roles"
import { clearAuthStorage } from "./session"
import { fetchUserByUsername } from "./users"

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"
const AUTH_USERNAME_KEY = "authUsername"
const AUTH_ROLES_KEY = "authRoles"

/**
 * @typedef {{ accessToken: string, refreshToken?: string, tokenType?: string, username?: string, roles?: string[] }} AuthTokens
 */

/** @param {unknown} roles */
export function hasAdminRole(roles) {
  if (!Array.isArray(roles)) return false
  // Admin panelga kirishga ruxsat berilgan rollar.
  // Backenddagi role nomlari: ADMIN, MODERATOR(Komissiya), TEACHER(Foydalanuvchi)
  const allowed = new Set(["ADMIN", "MODERATOR", "COMMISSION", "KOMISSIYA", "TEACHER", "USER"])
  return roles.some((r) => allowed.has(normalizeApiRoleToken(r)))
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem("authToken") || ""
}

export function getAuthUsername() {
  return localStorage.getItem(AUTH_USERNAME_KEY) || ""
}

/** @returns {string[]} */
export function getAuthRoles() {
  try {
    const raw = localStorage.getItem(AUTH_ROLES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function isAdminSession() {
  return Boolean(getAccessToken()) && hasAdminRole(getAuthRoles())
}

/** @param {AuthTokens} tokens */
export function setAuthTokens(tokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem("authToken", tokens.accessToken)
  if (tokens.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  if (tokens.username) localStorage.setItem(AUTH_USERNAME_KEY, tokens.username)
  if (tokens.roles) localStorage.setItem(AUTH_ROLES_KEY, JSON.stringify(tokens.roles))
}

export function clearAuthTokens() {
  clearAuthStorage()
}

/**
 * Token bor bo'lsa, foydalanuvchini API dan tekshiradi va admin panelga ruxsatli rollarnigina qoldiradi.
 * @returns {Promise<boolean>}
 */
export async function verifyAdminSession() {
  const token = getAccessToken()
  const username = getAuthUsername()
  if (!token || !username) {
    return false
  }

  try {
    const user = await fetchUserByUsername(username)
    if (!hasAdminRole(user.roles)) {
      return false
    }
    setAuthTokens({
      accessToken: token,
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || undefined,
      username,
      roles: user.roles,
    })
    return true
  } catch {
    // fetchUserByUsername muvaffaqiyatsiz bo'lsa ham tokenlarni tozalab yubormay,
    // token mavjudligiga ishonamiz va oxirgi saqlangan role'lardan foydalanamiz
    const storedRoles = getAuthRoles()
    if (storedRoles.length > 0 && hasAdminRole(storedRoles)) {
      return true
    }
    return false
  }
}

/**
 * /api/auth/login — ADMIN / MODERATOR / TEACHER rollari admin panelga kira oladi.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<AuthTokens>}
 */
export async function loginAdmin(username, password) {
  const json = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })

  const data = /** @type {Record<string, unknown>} */ (json ?? {})
  const accessToken = data.accessToken ?? data.token ?? data.access_token
  if (!accessToken || typeof accessToken !== "string") {
    throw new Error("Login javobida token topilmadi")
  }

  const refreshToken = typeof data.refreshToken === "string" ? data.refreshToken : undefined

  setAuthTokens({ accessToken, refreshToken, username })

  const user = await fetchUserByUsername(username)
  if (!hasAdminRole(user.roles)) {
    clearAuthTokens()
    throw new Error("ADMIN / Komissiya / Foydalanuvchi rollari admin panelga kira oladi")
  }

  const tokens = {
    accessToken,
    refreshToken,
    tokenType: typeof data.tokenType === "string" ? data.tokenType : undefined,
    username,
    roles: user.roles,
  }
  setAuthTokens(tokens)
  return tokens
}

/** Oddiy login (boshqa sahifalar uchun) */
export async function login(username, password) {
  const json = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })

  const data = /** @type {Record<string, unknown>} */ (json ?? {})
  const accessToken = data.accessToken ?? data.token ?? data.access_token
  if (!accessToken || typeof accessToken !== "string") {
    throw new Error("Login javobida token topilmadi")
  }

  const tokenRoles = parseRolesFromAccessToken(accessToken)
  const bodyRoles = extractApiRoles(data)
  const roles = [...new Set([...tokenRoles, ...bodyRoles])]

  const tokens = {
    accessToken,
    refreshToken: typeof data.refreshToken === "string" ? data.refreshToken : undefined,
    tokenType: typeof data.tokenType === "string" ? data.tokenType : undefined,
    username,
    roles,
    raw: data,
  }
  setAuthTokens(tokens)
  return tokens
}

export async function logout() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" })
  } catch {
    // Token allaqachon yaroqsiz bo'lishi mumkin
  } finally {
    clearAuthTokens()
  }
}
