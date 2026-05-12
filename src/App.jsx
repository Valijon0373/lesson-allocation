import { useEffect, useMemo, useState } from "react"
import { Eye, EyeOff, X } from "lucide-react"
import bgVideo from "./assets/bg.mp4"
import logoImg from "./assets/logo.jpg"
import Footer from "./components/Footer.jsx"
import HomeHeroBrand from "./components/HomeHeroBrand.jsx"
import Navbar from "./components/Navbar.jsx"
import { CATEGORY_MAX, CRITERIA, TOTAL_MAX_SCORE } from "./data/criteria.js"

const USERS = [
  { id: "u-admin", fullName: "Platforma Admin", role: "admin", login: "admin", password: "12345" },
  { id: "u-head", fullName: "Kafedra mudiri", role: "head", login: "mudir", password: "12345" },
  { id: "u-dean", fullName: "Fakultet dekani", role: "dean", login: "dekan", password: "12345" },
  { id: "u-expert", fullName: "Ekspert tekshiruvchi", role: "expert", login: "expert", password: "12345" },
  { id: "t-1", fullName: "Azizbek Karimov", role: "teacher", login: "teacher1", password: "12345" },
  { id: "t-2", fullName: "Dilnoza Sobirova", role: "teacher", login: "teacher2", password: "12345" },
]

const ROLE_LABELS = {
  admin: "Administrator",
  head: "Kafedra mudiri",
  dean: "Dekan",
  teacher: "O'qituvchi",
  expert: "Ekspert/Tekshiruvchi",
}

const ROLE_VISIBLE_CATEGORIES = {
  admin: Object.keys(CATEGORY_MAX),
  dean: Object.keys(CATEGORY_MAX),
  expert: Object.keys(CATEGORY_MAX),
  teacher: Object.keys(CATEGORY_MAX),
  head: ["O'qituvchilik faoliyati", "Metodik ishlar", "Tarbiyaviy faoliyat"],
}

const STORAGE_KEYS = {
  submissions: "nizom_submissions_v2",
  evaluations: "nizom_evaluations_v2",
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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Faylni o'qishda xatolik yuz berdi"))
    reader.readAsDataURL(file)
  })
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

function App() {
  const [activePage, setActivePage] = useState("dashboard")
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ login: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedTeacherId, setSelectedTeacherId] = useState("t-1")
  const [submissions, setSubmissions] = useState([])
  const [evaluations, setEvaluations] = useState({})
  const [uploadState, setUploadState] = useState({})

  useEffect(() => {
    setSubmissions(parseStorage(STORAGE_KEYS.submissions, []))
    setEvaluations(parseStorage(STORAGE_KEYS.evaluations, {}))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.submissions, JSON.stringify(submissions))
  }, [submissions])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.evaluations, JSON.stringify(evaluations))
  }, [evaluations])

  useEffect(() => {
    if (!loginOpen) setLoginPasswordVisible(false)
  }, [loginOpen])

  const teachers = USERS.filter((u) => u.role === "teacher")
  const managedTeacherId = currentUser?.role === "teacher" ? currentUser.id : selectedTeacherId
  const visibleCategories = currentUser ? ROLE_VISIBLE_CATEGORIES[currentUser.role] : Object.keys(CATEGORY_MAX)

  const visibleCriteria = CRITERIA.filter((c) => visibleCategories.includes(c.category))

  const categoryScoresForTeacher = (teacherId) => {
    const result = {}
    Object.keys(CATEGORY_MAX).forEach((cat) => {
      result[cat] = CRITERIA.filter((c) => c.category === cat).reduce(
        (sum, criterion) => sum + getEvaluation(evaluations, teacherId, criterion.id).score,
        0
      )
    })
    return result
  }

  const totalScoreForTeacher = (teacherId) =>
    CRITERIA.reduce((sum, criterion) => sum + getEvaluation(evaluations, teacherId, criterion.id).score, 0)

  const ranking = useMemo(() => {
    return [...teachers]
      .map((t) => ({ ...t, total: totalScoreForTeacher(t.id) }))
      .sort((a, b) => b.total - a.total)
  }, [teachers, evaluations])

  const activeTeacher = teachers.find((t) => t.id === managedTeacherId)
  const myTotalScore = managedTeacherId ? totalScoreForTeacher(managedTeacherId) : 0
  const myPercent = Math.round((myTotalScore / TOTAL_MAX_SCORE) * 100)
  const myCategoryScores = managedTeacherId ? categoryScoresForTeacher(managedTeacherId) : {}

  const mySubmissions = submissions.filter((s) => s.teacherId === managedTeacherId)
  const recentUploads = [...mySubmissions].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 5)

  const missingDocsCount = managedTeacherId
    ? CRITERIA.filter((criterion) => !mySubmissions.some((s) => s.criterionId === criterion.id)).length
    : 0

  const statuses = mySubmissions.reduce(
    (acc, submission) => {
      const status = getEvaluation(evaluations, managedTeacherId, submission.criterionId).status
      acc[status] += 1
      return acc
    },
    { pending: 0, approved: 0, rejected: 0 }
  )

  const handleLogin = (event) => {
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
    const found = USERS.find((u) => u.login === loginTrim && u.password === loginForm.password)
    if (!found) {
      setLoginError("Login yoki parol noto'g'ri.")
      return
    }
    setCurrentUser(found)
    if (found.role === "teacher") setSelectedTeacherId(found.id)
    setLoginError("")
    setLoginOpen(false)
    setLoginForm({ login: "", password: "" })
  }

  const canEvaluate = currentUser && ["admin", "head", "dean", "expert"].includes(currentUser.role)

  const handleUploadChange = (criterionId, field, value) => {
    setUploadState((prev) => ({
      ...prev,
      [criterionId]: { ...(prev[criterionId] ?? { type: "file", link: "" }), [field]: value },
    }))
  }

  const submitCriterionFile = async (criterionId) => {
    if (!currentUser || currentUser.role !== "teacher") return
    const state = uploadState[criterionId] ?? { type: "file", link: "" }
    const evidenceType = state.type || "file"
    if (evidenceType === "file") {
      const file = state.file
      if (!file) return
      const fileDataUrl = await fileToDataUrl(file)
      const payload = {
        id: crypto.randomUUID(),
        teacherId: currentUser.id,
        criterionId,
        evidenceType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || "application/octet-stream",
        fileDataUrl,
        url: "",
        uploadedAt: new Date().toISOString(),
      }
      setSubmissions((prev) => [payload, ...prev])
    } else {
      if (!state.link) return
      const payload = {
        id: crypto.randomUUID(),
        teacherId: currentUser.id,
        criterionId,
        evidenceType,
        fileName: evidenceType === "video" ? "Video link" : "Web link",
        fileSize: 0,
        fileType: "url",
        fileDataUrl: "",
        url: state.link.trim(),
        uploadedAt: new Date().toISOString(),
      }
      setSubmissions((prev) => [payload, ...prev])
    }
    setUploadState((prev) => ({ ...prev, [criterionId]: { type: "file", link: "" } }))
  }

  const deleteSubmission = (submissionId) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
  }

  const upsertEvaluation = (teacherId, criterionId, field, value) => {
    const key = `${teacherId}_${criterionId}`
    const current = evaluations[key] ?? { score: 0, comment: "", status: "pending" }
    let nextValue = value
    if (field === "score") {
      const criterion = CRITERIA.find((c) => c.id === criterionId)
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
          Jami {TOTAL_MAX_SCORE} ball bo'yicha progress, hujjatlar holati va reyting.
        </p>
      </header>

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
                {Object.entries(CATEGORY_MAX).map(([category, max]) => {
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
          </div>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Oxirgi yuklangan fayllar</h3>
            <div className="mt-3 space-y-2">
              {recentUploads.map((upload) => {
                const criterion = CRITERIA.find((c) => c.id === upload.criterionId)
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
          onNavigate={setActivePage}
          currentUser={currentUser}
          logoSrc={logoImg}
          logoAlt="Urganch DPI logo"
          userRoleLabel={currentUser ? ROLE_LABELS[currentUser.role] : ""}
          onLogout={() => setCurrentUser(null)}
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

            {visibleCriteria.map((criterion) => {
              const evalData = getEvaluation(evaluations, managedTeacherId, criterion.id)
              const criterionSubmissions = submissions.filter(
                (s) => s.teacherId === managedTeacherId && s.criterionId === criterion.id
              )
              const uploadModel = uploadState[criterion.id] ?? { type: "file", link: "" }
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

                  {currentUser.role === "teacher" && (
                    <div className="mt-4 rounded-xl border border-slate-200 p-3">
                      <p className="mb-2 text-sm font-semibold text-slate-800">Hujjat yuklash</p>
                      <div className="grid gap-2 md:grid-cols-4">
                        <select
                          value={uploadModel.type}
                          onChange={(e) => handleUploadChange(criterion.id, "type", e.target.value)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                          <option value="file">PDF/DOCX/JPG/PNG</option>
                          <option value="link">Link</option>
                          <option value="video">Video link</option>
                        </select>

                        {uploadModel.type === "file" ? (
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleUploadChange(criterion.id, "file", e.target.files?.[0])}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-indigo-100 file:px-3 file:py-1 file:text-indigo-700 md:col-span-2"
                          />
                        ) : (
                          <input
                            value={uploadModel.link || ""}
                            onChange={(e) => handleUploadChange(criterion.id, "link", e.target.value)}
                            placeholder={uploadModel.type === "video" ? "Video URL" : "URL"}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                          />
                        )}

                        <button
                          onClick={() => submitCriterionFile(criterion.id)}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Yuklash
                        </button>
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
                        {submission.fileDataUrl && (
                          <a
                            className="mt-1 inline-block text-xs font-semibold text-indigo-700"
                            href={submission.fileDataUrl}
                            download={submission.fileName}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ochish/Yuklab olish
                          </a>
                        )}
                        {submission.url && (
                          <a
                            className="mt-1 block break-all text-xs font-semibold text-indigo-700"
                            href={submission.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {submission.url}
                          </a>
                        )}
                        {currentUser.role === "teacher" && (
                          <button
                            onClick={() => deleteSubmission(submission.id)}
                            className="mt-2 rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700"
                          >
                            O'chirish
                          </button>
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
                className="mt-2 w-full rounded-md bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
              >
                Kirish
              </button>
              <p className="text-center text-xs text-slate-400">
                Demo: admin, mudir, dekan, expert, teacher1, teacher2 — parol: 12345
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
