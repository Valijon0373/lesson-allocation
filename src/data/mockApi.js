export const SESSION_EXPIRED_EVENT = "auth:session-expired"

const ACCESS_TOKEN_KEY = "accessToken"
const AUTH_USERNAME_KEY = "authUsername"
const AUTH_ROLES_KEY = "authRoles"

const UI_ROLE_BY_API = {
  ADMIN: "Admin",
  TEACHER: "O'qituvchi",
  USER: "Foydalanuvchi",
  MODERATOR: "Komissiya",
  COMMISSION: "Komissiya",
  KOMISSIYA: "Komissiya",
  DEAN: "Dekan",
  HEAD: "Kafedra mudiri",
}

const API_ROLE_BY_UI = {
  Admin: "ADMIN",
  "Foydalanuvchi": "USER",
  "O'qituvchi": "TEACHER",
  Komissiya: "COMMISSION",
  Dekan: "DEAN",
  "Kafedra mudiri": "HEAD",
}

/** @type {Record<string, string>} */
const DEMO_PASSWORDS = {
  admin: "admin123",
  dekan: "dekan123",
  teacher1: "teacher123",
  teacher2: "teacher123",
}

// --- MOCK DATA ---
export let mockFaculties = [
  { id: "f1", nameUz: "Filologiya Fakulteti", nameRu: "Факультет филологии" },
  { id: "f2", nameUz: "Pedagogika Fakulteti", nameRu: "Факультет Педагогики" },
]

export let mockDepartments = [
  { id: "d1", facultyId: "f1", nameUz: "O'zbek tili va adabiyoti kafedrasi" },
  { id: "d2", facultyId: "f2", nameUz: "Psixologiya kafedrasi" },
]

export let mockPositions = [
  { id: "p1", nameUz: "Kafedra mudiri" },
  { id: "p2", nameUz: "Dotsent" },
]

export let mockSubjects = [
  { id: "s1", departmentId: "d1", nameUz: "Hozirgi o'zbek adabiyoti", lecture: 30, practice: 30, lab: 0, seminar: 10, independent: 20, credits: 4, groups: 2, students: 50 },
  { id: "s2", departmentId: "d2", nameUz: "Umumiy psixologiya", lecture: 40, practice: 20, lab: 0, seminar: 10, independent: 30, credits: 5, groups: 3, students: 80 },
]

export let mockUsers = [
  { id: "u1", username: "admin", fio: "Administrator", login: "admin", izoh: "", roles: ["ADMIN"], permissions: ["teacher_view", "teacher_create", "teacher_edit", "teacher_delete", "user_view"] },
  { id: "u2", username: "dekan", fio: "Dekan Foydalanuvchi", login: "dekan", izoh: "", roles: ["DEAN"], permissions: [] },
]

export let mockTeachers = [
  { id: "t1", fio: "Eshmatov Toshmat", facultyId: "f1", departmentId: "d1", positionId: "p1", login: "teacher1" },
  { id: "t2", fio: "Aliyeva Guli", facultyId: "f2", departmentId: "d2", positionId: "p2", login: "teacher2" },
]

/** @type {Array<Record<string, unknown>>} */
export let mockTeacherDocuments = []

export let mockCategories = [
  { id: "cat1", sectionId: "sec1", title: "O'quv ishlari", maxScore: 50, fileUpload: true, requiredDocs: [], itemOrder: 1 },
]

export let mockSections = [
  { id: "sec1", title: "Asosiy faoliyat", maxScore: 50, itemOrder: 1 },
]

// --- AUTH UTILS ---
function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem("authToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem(AUTH_USERNAME_KEY)
  localStorage.removeItem(AUTH_ROLES_KEY)
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem("authToken") || ""
}

export function getAuthUsername() {
  return localStorage.getItem(AUTH_USERNAME_KEY) || ""
}

export function getAuthRoles() {
  try {
    const raw = localStorage.getItem(AUTH_ROLES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function clearAuthTokens() {
  clearAuthStorage()
}

/** @param {{ accessToken?: string, username?: string, roles?: string[] }} tokens */
export function setAuthTokens(tokens) {
  if (tokens.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem("authToken", tokens.accessToken)
  }
  if (tokens.username) localStorage.setItem(AUTH_USERNAME_KEY, tokens.username)
  if (tokens.roles) localStorage.setItem(AUTH_ROLES_KEY, JSON.stringify(tokens.roles))
}

export function notifySessionExpired() {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
}

/** @param {unknown} value */
export function normalizeApiRoleToken(value) {
  if (value == null || value === "") return ""
  if (typeof value === "object") {
    const raw = /** @type {Record<string, unknown>} */ (value)
    const inner = raw.name ?? raw.role ?? raw.authority ?? raw.roleName ?? raw.code ?? ""
    return normalizeApiRoleToken(inner)
  }
  let token = String(value).trim().toUpperCase()
  if (token.startsWith("ROLE_")) token = token.slice(5)
  return token
}

/** @param {unknown} raw */
export function extractApiRoles(raw) {
  if (!raw || typeof raw !== "object") return []
  const obj = /** @type {Record<string, unknown>} */ (raw)
  const found = []
  for (const source of [obj.roles, obj.authorities, obj.authorityList, obj.grantedAuthorities]) {
    if (!Array.isArray(source)) continue
    for (const item of source) {
      const token = normalizeApiRoleToken(item)
      if (token) found.push(token)
    }
  }
  for (const field of [obj.roleName, obj.role, obj.primaryRole]) {
    const token = normalizeApiRoleToken(field)
    if (token) found.push(token)
  }
  return [...new Set(found)]
}

/** @param {string} token */
export function parseRolesFromAccessToken(token) {
  if (!token || typeof token !== "string") return []
  if (token.startsWith("mock.")) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return extractApiRoles(payload)
    } catch {
      return []
    }
  }
  try {
    const base64 = token.split(".")[1]
    if (!base64) return []
    const payload = JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")))
    return extractApiRoles(payload)
  } catch {
    return []
  }
}

/** @param {string[]} roles */
export function isExpertApiRoles(roles) {
  return roles.some((role) =>
    ["MODERATOR", "COMMISSION", "KOMISSIYA", "EXPERT"].includes(normalizeApiRoleToken(role)),
  )
}

/** @param {string[]} roles */
function isTeacherApiRoles(roles) {
  return roles.some((role) => normalizeApiRoleToken(role) === "TEACHER")
}

/** @param {string[]} roles */
function isStaffApiRoles(roles) {
  return roles.some((role) => {
    const token = normalizeApiRoleToken(role)
    return ["ADMIN", "MODERATOR", "COMMISSION", "KOMISSIYA", "EXPERT", "HEAD", "DEAN", "USER", "TEACHER"].includes(token)
  })
}

/** @param {string[]} roles */
function hasAdminRole(roles) {
  if (!Array.isArray(roles)) return false
  const allowed = new Set(["ADMIN", "MODERATOR", "COMMISSION", "KOMISSIYA", "TEACHER", "USER"])
  return roles.some((r) => allowed.has(normalizeApiRoleToken(r)))
}

function buildMockToken(username, roles) {
  const payload = btoa(JSON.stringify({ sub: username, roles }))
  return `mock.${payload}.sig`
}

function resolveRolesForLogin(username) {
  const user = mockUsers.find((u) => u.username === username)
  if (user?.roles?.length) return user.roles
  const teacher = mockTeachers.find((t) => t.login === username)
  if (teacher) return ["TEACHER"]
  return []
}

function assertPassword(username, password) {
  const expected = DEMO_PASSWORDS[username]
  if (!expected || expected !== password) {
    throw new Error("Login yoki parol noto'g'ri.")
  }
}

/**
 * @param {{
 *   user?: { role?: string, roles?: string[] } | null,
 *   matchedTeacher?: unknown,
 *   tokenRoles?: string[],
 * }} input
 */
export function resolveMainAppRole({ user, matchedTeacher, tokenRoles = [] }) {
  if (matchedTeacher) return "teacher"
  if (!user) {
    if (isExpertApiRoles(tokenRoles)) return "expert"
    if (tokenRoles.some((role) => normalizeApiRoleToken(role) === "ADMIN")) return "admin"
    if (tokenRoles.some((role) => normalizeApiRoleToken(role) === "DEAN")) return "dean"
    if (tokenRoles.some((role) => normalizeApiRoleToken(role) === "HEAD")) return "head"
    return "teacher"
  }

  const uiRole = String(user.role ?? "")
  if (uiRole === "Admin" || uiRole === "System Admin") return "admin"
  if (uiRole === "Komissiya") return "expert"
  if (uiRole === "Dekan") return "dean"
  if (uiRole === "Kafedra mudiri") return "head"

  const roles = [
    ...extractApiRoles(user),
    ...(user.roles ?? []).map(normalizeApiRoleToken),
    ...tokenRoles.map(normalizeApiRoleToken),
  ].filter(Boolean)
  const unique = [...new Set(roles)]

  if (unique.includes("ADMIN")) return "admin"
  if (isExpertApiRoles(unique)) return "expert"
  if (unique.includes("HEAD")) return "head"
  if (unique.includes("DEAN")) return "dean"
  if (isTeacherApiRoles(unique) || uiRole === "O'qituvchi") return "teacher"
  return "expert"
}

/**
 * @param {{
 *   user?: { role?: string, roles?: string[] } | null,
 *   matchedTeacher?: unknown,
 *   tokenRoles?: string[],
 * }} input
 */
export function canAccessMainApp({ user, matchedTeacher, tokenRoles = [] }) {
  if (matchedTeacher) return true
  if (user?.role === "Komissiya" || user?.role === "Admin" || user?.role === "System Admin" || user?.role === "Dekan") return true
  if (user && isStaffApiRoles([...extractApiRoles(user), ...(user.roles ?? [])])) return true
  if (isStaffApiRoles(tokenRoles) || isExpertApiRoles(tokenRoles)) return true
  return false
}

/** @param {unknown} role */
export function mapApiRoleToUi(role) {
  const key = normalizeApiRoleToken(role)
  return UI_ROLE_BY_API[key] ?? String(role ?? "")
}

/** @param {string} uiRole */
export function mapUiRoleToApi(uiRole) {
  return API_ROLE_BY_UI[uiRole] ?? String(uiRole ?? "").toUpperCase()
}

/** @param {unknown} raw @param {string} username */
export function mapUserFromLoginBody(raw, username) {
  const roles = extractApiRoles(raw)
  const primaryRole = roles[0] ? mapApiRoleToUi(roles[0]) : ""
  return {
    id: username,
    fio: username,
    login: username,
    izoh: "",
    role: primaryRole,
    roles,
  }
}

function mapUserRow(user) {
  const roles = user.roles ?? []
  const primaryRole = roles[0] ? mapApiRoleToUi(roles[0]) : ""
  return {
    id: user.id,
    fio: user.fio ?? user.username,
    login: user.login ?? user.username,
    izoh: user.izoh ?? "",
    role: primaryRole,
    roles,
    permissions: user.permissions ?? [],
  }
}

function mapSectionRow(section) {
  return {
    id: section.id,
    title: section.title ?? section.titleUz ?? "Bo'lim",
    maxScore: Number(section.maxScore ?? 20),
    itemOrder: section.itemOrder ?? 0,
  }
}

function mapCriterionRow(row) {
  return {
    id: row.id,
    sectionId: row.sectionId ?? "",
    title: row.title ?? row.titleUz ?? "Mezon",
    maxScore: Number(row.maxScore ?? 1),
    fileUpload: row.fileUpload !== false,
    requiredDocs: Array.isArray(row.requiredDocs) ? row.requiredDocs : [],
    itemOrder: row.itemOrder ?? 0,
  }
}

function ensureTeacherDocumentIds(teacherId) {
  /** @type {Record<string, string>} */
  const documentIdByCriterion = {}
  for (const category of mockCategories) {
    const existing = mockTeacherDocuments.find(
      (doc) => doc.teacherId === teacherId && doc.criterionId === category.id,
    )
    const docId = existing?.teacherDocumentId ?? `td-${teacherId}-${category.id}`
    documentIdByCriterion[category.id] = String(docId)
    if (!existing) {
      mockTeacherDocuments.push({
        id: docId,
        teacherDocumentId: docId,
        teacherId,
        criterionId: category.id,
        category: { id: category.id },
      })
    }
  }
  return documentIdByCriterion
}

function mapTeacherDocumentsPayload(teacherId) {
  ensureTeacherDocumentIds(teacherId)
  /** @type {Record<string, string>} */
  const documentIdByCriterion = {}
  /** @type {Array<Record<string, unknown>>} */
  const submissions = []
  /** @type {Record<string, { score: number, comment: string, status: string, backendStatus?: string, scoredBy: string }>} */
  const evaluationsByCriterion = {}

  for (const doc of mockTeacherDocuments.filter((item) => item.teacherId === teacherId)) {
    const criterionId = String(doc.criterionId ?? "")
    if (!criterionId) continue

    documentIdByCriterion[criterionId] = String(doc.teacherDocumentId ?? doc.id)

    if (doc.fileName || doc.url) {
      submissions.push({
        id: String(doc.id),
        teacherDocumentId: String(doc.teacherDocumentId ?? doc.id),
        teacherId,
        criterionId,
        evidenceType: doc.evidenceType ?? "file",
        fileName: String(doc.fileName ?? "Hujjat"),
        fileSize: Number(doc.fileSize ?? 0),
        fileType: String(doc.fileType ?? ""),
        fileDataUrl: String(doc.fileDataUrl ?? ""),
        url: String(doc.url ?? ""),
        comment: String(doc.comment ?? ""),
        uploadedAt: String(doc.uploadedAt ?? new Date().toISOString()),
      })
    }

    const score = Number(doc.scoredBall ?? doc.ball ?? 0)
    const hasScore = doc.scoredBall != null || doc.ball != null
    evaluationsByCriterion[criterionId] = {
      score: hasScore ? score : 0,
      comment: String(doc.expertComment ?? doc.comment ?? ""),
      status: hasScore ? "approved" : "pending",
      backendStatus: hasScore ? "SCORED" : "",
      scoredBy: String(doc.scoredBy ?? ""),
    }
  }

  return { submissions, documentIdByCriterion, evaluationsByCriterion }
}

// --- API FUNCTIONS ---
export async function login(username, password) {
  const loginTrim = username.trim()
  assertPassword(loginTrim, password)

  const roles = resolveRolesForLogin(loginTrim)
  const accessToken = buildMockToken(loginTrim, roles)
  const tokens = { accessToken, username: loginTrim, roles, raw: { roles } }
  setAuthTokens(tokens)
  return tokens
}

export async function loginAdmin(username, password) {
  const tokens = await login(username, password)
  const roles = tokens.roles ?? getAuthRoles()
  if (!hasAdminRole(roles)) {
    clearAuthTokens()
    throw new Error("ADMIN / Komissiya / Foydalanuvchi rollari admin panelga kira oladi")
  }
  return tokens
}

export async function logout() {
  clearAuthTokens()
}

export async function verifyAdminSession() {
  const token = getAccessToken()
  const username = getAuthUsername()
  if (!token || !username) return false

  try {
    const user = await fetchUserByUsername(username)
    if (!hasAdminRole(user.roles)) return false
    setAuthTokens({ accessToken: token, username, roles: user.roles })
    return true
  } catch {
    const storedRoles = getAuthRoles()
    return storedRoles.length > 0 && hasAdminRole(storedRoles)
  }
}

// Faculties
export async function fetchAllFaculties() { return [...mockFaculties] }
export async function fetchFacultyById(id) { return mockFaculties.find((f) => f.id === String(id)) }
export async function saveFaculty(body) {
  const newF = { ...body, id: "f" + Date.now() }
  mockFaculties.push(newF)
  return newF
}
export async function updateFaculty(id, body) {
  const idx = mockFaculties.findIndex((f) => f.id === String(id))
  if (idx > -1) { mockFaculties[idx] = { ...mockFaculties[idx], ...body }; return mockFaculties[idx] }
  throw new Error("Topilmadi")
}
export async function deleteFaculty(id) { mockFaculties = mockFaculties.filter((f) => f.id !== String(id)) }

// Departments
export async function fetchAllDepartments(names) {
  return mockDepartments.map((d) => ({ ...d, fakultet: names?.[d.facultyId] || "Fakultet" }))
}
export async function fetchDepartmentById(id, names) {
  const d = mockDepartments.find((item) => item.id === String(id))
  if (!d) throw new Error("Topilmadi")
  return { ...d, fakultet: names?.[d.facultyId] || "Fakultet" }
}
export async function saveDepartment(body, names) {
  const newD = { ...body, id: "d" + Date.now() }
  mockDepartments.push(newD)
  return { ...newD, fakultet: names?.[newD.facultyId] || "Fakultet" }
}
export async function updateDepartment(id, body, names) {
  const idx = mockDepartments.findIndex((d) => d.id === String(id))
  if (idx > -1) {
    mockDepartments[idx] = { ...mockDepartments[idx], ...body }
    return { ...mockDepartments[idx], fakultet: names?.[mockDepartments[idx].facultyId] || "Fakultet" }
  }
  throw new Error("Topilmadi")
}
export async function deleteDepartment(id) { mockDepartments = mockDepartments.filter((d) => d.id !== String(id)) }

// Positions
export async function fetchAllPositions() { return [...mockPositions] }
export async function fetchPositionById(id) { return mockPositions.find((p) => p.id === String(id)) }
export async function savePosition(body) {
  const newP = { ...body, id: "p" + Date.now() }
  mockPositions.push(newP)
  return newP
}
export async function updatePosition(id, body) {
  const idx = mockPositions.findIndex((p) => p.id === String(id))
  if (idx > -1) { mockPositions[idx] = { ...mockPositions[idx], ...body }; return mockPositions[idx] }
  throw new Error("Topilmadi")
}
export async function deletePosition(id) { mockPositions = mockPositions.filter((p) => p.id !== String(id)) }

// Subjects
export async function fetchAllSubjects(names) {
  return mockSubjects.map((s) => ({
    ...s,
    departmentName: names?.[s.departmentId] || "Kafedra",
    total: (s.lecture || 0) + (s.practice || 0) + (s.lab || 0) + (s.seminar || 0) + (s.independent || 0),
  }))
}
export async function fetchSubjectById(id, names) {
  const s = mockSubjects.find((item) => item.id === String(id))
  if (!s) throw new Error("Topilmadi")
  return {
    ...s,
    departmentName: names?.[s.departmentId] || "Kafedra",
    total: (s.lecture || 0) + (s.practice || 0) + (s.lab || 0) + (s.seminar || 0) + (s.independent || 0),
  }
}
export async function saveSubject(body, names) {
  const newS = { ...body, id: "s" + Date.now() }
  mockSubjects.push(newS)
  return {
    ...newS,
    departmentName: names?.[newS.departmentId] || "Kafedra",
    total: (newS.lecture || 0) + (newS.practice || 0) + (newS.lab || 0) + (newS.seminar || 0) + (newS.independent || 0),
  }
}
export async function updateSubject(id, body, names) {
  const idx = mockSubjects.findIndex((s) => s.id === String(id))
  if (idx > -1) {
    mockSubjects[idx] = { ...mockSubjects[idx], ...body }
    const s = mockSubjects[idx]
    return {
      ...s,
      departmentName: names?.[s.departmentId] || "Kafedra",
      total: (s.lecture || 0) + (s.practice || 0) + (s.lab || 0) + (s.seminar || 0) + (s.independent || 0),
    }
  }
  throw new Error("Topilmadi")
}
export async function deleteSubject(id) { mockSubjects = mockSubjects.filter((s) => s.id !== String(id)) }

// Users
export async function fetchAllUsers() {
  return mockUsers.map(mapUserRow)
}
export async function fetchUserByUsername(username) {
  const user = mockUsers.find((u) => u.username === username)
  if (!user) {
    const teacher = mockTeachers.find((t) => t.login === username)
    if (teacher) {
      return {
        id: teacher.id,
        fio: teacher.fio,
        login: teacher.login,
        izoh: "",
        role: "O'qituvchi",
        roles: ["TEACHER"],
        permissions: [],
      }
    }
    throw new Error("Foydalanuvchi topilmadi")
  }
  return mapUserRow(user)
}
export async function checkUsernameAvailable(username) { return !mockUsers.some((u) => u.username === username) }
export async function saveUser(body) {
  const newU = { id: "u" + Date.now(), ...body, permissions: body.permissions || [] }
  mockUsers.push(newU)
  return mapUserRow(newU)
}
export async function updateUser(username, body) {
  const idx = mockUsers.findIndex((u) => u.username === username)
  if (idx > -1) { mockUsers[idx] = { ...mockUsers[idx], ...body }; return mapUserRow(mockUsers[idx]) }
  throw new Error("Topilmadi")
}
export async function deleteUser(username) { mockUsers = mockUsers.filter((u) => u.username !== username) }

export async function fetchPermissionsCatalog() {
  return ["teacher_view", "teacher_create", "teacher_edit", "teacher_delete", "user_view"]
}
export async function setUserPermissions(username, permissions) {
  const u = mockUsers.find((item) => item.username === username)
  if (u) u.permissions = Array.from(new Set([...(u.permissions || []), ...permissions]))
  return u?.permissions || []
}
export async function removeUserPermissions(username, permissions) {
  const u = mockUsers.find((item) => item.username === username)
  if (u) u.permissions = (u.permissions || []).filter((p) => !permissions.includes(p))
  return u?.permissions || []
}

// Teachers
export async function fetchAllTeachers(facultyNames, departmentNames) {
  return mockTeachers.map((t) => ({
    ...t,
    fakultet: facultyNames?.[t.facultyId] || "Fakultet",
    kafedra: departmentNames?.[t.departmentId] || "Kafedra",
  }))
}
export async function fetchTeacherById(id, facultyNames, departmentNames) {
  const t = mockTeachers.find((item) => item.id === String(id))
  if (!t) throw new Error("Topilmadi")
  return { ...t, fakultet: facultyNames?.[t.facultyId], kafedra: departmentNames?.[t.departmentId] }
}
export async function saveTeacher(body) {
  const newT = { ...body, id: "t" + Date.now(), login: body.login ?? body.fio?.toLowerCase().replace(/\s+/g, "") }
  mockTeachers.push(newT)
  return {
    ...newT,
    kafedra: mockDepartments.find((d) => d.id === newT.departmentId)?.nameUz || "Kafedra",
  }
}
export async function updateTeacher(id, body) {
  const idx = mockTeachers.findIndex((t) => t.id === String(id))
  if (idx > -1) { mockTeachers[idx] = { ...mockTeachers[idx], ...body }; return mockTeachers[idx] }
  throw new Error("Topilmadi")
}
export async function deleteTeacher(id) { mockTeachers = mockTeachers.filter((t) => t.id !== String(id)) }
export async function fetchTeachersResourceInfo() { return [] }
export async function fetchTeachersRatingInfo() { return [] }
export async function downloadTeachersResourceInfoExcel() { console.log("Excel yuklandi (mock)") }

// Teacher Documents
export async function fetchTeacherDocuments(teacherId) {
  return mapTeacherDocumentsPayload(String(teacherId))
}

export async function saveTeacherDocument(body) {
  const teacherDocumentId = String(body.teacherDocumentId)
  const idx = mockTeacherDocuments.findIndex((doc) => String(doc.teacherDocumentId ?? doc.id) === teacherDocumentId)
  const evidenceType = body.evidenceType ?? "file"
  const fileName =
    evidenceType === "file"
      ? body.file?.name || "Hujjat"
      : evidenceType === "video"
        ? "Video link"
        : "Web link"

  let fileDataUrl = ""
  if (evidenceType === "file" && body.file instanceof File) {
    fileDataUrl = URL.createObjectURL(body.file)
  }

  const saved = {
    id: "res-" + Date.now(),
    teacherDocumentId,
    teacherId: body.teacherId,
    criterionId: body.criterionId,
    evidenceType,
    fileName,
    fileSize: body.file?.size ?? 0,
    fileType: body.file?.type ?? (evidenceType === "file" ? "application/octet-stream" : "url"),
    fileDataUrl,
    url: evidenceType === "file" ? fileDataUrl : String(body.url ?? ""),
    comment: body.comment ?? "",
    uploadedAt: new Date().toISOString(),
  }

  if (idx > -1) {
    mockTeacherDocuments[idx] = { ...mockTeacherDocuments[idx], ...saved }
  } else {
    mockTeacherDocuments.push(saved)
  }

  return saved
}

export async function deleteTeacherResource(id) {
  mockTeacherDocuments = mockTeacherDocuments.filter((d) => String(d.id) !== String(id))
}

export async function setDocumentBall(body) {
  const idx = mockTeacherDocuments.findIndex(
    (doc) => String(doc.teacherDocumentId ?? doc.id) === String(body.documentId),
  )
  if (idx > -1) {
    mockTeacherDocuments[idx] = {
      ...mockTeacherDocuments[idx],
      scoredBall: body.ball,
      expertComment: body.comment ?? "",
      scoredBy: body.scoredBy ?? "",
    }
  }
  return true
}

export async function fetchIsDocumentsScored() { return false }
export async function fetchTotalDocumentCount() { return mockTeacherDocuments.filter((d) => d.fileName || d.url).length }
export async function fetchFileTypeDistribution() { return [{ type: "pdf", count: 1 }] }
export async function fetchFileCountByFaculty() { return [{ faculty: "Filologiya", count: 1 }] }

// Categories & Criteria
export async function fetchAllSections() {
  return mockSections.map(mapSectionRow)
}
export async function saveSection(body) {
  const newS = mapSectionRow({ ...body, id: "sec" + Date.now() })
  mockSections.push(newS)
  return newS
}
export async function updateSection(id, body) {
  const idx = mockSections.findIndex((s) => s.id === String(id))
  if (idx > -1) {
    mockSections[idx] = mapSectionRow({ ...mockSections[idx], ...body })
    return mockSections[idx]
  }
  throw new Error("Topilmadi")
}
export async function deleteSection(id) { mockSections = mockSections.filter((s) => s.id !== String(id)) }

export async function fetchAllCriterionRows(_sections) {
  return mockCategories.map(mapCriterionRow)
}
export async function saveCriterionRow(body) {
  const newC = mapCriterionRow({ ...body, id: "cat" + Date.now() })
  mockCategories.push(newC)
  return newC
}
export async function updateCriterionRow(id, body) {
  const idx = mockCategories.findIndex((c) => c.id === String(id))
  if (idx > -1) {
    mockCategories[idx] = mapCriterionRow({ ...mockCategories[idx], ...body })
    return mockCategories[idx]
  }
  throw new Error("Topilmadi")
}
export async function deleteCriterionRow(id) { mockCategories = mockCategories.filter((c) => c.id !== String(id)) }

// Files
export function getFileDownloadUrl(fileId) { return "#" }
