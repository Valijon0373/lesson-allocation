import { useEffect, useMemo, useState } from "react"
import bgVideo from "./assets/bg.mp4"
import logoImg from "./assets/logo.jpg"
import Footer from "./components/Footer.jsx"
import HomeHeroBrand from "./components/HomeHeroBrand.jsx"
import Navbar from "./components/Navbar.jsx"

const TOTAL_MAX_SCORE = 110

const USERS = [
  { id: "u-admin", fullName: "Platforma Admin", role: "admin", login: "admin", password: "12345" },
  { id: "u-head", fullName: "Kafedra mudiri", role: "head", login: "mudir", password: "12345" },
  { id: "u-dean", fullName: "Fakultet dekani", role: "dean", login: "dekan", password: "12345" },
  { id: "u-expert", fullName: "Ekspert tekshiruvchi", role: "expert", login: "expert", password: "12345" },
  { id: "t-1", fullName: "Azizbek Karimov", role: "teacher", login: "teacher1", password: "12345" },
  { id: "t-2", fullName: "Dilnoza Sobirova", role: "teacher", login: "teacher2", password: "12345" },
]

const ROLE_LABELS = {
  admin: "Admin",
  head: "Kafedra mudiri",
  dean: "Dekan",
  teacher: "O'qituvchi",
  expert: "Ekspert/Tekshiruvchi",
}

const CATEGORY_MAX = {
  "O'qituvchilik faoliyati": 20,
  "Metodik ishlar": 20,
  "Tarbiyaviy faoliyat": 20,
  "Ilmiy faoliyat": 30,
  "OTM rivojiga hissa": 10,
  "Shaxsiy fazilatlar": 10,
}

const ROLE_VISIBLE_CATEGORIES = {
  admin: Object.keys(CATEGORY_MAX),
  dean: Object.keys(CATEGORY_MAX),
  expert: Object.keys(CATEGORY_MAX),
  teacher: Object.keys(CATEGORY_MAX),
  head: ["O'qituvchilik faoliyati", "Metodik ishlar", "Tarbiyaviy faoliyat"],
}

const CRITERIA = [
  {
    id: "c-1-1",
    category: "O'qituvchilik faoliyati",
    title: "Nazariy-amaliy bilimlar va ochiq darslar",
    description: "Ochiq darslar asosida zamonaviy fan tendensiyalarini qo'llash darajasi.",
    maxScore: 8,
    requiredDocs: ["Ochiq dars jadvali", "Taqdimot", "Bayonnoma", "Foto/video"],
  },
  {
    id: "c-1-2",
    category: "O'qituvchilik faoliyati",
    title: "Talabalar so'rovnomasi bo'yicha o'qitish sifati",
    description: "Talabalar fikri va anonim so'rovnoma natijalari.",
    maxScore: 5,
    requiredDocs: ["So'rovnoma natijasi", "Tahlil hujjati"],
  },
  {
    id: "c-1-3",
    category: "O'qituvchilik faoliyati",
    title: "Talabalar olimpiada/tanlov/grantdagi ishtiroki",
    description: "Ustoz-shogird tizimida tayyorlangan talabalar natijalari.",
    maxScore: 7,
    requiredDocs: ["Buyruq nusxasi", "Diplom/sertifikat", "Nashr havolasi"],
  },
  {
    id: "c-2-1",
    category: "Metodik ishlar",
    title: "Darslik va o'quv qo'llanmalar",
    description: "Yakka mualliflik yoki hammualliflikdagi nashrlar.",
    maxScore: 8,
    requiredDocs: ["Guvohnoma", "ISBN ma'lumot", "Nashr nusxasi"],
  },
  {
    id: "c-2-2",
    category: "Metodik ishlar",
    title: "AKTdan foydalanish va o'quv materiallari",
    description: "HEMIS faoliyati va videodars/taqdimotlar sifati.",
    maxScore: 7,
    requiredDocs: ["HEMIS skrinshot", "Videodars", "Topshiriqlar ro'yxati"],
  },
  {
    id: "c-2-3",
    category: "Metodik ishlar",
    title: "Zamonaviy pedagogik texnologiyalar",
    description: "PISA/PIRLS/TIMSS/STEAM yoki innovatsion metodlar joriy etilishi.",
    maxScore: 5,
    requiredDocs: ["Metodik qo'llanma", "Mashg'ulot ishlanmasi"],
  },
  {
    id: "c-3-1",
    category: "Tarbiyaviy faoliyat",
    title: "Ma'naviy-ma'rifiy va sport tadbirlari",
    description: "Fakultet/institut miqyosidagi tadbirlar tashkiloti.",
    maxScore: 6,
    requiredDocs: ["Ma'lumotnoma", "Foto", "Dastur"],
  },
  {
    id: "c-3-2",
    category: "Tarbiyaviy faoliyat",
    title: "Kuratorlik faoliyati",
    description: "Biriktirilgan akademik guruhlar bilan ishlash natijalari.",
    maxScore: 5,
    requiredDocs: ["Farmoyish", "Bayonnoma", "Foto hisobot"],
  },
  {
    id: "c-3-3",
    category: "Tarbiyaviy faoliyat",
    title: "Talabalar bo'sh vaqtini tashkil etish",
    description: "TTJ va ustoz-shogird asosidagi faollik.",
    maxScore: 5,
    requiredDocs: ["Reja", "Sertifikat", "Bayonnoma"],
  },
  {
    id: "c-3-4",
    category: "Tarbiyaviy faoliyat",
    title: "Jamoatchilik ishlari va OAVdagi chiqishlar",
    description: "Davlat/jamoat tashkilotlari bilan hamkorlikdagi ishtirok.",
    maxScore: 4,
    requiredDocs: ["Ma'lumotnoma", "Foto", "Media havola"],
  },
  {
    id: "c-4-1",
    category: "Ilmiy faoliyat",
    title: "Ilmiy konferensiyalar",
    description: "Scopus/Web of Science va xalqaro-respublika konferensiyalari.",
    maxScore: 10,
    requiredDocs: ["Maqola/tezis", "Indeksatsiya havolasi"],
  },
  {
    id: "c-4-2",
    category: "Ilmiy faoliyat",
    title: "Ilmiy nashrlar va monografiyalar",
    description: "Monografiya, OAK va yuqori impakt-faktorli jurnallar.",
    maxScore: 5,
    requiredDocs: ["Maqola PDF", "Monografiya nusxasi", "ISBN/DOI"],
  },
  {
    id: "c-4-3",
    category: "Ilmiy faoliyat",
    title: "Loyihalar va tijoratlashtirish",
    description: "Innovatsion loyihalar va shartnomaviy ishlarda ishtirok.",
    maxScore: 4,
    requiredDocs: ["Shartnoma", "Kafedra ma'lumotnomasi"],
  },
  {
    id: "c-4-4",
    category: "Ilmiy faoliyat",
    title: "Patent va mualliflik guvohnomalari",
    description: "Ixtiro, dasturiy mahsulot va mualliflik huquqi hujjatlari.",
    maxScore: 3,
    requiredDocs: ["Patent guvohnomasi", "Mualliflik hujjati"],
  },
  {
    id: "c-4-5",
    category: "Ilmiy faoliyat",
    title: "Dissertatsiya va ilmiy rahbarlik",
    description: "Opponentlik, himoya, ilmiy maslahat va tadqiqot natijalari.",
    maxScore: 8,
    requiredDocs: ["Avtoreferat", "Diplom", "OAK e'loni"],
  },
  {
    id: "c-5-1",
    category: "OTM rivojiga hissa",
    title: "Ta'lim muassasalari hamkorligi",
    description: "Uzviylik va trening/seminarlarni tashkil etish.",
    maxScore: 3,
    requiredDocs: ["Reja", "Seminar dasturi", "Xulosa"],
  },
  {
    id: "c-5-2",
    category: "OTM rivojiga hissa",
    title: "Xorijiy OTMlar bilan almashinuv",
    description: "Top-1000 OTMlar bilan hamkorlik loyihalari.",
    maxScore: 4,
    requiredDocs: ["Memorandum", "Taklifnoma", "Buyruq"],
  },
  {
    id: "c-5-3",
    category: "OTM rivojiga hissa",
    title: "Yangi yo'nalish va ARM bazasi",
    description: "Yangi yo'nalish/laboratoriya ochish hamda ARMni boyitish.",
    maxScore: 3,
    requiredDocs: ["Tasdiqlovchi hujjat", "ARM ma'lumotnomasi"],
  },
  {
    id: "c-6-1",
    category: "Shaxsiy fazilatlar",
    title: "Ilmiy daraja va unvon",
    description: "Fan doktori, PhD, dotsent va ilmiy unvonlar.",
    maxScore: 3,
    requiredDocs: ["Diplom nusxasi"],
  },
  {
    id: "c-6-2",
    category: "Shaxsiy fazilatlar",
    title: "Malaka oshirish va til/stajirovka",
    description: "Malaka oshirish, xorijiy tillar va stajirovka natijalari.",
    maxScore: 7,
    requiredDocs: ["Sertifikat", "Seminar bayonnomasi", "Dalolatnoma"],
  },
]

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
      <header className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-wider text-indigo-100">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold">Nizom monitoring platformasi</h1>
        <p className="mt-2 text-indigo-50">
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
              Progress ({activeTeacher?.fullName})
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
              <h3 className="text-lg font-semibold text-slate-900">Reyting (Ranking)</h3>
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
            <header className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl">
              <h1 className="text-3xl font-bold">Mezonlar bo'limi</h1>
              <p className="mt-2 text-indigo-100">
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
                  <p className="mt-1 text-sm text-slate-600">{criterion.description}</p>

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
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
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
