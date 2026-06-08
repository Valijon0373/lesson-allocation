import { useCallback, useEffect, useMemo, useState } from "react"
import { Download, Eye, EyeOff, MessageSquareText, Trash2, X } from "lucide-react"
import bgVideo from "./assets/bg.mp4"
import logoImg from "./assets/logo.jpg"
import Footer from "./components/Footer.jsx"
import HomeHeroBrand from "./components/HomeHeroBrand.jsx"
import Navbar from "./components/Navbar.jsx"
import { fetchAllCriterionRows } from "./api/categories"
import { fetchAllSections } from "./api/criteriaApi"
import { clearAuthTokens, getAccessToken, getAuthUsername, login, setAuthTokens } from "./api/auth"
import { fetchAllTeachers, saveTeacher } from "./api/teachers"
import { deleteTeacherResource, fetchTeacherDocuments, saveTeacherDocument } from "./api/teacherDocuments"
import { getFileDownloadUrl } from "./api/files"
import { fetchUserByUsername } from "./api/users"
import { CRITERIA as DEFAULT_CRITERIA } from "./data/criteria.js"

const USERS = [
  { id: "u-admin", fullName: "Platforma Admin", role: "admin", login: "admin", password: "12345" },
  { id: "u-head", fullName: "Kafedra mudiri", role: "head", login: "mudir", password: "12345" },
  { id: "u-dean", fullName: "Fakultet dekani", role: "dean", login: "dekan", password: "12345" },
  { id: "u-expert", fullName: "Ekspert tekshiruvchi", role: "expert", login: "expert", password: "12345" },
]

const ROLE_LABELS = {
  admin: "Administrator",
  head: "Kafedra mudiri",
  dean: "Dekan",
  teacher: "O'qituvchi",
  expert: "Ekspert/Tekshiruvchi",
}

const STORAGE_KEYS = {
  submissions: "nizom_submissions_v2",
  evaluations: "nizom_evaluations_v2",
}

const POSITIONS_API_URL = "/api/positions"
const DEPARTMENTS_API_URL = "/api/departments"

function normalizePositions(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : []

  return list
    .map((item, index) => {
      if (typeof item === "string") {
        return { id: item, name: item, departmentId: "", order: index }
      }
      const id = String(item?.id ?? item?.positionId ?? item?.code ?? item?.name ?? index)
      const name = String(item?.name ?? item?.title ?? item?.positionName ?? item?.label ?? "").trim()
      const departmentId = String(item?.departmentId ?? item?.kafedraId ?? item?.department?.id ?? "")
      if (!name) return null
      return { id, name, departmentId, order: index }
    })
    .filter(Boolean)
}

function normalizeDepartments(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : []

  return list
    .map((item, index) => {
      if (typeof item === "string") {
        return { id: item, name: item, facultyId: "", order: index }
      }
      const id = String(item?.id ?? item?.departmentId ?? item?.kafedraId ?? item?.code ?? item?.name ?? index)
      const name = String(item?.name ?? item?.title ?? item?.departmentName ?? item?.kafedraNomi ?? "").trim()
      const facultyId = String(item?.facultyId ?? item?.faculty?.id ?? item?.fakultetId ?? "")
      if (!name) return null
      return { id, name, facultyId, order: index }
    })
    .filter(Boolean)
}

function parseStorage(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function formatFileSize(size) {
  if (!size) return "-"
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

function getEvaluation(evaluations, teacherId, criterionId) {
  return evaluations[`${teacherId}_${criterionId}`] ?? { score: 0, comment: "", status: "pending" }
}

function mapTeachersFromApi(list) {
  return list.map((teacher) => ({
    id: teacher.id,
    fullName: teacher.fio,
    role: "teacher",
    login: teacher.login,
    password: "",
    departmentId: teacher.departmentId,
    department: teacher.kafedra || "",
    positionId: teacher.positionId ?? "",
  }))
}

function findTeacherByLogin(list, login) {
  const normalized = login.trim().toLowerCase()
  return list.find((item) => item.login.trim().toLowerCase() === normalized)
}

function isTeacherAccount(user) {
  if (!user) return false
  if (user.role === "O'qituvchi" || user.role === "teacher") return true
  return Array.isArray(user.roles) && user.roles.some((role) => String(role).toUpperCase() === "TEACHER")
}

function isTeacherUser(user) {
  return isTeacherAccount(user)
}

function App() {
  const [activePage, setActivePage] = useState("dashboard")
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ login: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const [users] = useState(USERS)
  const [teachers, setTeachers] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [evaluations, setEvaluations] = useState({})
  const [criteriaList, setCriteriaList] = useState(DEFAULT_CRITERIA)
  const [uploadState, setUploadState] = useState({})
  const [teacherDocumentIds, setTeacherDocumentIds] = useState({})
  const [uploadError, setUploadError] = useState("")
  const [uploadingCriterionIds, setUploadingCriterionIds] = useState({})
  const [pageLoading, setPageLoading] = useState(false)
  const [newTeacherForm, setNewTeacherForm] = useState({
    fullName: "",
    login: "",
    password: "",
    departmentId: "",
    positionId: "",
  })
  const [newTeacherError, setNewTeacherError] = useState("")
  const [departments, setDepartments] = useState([])
  const [departmentsLoading, setDepartmentsLoading] = useState(false)
  const [departmentsError, setDepartmentsError] = useState("")
  const [positions, setPositions] = useState([])
  const [positionsLoading, setPositionsLoading] = useState(false)
  const [positionsError, setPositionsError] = useState("")
  const [teacherLoadError, setTeacherLoadError] = useState("")
  const [criteriaLoadError, setCriteriaLoadError] = useState("")
  const [authSessionKey, setAuthSessionKey] = useState(0)

  const loadCriteriaFromApi = useCallback(async () => {
    if (!getAccessToken()) {
      setCriteriaLoadError("")
      return
    }
    try {
      const sections = await fetchAllSections()
      const rows = await fetchAllCriterionRows(sections)
      const sectionTitleById = Object.fromEntries(sections.map((section) => [section.id, section.title]))
      const apiCriteria = rows.map((row) => ({
        id: row.id,
        category: row.sectionId ? (sectionTitleById[row.sectionId] ?? "Bo'lim") : "Mezonlar",
        title: row.title,
        maxScore: row.maxScore,
        fileUpload: row.fileUpload !== false,
        requiredDocs: Array.isArray(row.requiredDocs) ? row.requiredDocs : [],
      }))

      if (apiCriteria.length > 0) {
        setCriteriaList(apiCriteria)
      } else if (sections.length > 0) {
        setCriteriaList(
          sections.map((section) => ({
            id: section.id,
            category: section.title,
            title: section.title,
            maxScore: section.maxScore,
            fileUpload: true,
            requiredDocs: [],
          })),
        )
      }
      setCriteriaLoadError("")
    } catch (error) {
      setCriteriaLoadError(error instanceof Error ? error.message : "Mezonlar API dan yuklanmadi")
    }
  }, [])

  const loadTeachersFromApi = useCallback(async () => {
    if (!getAccessToken()) {
      setTeacherLoadError("")
      return
    }
    try {
      const list = await fetchAllTeachers()
      setTeachers(mapTeachersFromApi(list))
      setSelectedTeacherId((prev) => prev || list[0]?.id || "")
      setTeacherLoadError("")
    } catch (error) {
      setTeacherLoadError(error instanceof Error ? error.message : "O'qituvchilarni yuklab bo'lmadi")
    }
  }, [])

  useEffect(() => {
    setSubmissions(parseStorage(STORAGE_KEYS.submissions, []))
    setEvaluations(parseStorage(STORAGE_KEYS.evaluations, {}))
  }, [])

  useEffect(() => {
    loadTeachersFromApi()
  }, [loadTeachersFromApi, authSessionKey])

  useEffect(() => {
    loadCriteriaFromApi()
  }, [loadCriteriaFromApi, authSessionKey])

  useEffect(() => {
    if (currentUser) return
    const token = getAccessToken()
    const username = getAuthUsername()
    if (!token || !username) return

    let cancelled = false
    const restoreSession = async () => {
      try {
        let matched = findTeacherByLogin(teachers, username)
        if (!matched) {
          const list = await fetchAllTeachers()
          const mapped = mapTeachersFromApi(list)
          matched = findTeacherByLogin(mapped, username)
          if (!cancelled && mapped.length) setTeachers(mapped)
        }

        let user = null
        try {
          user = await fetchUserByUsername(username)
        } catch {
          user = null
        }

        if (!matched && !isTeacherAccount(user)) return

        const teacherUser =
          matched ??
          (user
            ? {
                id: user.id,
                fullName: user.fio,
                role: "teacher",
                login: user.login,
                password: "",
                departmentId: "",
                department: "",
                positionId: "",
              }
            : null)

        if (!teacherUser || cancelled) return

        setCurrentUser(teacherUser)
        setSelectedTeacherId(teacherUser.id)
        setActivePage("mezonlar")
        setAuthSessionKey((key) => key + 1)
      } catch {
        if (!cancelled) clearAuthTokens()
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
  }, [currentUser, teachers])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.submissions, JSON.stringify(submissions))
  }, [submissions])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.evaluations, JSON.stringify(evaluations))
  }, [evaluations])

  useEffect(() => {
    if (!loginOpen) setLoginPasswordVisible(false)
  }, [loginOpen])

  useEffect(() => {
    setPageLoading(false)
  }, [activePage])

  const handleNavigate = (page) => {
    if (page === activePage) return
    setPageLoading(true)
    setActivePage(page)
  }

  const categoryMaxScore = useMemo(
    () =>
      criteriaList.reduce((acc, criterion) => {
        acc[criterion.category] = (acc[criterion.category] ?? 0) + Number(criterion.maxScore || 0)
        return acc
      }, {}),
    [criteriaList],
  )

  const allCategories = useMemo(() => Object.keys(categoryMaxScore), [categoryMaxScore])
  const totalMaxScore = useMemo(
    () => Object.values(categoryMaxScore).reduce((sum, value) => sum + Number(value || 0), 0),
    [categoryMaxScore],
  )

  const roleVisibleCategories = useMemo(
    () => ({
      admin: allCategories,
      dean: allCategories,
      expert: allCategories,
      teacher: allCategories,
      head: ["O'qituvchilik faoliyati", "Metodik ishlar", "Tarbiyaviy faoliyat"],
    }),
    [allCategories],
  )

  useEffect(() => {
    let cancelled = false
    const fetchDepartments = async () => {
      setDepartmentsLoading(true)
      setDepartmentsError("")
      try {
        const response = await fetch(DEPARTMENTS_API_URL)
        if (!response.ok) {
          throw new Error(`API xatosi: ${response.status}`)
        }
        const payload = await response.json()
        const normalized = normalizeDepartments(payload)
        if (normalized.length === 0) {
          throw new Error("Kafedralar topilmadi.")
        }
        if (!cancelled) {
          setDepartments(normalized)
          setNewTeacherForm((prev) => ({
            ...prev,
            departmentId: prev.departmentId || normalized[0].id,
          }))
        }
      } catch (error) {
        if (!cancelled) {
          setDepartments([])
          setDepartmentsError(error instanceof Error ? error.message : "Kafedralarni yuklashda xatolik yuz berdi.")
        }
      } finally {
        if (!cancelled) {
          setDepartmentsLoading(false)
        }
      }
    }
    fetchDepartments()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const selectedDepartmentId = newTeacherForm.departmentId
    if (!selectedDepartmentId) {
      setPositions([])
      setPositionsError("")
      setPositionsLoading(false)
      setNewTeacherForm((prev) => ({ ...prev, positionId: "" }))
      return
    }
    let cancelled = false
    const fetchPositions = async () => {
      setPositionsLoading(true)
      setPositionsError("")
      try {
        const response = await fetch(`${POSITIONS_API_URL}?departmentId=${encodeURIComponent(selectedDepartmentId)}`)
        if (!response.ok) {
          throw new Error(`API xatosi: ${response.status}`)
        }
        const payload = await response.json()
        const normalized = normalizePositions(payload)
        const filtered = normalized.some((item) => item.departmentId)
          ? normalized.filter((item) => item.departmentId === selectedDepartmentId)
          : normalized
        if (filtered.length === 0) {
          throw new Error("Tanlangan kafedra uchun lavozim topilmadi.")
        }
        if (!cancelled) {
          setPositions(filtered)
          setNewTeacherForm((prev) => ({
            ...prev,
            positionId: filtered.some((item) => item.id === prev.positionId) ? prev.positionId : filtered[0].id,
          }))
        }
      } catch (error) {
        if (!cancelled) {
          setPositions([])
          setNewTeacherForm((prev) => ({ ...prev, positionId: "" }))
          setPositionsError(error instanceof Error ? error.message : "Lavozimlarni yuklashda xatolik yuz berdi.")
        }
      } finally {
        if (!cancelled) {
          setPositionsLoading(false)
        }
      }
    }
    fetchPositions()
    return () => {
      cancelled = true
    }
  }, [newTeacherForm.departmentId])

  const managedTeacherId = isTeacherUser(currentUser) ? currentUser.id : selectedTeacherId
  const visibleCategories = currentUser ? roleVisibleCategories[currentUser.role] ?? allCategories : allCategories

  const visibleCriteria = criteriaList.filter((c) => visibleCategories.includes(c.category))

  const categoryScoresForTeacher = (teacherId) => {
    const result = {}
    Object.keys(categoryMaxScore).forEach((cat) => {
      result[cat] = criteriaList.filter((c) => c.category === cat).reduce(
        (sum, criterion) => sum + getEvaluation(evaluations, teacherId, criterion.id).score,
        0
      )
    })
    return result
  }

  const totalScoreForTeacher = (teacherId) =>
    criteriaList.reduce((sum, criterion) => sum + getEvaluation(evaluations, teacherId, criterion.id).score, 0)

  const ranking = useMemo(() => {
    return [...teachers]
      .map((t) => ({ ...t, total: totalScoreForTeacher(t.id) }))
      .sort((a, b) => b.total - a.total)
  }, [teachers, evaluations])

  const activeTeacher = teachers.find((t) => t.id === managedTeacherId)
  const myTotalScore = managedTeacherId ? totalScoreForTeacher(managedTeacherId) : 0
  const myPercent = totalMaxScore > 0 ? Math.round((myTotalScore / totalMaxScore) * 100) : 0
  const myCategoryScores = managedTeacherId ? categoryScoresForTeacher(managedTeacherId) : {}

  const mySubmissions = submissions.filter((s) => s.teacherId === managedTeacherId)
  const recentUploads = [...mySubmissions].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 5)

  const missingDocsCount = managedTeacherId
    ? criteriaList.filter((criterion) => !mySubmissions.some((s) => s.criterionId === criterion.id)).length
    : 0

  const statuses = mySubmissions.reduce(
    (acc, submission) => {
      const status = getEvaluation(evaluations, managedTeacherId, submission.criterionId).status
      acc[status] += 1
      return acc
    },
    { pending: 0, approved: 0, rejected: 0 }
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    const loginTrim = loginForm.login.trim()
    if (!loginTrim) {
      setLoginError("Loginni kiriting.")
      return
    }
    if (!loginForm.password) {
      setLoginError("Parolni kiriting.")
      return
    }

    const foundLocal = users.find((u) => u.login === loginTrim && u.password === loginForm.password)
    if (foundLocal) {
      setCurrentUser(foundLocal)
      if (foundLocal.role === "teacher") {
        setSelectedTeacherId(foundLocal.id)
        setActivePage("mezonlar")
      }
      setLoginError("")
      setLoginOpen(false)
      setLoginForm({ login: "", password: "" })
      return
    }

    setLoginLoading(true)
    setLoginError("")
    try {
      const tokens = await login(loginTrim, loginForm.password)

      let matched = findTeacherByLogin(teachers, loginTrim)
      if (!matched) {
        const list = await fetchAllTeachers()
        const mapped = mapTeachersFromApi(list)
        matched = findTeacherByLogin(mapped, loginTrim)
        if (matched) setTeachers(mapped)
      }

      let user = null
      try {
        user = await fetchUserByUsername(loginTrim)
      } catch {
        user = null
      }

      if (!matched && !isTeacherAccount(user)) {
        clearAuthTokens()
        setLoginError("Bu login faqat o'qituvchilar uchun.")
        return
      }

      setAuthTokens({
        ...tokens,
        username: loginTrim,
        roles: user?.roles,
      })

      const teacherUser = matched ?? {
        id: user.id,
        fullName: user.fio,
        role: "teacher",
        login: user.login,
        password: "",
        departmentId: "",
        department: "",
        positionId: "",
      }

      setCurrentUser(teacherUser)
      setSelectedTeacherId(teacherUser.id)
      setAuthSessionKey((key) => key + 1)
      setActivePage("mezonlar")
      setLoginOpen(false)
      setLoginForm({ login: "", password: "" })
    } catch {
      clearAuthTokens()
      setLoginError("Login yoki parol noto'g'ri.")
    } finally {
      setLoginLoading(false)
    }
  }

  const canEvaluate = currentUser && ["admin", "head", "dean", "expert"].includes(currentUser.role)

  const createTeacherAccount = async (event) => {
    event.preventDefault()
    if (!currentUser || currentUser.role !== "admin") return
    const fullName = newTeacherForm.fullName.trim()
    const login = newTeacherForm.login.trim()
    const password = newTeacherForm.password
    const departmentId = newTeacherForm.departmentId.trim()
    const positionId = newTeacherForm.positionId.trim()
    const department = departments.find((item) => item.id === departmentId)
    if (!fullName || !login || !password || !departmentId || !positionId) {
      setNewTeacherError("Ism, login, parol, kafedra va lavozimni to'ldiring.")
      return
    }
    if (!department) {
      setNewTeacherError("Kafedra topilmadi. Qayta tanlang.")
      return
    }
    const loginUsed = [...users, ...teachers].some((u) => u.login.toLowerCase() === login.toLowerCase())
    if (loginUsed) {
      setNewTeacherError("Bu login band. Boshqa login tanlang.")
      return
    }
    try {
      const created = await saveTeacher({
        fio: fullName,
        login,
        password,
        facultyId: department.facultyId || "",
        departmentId,
        positionId,
      })
      const newTeacher = {
        id: created.id,
        fullName: created.fio,
        role: "teacher",
        login: created.login,
        password: "",
        departmentId: created.departmentId,
        department: created.kafedra || department.name,
        positionId: created.positionId ?? positionId,
      }
      setTeachers((prev) => [newTeacher, ...prev])
      setSelectedTeacherId(newTeacher.id)
      setNewTeacherForm({ fullName: "", login: "", password: "", departmentId, positionId })
      setNewTeacherError("")
    } catch (error) {
      setNewTeacherError(error instanceof Error ? error.message : "O'qituvchini saqlab bo'lmadi.")
    }
  }

  const handleUploadChange = (criterionId, field, value) => {
    setUploadState((prev) => ({
      ...prev,
      [criterionId]: { ...(prev[criterionId] ?? { type: "file", link: "", comment: "" }), [field]: value },
    }))
  }

  const submitCriterionFile = async (criterionId) => {
    if (!currentUser || currentUser.role !== "teacher") return
    const state = uploadState[criterionId] ?? { type: "file", link: "", comment: "" }
    const evidenceType = state.type || "file"
    const teacherDocumentId = teacherDocumentIds[criterionId]
    if (!teacherDocumentId) {
      setUploadError("Ushbu mezon uchun hujjat identifikatori topilmadi. Sahifani yangilab qayta urinib ko'ring.")
      return
    }

    if (evidenceType === "file" && !state.file) return
    if (evidenceType !== "file" && !state.link?.trim()) return

    setUploadError("")
    setUploadingCriterionIds((prev) => ({ ...prev, [criterionId]: true }))
    try {
      const saved = await saveTeacherDocument({
        teacherDocumentId,
        teacherId: currentUser.id,
        criterionId,
        evidenceType,
        file: evidenceType === "file" ? state.file : undefined,
        url: evidenceType !== "file" ? state.link.trim() : undefined,
        comment: state.comment?.trim() || "",
      })
      setSubmissions((prev) => [saved, ...prev])
      setUploadState((prev) => ({ ...prev, [criterionId]: { type: "file", link: "", comment: "" } }))
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Hujjatni yuklab bo'lmadi.")
    } finally {
      setUploadingCriterionIds((prev) => ({ ...prev, [criterionId]: false }))
    }
  }

  useEffect(() => {
    if (!currentUser || currentUser.role !== "teacher") return
    const loadDocs = async () => {
      try {
        const { submissions: list, documentIdByCriterion } = await fetchTeacherDocuments(currentUser.id)
        setTeacherDocumentIds(documentIdByCriterion)
        if (list.length) setSubmissions((prev) => [...list, ...prev.filter((p) => p.teacherId !== currentUser.id)])
      } catch {
        // API xatoligida local holat saqlanadi
      }
    }
    loadDocs()
  }, [currentUser])

  const deleteSubmission = async (submissionId) => {
    try {
      await deleteTeacherResource(submissionId)
    } catch {
      // Agar API orqali o'chirishda xatolik bo'lsa ham UI dan olib tashlaymiz
    }
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
  }

  const upsertEvaluation = (teacherId, criterionId, field, value) => {
    const key = `${teacherId}_${criterionId}`
    const current = evaluations[key] ?? { score: 0, comment: "", status: "pending" }
    let nextValue = value
    if (field === "score") {
      const criterion = criteriaList.find((c) => c.id === criterionId)
      const parsed = Number(value)
      if (Number.isNaN(parsed) || !criterion) return
      nextValue = Math.max(0, Math.min(criterion.maxScore, parsed))
    }
    setEvaluations((prev) => ({
      ...prev,
      [key]: { ...current, [field]: nextValue },
    }))
  }

  const renderDashboard = () => (
    <section className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white shadow-xl">
        <p className="text-sm uppercase tracking-wider text-indigo-100">Statistika</p>
        <h1 className="mt-2 text-3xl font-bold">Nizom monitoring platformasi</h1>
        <p className="mx-auto mt-2 max-w-3xl text-indigo-50">
          Jami {totalMaxScore} ball bo'yicha progress, hujjatlar holati{currentUser?.role === "teacher" ? "." : " va reyting."}
        </p>
      </header>

      {isTeacherUser(currentUser) && activePage === "dashboard" && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          Hujjat yuklash uchun yuqoridagi{" "}
          <button
            type="button"
            onClick={() => setActivePage("mezonlar")}
            className="font-semibold underline underline-offset-2"
          >
            Mezonlar
          </button>{" "}
          bo'limiga o'ting.
        </div>
      )}

      {currentUser && (
        <>
          {currentUser.role !== "teacher" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="text-sm font-medium text-slate-700">O'qituvchini tanlang</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Jami ball</p>
              <p className="mt-2 text-3xl font-bold text-indigo-700">{myTotalScore} / 110</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Foiz</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">{myPercent}%</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Yetishmayotgan hujjatlar</p>
              <p className="mt-2 text-3xl font-bold text-amber-700">{missingDocsCount}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Statuslar</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                Kutilmoqda: {statuses.pending} | Tasdiq: {statuses.approved} | Rad: {statuses.rejected}
              </p>
            </article>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-sm font-medium text-slate-600">
              Ko'rsatkich ({activeTeacher?.fullName})
            </p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-indigo-600" style={{ width: `${myPercent}%` }} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Bo'limlar bo'yicha grafik</h3>
              <div className="mt-3 space-y-3">
                {Object.entries(categoryMaxScore).map(([category, max]) => {
                  const score = myCategoryScores[category] ?? 0
                  const percent = Math.round((score / max) * 100)
                  return (
                    <div key={category}>
                      <div className="mb-1 flex justify-between text-xs text-slate-600">
                        <span>{category}</span>
                        <span>{score}/{max}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-violet-600" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            {currentUser?.role !== "teacher" ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Reyting</h3>
                <div className="mt-3 space-y-2">
                  {ranking.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-sm text-slate-700">
                        {index + 1}. {item.fullName}
                      </p>
                      <p className="text-sm font-bold text-indigo-700">{item.total} ball</p>
                    </div>
                  ))}
                </div>
              </article>
            ) : (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Oxirgi yuklangan fayllar</h3>
                <div className="mt-3 space-y-2">
                  {recentUploads.map((upload) => {
                    const criterion = criteriaList.find((c) => c.id === upload.criterionId)
                    return (
                      <div key={upload.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <p className="font-medium text-slate-800">{upload.fileName}</p>
                        <p className="text-slate-500">{criterion?.title}</p>
                      </div>
                    )
                  })}
                  {recentUploads.length === 0 && (
                    <p className="text-sm text-slate-500">Hozircha yuklangan fayl yo'q.</p>
                  )}
                </div>
              </article>
            )}
          </div>

          {currentUser?.role === "teacher" && (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Qo'shilgan bo'lim va mezonlar</h3>
              <div className="mt-3 space-y-4">
                {Object.entries(
                  visibleCriteria.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = []
                    acc[item.category].push(item)
                    return acc
                  }, {}),
                ).map(([category, items]) => (
                  <div key={category} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">{category}</p>
                    <div className="mt-2 space-y-1">
                      {items.map((item, idx) => (
                        <p key={item.id} className="text-sm text-slate-600">
                          {idx + 1}. {item.title} ({item.maxScore} ball)
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {visibleCriteria.length === 0 && (
                  <p className="text-sm text-slate-500">Hozircha qo'shilgan bo'lim/mezon topilmadi.</p>
                )}
              </div>
            </article>
          )}

          {currentUser?.role !== "teacher" && (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Oxirgi yuklangan fayllar</h3>
              <div className="mt-3 space-y-2">
                {recentUploads.map((upload) => {
                  const criterion = criteriaList.find((c) => c.id === upload.criterionId)
                  return (
                    <div key={upload.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                      <p className="font-medium text-slate-800">{upload.fileName}</p>
                      <p className="text-slate-500">{criterion?.title}</p>
                    </div>
                  )
                })}
                {recentUploads.length === 0 && (
                  <p className="text-sm text-slate-500">Hozircha yuklangan fayl yo'q.</p>
                )}
              </div>
            </article>
          )}

          {currentUser?.role === "admin" && (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">O'qituvchi login/parolini berish</h3>
              <form onSubmit={createTeacherAccount} className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Kafedra</span>
                  <select
                    value={newTeacherForm.departmentId}
                    onChange={(e) =>
                      setNewTeacherForm((prev) => ({ ...prev, departmentId: e.target.value, positionId: "" }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    disabled={departmentsLoading || departments.length === 0}
                  >
                    {departmentsLoading && <option value="">Kafedralar yuklanmoqda...</option>}
                    {!departmentsLoading && departments.length === 0 && <option value="">Kafedra topilmadi</option>}
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Lavozim</span>
                  <select
                    value={newTeacherForm.positionId}
                    onChange={(e) => setNewTeacherForm((prev) => ({ ...prev, positionId: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    disabled={!newTeacherForm.departmentId || positionsLoading || positions.length === 0}
                  >
                    {!newTeacherForm.departmentId && <option value="">Avval kafedrani tanlang</option>}
                    {newTeacherForm.departmentId && positionsLoading && <option value="">Lavozimlar yuklanmoqda...</option>}
                    {newTeacherForm.departmentId && !positionsLoading && positions.length === 0 && (
                      <option value="">Lavozim topilmadi</option>
                    )}
                    {positions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block font-medium text-slate-700">F.I.O</span>
                  <input
                    value={newTeacherForm.fullName}
                    onChange={(e) => setNewTeacherForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="O'qituvchi F.I.O"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Login</span>
                  <input
                    value={newTeacherForm.login}
                    onChange={(e) => setNewTeacherForm((prev) => ({ ...prev, login: e.target.value }))}
                    placeholder="Login"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Parol</span>
                  <input
                    value={newTeacherForm.password}
                    onChange={(e) => setNewTeacherForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Parol"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="submit"
                  disabled={
                    departmentsLoading ||
                    departments.length === 0 ||
                    !newTeacherForm.departmentId ||
                    positionsLoading ||
                    positions.length === 0
                  }
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white md:col-span-2"
                >
                  O'qituvchini qo'shish
                </button>
              </form>
              {departmentsError && (
                <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-100">
                  Kafedralarni API dan olishda xatolik: {departmentsError}
                </p>
              )}
              {positionsError && (
                <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-100">
                  Lavozimlarni API dan olishda xatolik: {positionsError}
                </p>
              )}
              {newTeacherError && (
                <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
                  {newTeacherError}
                </p>
              )}
              {teacherLoadError && (
                <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-100">
                  O'qituvchilarni API dan olishda xatolik: {teacherLoadError}
                </p>
              )}
            </article>
          )}
        </>
      )}
    </section>
  )

  return (
    <main className="relative flex min-h-screen flex-col text-slate-800">
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <video
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={bgVideo}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-indigo-950/75" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Navbar
          activePage={activePage}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          logoSrc={logoImg}
          logoAlt="Urganch DPI logo"
          userRoleLabel={currentUser ? ROLE_LABELS[currentUser.role] : ""}
          onLogout={() => {
            clearAuthTokens()
            setCurrentUser(null)
            setCriteriaLoadError("")
            setCriteriaList(DEFAULT_CRITERIA)
            setAuthSessionKey((key) => key + 1)
          }}
          onOpenLogin={() => setLoginOpen(true)}
        />
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-[calc(4.25rem+1rem)] sm:px-6 sm:pt-[calc(4.75rem+1rem)] lg:px-8">
        {!currentUser ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-4 sm:py-6">
            <section className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border border-white/15 bg-white/10 px-6 py-8 shadow-2xl shadow-slate-950/40 backdrop-blur-md sm:px-8 sm:py-10 md:gap-8 md:py-11">
              <HomeHeroBrand />
            </section>
          </div>
        ) : activePage === "dashboard" ? (
          renderDashboard()
        ) : (
          <section className="space-y-6">
            <header className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white shadow-xl">
              <h1 className="text-3xl font-bold">Mezonlar bo'limi</h1>
              <p className="mx-auto mt-2 max-w-3xl text-indigo-100">
                Har bir mezon uchun tavsif, maksimal ball, kerakli hujjatlar, upload va ekspert izohi.
              </p>
            </header>
            {criteriaLoadError && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Mezonlarni API dan olishda xatolik: {criteriaLoadError}
              </p>
            )}
            {teacherLoadError && currentUser.role !== "teacher" && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {teacherLoadError}
              </p>
            )}

            {visibleCriteria.length === 0 && !criteriaLoadError && (
              <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                {getAccessToken()
                  ? "Hozircha mezon ko'rinmayapti. Admin panelda (/admin) avval bo'lim va mezon qo'shing."
                  : "Mezonlarni ko'rish uchun tizimga kiring (admin panelda yaratilgan login va parol)."}
              </p>
            )}

            {currentUser.role !== "teacher" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="text-sm font-medium text-slate-700">Baholanayotgan o'qituvchi</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {uploadError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {uploadError}
              </div>
            ) : null}

            {visibleCriteria.map((criterion) => {
              const evalData = getEvaluation(evaluations, managedTeacherId, criterion.id)
              const criterionSubmissions = submissions.filter(
                (s) => s.teacherId === managedTeacherId && s.criterionId === criterion.id
              )
              const uploadModel = uploadState[criterion.id] ?? { type: "file", link: "", comment: "" }
              return (
                <article key={criterion.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {criterion.category}
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      Maksimal ball: {criterion.maxScore}
                    </p>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{criterion.title}</h3>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">Kerakli hujjatlar</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {criterion.requiredDocs.map((doc) => (
                        <span key={doc} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isTeacherUser(currentUser) && (
                    <div className="mt-4 rounded-xl border border-slate-200 p-3">
                      <div className="grid grid-cols-4 items-end gap-2">
                        <div>
                          <p className="mb-1 text-center text-xs font-semibold text-slate-700">Hujjat turi</p>
                          <select
                            value={uploadModel.type}
                            onChange={(e) => handleUploadChange(criterion.id, "type", e.target.value)}
                            className="min-h-12 min-w-0 w-full rounded-lg border border-slate-300 px-2 py-3 text-center text-xs"
                          >
                            <option value="file">PDF/DOCX/JPG/PNG</option>
                            <option value="link">Link</option>
                            <option value="video">Video link</option>
                          </select>
                        </div>

                        <div>
                          <p className="mb-1 text-center text-xs font-semibold text-slate-700">Hujjat yuklash</p>
                          {uploadModel.type === "file" ? (
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleUploadChange(criterion.id, "file", e.target.files?.[0])}
                              className="min-h-12 min-w-0 w-full rounded-lg border border-slate-300 px-2 py-2.5 text-center text-xs file:mx-auto file:rounded file:border-0 file:bg-indigo-100 file:px-2 file:py-1.5 file:text-[11px] file:text-indigo-700"
                            />
                          ) : (
                            <input
                              value={uploadModel.link || ""}
                              onChange={(e) => handleUploadChange(criterion.id, "link", e.target.value)}
                              placeholder={uploadModel.type === "video" ? "Video URL" : "URL"}
                              className="min-h-12 min-w-0 w-full rounded-lg border border-slate-300 px-2 py-3 text-center text-xs"
                            />
                          )}
                        </div>

                        <div>
                          <p className="mb-1 text-center text-xs font-semibold text-slate-700">Hujjat izohi</p>
                          <input
                            value={uploadModel.comment || ""}
                            onChange={(e) => handleUploadChange(criterion.id, "comment", e.target.value)}
                            placeholder="Izoh yozing..."
                            className="min-h-12 min-w-0 w-full rounded-lg border border-slate-300 px-2 py-3 text-center text-xs"
                          />
                        </div>

                        <div>
                          <p className="mb-1 text-center text-xs font-semibold text-transparent">.</p>
                          <button
                            onClick={() => submitCriterionFile(criterion.id)}
                            disabled={uploadingCriterionIds[criterion.id]}
                            className="min-h-12 min-w-0 w-full cursor-pointer rounded-lg bg-indigo-600 px-2 py-3 text-center text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {uploadingCriterionIds[criterion.id]
                              ? "Kuting..."
                              : uploadModel.type === "file"
                                ? "Yuklash"
                                : "Yuborish"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    {criterionSubmissions.map((submission) => (
                      <div key={submission.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-slate-800">{submission.fileName}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(submission.fileSize)}</p>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {(submission.fileDataUrl || (submission.evidenceType === "file" && submission.fileName)) ? (
                            <>
                              <a
                                className="inline-flex items-center rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                                href={
                                  submission.fileDataUrl ||
                                  submission.url ||
                                  getFileDownloadUrl(submission.fileName)
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Eye className="mr-1 h-3.5 w-3.5" />
                                Ochish
                              </a>
                              <a
                                className="inline-flex items-center rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
                                href={
                                  submission.fileDataUrl ||
                                  submission.url ||
                                  getFileDownloadUrl(submission.fileName)
                                }
                                download={submission.fileName}
                              >
                                <Download className="mr-1 h-3.5 w-3.5" />
                                Yuklab olish
                              </a>
                            </>
                          ) : null}
                          {submission.url && submission.evidenceType !== "file" && (
                            <a
                              className="inline-flex items-center rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
                              href={submission.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Havola
                            </a>
                          )}
                          {currentUser.role === "teacher" && (
                            <button
                              onClick={() => deleteSubmission(submission.id)}
                              className="inline-flex items-center rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" />
                              O'chirish
                            </button>
                          )}
                        </div>
                        {submission.comment && (
                          <p className="mt-3 text-base text-slate-600">
                            <MessageSquareText className="mr-1.5 inline h-4 w-4 text-slate-500" />
                            <span className="font-semibold text-slate-700">Izoh:</span> {submission.comment}
                          </p>
                        )}
                      </div>
                    ))}
                    {criterionSubmissions.length === 0 && (
                      <p className="text-sm text-slate-500">Bu mezon uchun yuklangan hujjat yo'q.</p>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl bg-emerald-50 p-3">
                    <p className="text-sm font-semibold text-emerald-900">Ekspert izohi</p>
                    {canEvaluate ? (
                      <div className="mt-2 grid gap-2 md:grid-cols-3">
                        <input
                          type="number"
                          min={0}
                          max={criterion.maxScore}
                          value={evalData.score}
                          onChange={(e) => upsertEvaluation(managedTeacherId, criterion.id, "score", e.target.value)}
                          className="rounded-lg border border-emerald-300 px-3 py-2 text-sm"
                        />
                        <select
                          value={evalData.status}
                          onChange={(e) => upsertEvaluation(managedTeacherId, criterion.id, "status", e.target.value)}
                          className="rounded-lg border border-emerald-300 px-3 py-2 text-sm"
                        >
                          <option value="pending">Kutilmoqda</option>
                          <option value="approved">Tasdiqlangan</option>
                          <option value="rejected">Rad etilgan</option>
                        </select>
                        <input
                          value={evalData.comment}
                          onChange={(e) => upsertEvaluation(managedTeacherId, criterion.id, "comment", e.target.value)}
                          placeholder="Izoh yozing..."
                          className="rounded-lg border border-emerald-300 px-3 py-2 text-sm md:col-span-3"
                        />
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-emerald-800">{evalData.comment || "Hozircha izoh yo'q."}</p>
                    )}
                  </div>
                </article>
              )
            })}
          </section>
        )}
        </div>

        <Footer />
      </div>

      {loginOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overscroll-contain bg-transparent p-4"
          role="presentation"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="relative w-full max-w-[420px] rounded-2xl bg-white px-8 pb-8 pt-10 shadow-xl shadow-black/20 ring-1 ring-slate-200/90"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-dialog-title"  
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLoginOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Yopish"
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={logoImg}
                alt=""
                className="h-[88px] w-[88px] rounded-full border border-slate-200 object-cover shadow-sm"
              />
              <h2 id="login-dialog-title" className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                Tizimga Kirish
              </h2>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div className="space-y-1.5 text-left">
                <label htmlFor="login-field" className="block text-sm font-bold text-slate-900">
                  Login
                </label>
                <input
                  id="login-field"
                  autoComplete="username"
                  value={loginForm.login}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, login: e.target.value }))}
                  placeholder="Loginni kiriting"
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-blue-500/0 transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label htmlFor="password-field" className="block text-sm font-bold text-slate-900">
                  Parol
                </label>
                <div className="relative">
                  <input
                    id="password-field"
                    autoComplete="current-password"
                    type={loginPasswordVisible ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Parolni kiriting"
                    className="w-full rounded-md border border-slate-300 py-2.5 pl-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-blue-500/0 transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setLoginPasswordVisible((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    aria-label={loginPasswordVisible ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  >
                    {loginPasswordVisible ? (
                      <EyeOff className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    )}
                  </button>
                </div>
              </div>
              {loginError && (
                <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">{loginError}</p>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="mt-2 w-full rounded-md bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginLoading ? "Tekshirilmoqda..." : "Kirish"}
              </button>
            </form>
          </div>
        </div>
      )}
        {pageLoading && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-10 py-8 shadow-2xl">
              <svg className="h-10 w-10 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-lg font-semibold text-slate-700">Kuting...</p>
            </div>
          </div>
        )}
    </main>
  )
}

export default App
