import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronDown,
  ClipboardCheck,
  Eye,
  FileText,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Pencil,
  Plus,
  Search,
  SquarePen,
  Trash2,
  User,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"
import logoImg from "../assets/logo.jpg"

const TEAL = "#14b8a6"
const TEAL_BG = "bg-teal-500"
const NAV = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  {
    id: "fakultetlar",
    label: "Fakultetlar",
    Icon: Landmark,
    iconStroke: 1.25,
    inactiveClassLight: "text-slate-700",
  },
  { id: "kafedralar", label: "Kafedralar", Icon: GraduationCap },
  { id: "lavozim", label: "Lavozim", Icon: FileText },
  { id: "foydalanuvchilar", label: "Foydalanuvchilar", Icon: User },
  { id: "oqituvchilar", label: "O'qituvchilar", Icon: Users },
  { id: "mezonlar", label: "Mezonlar", Icon: ClipboardCheck },
]

const STATS = {
  fakultetlar: 5,
  kafedralar: 15,
  foydalanuvchilar: 302,
}

const RATING_SLICES = [
  { stars: 5, pct: 98, color: "#14b8a6" },
  { stars: 4, pct: 1.5, color: "#22c55e" },
  { stars: 3, pct: 0.3, color: "#eab308" },
  { stars: 2, pct: 0.1, color: "#f97316" },
  { stars: 1, pct: 0.1, color: "#ef4444" },
]

const CATEGORY_BARS = [
  { label: "Umumiy", value: 5 },
  { label: "Kasbiy kompetensiya", value: 5 },
  { label: "Pedagogik mahorat", value: 5 },
  { label: "Tadqiqot faoliyati", value: 5 },
  { label: "Ijodkorlik", value: 5 },
]

const MAVJUD_FAKULTETLAR = [
  { id: "f-1", nameUz: "Filologiya Fakulteti", nameRu: "Факультет филологии" },
  { id: "f-2", nameUz: "Pedagogika Fakulteti", nameRu: "Факультет Педагогики" },
  { id: "f-3", nameUz: "Aniq va tabiiy fanlar Fakulteti", nameRu: "Факультет точных и естественных наук" },
  { id: "f-4", nameUz: "Ijtimoiy va amaliy fanlar Fakulteti", nameRu: "Факультет социальных и прикладных наук" },
  { id: "f-5", nameUz: "Boshlang'ich ta'lim Fakulteti", nameRu: "Факультет начального образования" },
]

const KAFEDRALAR_ROYXATI = [
  {
    id: "k-1",
    nameUz: "Rus tili va adabiyoti kafedrasi",
    nameRu: "Кафедра русского языка и литературы",
    fakultet: "Filologiya Fakulteti",
  },
  {
    id: "k-2",
    nameUz: "O'zbek tili va adabiyoti kafedrasi",
    nameRu: "Кафедра узбекского языка и литературы",
    fakultet: "Filologiya Fakulteti",
  },
  {
    id: "k-3",
    nameUz: "Xorijiy tillar va tilshunoslik kafedrasi",
    nameRu: "Кафедра иностранных языков и лингвистики",
    fakultet: "Filologiya Fakulteti",
  },
  {
    id: "k-4",
    nameUz: "Pedagogika nazariyasi va tarix kafedrasi",
    nameRu: "Кафедра теории и истории педагогики",
    fakultet: "Pedagogika Fakulteti",
  },
  {
    id: "k-5",
    nameUz: "Psixologiya kafedrasi",
    nameRu: "Кафедра психологии",
    fakultet: "Pedagogika Fakulteti",
  },
  {
    id: "k-6",
    nameUz: "Maxsus pedagogika va inklyuziv ta'lim kafedrasi",
    nameRu: "Кафедра специальной педагогики и инклюзивного образования",
    fakultet: "Pedagogika Fakulteti",
  },
  {
    id: "k-7",
    nameUz: "Matematika va informatika o'qitish metodikasi kafedrasi",
    nameRu: "Кафедра методики преподавания математики и информатики",
    fakultet: "Aniq va tabiiy fanlar Fakulteti",
  },
  {
    id: "k-8",
    nameUz: "Fizika va astronomiya kafedrasi",
    nameRu: "Кафедра физики и астрономии",
    fakultet: "Aniq va tabiiy fanlar Fakulteti",
  },
  {
    id: "k-9",
    nameUz: "Kimyo va biologiya kafedrasi",
    nameRu: "Кафедра химии и биологии",
    fakultet: "Aniq va tabiiy fanlar Fakulteti",
  },
  {
    id: "k-10",
    nameUz: "Tarix va ijtimoiy fanlar kafedrasi",
    nameRu: "Кафедра истории и общественных наук",
    fakultet: "Ijtimoiy va amaliy fanlar Fakulteti",
  },
  {
    id: "k-11",
    nameUz: "Geografiya va ekologiya ta'limi kafedrasi",
    nameRu: "Кафедра географического и экологического образования",
    fakultet: "Ijtimoiy va amaliy fanlar Fakulteti",
  },
  {
    id: "k-12",
    nameUz: "Jismoniy tarbiya va sport kafedrasi",
    nameRu: "Кафедра физического воспитания и спорта",
    fakultet: "Ijtimoiy va amaliy fanlar Fakulteti",
  },
  {
    id: "k-13",
    nameUz: "Boshlang'ich ta'lim metodikasi kafedrasi",
    nameRu: "Кафедра методики начального образования",
    fakultet: "Boshlang'ich ta'lim Fakulteti",
  },
  {
    id: "k-14",
    nameUz: "Maktabgacha ta'lim kafedrasi",
    nameRu: "Кафедра дошкольного образования",
    fakultet: "Boshlang'ich ta'lim Fakulteti",
  },
  {
    id: "k-15",
    nameUz: "Bolalar rivojlanishi va ergonomika kafedrasi",
    nameRu: "Кафедра развития детей и эргономики",
    fakultet: "Boshlang'ich ta'lim Fakulteti",
  },
]

function pieGradient(slices) {
  let acc = 0
  const parts = slices.map((s) => {
    const start = acc
    acc += s.pct
    return `${s.color} ${start}% ${acc}%`
  })
  return `conic-gradient(${parts.join(", ")})`
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : true
  )
  const [activeNav, setActiveNav] = useState("dashboard")
  const [dark, setDark] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = () => {
      if (mq.matches) setSidebarOpen(true)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (!profileOpen) return
    const onDown = (e) => {
      if (e.key === "Escape") setProfileOpen(false)
    }
    const onClick = (e) => {
      const root = profileRef.current
      if (!root) return
      if (root.contains(e.target)) return
      setProfileOpen(false)
    }
    window.addEventListener("keydown", onDown)
    window.addEventListener("mousedown", onClick)
    return () => {
      window.removeEventListener("keydown", onDown)
      window.removeEventListener("mousedown", onClick)
    }
  }, [profileOpen])

  const pieStyle = useMemo(() => ({ background: pieGradient(RATING_SLICES) }), [])

  const mainTitle =
    activeNav === "dashboard"
      ? "Admin Dashboard"
      : NAV.find((n) => n.id === activeNav)?.label ?? "Admin"

  return (
    <div
      className={`flex min-h-screen font-sans ${dark ? "bg-slate-900 text-slate-100" : "bg-slate-100 text-slate-800"}`}
    >
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r shadow-sm transition-transform duration-200 md:relative md:translate-x-0 ${
          dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className={`border-b px-5 py-6 ${dark ? "border-slate-700" : "border-slate-100"}`}>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="" className="h-10 w-10 rounded-full border object-cover" />
            <div>
              <p className="text-lg font-bold leading-tight">UrSPI Admin</p>
              <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = activeNav === item.id
            const NavItemIcon = item.Icon
            const stroke = item.iconStroke ?? 1.5
            const inactiveLight = item.inactiveClassLight ?? "text-slate-600"
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? `font-medium ${TEAL_BG} text-white shadow-md shadow-teal-900/20`
                    : `font-medium ${dark ? "text-slate-300 hover:bg-slate-700/80" : `${inactiveLight} hover:bg-slate-50`}`
                }`}
              >
                <NavItemIcon
                  className={`h-5 w-5 shrink-0 ${active ? "" : "opacity-95"}`}
                  strokeWidth={stroke}
                  aria-hidden
                />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className={`p-4 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
          <Link to="/" className={`font-medium hover:underline ${dark ? "text-teal-400" : "text-teal-600"}`}>
            Platformaga qaytish
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Menyuni yopish"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col md:min-h-0">
        <header
          className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 shadow-sm ${
            dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`rounded-lg p-2 md:hidden ${dark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Menyu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            </button>
            <h1 className="text-lg font-semibold">{mainTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className={`rounded-lg p-2 ${dark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
              aria-label="Tungi rejim"
            >
              <Moon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </button>
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors ${
                  dark ? "hover:bg-slate-700/80" : "hover:bg-slate-100"
                }`}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  AD
                </span>
                <div className="hidden text-sm sm:block">
                  <p className="font-medium leading-none">admin</p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 opacity-50 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                  aria-hidden
                />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className={`absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-2xl border shadow-lg ${
                    dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false)
                      window.location.assign("/")
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                      dark ? "hover:bg-slate-700/70" : "hover:bg-slate-50"
                    } text-red-600`}
                  >
                    <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto w-full max-w-6xl">
            {activeNav === "dashboard" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <article
                    className={`rounded-xl border p-5 shadow-sm ${dark ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"}`}
                  >
                    <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Fakultetlar</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{STATS.fakultetlar}</p>
                  </article>
                  <article
                    className={`rounded-xl border p-5 shadow-sm ${dark ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"}`}
                  >
                    <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Kafedralar</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-600">{STATS.kafedralar}</p>
                  </article>
                  <article
                    className={`rounded-xl border p-5 shadow-sm ${dark ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"}`}
                  >
                    <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Foydalanuvchilar</p>
                    <p className="mt-2 text-3xl font-bold text-violet-600">{STATS.foydalanuvchilar}</p>
                  </article>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <article
                    className={`rounded-xl border p-5 shadow-sm ${dark ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"}`}
                  >
                    <h2 className="text-lg font-semibold">Reytinglar taqsimoti</h2>
                    <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                      <div
                        className="relative h-48 w-48 shrink-0 rounded-full shadow-inner ring-4 ring-white/10"
                        style={pieStyle}
                      />
                      <div className="w-full max-w-xs space-y-2">
                        {RATING_SLICES.map((s) => (
                          <div key={s.stars} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} />
                              {s.stars} yulduz
                            </span>
                            <span className="font-semibold">{s.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>

                  <article
                    className={`rounded-xl border p-5 shadow-sm ${dark ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"}`}
                  >
                    <h2 className="text-lg font-semibold">Kategoriyalar bo&apos;yicha o&apos;rtacha reytinglar</h2>
                    <div className="mt-4 flex justify-between gap-1 border-b pb-1 text-[10px] font-medium text-slate-400">
                      {[0, 1, 2, 3, 4, 5].map((t) => (
                        <span key={t} className="w-0 flex-1 text-center">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex h-52 items-end justify-between gap-2 border-l border-slate-200 pl-2 pt-2 dark:border-slate-600">
                      {CATEGORY_BARS.map((c) => (
                        <div key={c.label} className="flex min-w-0 flex-1 flex-col items-center justify-end">
                          <div
                            className="w-full max-w-10 rounded-t-md"
                            style={{
                              height: `${Math.max(8, (c.value / 5) * 168)}px`,
                              backgroundColor: TEAL,
                            }}
                            title={`${c.label}: ${c.value}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between gap-1 px-0">
                      {CATEGORY_BARS.map((c) => (
                        <p
                          key={c.label}
                          className="min-w-0 flex-1 -rotate-[35deg] text-center text-[9px] leading-tight text-slate-600 sm:text-[10px] dark:text-slate-400"
                        >
                          {c.label}
                        </p>
                      ))}
                    </div>
                  </article>
                </div>
              </div>
            )}

            {activeNav === "fakultetlar" && <FakultetlarPanel dark={dark} />}
            {activeNav === "kafedralar" && <KafedralarPanel dark={dark} />}
            {activeNav === "lavozim" && <Placeholder dark={dark} title="Lavozim" />}
            {activeNav === "foydalanuvchilar" && <Placeholder dark={dark} title="Foydalanuvchilar" />}
            {activeNav === "oqituvchilar" && <Placeholder dark={dark} title="O'qituvchilar" />}
            {activeNav === "mezonlar" && <Placeholder dark={dark} title="Mezonlar" />}
          </div>
        </main>
      </div>
    </div>
  )
}

function KafedralarPanel({ dark }) {
  const [searchDraft, setSearchDraft] = useState("")
  const [searchApplied, setSearchApplied] = useState("")

  const filtered = useMemo(() => {
    const q = searchApplied.trim().toLowerCase()
    if (!q) return KAFEDRALAR_ROYXATI
    return KAFEDRALAR_ROYXATI.filter(
      (row) =>
        row.nameUz.toLowerCase().includes(q) ||
        row.fakultet.toLowerCase().includes(q)
    )
  }, [searchApplied])

  const cardBase = dark
    ? "border-slate-600 bg-slate-800"
    : "border-slate-200 bg-white shadow-sm"
  const subtitle = dark ? "text-slate-400" : "text-slate-500"
  const title = dark ? "text-slate-100" : "text-slate-900"
  const meta = dark ? "text-slate-500" : "text-slate-400"
  const inputWrap = dark
    ? "border-slate-600 bg-slate-800/80 text-slate-100 placeholder:text-slate-500"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"

  return (
    <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} p-5 sm:p-6`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`text-xl font-bold tracking-tight ${title}`}>Kafedralar Ro&apos;yxati</h2>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 ${TEAL_BG}`}
          >
            <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
            Qo'shish
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="relative min-w-0 flex-1">
            <Search
              className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-slate-500" : "text-slate-400"}`}
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchApplied(searchDraft)
              }}
              placeholder="Kafedra qidirish..."
              className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${inputWrap}`}
            />
          </div>
          <button
            type="button"
            onClick={() => setSearchApplied(searchDraft)}
            className={`inline-flex shrink-0 items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors sm:min-w-[7.5rem] ${
              dark
                ? "border-blue-500/90 text-blue-400 hover:bg-slate-700/80"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            Qidirish
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {filtered.map((row) => (
            <li
              key={row.id}
              className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-4 sm:px-5 ${cardBase}`}
            >
              <div className="min-w-0 flex-1">
                <p className={`font-bold leading-snug ${title}`}>{row.nameUz}</p>
                <p className={`mt-1.5 text-xs ${meta}`}>Fakultet: {row.fakultet}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dark
                      ? "border-blue-500/80 text-blue-400 hover:bg-slate-700/80"
                      : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Eye className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  Ko'rish
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dark
                      ? "border-emerald-500/80 text-emerald-400 hover:bg-slate-700/80"
                      : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <Pencil className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  Tahrirlash
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dark
                      ? "border-red-500/80 text-red-400 hover:bg-slate-700/80"
                      : "border-red-600 text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Trash2 className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  O'chirish
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className={`text-center text-sm ${subtitle}`}>Qidiruv bo&apos;yicha natija topilmadi.</p>
        )}
      </div>
    </div>
  )
}

function FakultetlarPanel({ dark }) {
  const cardBase = dark
    ? "border-slate-600 bg-slate-800"
    : "border-slate-200 bg-white shadow-sm"
  const title = dark ? "text-slate-100" : "text-slate-900"

  return (
    <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} p-5 sm:p-6`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`text-xl font-bold tracking-tight ${title}`}>Mavjud Fakultetlar</h2>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 ${TEAL_BG}`}
          >
            <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
            Qo'shish
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {MAVJUD_FAKULTETLAR.map((fac) => (
            <li
              key={fac.id}
              className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-4 sm:px-5 ${cardBase}`}
            >
              <div className="min-w-0 flex-1">
                <p className={`font-bold leading-snug ${title}`}>{fac.nameUz}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dark
                      ? "border-blue-500/80 text-blue-400 hover:bg-slate-700/80"
                      : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Eye className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  Ko'rish
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dark
                      ? "border-emerald-500/80 text-emerald-400 hover:bg-slate-700/80"
                      : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <SquarePen className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  Tahrirlash
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dark
                      ? "border-red-500/80 text-red-400 hover:bg-slate-700/80"
                      : "border-red-600 text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Trash2 className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  O'chirish
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Placeholder({ dark, title }) {
  return (
    <div
      className={`rounded-xl border p-8 text-center ${dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
    >
      <p className={`text-lg font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>{title}</p>
      <p className={`mt-2 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
        Bu bo&apos;lim tez orada to&apos;ldiriladi.
      </p>
    </div>
  )
}
