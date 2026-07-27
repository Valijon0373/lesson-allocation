import React, { useState, useMemo } from "react"
import { 
  Search, Plus, Filter, Eye, CheckCircle2, XCircle, Clock, 
  AlertCircle, FileSpreadsheet, Trash2, Calendar, User, 
  Building2, BookOpen, AlertTriangle, Check, X, ArrowUpDown,
  MessageSquare, Sparkles, HelpCircle, ChevronRight
} from "lucide-react"
import { BsMailboxFlag } from "react-icons/bs"

const initialTalabnomalar = [
  {
    id: "TL-2026-001",
    date: "2026-07-25",
    faculty: "Filologiya fakulteti",
    department: "Rus tili va adabiyoti kafedrasi",
    subject: "Rus tili grammatikasi (Qo'shimcha oqim)",
    semester: "Kuzki semestr",
    hours: { lecture: 36, practice: 36, lab: 0, seminar: 18, total: 90 },
    reason: "Yangi qabul qilingan guruhlar soni ortganligi sababli qo'shimcha soat ajratish talabi.",
    applicant: "Karimova Z.A. (Kafedra mudiri)",
    status: "Kutilmoqda",
    priority: "Yuqori",
    rejectReason: ""
  },
  {
    id: "TL-2026-002",
    date: "2026-07-24",
    faculty: "Aniq va tabiiy fanlar fakulteti",
    department: "Matematika va informatika o'qitish metodikasi",
    subject: "Sun'iy intellekt asoslari",
    semester: "Kuzki semestr",
    hours: { lecture: 54, practice: 36, lab: 36, seminar: 0, total: 126 },
    reason: "IT yo'nalishidagi yangi o'quv rejasi bo'yicha mutaxassis professor-o'qituvchi talab etiladi.",
    applicant: "Rahimov D.Ch. (Kafedra mudiri)",
    status: "Tasdiqlangan",
    priority: "O'rta",
    rejectReason: ""
  },
  {
    id: "TL-2026-003",
    date: "2026-07-22",
    faculty: "Pedagogika fakulteti",
    department: "Maxsus pedagogika va inklyuziv ta'lim",
    subject: "Inklyuziv ta'lim pedagogikasi",
    semester: "Bahorki semestr",
    hours: { lecture: 36, practice: 36, lab: 0, seminar: 36, total: 108 },
    reason: "O'rinbosar o'qituvchi (homiladorlik ta'tili) o'rniga soat taqsimlash talabnomasi.",
    applicant: "Ergasheva Z.A. (Dotsent)",
    status: "Kutilmoqda",
    priority: "Zaruriy",
    rejectReason: ""
  },
  {
    id: "TL-2026-004",
    date: "2026-07-20",
    faculty: "Ijtimoiy va amaliy fanlar fakulteti",
    department: "Tarix va ijtimoiy fanlar kafedrasi",
    subject: "O'zbekiston davlatchiligi tarixi",
    semester: "Kuzki semestr",
    hours: { lecture: 72, practice: 72, lab: 0, seminar: 0, total: 144 },
    reason: "Sirtqi ta'lim shakli uchun auditoriya dars yuklamalari talabi.",
    applicant: "Toshmatov B.R. (Kafedra mudiri)",
    status: "Rad etilgan",
    priority: "Past",
    rejectReason: "Soatlar kafedra ichki resurslari hisobidan qoplanishi belgilandi."
  },
  {
    id: "TL-2026-005",
    date: "2026-07-18",
    faculty: "Boshlang'ich ta'lim fakulteti",
    department: "Boshlang'ich ta'lim metodikasi kafedrasi",
    subject: "Boshlang'ich sinflarda matematika o'qitish metodikasi",
    semester: "Bahorki semestr",
    hours: { lecture: 54, practice: 54, lab: 18, seminar: 18, total: 144 },
    reason: "Amaliyot darslarini kichik guruhlarga bo'lish uchun qo'shimcha soat ajratish.",
    applicant: "Saidova N.B. (Kafedra mudiri)",
    status: "Tasdiqlangan",
    priority: "O'rta",
    rejectReason: ""
  },
  {
    id: "TL-2026-006",
    date: "2026-07-15",
    faculty: "Filologiya fakulteti",
    department: "Xorijiy tillar va tilshunoslik kafedrasi",
    subject: "Amaliy ingliz tili (IELTS tayyorlov)",
    semester: "Kuzki semestr",
    hours: { lecture: 0, practice: 120, lab: 40, seminar: 0, total: 160 },
    reason: "C1 darajadagi malakali xorijiy mutaxassisni jalb qilish uchun yuklama talabi.",
    applicant: "Valiyev S.T. (Dekan o'rinbosari)",
    status: "Kutilmoqda",
    priority: "Yuqori",
    rejectReason: ""
  }
]

export default function Talabnoma({ isDark }) {
  const [talabnomalar, setTalabnomalar] = useState(initialTalabnomalar)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [facultyFilter, setFacultyFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")

  // Modals state
  const [viewModalData, setViewModalData] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [rejectModalData, setRejectModalData] = useState(null)
  const [rejectComment, setRejectComment] = useState("")

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  // New requisition form state
  const [newReq, setNewReq] = useState({
    faculty: "Filologiya fakulteti",
    department: "Rus tili va adabiyoti kafedrasi",
    subject: "",
    semester: "Kuzki semestr",
    lecture: "",
    practice: "",
    lab: "",
    seminar: "",
    reason: "",
    applicant: ""
  })

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3500)
  }

  // Stats calculation
  const stats = useMemo(() => {
    const total = talabnomalar.length
    const pending = talabnomalar.filter((t) => t.status === "Kutilmoqda").length
    const approved = talabnomalar.filter((t) => t.status === "Tasdiqlangan").length
    const rejected = talabnomalar.filter((t) => t.status === "Rad etilgan").length
    return { total, pending, approved, rejected }
  }, [talabnomalar])

  // Faculties and Departments list for filter
  const facultiesList = useMemo(() => {
    const set = new Set(talabnomalar.map((t) => t.faculty))
    return Array.from(set)
  }, [talabnomalar])

  // Filtered requisitions
  const filteredList = useMemo(() => {
    return talabnomalar.filter((t) => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch = 
        !q || 
        t.id.toLowerCase().includes(q) || 
        t.subject.toLowerCase().includes(q) || 
        t.department.toLowerCase().includes(q) || 
        t.applicant.toLowerCase().includes(q) || 
        t.reason.toLowerCase().includes(q)

      const matchStatus = statusFilter === "all" || t.status === statusFilter
      const matchFaculty = facultyFilter === "all" || t.faculty === facultyFilter
      const matchSemester = semesterFilter === "all" || t.semester === semesterFilter

      return matchSearch && matchStatus && matchFaculty && matchSemester
    })
  }, [talabnomalar, searchQuery, statusFilter, facultyFilter, semesterFilter])

  // Handlers
  const handleApprove = (id) => {
    setTalabnomalar((prev) => 
      prev.map((item) => item.id === id ? { ...item, status: "Tasdiqlangan", rejectReason: "" } : item)
    )
    showToast("Talabnoma muvaffaqiyatli tasdiqlandi!", "success")
    if (viewModalData && viewModalData.id === id) {
      setViewModalData((prev) => ({ ...prev, status: "Tasdiqlangan", rejectReason: "" }))
    }
  }

  const handleOpenReject = (item) => {
    setRejectComment("")
    setRejectModalData(item)
  }

  const handleConfirmReject = () => {
    if (!rejectModalData) return
    const id = rejectModalData.id
    const reason = rejectComment.trim() || "Sabab ko'rsatilmadi"
    setTalabnomalar((prev) => 
      prev.map((item) => item.id === id ? { ...item, status: "Rad etilgan", rejectReason: reason } : item)
    )
    showToast("Talabnoma rad etildi!", "warning")
    if (viewModalData && viewModalData.id === id) {
      setViewModalData((prev) => ({ ...prev, status: "Rad etilgan", rejectReason: reason }))
    }
    setRejectModalData(null)
  }

  const handleDelete = (id) => {
    if (window.confirm("Ushbu talabnomani o'chirishni tasdiqlaysizmi?")) {
      setTalabnomalar((prev) => prev.filter((item) => item.id !== id))
      showToast("Talabnoma ro'yxatdan o'chirildi!", "info")
      if (viewModalData && viewModalData.id === id) {
        setViewModalData(null)
      }
    }
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!newReq.subject || !newReq.reason || !newReq.applicant) {
      showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", "warning")
      return
    }

    const lecture = parseInt(newReq.lecture) || 0
    const practice = parseInt(newReq.practice) || 0
    const lab = parseInt(newReq.lab) || 0
    const seminar = parseInt(newReq.seminar) || 0
    const total = lecture + practice + lab + seminar

    if (total === 0) {
      showToast("Kamida 1 soat yuklama kiritilishi shart!", "warning")
      return
    }

    const newId = `TL-2026-00${talabnomalar.length + 1}`
    const today = new Date().toISOString().split("T")[0]

    const createdItem = {
      id: newId,
      date: today,
      faculty: newReq.faculty,
      department: newReq.department,
      subject: newReq.subject.trim(),
      semester: newReq.semester,
      hours: { lecture, practice, lab, seminar, total },
      reason: newReq.reason.trim(),
      applicant: newReq.applicant.trim(),
      status: "Kutilmoqda",
      rejectReason: ""
    }

    setTalabnomalar((prev) => [createdItem, ...prev])
    setCreateModalOpen(false)
    showToast("Yangi talabnoma muvaffaqiyatli yuborildi!", "success")
    
    // Reset form
    setNewReq({
      faculty: "Filologiya fakulteti",
      department: "Rus tili va adabiyoti kafedrasi",
      subject: "",
      semester: "Kuzki semestr",
      lecture: "",
      practice: "",
      lab: "",
      seminar: "",
      reason: "",
      applicant: ""
    })
  }

  const exportToCSV = () => {
    const headers = ["ID", "Sana", "Fakultet", "Kafedra", "Fan nomi", "Semestr", "Ma'ruza", "Amaliyot", "Lab", "Seminar", "Jami soat", "Talabgor", "Holati"]
    const rows = filteredList.map((t) => [
      t.id,
      t.date,
      `"${t.faculty}"`,
      `"${t.department}"`,
      `"${t.subject}"`,
      t.semester,
      t.hours.lecture,
      t.hours.practice,
      t.hours.lab,
      t.hours.seminar,
      t.hours.total,
      `"${t.applicant}"`,
      t.status
    ])
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Kafedra_talabnomalari_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Ma'lumotlar CSV formatida yuklab olindi!", "success")
  }

  return (
    <div className={`min-h-screen p-6 md:p-8 transition-colors duration-300 ${isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md ${
            toast.type === "success" 
              ? isDark ? "bg-emerald-900/90 border-emerald-700 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/10"
              : toast.type === "warning"
              ? isDark ? "bg-amber-900/90 border-amber-700 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-800 shadow-amber-500/10"
              : isDark ? "bg-blue-900/90 border-blue-700 text-blue-200" : "bg-blue-50 border-blue-200 text-blue-800 shadow-blue-500/10"
          }`}>
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />}
            {toast.type === "warning" && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5 shrink-0 text-blue-500" />}
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 border shadow-sm transition-all duration-300 ${
          isDark 
            ? "bg-gradient-to-br from-indigo-950/80 via-slate-850 to-slate-900 border-indigo-500/20 shadow-indigo-950/30" 
            : "bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 border-indigo-400/20 text-white shadow-indigo-500/10"
        }`}>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 -mb-12 w-48 h-48 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/15 text-white backdrop-blur-md border border-white/20">
                <BsMailboxFlag className="w-3.5 h-3.5 animate-pulse" />
                <span>Kafedra talabnomalari tizimi</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Dars yuklamasi bo&apos;yicha Talabnomalar</span>
              </h1>
              <p className="text-sm md:text-base text-indigo-100/90 max-w-2xl font-normal leading-relaxed">
                Fakultet va kafedralar tomonidan qo&apos;shimcha dars soatlari, yangi oqimlar hamda professor-o&apos;qituvchilarga bo&apos;lgan ehtiyoj talabnomalarini ko&apos;rib chiqish va tasdiqlash paneli.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm backdrop-blur-md active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span>Yuklab olish (CSV)</span>
              </button>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-lg shadow-orange-500/25 active:scale-95"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Yangi talabnoma</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setStatusFilter("all")}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 ${
              statusFilter === "all"
                ? isDark ? "bg-indigo-950/60 border-indigo-500/50 shadow-lg shadow-indigo-950/50" : "bg-indigo-50 border-indigo-300 shadow-md shadow-indigo-100"
                : isDark ? "bg-slate-800/80 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Jami talabnomalar</p>
                <h3 className="text-3xl font-extrabold mt-1.5 tabular-nums">{stats.total}</h3>
              </div>
              <div className={`p-3.5 rounded-2xl ${isDark ? "bg-indigo-500/15 text-indigo-400 group-hover:bg-indigo-500/25" : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200/80"} transition-colors`}>
                <BsMailboxFlag className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-500 dark:text-indigo-400">
              <span>Barcha arizalarni ko&apos;rish</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter("Kutilmoqda")}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 ${
              statusFilter === "Kutilmoqda"
                ? isDark ? "bg-amber-950/60 border-amber-500/50 shadow-lg shadow-amber-950/50" : "bg-amber-50 border-amber-300 shadow-md shadow-amber-100"
                : isDark ? "bg-slate-800/80 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-amber-400/90" : "text-amber-600"}`}>Kutilmoqda (Yangi)</p>
                <h3 className="text-3xl font-extrabold mt-1.5 tabular-nums text-amber-600 dark:text-amber-400">{stats.pending}</h3>
              </div>
              <div className={`p-3.5 rounded-2xl ${isDark ? "bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25" : "bg-amber-100 text-amber-600 group-hover:bg-amber-200/80"} transition-colors`}>
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Tasdiqlashni kutayotganlar</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter("Tasdiqlangan")}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 ${
              statusFilter === "Tasdiqlangan"
                ? isDark ? "bg-emerald-950/60 border-emerald-500/50 shadow-lg shadow-emerald-950/50" : "bg-emerald-50 border-emerald-300 shadow-md shadow-emerald-100"
                : isDark ? "bg-slate-800/80 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-emerald-400/90" : "text-emerald-600"}`}>Tasdiqlangan</p>
                <h3 className="text-3xl font-extrabold mt-1.5 tabular-nums text-emerald-600 dark:text-emerald-400">{stats.approved}</h3>
              </div>
              <div className={`p-3.5 rounded-2xl ${isDark ? "bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25" : "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200/80"} transition-colors`}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Qabul qilingan soatlar</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter("Rad etilgan")}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 ${
              statusFilter === "Rad etilgan"
                ? isDark ? "bg-rose-950/60 border-rose-500/50 shadow-lg shadow-rose-950/50" : "bg-rose-50 border-rose-300 shadow-md shadow-rose-100"
                : isDark ? "bg-slate-800/80 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-rose-400/90" : "text-rose-600"}`}>Rad etilgan</p>
                <h3 className="text-3xl font-extrabold mt-1.5 tabular-nums text-rose-600 dark:text-rose-400">{stats.rejected}</h3>
              </div>
              <div className={`p-3.5 rounded-2xl ${isDark ? "bg-rose-500/15 text-rose-400 group-hover:bg-rose-500/25" : "bg-rose-100 text-rose-600 group-hover:bg-rose-200/80"} transition-colors`}>
                <XCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Qaytarilgan arizalar</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className={`rounded-2xl p-5 border shadow-sm transition-colors ${isDark ? "bg-slate-800/90 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ID, Fan nomi, Kafedra yoki talabgor bo'yicha qidirish..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border font-medium outline-none transition-all ${
                  isDark 
                    ? "bg-slate-900/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" 
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/10"
                }`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium border outline-none transition-all ${
                  isDark ? "bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600"
                }`}
              >
                <option value="all">Barcha holatlar</option>
                <option value="Kutilmoqda">⏳ Kutilmoqda</option>
                <option value="Tasdiqlangan">✅ Tasdiqlangan</option>
                <option value="Rad etilgan">❌ Rad etilgan</option>
              </select>
            </div>

            {/* Faculty Filter */}
            <div className="md:col-span-2">
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium border outline-none transition-all ${
                  isDark ? "bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600"
                }`}
              >
                <option value="all">Barcha fakultetlar</option>
                {facultiesList.map((f, idx) => (
                  <option key={idx} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="md:col-span-2">
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium border outline-none transition-all ${
                  isDark ? "bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600"
                }`}
              >
                <option value="all">Barcha semestrlar</option>
                <option value="Kuzki semestr">Kuzki semestr</option>
                <option value="Bahorki semestr">Bahorki semestr</option>
              </select>
            </div>

          </div>
        </div>

        {/* Talabnomalar Table / Cards */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${isDark ? "bg-slate-800/90 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50/50"}`}>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>Talabnomalar ro&apos;yxati</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700"}`}>
                {filteredList.length} ta
              </span>
            </h2>
            <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Guruhlash: Yangi talabnomalar yuqorida
            </span>
          </div>

          {filteredList.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDark ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-400"}`}>
                <BsMailboxFlag className="w-8 h-8" />
              </div>
              <p className={`text-base font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Hozircha hech qanday talabnoma topilmadi</p>
              <p className={`text-xs max-w-sm mx-auto ${isDark ? "text-slate-500" : "text-slate-400"}`}>Qidiruv so&apos;zini yoki filtrlash shartlarini o&apos;zgartirib ko&apos;ring yoki yangi talabnoma yarating.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-xs font-bold uppercase tracking-wider border-b ${isDark ? "border-slate-700 bg-slate-850/80 text-slate-400" : "border-slate-200 bg-slate-100/70 text-slate-600"}`}>
                    <th className="py-4 px-5">Talabnoma ID / Sana</th>
                    <th className="py-4 px-5">Kafedra / Fakultet</th>
                    <th className="py-4 px-5">Fan / Semestr</th>
                    <th className="py-4 px-5 text-center">Talab soat</th>
                    <th className="py-4 px-5">Talabgor</th>
                    <th className="py-4 px-5 text-center">Holati</th>
                    <th className="py-4 px-5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 text-sm">
                  {filteredList.map((item) => {
                    const isPending = item.status === "Kutilmoqda"
                    const isApproved = item.status === "Tasdiqlangan"
                    const isRejected = item.status === "Rad etilgan"

                    return (
                      <tr 
                        key={item.id} 
                        className={`group transition-colors ${
                          isDark ? "hover:bg-slate-700/40" : "hover:bg-slate-50/80"
                        }`}
                      >
                        {/* ID and Date */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl shrink-0 ${
                              isPending 
                                ? isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-100 text-amber-700"
                                : isApproved 
                                ? isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                                : isDark ? "bg-rose-500/15 text-rose-400" : "bg-rose-100 text-rose-700"
                            }`}>
                              <BsMailboxFlag className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 block">
                                {item.id}
                              </span>
                              <span className={`inline-flex items-center gap-1 text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                <Calendar className="w-3 h-3 shrink-0" />
                                {item.date}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Kafedra / Fakultet */}
                        <td className="py-4 px-5 max-w-[220px]">
                          <p className={`font-extrabold truncate ${isDark ? "text-white" : "text-black"}`} title={item.department}>
                            {item.department}
                          </p>
                          <p className={`text-xs mt-0.5 truncate font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`} title={item.faculty}>
                            {item.faculty}
                          </p>
                        </td>

                        {/* Fan / Semestr */}
                        <td className="py-4 px-5 max-w-[240px]">
                          <p className={`font-extrabold line-clamp-1 ${isDark ? "text-white" : "text-black"}`} title={item.subject}>
                            {item.subject}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.semester === "Kuzki semestr"
                              ? isDark ? "bg-orange-500/15 text-orange-400" : "bg-orange-50 text-orange-700 border border-orange-200"
                              : isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {item.semester}
                          </span>
                        </td>

                        {/* Talab soati */}
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <div className="inline-flex flex-col items-center">
                            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                              {item.hours.total} soat
                            </span>
                            <span className={`text-[11px] font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              M:{item.hours.lecture} | A:{item.hours.practice} | L:{item.hours.lab}
                            </span>
                          </div>
                        </td>

                        {/* Talabgor */}
                        <td className="py-4 px-5 max-w-[180px]">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                              isDark ? "bg-slate-700 text-white" : "bg-slate-300 text-black"
                            }`}>
                              {item.applicant.slice(0, 1)}
                            </div>
                            <span className={`font-bold text-xs truncate ${isDark ? "text-white" : "text-black"}`} title={item.applicant}>
                              {item.applicant}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                            isPending
                              ? isDark ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-amber-50 text-amber-700 border border-amber-200"
                              : isApproved
                              ? isDark ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isDark ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {isPending && <Clock className="w-3.5 h-3.5 animate-spin-slow" />}
                            {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isRejected && <XCircle className="w-3.5 h-3.5" />}
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* View Modal Button */}
                            <button
                              onClick={() => setViewModalData(item)}
                              title="Batafsil ko'rish"
                              className={`p-2 rounded-xl border transition-colors ${
                                isDark 
                                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white" 
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* If Pending: Approve / Reject buttons */}
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApprove(item.id)}
                                  title="Tasdiqlash (Qabul qilish)"
                                  className="p-2 rounded-xl font-semibold transition-all bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 active:scale-90"
                                >
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                </button>
                                <button
                                  onClick={() => handleOpenReject(item)}
                                  title="Rad etish (Sabab yozish)"
                                  className="p-2 rounded-xl font-semibold transition-all bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 active:scale-90"
                                >
                                  <X className="w-4 h-4 stroke-[2.5]" />
                                </button>
                              </>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(item.id)}
                              title="O'chirish"
                              className={`p-2 rounded-xl transition-colors ${
                                isDark 
                                  ? "text-slate-500 hover:bg-rose-950/50 hover:text-rose-400" 
                                  : "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-2xl rounded-3xl p-6 md:p-8 border shadow-2xl overflow-hidden ${
            isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  viewModalData.status === "Tasdiqlangan" 
                    ? isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                    : viewModalData.status === "Rad etilgan"
                    ? isDark ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-700"
                    : isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"
                }`}>
                  <BsMailboxFlag className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider uppercase text-indigo-500 dark:text-indigo-400 block">
                    Talabnoma ma&apos;lumotnomasi
                  </span>
                  <h3 className="text-xl font-extrabold mt-0.5">{viewModalData.id}</h3>
                </div>
              </div>
              <button
                onClick={() => setViewModalData(null)}
                className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                viewModalData.status === "Tasdiqlangan"
                  ? isDark ? "bg-emerald-950/40 border-emerald-800 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : viewModalData.status === "Rad etilgan"
                  ? isDark ? "bg-rose-950/40 border-rose-800 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-900"
                  : isDark ? "bg-amber-950/40 border-amber-800 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"
              }`}>
                <div className="flex items-center gap-3">
                  {viewModalData.status === "Tasdiqlangan" && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
                  {viewModalData.status === "Rad etilgan" && <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
                  {viewModalData.status === "Kutilmoqda" && <Clock className="w-6 h-6 text-amber-500 shrink-0 animate-pulse" />}
                  <div>
                    <p className="text-xs font-semibold opacity-80">Joriy holat</p>
                    <p className="text-base font-extrabold">{viewModalData.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold opacity-80 block">Yuborilgan sana</span>
                  <span className="text-sm font-bold">{viewModalData.date}</span>
                </div>
              </div>

              {/* If Rejected Show Reason */}
              {viewModalData.status === "Rad etilgan" && viewModalData.rejectReason && (
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-rose-950/30 border-rose-800/80 text-rose-300" : "bg-rose-50/80 border-rose-300 text-rose-800"}`}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Rad etish sababi:
                  </p>
                  <p className="text-sm font-medium italic">&quot;{viewModalData.rejectReason}&quot;</p>
                </div>
              )}

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Fakultet</p>
                  <p className="text-sm font-bold mt-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{viewModalData.faculty}</span>
                  </p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Kafedra</p>
                  <p className="text-sm font-bold mt-1">{viewModalData.department}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Fan nomi</p>
                  <p className="text-sm font-bold mt-1 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>{viewModalData.subject}</span>
                  </p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>O&apos;quv semestri</p>
                  <p className="text-sm font-bold mt-1">{viewModalData.semester}</p>
                </div>
              </div>

              {/* Hours Breakdown Box */}
              <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? "bg-indigo-950/30 border-indigo-500/30" : "bg-indigo-50/60 border-indigo-200"}`}>
                <div className="flex items-center justify-between border-b pb-3 border-indigo-500/20">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Soatlar taqsimoti (Jami yuklama)</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{viewModalData.hours.total} soat</span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Ma&apos;ruza</p>
                    <p className="text-lg font-extrabold mt-1">{viewModalData.hours.lecture}</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Amaliyot</p>
                    <p className="text-lg font-extrabold mt-1">{viewModalData.hours.practice}</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Laboratoriya</p>
                    <p className="text-lg font-extrabold mt-1">{viewModalData.hours.lab}</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Seminar</p>
                    <p className="text-lg font-extrabold mt-1">{viewModalData.hours.seminar || 0}</p>
                  </div>
                </div>
              </div>

              {/* Reason & Applicant */}
              <div className="space-y-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Talabgor va mas&apos;ul shaxs:
                  </p>
                  <div className={`mt-1.5 p-3.5 rounded-2xl border flex items-center gap-3 ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <User className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm font-bold">{viewModalData.applicant}</span>
                  </div>
                </div>

                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Asoslash (Sabab va izoh):
                  </p>
                  <div className={`mt-1.5 p-4 rounded-2xl border text-sm leading-relaxed font-medium ${isDark ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                    {viewModalData.reason}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              {viewModalData.status === "Kutilmoqda" && (
                <>
                  <button
                    onClick={() => handleOpenReject(viewModalData)}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-all"
                  >
                    Rad etish
                  </button>
                  <button
                    onClick={() => handleApprove(viewModalData.id)}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    Tasdiqlash (Qabul qilish)
                  </button>
                </>
              )}
              <button
                onClick={() => setViewModalData(null)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${
                  isDark ? "border-slate-700 bg-slate-700/50 hover:bg-slate-700" : "border-slate-200 bg-slate-100 hover:bg-slate-200"
                }`}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW REQUISITION MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-2xl rounded-3xl p-6 md:p-8 border shadow-2xl overflow-hidden ${
            isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Yangi talabnoma yuborish</h3>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Kafedra bo&apos;yicha qo&apos;shimcha yuklama soatlari talabi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="py-6 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Fakultet
                  </label>
                  <select
                    value={newReq.faculty}
                    onChange={(e) => setNewReq({ ...newReq, faculty: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium outline-none transition-all ${
                      isDark ? "bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                    }`}
                  >
                    <option value="Filologiya fakulteti">Filologiya fakulteti</option>
                    <option value="Pedagogika fakulteti">Pedagogika fakulteti</option>
                    <option value="Aniq va tabiiy fanlar fakulteti">Aniq va tabiiy fanlar fakulteti</option>
                    <option value="Ijtimoiy va amaliy fanlar fakulteti">Ijtimoiy va amaliy fanlar fakulteti</option>
                    <option value="Boshlang'ich ta'lim fakulteti">Boshlang&apos;ich ta&apos;lim fakulteti</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Kafedra
                  </label>
                  <input
                    type="text"
                    required
                    value={newReq.department}
                    onChange={(e) => setNewReq({ ...newReq, department: e.target.value })}
                    placeholder="Masalan: Rus tili va adabiyoti kafedrasi"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium outline-none transition-all ${
                      isDark ? "bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Fan nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReq.subject}
                    onChange={(e) => setNewReq({ ...newReq, subject: e.target.value })}
                    placeholder="Masalan: Rus tili grammatikasi"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium outline-none transition-all ${
                      isDark ? "bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Semestr
                  </label>
                  <select
                    value={newReq.semester}
                    onChange={(e) => setNewReq({ ...newReq, semester: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium outline-none transition-all ${
                      isDark ? "bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                    }`}
                  >
                    <option value="Kuzki semestr">Kuzki semestr</option>
                    <option value="Bahorki semestr">Bahorki semestr</option>
                  </select>
                </div>
              </div>

              {/* Hours inputs */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                  Talab etilayotgan soatlar taqsimoti (soat hisobida)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className={`block text-[11px] font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Ma&apos;ruza</label>
                    <input
                      type="number"
                      min="0"
                      value={newReq.lecture}
                      onChange={(e) => setNewReq({ ...newReq, lecture: e.target.value })}
                      placeholder="0"
                      className={`w-full px-3 py-2 rounded-xl text-sm font-bold border text-center outline-none ${
                        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Amaliyot</label>
                    <input
                      type="number"
                      min="0"
                      value={newReq.practice}
                      onChange={(e) => setNewReq({ ...newReq, practice: e.target.value })}
                      placeholder="0"
                      className={`w-full px-3 py-2 rounded-xl text-sm font-bold border text-center outline-none ${
                        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Laboratoriya</label>
                    <input
                      type="number"
                      min="0"
                      value={newReq.lab}
                      onChange={(e) => setNewReq({ ...newReq, lab: e.target.value })}
                      placeholder="0"
                      className={`w-full px-3 py-2 rounded-xl text-sm font-bold border text-center outline-none ${
                        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Seminar</label>
                    <input
                      type="number"
                      min="0"
                      value={newReq.seminar}
                      onChange={(e) => setNewReq({ ...newReq, seminar: e.target.value })}
                      placeholder="0"
                      className={`w-full px-3 py-2 rounded-xl text-sm font-bold border text-center outline-none ${
                        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Talabgor (Mas&apos;ul shaxs) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReq.applicant}
                    onChange={(e) => setNewReq({ ...newReq, applicant: e.target.value })}
                    placeholder="Masalan: Karimova Z.A. (Kafedra mudiri)"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium outline-none transition-all ${
                      isDark ? "bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>

              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Asos (Talabnoma sababi va izoh) *
                </label>
                <textarea
                  required
                  rows="3"
                  value={newReq.reason}
                  onChange={(e) => setNewReq({ ...newReq, reason: e.target.value })}
                  placeholder="Masalan: Yangi qabul qilingan guruhlar soni ortganligi hamda o'qituvchi yetishmovchiligi sababli..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-medium outline-none transition-all resize-none ${
                    isDark ? "bg-slate-900/80 border-slate-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                  }`}
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${
                    isDark ? "border-slate-700 bg-slate-700/50 hover:bg-slate-700" : "border-slate-200 bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                >
                  Yuborish va saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-md rounded-3xl p-6 border shadow-2xl overflow-hidden ${
            isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">Talabnomani rad etish</h3>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  ID: {rejectModalData.id}
                </p>
              </div>
            </div>

            <div className="py-5 space-y-3">
              <p className="text-sm font-semibold">
                Ushbu talabnomani rad etish yoki qaytarish sababini ko&apos;rsating:
              </p>
              <textarea
                rows="3"
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Masalan: Soatlar kafedra ichki yuklamasi hisobidan qoplangani sababli..."
                className={`w-full p-3 rounded-xl text-sm border font-medium outline-none resize-none ${
                  isDark ? "bg-slate-900 border-slate-700 text-white focus:border-rose-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-600"
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setRejectModalData(null)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-colors ${
                  isDark ? "border-slate-700 bg-slate-700/50 hover:bg-slate-700" : "border-slate-200 bg-slate-100 hover:bg-slate-200"
                }`}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25 transition-all"
              >
                Rad etishni tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
