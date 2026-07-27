import React, { useState } from "react"
import { 
  Users, 
  CalendarDays, 
  Building2, 
  GraduationCap, 
  UserCog, 
  ShieldCheck, 
  History, 
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Search,
  Key,
  Shield,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Settings,
  Sliders,
  Check,
  X,
  ExternalLink,
  Wifi
} from "lucide-react"
import Faculties from "./Faculties"
import Departments from "./Departments"
import UsersComponent from "./Users"
import Teachers from "./Teachers"

const ALL_PERMISSIONS = [
  "faculty_view", "faculty_create", "faculty_edit", "faculty_delete",
  "department_view", "department_create", "department_edit", "department_delete",
  "position_view", "position_create", "position_edit", "position_delete",
  "user_view", "user_create", "user_edit", "user_delete",
  "teacher_view", "teacher_create", "teacher_edit", "teacher_delete",
  "criteria_view", "criteria_create", "criteria_edit", "criteria_delete"
]

export default function Sozlamalar({ isDark }) {
  const [activeMenu, setActiveMenu] = useState("foydalanuvchilar")
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3000)
  }

  const menuItems = [
    { id: "foydalanuvchilar", label: "Foydalanuvchilar", icon: Users },
    { id: "oquv_yili", label: "O'quv yili", icon: CalendarDays },
    { id: "fakultetlar", label: "Fakultetlar", icon: Building2 },
    { id: "kafedralar", label: "Kafedralar", icon: GraduationCap },
    { id: "oqituvchilar", label: "O'qituvchilar", icon: UserCog },
    { id: "rollar", label: "Rollar", icon: ShieldCheck },
    { id: "audit_log", label: "Audit log", icon: History },
    { id: "hemis", label: "HEMIS", icon: Database },
  ]

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md ${
            toast.type === "success" 
              ? isDark ? "bg-emerald-900/90 border-emerald-700 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/10"
              : isDark ? "bg-blue-900/90 border-blue-700 text-blue-200" : "bg-blue-50 border-blue-200 text-blue-800 shadow-blue-500/10"
          }`}>
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className={`p-6 rounded-3xl border shadow-sm flex items-center justify-between ${
          isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl ${isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
              <Settings className="w-8 h-8 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Tizim sozlamalari va ma&apos;lumotnomalar</h1>
              <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Foydalanuvchilar, o&apos;quv yillari, rollar hamda HEMIS integratsiyasi sozlamalarini boshqarish paneli
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isDark ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
              ● Tizim barqaror ishlamoqda
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Menu */}
        <div className="md:col-span-3 sticky top-24">
          <div className={`p-3 rounded-3xl border shadow-sm space-y-1.5 ${
            isDark ? "bg-slate-800/90 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <p className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-400"}`}>
              SOZLAMALAR BO&apos;LIMI
            </p>
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id
              const IconComp = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? isDark
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 translate-x-1"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm translate-x-1"
                      : isDark
                      ? "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <IconComp className={`w-5 h-5 shrink-0 ${isActive ? (isDark ? "text-white" : "text-indigo-700") : (isDark ? "text-slate-400" : "text-slate-500")}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className={`w-2 h-2 rounded-full ${isDark ? "bg-white" : "bg-indigo-600"}`} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9">
          <div className={`min-h-[600px] rounded-3xl border shadow-sm overflow-hidden transition-colors ${
            isDark ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
          }`}>
            {activeMenu === "foydalanuvchilar" && (
              <div className="p-4 md:p-6">
                <UsersComponent dark={isDark} permissions={ALL_PERMISSIONS} isAdmin={true} />
              </div>
            )}

            {activeMenu === "oquv_yili" && (
              <OquvYiliSection isDark={isDark} showToast={showToast} />
            )}

            {activeMenu === "fakultetlar" && (
              <div className="p-4 md:p-6">
                <Faculties dark={isDark} permissions={ALL_PERMISSIONS} isAdmin={true} />
              </div>
            )}

            {activeMenu === "kafedralar" && (
              <div className="p-4 md:p-6">
                <Departments dark={isDark} permissions={ALL_PERMISSIONS} isAdmin={true} />
              </div>
            )}

            {activeMenu === "oqituvchilar" && (
              <div className="p-4 md:p-6">
                <Teachers dark={isDark} permissions={ALL_PERMISSIONS} isAdmin={true} />
              </div>
            )}

            {activeMenu === "rollar" && (
              <RollarSection isDark={isDark} showToast={showToast} />
            )}

            {activeMenu === "audit_log" && (
              <AuditLogSection isDark={isDark} />
            )}

            {activeMenu === "hemis" && (
              <HemisSection isDark={isDark} showToast={showToast} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 1. O'quv yili (Academic Year) Component */
/* -------------------------------------------------------------------------- */
function OquvYiliSection({ isDark, showToast }) {
  const [years, setYears] = useState([
    { id: 1, name: "2025-2026 o'quv yili", semester: "Kuzki semestr (1-semestr)", start: "2025-09-02", end: "2026-01-25", status: "Faol", weeks: 18 },
    { id: 2, name: "2025-2026 o'quv yili", semester: "Bahorki semestr (2-semestr)", start: "2026-02-05", end: "2026-06-25", status: "Kutilmoqda", weeks: 18 },
    { id: 3, name: "2024-2025 o'quv yili", semester: "Bahorki semestr (2-semestr)", start: "2025-02-05", end: "2025-06-25", status: "Yakunlangan", weeks: 18 },
    { id: 4, name: "2024-2025 o'quv yili", semester: "Kuzki semestr (1-semestr)", start: "2024-09-02", end: "2025-01-25", status: "Yakunlangan", weeks: 18 },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newYearName, setNewYearName] = useState("2026-2027 o'quv yili")
  const [newSemester, setNewSemester] = useState("Kuzki semestr (1-semestr)")
  const [newStart, setNewStart] = useState("2026-09-02")
  const [newEnd, setNewEnd] = useState("2027-01-25")
  const [newWeeks, setNewWeeks] = useState(18)
  const [newStatus, setNewStatus] = useState("Kutilmoqda")

  const activateYear = (id) => {
    setYears(prev => prev.map(y => ({
      ...y,
      status: y.id === id ? "Faol" : y.status === "Faol" ? "Yakunlangan" : y.status
    })))
    showToast("Joriy faol o'quv semestri o'zgartirildi!", "success")
  }

  const handleAddYear = (e) => {
    e.preventDefault()
    if (!newYearName.trim()) return

    const newObj = {
      id: Date.now(),
      name: newYearName.trim(),
      semester: newSemester,
      start: newStart,
      end: newEnd,
      status: newStatus,
      weeks: Number(newWeeks) || 18,
    }

    if (newStatus === "Faol") {
      setYears(prev => [
        newObj,
        ...prev.map(y => ({
          ...y,
          status: y.status === "Faol" ? "Yakunlangan" : y.status
        }))
      ])
      showToast("Yangi o'quv semestri qo'shildi va faol qilindi!", "success")
    } else {
      setYears(prev => [newObj, ...prev])
      showToast("Yangi o'quv semestri muvaffaqiyatli qo'shildi!", "success")
    }

    setIsAddModalOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-indigo-500" />
            <span>O&apos;quv yili va Semestrlar boshqaruvi</span>
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Tizimda yuklamalar hisoblash uchun asosiy faol semestrni belgilash
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Yangi semestr qo&apos;shish</span>
        </button>
      </div>

      <div className="grid gap-4">
        {years.map((y) => {
          const isFaol = y.status === "Faol"
          return (
            <div
              key={y.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isFaol
                  ? isDark ? "bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-950/50" : "bg-indigo-50/80 border-indigo-300 shadow-md shadow-indigo-100"
                  : isDark ? "bg-slate-900/60 border-slate-700 hover:border-slate-600" : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-base">{y.name}</span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                    isFaol 
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 animate-pulse" 
                      : y.status === "Kutilmoqda"
                      ? isDark ? "bg-amber-500/20 text-amber-300" : "bg-amber-100 text-amber-800"
                      : isDark ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-600"
                  }`}>
                    {y.status}
                  </span>
                </div>
                <p className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {y.semester} ({y.weeks} hafta)
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Boshlanish: <span className="font-medium">{y.start}</span> • Tugash: <span className="font-medium">{y.end}</span>
                </p>
              </div>

              <div>
                {!isFaol ? (
                  <button
                    onClick={() => activateYear(y.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      isDark ? "border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200" : "border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    Faol semestr qilish
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Joriy faol semestr
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Yangi Semestr Qo'shish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
            isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Yangi semestr qo&apos;shish</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Tizimga yangi o&apos;quv yili va semestr parametrlarini kiritish
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className={`p-2 rounded-xl border transition-colors ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-black"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddYear} className="space-y-4">
              {/* O'quv yili */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  O&apos;quv yili nomi
                </label>
                <input
                  type="text"
                  required
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  placeholder="masalan: 2026-2027 o'quv yili"
                  className={`w-full rounded-xl border p-3.5 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                    isDark ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-300 text-black placeholder-slate-400 shadow-2xs"
                  }`}
                />
              </div>

              {/* Semestr turi */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Semestr turi
                </label>
                <select
                  value={newSemester}
                  onChange={(e) => setNewSemester(e.target.value)}
                  className={`w-full rounded-xl border p-3.5 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                    isDark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-300 text-black shadow-2xs"
                  }`}
                >
                  <option value="Kuzki semestr (1-semestr)">Kuzki semestr (1-semestr)</option>
                  <option value="Bahorki semestr (2-semestr)">Bahorki semestr (2-semestr)</option>
                  <option value="Yozgi semestr (3-semestr)">Yozgi semestr (3-semestr)</option>
                </select>
              </div>

              {/* Sanalar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Boshlanish sanasi
                  </label>
                  <input
                    type="date"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className={`w-full rounded-xl border p-3.5 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                      isDark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-300 text-black shadow-2xs"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Tugash sanasi
                  </label>
                  <input
                    type="date"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className={`w-full rounded-xl border p-3.5 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                      isDark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-300 text-black shadow-2xs"
                    }`}
                  />
                </div>
              </div>

              {/* Hafta va Holat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Haftalar soni
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    required
                    value={newWeeks}
                    onChange={(e) => setNewWeeks(Number(e.target.value))}
                    className={`w-full rounded-xl border p-3.5 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                      isDark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-300 text-black shadow-2xs"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Dastlabki holati
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className={`w-full rounded-xl border p-3.5 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                      isDark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-300 text-black shadow-2xs"
                    }`}
                  >
                    <option value="Kutilmoqda">Kutilmoqda (Kelgusi semestr)</option>
                    <option value="Faol">Faol (Joriy faol semestr)</option>
                    <option value="Yakunlangan">Yakunlangan (Arxiv)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-colors ${
                    isDark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Semestrni qo&apos;shish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 2. Rollar (Roles & Permissions) Component */
/* -------------------------------------------------------------------------- */
function RollarSection({ isDark, showToast }) {
  const [roles, setRoles] = useState([
    { id: 1, name: "Admin (Tizim administratori)", usersCount: 3, badge: "Barcha huquqlar", color: "from-rose-500 to-red-600", perms: ["Tizim sozlamalari", "Foydalanuvchilar boshqaruvi", "Yuklamalarni tasdiqlash", "HEMIS integratsiyasi", "Fakultet va Kafedralarni ko'rish", "O'qituvchilarni tahrirlash"] },
    { id: 2, name: "Dekan (Fakultet rahbari)", usersCount: 5, badge: "Fakultet doirasi", color: "from-indigo-500 to-blue-600", perms: ["Fakultet kafedralarini ko'rish", "Talabnomalarni tasdiqlash", "Semestr hisobotlari", "Dars yuklamalarini monitoring qilish"] },
    { id: 3, name: "Kafedra mudiri", usersCount: 15, badge: "Kafedra doirasi", color: "from-emerald-500 to-teal-600", perms: ["Dars yuklamasini taqsimlash", "O'qituvchilarni biriktirish", "Talabnoma yuborish", "O'qituvchilarni ko'rish"] },
    { id: 4, name: "O'quv uslubiy boshqarma", usersCount: 4, badge: "Uslubiy nazorat", color: "from-amber-500 to-orange-600", perms: ["Kafedra yuklamalarini tekshirish", "O'quv reja va syllabus nazorati", "Stavka normativini monitoring qilish"] },
    { id: 5, name: "O'quv ishlari bo'yicha prorektor", usersCount: 1, badge: "Oliy boshqaruv", color: "from-purple-500 to-indigo-600", perms: ["Barcha yuklamalarni nazorat qilish", "Taqsimotlarni yakuniy tasdiqlash", "Universitet hisobotlari va tahlili", "O'qituvchilarni ko'rish"] },
  ])
  const [editingRole, setEditingRole] = useState(null)
  const [tempPerms, setTempPerms] = useState([])

  const PERMISSION_GROUPS = [
    {
      groupName: "Tizim va Ma'muriyat",
      items: [
        { id: "Tizim sozlamalari", label: "Tizim sozlamalarini boshqarish", desc: "Sozlamalar paneli va konfiguratsiyani o'zgartirish" },
        { id: "Foydalanuvchilar boshqaruvi", label: "Foydalanuvchilar boshqaruvi", desc: "Foydalanuvchi qo'shish, tahrirlash va rollarini belgilash" },
        { id: "HEMIS integratsiyasi", label: "HEMIS integratsiyasi", desc: "HEMIS ma'lumotlarini sinxronizatsiya qilish va API sozlash" },
      ]
    },
    {
      groupName: "Yuklama va Taqsimotlar",
      items: [
        { id: "Yuklamalarni tasdiqlash", label: "Yuklamalarni tasdiqlash", desc: "Taqsimlangan dars yuklamalarini rasman tasdiqlash" },
        { id: "Dars yuklamasini taqsimlash", label: "Dars yuklamasini taqsimlash", desc: "Fanlar bo'yicha soatlarni o'qituvchilarga bo'lib berish" },
        { id: "O'qituvchilarni biriktirish", label: "O'qituvchilarni biriktirish", desc: "Guruhlar va fanlarga professor-o'qituvchilarni biriktirish" },
        { id: "Barcha yuklamalarni nazorat qilish", label: "Barcha yuklamalarni nazorat qilish", desc: "Universitet miqyosida barcha yuklamalar monitoringi" },
        { id: "Taqsimotlarni yakuniy tasdiqlash", label: "Taqsimotlarni yakuniy tasdiqlash", desc: "Oliy boshqaruv darajasida taqsimotlarni yakunlash" },
      ]
    },
    {
      groupName: "Monitoring va Nazorat",
      items: [
        { id: "Kafedra yuklamalarini tekshirish", label: "Kafedra yuklamalarini tekshirish", desc: "Kafedralarning taqsimot mezonlariga mosligini tekshirish" },
        { id: "O'quv reja va syllabus nazorati", label: "O'quv reja va syllabus nazorati", desc: "Syllabus yuklanishi va fan dasturlarini nazorat qilish" },
        { id: "Stavka normativini monitoring qilish", label: "Stavka normativini monitoring qilish", desc: "O'qituvchilar ish stavkasi (0.5, 1.0) meyorini kuzatish" },
        { id: "Dars yuklamalarini monitoring qilish", label: "Dars yuklamalarini monitoring qilish", desc: "Fakultet doirasida dars soatlari taqsimotini kuzatish" },
      ]
    },
    {
      groupName: "Obektlar va Hisobotlar",
      items: [
        { id: "Fakultet kafedralarini ko'rish", label: "Fakultet kafedralarini ko'rish", desc: "Fakultet tarkibidagi kafedralar ma'lumotlarini ko'rish" },
        { id: "Fakultet va Kafedralarni ko'rish", label: "Fakultet va Kafedralarni ko'rish", desc: "Barcha fakultet va kafedralar ro'yxatidan foydalanish" },
        { id: "O'qituvchilarni ko'rish", label: "O'qituvchilarni ko'rish", desc: "Professor-o'qituvchilar ro'yxati va yuklamasini ko'rish" },
        { id: "O'qituvchilarni tahrirlash", label: "O'qituvchilarni tahrirlash", desc: "O'qituvchilar ma'lumotlari, lavozimi va stavkasini tahrirlash" },
        { id: "Talabnoma yuborish", label: "Talabnoma yuborish", desc: "Qo'shimcha dars yoki shtat bo'yicha talabnoma yuborish" },
        { id: "Talabnomalarni tasdiqlash", label: "Talabnomalarni tasdiqlash", desc: "Yuborilgan talabnomalarni ko'rib chiqish va tasdiqlash" },
        { id: "Semestr hisobotlari", label: "Semestr hisobotlari", desc: "Fakultet va kafedralar bo'yicha semestr yakuniy hisobotlari" },
        { id: "Universitet hisobotlari va tahlili", label: "Universitet hisobotlari va tahlili", desc: "Umumiy universitet miqyosida tahliliy hisobotlar" },
      ]
    }
  ]

  const handleOpenEdit = (role) => {
    setEditingRole(role)
    setTempPerms([...role.perms])
  }

  const handleTogglePerm = (permId) => {
    setTempPerms((prev) => 
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    )
  }

  const handleSavePerms = () => {
    setRoles((prev) => 
      prev.map((r) => r.id === editingRole.id ? { ...r, perms: [...tempPerms] } : r)
    )
    showToast(`${editingRole.name} roli huquqlari saqlandi!`, "success")
    setEditingRole(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <span>Rollar va Huquqlar (Permissions)</span>
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Foydalanuvchi rollariga ruxsat etilgan funksiyalar va ruxsatnomalar darajasi
          </p>
        </div>
        <button
          onClick={() => showToast("Yangi rol qo'shish imkoniyati.", "info")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Yangi rol yaratish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <div key={r.id} className={`p-5 rounded-2xl border space-y-4 ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${r.color} flex items-center justify-center text-white shadow-md`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">{r.name}</h3>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {r.usersCount} ta foydalanuvchi
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isDark ? "bg-slate-800 text-indigo-400 border border-slate-700" : "bg-white text-indigo-700 border border-slate-200 shadow-2xs"}`}>
                {r.badge}
              </span>
            </div>

            <div className="space-y-1.5">
              <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Asosiy ruxsatlar:</p>
              <div className="flex flex-wrap gap-1.5">
                {r.perms.length > 0 ? r.perms.map((p, idx) => (
                  <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-medium ${isDark ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-white text-slate-700 border border-slate-200"}`}>
                    ✓ {p}
                  </span>
                )) : (
                  <span className={`text-xs italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>Huquqlar cheklangan (chegaralangan)</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex justify-end">
              <button
                type="button"
                onClick={() => handleOpenEdit(r)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Huquqlarni tahrirlash</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Huquqlarni Tahrirlash / Chegaralash Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`w-full max-w-3xl rounded-2xl border p-6 shadow-2xl max-h-[90vh] flex flex-col ${
            isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-black"
          }`}>
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${editingRole.color} flex items-center justify-center text-white shadow-md`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
                    <span>{editingRole.name}</span>
                  </h3>
                  <p className={`text-xs mt-0.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Ruxsat etilgan funksiyalar va huquqlarni toggle button orqali yoqish yoki chegaralash
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className={`p-2 rounded-xl border transition-colors ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-black"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 py-3 px-1 border-b border-slate-200 dark:border-slate-700/60 text-xs font-bold shrink-0">
              <span className={isDark ? "text-indigo-400" : "text-indigo-600"}>
                Tanlangan ruxsatlar: {tempPerms.length} ta
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTempPerms(PERMISSION_GROUPS.flatMap(g => g.items.map(i => i.id)))}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                >
                  Barchasini yoqish
                </button>
                <button
                  type="button"
                  onClick={() => setTempPerms([])}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                >
                  Barchasini chegaralash
                </button>
              </div>
            </div>

            {/* Modal Body: Groups with Toggle Switches */}
            <div className="py-4 space-y-6 overflow-y-auto pr-1 grow">
              {PERMISSION_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2.5">
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider px-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {group.groupName}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {group.items.map((item) => {
                      const isEnabled = tempPerms.includes(item.id)
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleTogglePerm(item.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isEnabled
                              ? isDark ? "bg-indigo-950/30 border-indigo-500/50 shadow-2xs" : "bg-indigo-50/70 border-indigo-200 shadow-2xs"
                              : isDark ? "bg-slate-900/40 border-slate-700/80 hover:bg-slate-800/40 opacity-75" : "bg-white border-slate-200/80 hover:bg-slate-50 opacity-75"
                          }`}
                        >
                          <div className="pr-3">
                            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>{item.label}</p>
                            <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.desc}</p>
                          </div>
                          
                          {/* Toggle Button / Switch */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePerm(item.id)
                            }}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isEnabled ? "bg-indigo-600" : isDark ? "bg-slate-700" : "bg-slate-300"
                            }`}
                          >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isEnabled ? "translate-x-5" : "translate-x-0"
                            }`} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-colors ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSavePerms}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Huquqlarni saqlash</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. Audit log Component */
/* -------------------------------------------------------------------------- */
function AuditLogSection({ isDark }) {
  const [search, setSearch] = useState("")
  const logs = [
    { id: 1, time: "2026-07-27 16:32:10", user: "Karimov A.A. (Admin)", action: "Talabnoma TL-2026-002 tasdiqlandi", ip: "192.168.1.45", status: "Muvaffaqiyatli" },
    { id: 2, time: "2026-07-27 15:45:22", user: "Saidova N.B. (Kafedra mudiri)", action: "Yangi talabnoma yuborildi (TL-2026-005)", ip: "192.168.1.102", status: "Muvaffaqiyatli" },
    { id: 3, time: "2026-07-27 14:20:05", user: "Karimov A.A. (Admin)", action: "O'qituvchilar yuklamasi CSV yuklanib olindi", ip: "192.168.1.45", status: "Muvaffaqiyatli" },
    { id: 4, time: "2026-07-27 11:10:50", user: "Toshmatov B.R. (Kafedra mudiri)", action: "Dars taqsimotida o'qituvchi almashtirildi", ip: "192.168.1.88", status: "Muvaffaqiyatli" },
    { id: 5, time: "2026-07-26 18:00:12", user: "System (Auto Sync)", action: "HEMIS bazasidan o'qituvchilar ma'lumoti yangilandi", ip: "127.0.0.1", status: "Muvaffaqiyatli" },
    { id: 6, time: "2026-07-26 09:15:30", user: "Rahimov D.Ch. (Kafedra mudiri)", action: "Tizimga kirishga urinish (Xato parol)", ip: "192.168.1.15", status: "Ogohlantirish" },
  ]

  const filtered = logs.filter(l => !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-500" />
            <span>Audit log (Tizim amallari tarixi)</span>
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Tizim foydalanuvchilarining barcha harakatlari va o&apos;zgarishlar qaydi
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Foydalanuvchi yoki amal..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border outline-none ${
              isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-xs font-extrabold uppercase tracking-wider border-b ${isDark ? "border-slate-700 text-slate-300 bg-slate-850" : "border-slate-300 text-black bg-slate-200/70"}`}>
              <th className="py-3 px-4">Vaqti</th>
              <th className="py-3 px-4">Foydalanuvchi</th>
              <th className="py-3 px-4">Bajarilgan amal</th>
              <th className="py-3 px-4">IP Manzil</th>
              <th className="py-3 px-4 text-right">Holati</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${isDark ? "divide-slate-700" : "divide-slate-200"}`}>
            {filtered.map((l) => (
              <tr key={l.id} className={`${isDark ? "hover:bg-slate-700/40" : "hover:bg-slate-100/70"}`}>
                <td className={`py-3.5 px-4 whitespace-nowrap text-xs font-mono font-bold ${isDark ? "text-white" : "text-black"}`}>
                  {l.time}
                </td>
                <td className={`py-3.5 px-4 font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                  {l.user}
                </td>
                <td className={`py-3.5 px-4 font-bold ${isDark ? "text-white" : "text-black"}`}>
                  {l.action}
                </td>
                <td className={`py-3.5 px-4 whitespace-nowrap text-xs font-mono font-bold ${isDark ? "text-white" : "text-black"}`}>
                  {l.ip}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                    l.status === "Muvaffaqiyatli"
                      ? isDark ? "bg-emerald-500/20 border-emerald-500/40 text-white" : "bg-emerald-200 border-emerald-400 text-black"
                      : isDark ? "bg-amber-500/20 border-amber-500/40 text-white" : "bg-amber-200 border-amber-400 text-black"
                  }`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 4. HEMIS Integration Component */
/* -------------------------------------------------------------------------- */
function HemisSection({ isDark, showToast }) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState("2026-07-26 18:00:12")
  const [tokenInput, setTokenInput] = useState("aKuD8934jkls2390IBL_")
  const [savedToken, setSavedToken] = useState("aKuD8934jkls2390IBL_")
  const [baseUrlInput, setBaseUrlInput] = useState("https://student.urspi.uz/rest")
  const [savedBaseUrl, setSavedBaseUrl] = useState("https://student.urspi.uz/rest")

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setLastSync(new Date().toISOString().replace("T", " ").slice(0, 19))
      showToast("HEMIS axborot tizimida ma'lumotlar muvaffaqiyatli yangilandi!", "success")
    }, 2000)
  }

  const handleSaveToken = () => {
    if (!tokenInput.trim() || !baseUrlInput.trim()) {
      showToast("Token va Base URL qiymatlarini kiritish majburiy!", "warning")
      return
    }
    setSavedToken(tokenInput.trim())
    setSavedBaseUrl(baseUrlInput.trim())
    showToast("HEMIS API tokeni va sozlamalar muvaffaqiyatli saqlandi!", "success")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2.5">
            <Database className="w-6 h-6 text-indigo-500" />
            <span>HEMIS Axborot Tizimi Integratsiyasi</span>
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            UrSPI HEMIS Oliy ta&apos;lim axborot tizimi bilan API orqali sinxronizatsiya
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
            isSyncing 
              ? "bg-slate-400 text-slate-200 cursor-not-allowed" 
              : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20 active:scale-95"
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "Sinxronizatsiya..." : "HEMIS bilan yangilash"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border space-y-2 ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>API Status</span>
            <Wifi className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">Ushbu tizim ulanmadi (Ulanish tayyor)</p>
          <p className="text-xs text-slate-500">Endpoint: {savedBaseUrl}/v1</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>So&apos;nggi yangilanish</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-extrabold font-mono">{lastSync}</p>
          <p className="text-xs text-slate-500">Avtomatik yangilanish: Har 24 soatda</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Sinxron obektlar</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-lg font-extrabold">O&apos;qituvchilar, Fanlar, Kafedralar</p>
          <p className="text-xs text-slate-500">Jami 320+ ta yozuv ulanishi</p>
        </div>
      </div>

      {/* HEMIS Token Card */}
      <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/80 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
        <h3 className={`text-lg font-bold mb-1.5 ${isDark ? "text-white" : "text-black"}`}>HEMIS token</h3>
        <p className={`text-xs sm:text-sm mb-5 leading-relaxed font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Admin panel tokeni lokal bazaga saqlanadi. Fakultetlar / Kafedralar sahifasidagi &ldquo;HEMIS dan yuklash&rdquo; shu token orqali /v1/data/department-list ga murojaat qiladi.
        </p>

        {/* Status Box */}
        <div className={`p-4 rounded-xl border mb-6 text-sm space-y-1.5 font-medium ${
          isDark ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300" : "bg-emerald-50/70 border-emerald-200/80 text-slate-800"
        }`}>
          <div>
            <span className="font-semibold">Holat: </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Saqlangan</span>
          </div>
          <div>
            <span className="font-semibold">Token: </span>
            <span className="font-mono">{savedToken ? (savedToken.length > 8 ? `${savedToken.slice(0, 4)}****${savedToken.slice(-4)}` : savedToken) : "---"}</span>
          </div>
          <div>
            <span className="font-semibold">Base URL: </span>
            <span className="font-mono">{savedBaseUrl || "---"}</span>
          </div>
        </div>

        {/* Access Token Input */}
        <div className="mb-5">
          <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Access token
          </label>
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Bearer token (faqat token qiymati)"
            rows={3}
            className={`w-full rounded-xl border p-3.5 text-sm outline-none font-mono transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
              isDark ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-300 text-black placeholder-slate-400 shadow-2xs"
            }`}
          />
        </div>

        {/* Base URL Input */}
        <div className="mb-6">
          <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Base URL
          </label>
          <input
            type="text"
            value={baseUrlInput}
            onChange={(e) => setBaseUrlInput(e.target.value)}
            className={`w-full rounded-xl border p-3.5 text-sm outline-none font-mono transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
              isDark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-300 text-black shadow-2xs"
            }`}
          />
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSaveToken}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
        >
          Tokenni saqlash
        </button>
      </div>

      <div className={`p-6 rounded-2xl border ${isDark ? "bg-indigo-950/20 border-indigo-500/30" : "bg-indigo-50/60 border-indigo-200"}`}>
        <h3 className="font-bold text-base text-indigo-600 dark:text-indigo-400 mb-2">Sinxronizatsiya parametrlari</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
            <span>O&apos;qituvchilar dars soatlarini avtomat olib kelish</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
            <span>Yangi qo&apos;shilgan guruhlar va talabalar sonini yangilash</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
            <span>Kafedralar va lavozimlar tuzilmasini moslashtirish</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
            <span>Syllabus va fanning mavzular rejasini yuklash</span>
          </label>
        </div>
      </div>
    </div>
  )
}
