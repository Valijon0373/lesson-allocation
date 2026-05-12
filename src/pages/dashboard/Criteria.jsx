import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleX,
  Eye,
  FileText,
  Filter,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { CATEGORY_MAX, CRITERIA, DEMO_CRITERIA_EVAL } from "../../data/criteria.js"

const CATEGORY_ORDER = Object.keys(CATEGORY_MAX)

const CATEGORY_UI_TITLE = {
  "OTM rivojiga hissa": "Institut rivojiga qo'shgan hissasi",
  "Shaxsiy fazilatlar": "Shaxsiy yutuqlar",
}

const PREVIEW_ROWS = 3
const TEAL_BG = "bg-teal-500"
const STORAGE_KEY = "admin_mezonlar_dashboard_v1"

/** @typedef {{ id: string, title: string, maxScore: number }} DashboardSection */
/** @typedef {{ id: string, sectionId: string, title: string, maxScore: number, requiredDocs: string[], collected: number, status: 'approved'|'pending' }} DashboardCriterion */

function categoryLabel(cat) {
  return CATEGORY_UI_TITLE[cat] ?? cat
}

function buildDefaultSnapshot() {
  /** @type {DashboardSection[]} */
  const sections = CATEGORY_ORDER.map((cat, idx) => ({
    id: `builtin-${idx}`,
    title: categoryLabel(cat),
    maxScore: CATEGORY_MAX[cat] ?? 0,
  }))
  /** @type {DashboardCriterion[]} */
  const criteria = CRITERIA.map((c) => {
    const idx = CATEGORY_ORDER.indexOf(c.category)
    const sectionId = idx >= 0 ? `builtin-${idx}` : sections[0].id
    return {
      id: c.id,
      sectionId,
      title: c.title,
      maxScore: c.maxScore,
      requiredDocs: c.requiredDocs ?? [],
      collected: DEMO_CRITERIA_EVAL[c.id]?.collected ?? 0,
      status: DEMO_CRITERIA_EVAL[c.id]?.status ?? "pending",
    }
  })
  return { sections, criteria }
}

function sanitizeSnapshot(data) {
  if (!data || typeof data !== "object") return buildDefaultSnapshot()
  const rawSections = Array.isArray(data.sections) ? data.sections : []
  /** @type {DashboardSection[]} */
  const sections = rawSections
    .filter((s) => s && typeof s.id === "string" && typeof s.title === "string" && s.title.trim())
    .map((s) => ({
      id: String(s.id),
      title: String(s.title).trim(),
      maxScore: Number.isFinite(Number(s.maxScore)) && Number(s.maxScore) > 0 ? Number(s.maxScore) : 20,
    }))
  if (sections.length === 0) return buildDefaultSnapshot()
  const sectionIds = new Set(sections.map((s) => s.id))

  const rawCrit = Array.isArray(data.criteria) ? data.criteria : []
  /** @type {DashboardCriterion[]} */
  let criteria = rawCrit
    .filter((c) => c && typeof c.id === "string" && typeof c.sectionId === "string" && sectionIds.has(c.sectionId))
    .map((c) => ({
      id: String(c.id),
      sectionId: String(c.sectionId),
      title: String(c.title ?? "").trim() || "Mezon",
      maxScore: Number.isFinite(Number(c.maxScore)) && Number(c.maxScore) > 0 ? Number(c.maxScore) : 1,
      requiredDocs: Array.isArray(c.requiredDocs) ? c.requiredDocs.map(String) : [],
      collected: Number.isFinite(Number(c.collected)) ? Number(c.collected) : 0,
      status: c.status === "approved" ? "approved" : "pending",
    }))

  return { sections, criteria }
}

function loadSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildDefaultSnapshot()
    return sanitizeSnapshot(JSON.parse(raw))
  } catch {
    return buildDefaultSnapshot()
  }
}

function Modal({ open, onClose, dark, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-14">
      <button type="button" aria-label="Yopish" className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-lg rounded-2xl border p-6 text-lg shadow-xl ${
          dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function ScoreBar({ dark, value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
      <div className="h-full rounded-full bg-teal-500 transition-[width] duration-300" style={{ width: `${pct}%` }} />
    </div>
  )
}

function StatusBadge({ dark, status }) {
  const approved = status === "approved"
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        approved
          ? dark
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-emerald-100 text-emerald-800"
          : dark
            ? "bg-amber-500/20 text-amber-200"
            : "bg-amber-100 text-amber-900"
      }`}
    >
      {approved ? "Tasdiqlangan" : "Tekshirilmoqda"}
    </span>
  )
}

export default function Criteria({ dark }) {
  const initial = useMemo(() => loadSnapshot(), [])
  const [sections, setSections] = useState(() => initial.sections)
  const [criteria, setCriteria] = useState(() => initial.criteria)

  const [openSection, setOpenSection] = useState(() => initial.sections[0]?.id ?? "")
  const [showAllInSection, setShowAllInSection] = useState(() => ({}))
  const [sectionDraft, setSectionDraft] = useState("all")
  const [statusDraft, setStatusDraft] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createDraft, setCreateDraft] = useState({
    sectionId: "",
    title: "",
    maxScore: "5",
  })

  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState(/** @type {string | null} */ (null))
  const [sectionFormDraft, setSectionFormDraft] = useState({
    title: "",
    maxScore: "20",
  })
  const [deleteSectionTarget, setDeleteSectionTarget] = useState(/** @type {DashboardSection | null} */ (null))

  const [notice, setNotice] = useState({ open: false, message: "" })
  const noticeTimeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sections, criteria }))
  }, [sections, criteria])

  const rows = criteria

  const cardBase = dark ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white shadow-sm"
  const subtitle = dark ? "text-slate-400" : "text-slate-500"
  const titleClr = dark ? "text-slate-100" : "text-slate-900"
  const input = dark
    ? "border-slate-600 bg-slate-900/40 text-slate-100 placeholder:text-slate-600"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
  const selectInput = `${input} ${
    dark ? "[&>option]:bg-slate-800 [&>option]:text-slate-100" : "[&>option]:bg-white [&>option]:text-slate-900"
  }`

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (sectionFilter !== "all" && r.sectionId !== sectionFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      return true
    })
  }, [rows, sectionFilter, statusFilter])

  const bySectionId = useMemo(() => {
    const map = {}
    sections.forEach((s) => {
      map[s.id] = filteredRows.filter((r) => r.sectionId === s.id)
    })
    return map
  }, [filteredRows, sections])

  const applyFilters = () => {
    setSectionFilter(sectionDraft)
    setStatusFilter(statusDraft)
  }

  const toggleSection = (sectionId) => {
    setOpenSection((prev) => (prev === sectionId ? "" : sectionId))
  }

  const toggleShowAllRows = (sectionId) => {
    setShowAllInSection((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const closeCreateModal = () => setCreateModalOpen(false)
  const closeSectionModal = () => {
    setSectionModalOpen(false)
    setEditingSectionId(null)
  }

  const openCreateCriterion = () => {
    const first = sections[0]?.id ?? ""
    setCreateDraft({
      sectionId: first,
      title: "",
      maxScore: "5",
    })
    setCreateModalOpen(true)
  }

  const openCreateForSection = (sectionId) => {
    setCreateDraft({
      sectionId,
      title: "",
      maxScore: "5",
    })
    setCreateModalOpen(true)
  }

  const openCreateSection = () => {
    setEditingSectionId(null)
    setSectionFormDraft({ title: "", maxScore: "20" })
    setSectionModalOpen(true)
  }

  const openEditSection = (sec) => {
    setEditingSectionId(sec.id)
    setSectionFormDraft({
      title: sec.title,
      maxScore: String(sec.maxScore),
    })
    setSectionModalOpen(true)
  }

  const showNotice = (message) => {
    setNotice({ open: true, message })
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current)
    noticeTimeoutRef.current = setTimeout(() => {
      setNotice({ open: false, message: "" })
      noticeTimeoutRef.current = null
    }, 1300)
  }

  const onSaveCriterion = () => {
    const title = createDraft.title.trim()
    const maxScore = Number(createDraft.maxScore)
    if (!title || !Number.isFinite(maxScore) || maxScore <= 0) return
    if (!sections.some((s) => s.id === createDraft.sectionId)) return

    const newRow = {
      id: `c-custom-${Date.now()}`,
      sectionId: createDraft.sectionId,
      title,
      maxScore: Math.round(maxScore),
      requiredDocs: [],
      collected: 0,
      status: /** @type {'pending'} */ ("pending"),
    }
    setCriteria((prev) => [...prev, newRow])
    closeCreateModal()
    showNotice("Mezon qo'shildi")
    setOpenSection(createDraft.sectionId)
  }

  const onSaveSection = () => {
    const title = sectionFormDraft.title.trim()
    const maxScore = Number(sectionFormDraft.maxScore)
    if (!title || !Number.isFinite(maxScore) || maxScore <= 0) return

    if (editingSectionId) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editingSectionId ? { ...s, title, maxScore: Math.round(maxScore) } : s
        )
      )
      closeSectionModal()
      showNotice("Bo'lim yangilandi")
      return
    }

    const id = `custom-${Date.now()}`
    const newSection = {
      id,
      title,
      maxScore: Math.round(maxScore),
    }
    setSections((prev) => [...prev, newSection])
    closeSectionModal()
    showNotice("Bo'lim yaratildi")
    setOpenSection(id)
  }

  const criteriaCountForSection = (sectionId) => criteria.filter((c) => c.sectionId === sectionId).length

  const confirmDeleteSection = () => {
    const target = deleteSectionTarget
    if (!target) return
    const id = target.id

    setSections((prev) => {
      const next = prev.filter((s) => s.id !== id)
      const fallbackId = next[0]?.id ?? ""
      setOpenSection((cur) => (cur === id ? fallbackId : cur))
      setCreateDraft((d) => (d.sectionId === id ? { ...d, sectionId: fallbackId } : d))
      return next
    })
    setCriteria((prev) => prev.filter((c) => c.sectionId !== id))
    setSectionDraft((d) => (d === id ? "all" : d))
    setSectionFilter((f) => (f === id ? "all" : f))
    setDeleteSectionTarget(null)
    showNotice("Bo'lim o'chirildi")
  }

  const firstSectionId = sections[0]?.id ?? ""

  return (
    <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} p-5 sm:p-6`}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className={`text-xl font-bold tracking-tight ${titleClr}`}>Mezonlar</h2>
            <p className={`mt-1 max-w-2xl text-sm leading-relaxed ${subtitle}`}>
              Avval <span className={`font-semibold ${titleClr}`}>Bo&apos;lim qo&apos;shish</span> bilan yangi bo&apos;lim yarating, keyin uning ichiga{" "}
              <span className={`font-semibold ${titleClr}`}>Mezon qo&apos;shish</span> yoki bo&apos;lim ochilganda{" "}
              <span className={`font-semibold ${titleClr}`}>Bu bo&apos;limga mezon qo&apos;shish</span> orqali qator qo&apos;shing.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={openCreateSection}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                dark ? "border-emerald-500 text-emerald-300 hover:bg-slate-700/70" : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <FolderPlus className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
              Bo&apos;lim qo&apos;shish
            </button>
            <button
              type="button"
              onClick={openCreateCriterion}
              disabled={sections.length === 0}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 disabled:pointer-events-none disabled:opacity-50 ${TEAL_BG}`}
            >
              <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
              Mezon qo&apos;shish
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <select
            value={sectionDraft}
            onChange={(e) => setSectionDraft(e.target.value)}
            className={`w-full min-w-[11rem] rounded-lg border px-3 py-2.5 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 sm:w-auto ${selectInput}`}
          >
            <option value="all">Barcha bo&apos;limlar</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <select
            value={statusDraft}
            onChange={(e) => setStatusDraft(e.target.value)}
            className={`w-full min-w-[11rem] rounded-lg border px-3 py-2.5 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 sm:w-auto ${selectInput}`}
          >
            <option value="all">Barcha statuslar</option>
            <option value="approved">Tasdiqlangan</option>
            <option value="pending">Tekshirilmoqda</option>
          </select>
          <button
            type="button"
            onClick={applyFilters}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors sm:shrink-0 ${
              dark ? "border-teal-500 text-teal-300 hover:bg-slate-700/70" : "border-teal-600 text-teal-700 hover:bg-teal-50"
            }`}
          >
            <Filter className="h-4 w-4" strokeWidth={2} aria-hidden />
            Filtr
          </button>
        </div>

        <div className="space-y-3">
          {sections.map((sec, idx) => {
            const sectionRows = bySectionId[sec.id] ?? []
            const catMax = sec.maxScore
            const catCollected = sectionRows.reduce((s, r) => s + r.collected, 0)
            const isOpen = openSection === sec.id
            const showAll = showAllInSection[sec.id]
            const visibleRows =
              sectionRows.length > PREVIEW_ROWS && !showAll ? sectionRows.slice(0, PREVIEW_ROWS) : sectionRows
            const sectionNum = idx + 1

            return (
              <div key={sec.id} className={`overflow-hidden rounded-xl border ${cardBase}`}>
                <div
                  className={`flex w-full items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 ${
                    dark ? "hover:bg-slate-700/20" : "hover:bg-slate-50/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    className={`flex min-w-0 flex-1 items-start gap-2 text-left sm:gap-3 ${
                      dark ? "hover:bg-transparent" : "hover:bg-transparent"
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 ${subtitle}`}>
                      {isOpen ? <ChevronUp className="h-5 w-5" strokeWidth={2} aria-hidden /> : <ChevronDown className="h-5 w-5" strokeWidth={2} aria-hidden />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-bold ${titleClr}`}>
                        {sectionNum}. {sec.title}
                      </p>
                    </div>
                  </button>
                  <div className="shrink-0 self-center text-right">
                    <p className={`text-sm font-bold tabular-nums leading-none ${titleClr}`}>
                      {catCollected} / {catMax}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      title="Bo'limni tahrirlash"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditSection(sec)
                      }}
                      className={`rounded-lg border p-2 transition-colors ${
                        dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-300 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </button>
                    <button
                      type="button"
                      title="Bo'limni o'chirish"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteSectionTarget(sec)
                      }}
                      className={`rounded-lg border p-2 transition-colors ${
                        dark ? "border-red-500/50 text-red-300 hover:bg-red-950/40" : "border-red-200 text-red-700 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className={`border-t ${dark ? "border-slate-600" : "border-slate-200"}`}>
                    <div
                      className={`flex flex-wrap items-center justify-end gap-2 border-b px-4 py-2.5 ${
                        dark ? "border-slate-600 bg-slate-900/25" : "border-slate-200 bg-slate-50/90"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => openCreateForSection(sec.id)}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                          dark ? "bg-teal-600 text-white hover:bg-teal-500" : "bg-teal-600 text-white hover:bg-teal-700"
                        }`}
                      >
                        <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
                        Bu bo&apos;limga mezon qo&apos;shish
                      </button>
                    </div>

                    {sectionRows.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className={`min-w-[720px] w-full border-collapse text-sm ${dark ? "border-slate-700" : "border-slate-200"}`}>
                          <thead className={dark ? "bg-slate-900/40" : "bg-slate-50"}>
                            <tr>
                              <th className={`border px-3 py-3 text-left font-bold ${dark ? "border-slate-600" : "border-slate-200"} ${titleClr}`}>№</th>
                              <th className={`border px-3 py-3 text-left font-bold ${dark ? "border-slate-600" : "border-slate-200"} ${titleClr}`}>Mezon nomi</th>
                              <th className={`border px-3 py-3 text-center font-bold ${dark ? "border-slate-600" : "border-slate-200"} ${titleClr}`}>Maks. ball</th>
                              <th className={`border px-3 py-3 text-left font-bold ${dark ? "border-slate-600" : "border-slate-200"} ${titleClr}`}>Yig&apos;ilgan ball</th>
                              <th className={`border px-3 py-3 text-center font-bold ${dark ? "border-slate-600" : "border-slate-200"} ${titleClr}`}>Status</th>
                              <th className={`border px-3 py-3 text-right font-bold ${dark ? "border-slate-600" : "border-slate-200"} ${titleClr}`}>Amallar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleRows.map((row) => {
                              const fullIdx = sectionRows.indexOf(row)
                              const numLabel = `${sectionNum}.${fullIdx + 1}`
                              return (
                                <tr key={row.id}>
                                  <td className={`border px-3 py-3 font-semibold tabular-nums ${dark ? "border-slate-600" : "border-slate-200"} ${titleClr}`}>{numLabel}</td>
                                  <td className={`border px-3 py-3 ${dark ? "border-slate-600" : "border-slate-200"} ${subtitle}`}>
                                    <span className={`font-medium ${titleClr}`}>{row.title}</span>
                                  </td>
                                  <td className={`border px-3 py-3 text-center font-semibold tabular-nums ${dark ? "border-slate-600" : "border-slate-200"} ${titleClr}`}>
                                    {row.maxScore}
                                  </td>
                                  <td className={`border px-3 py-3 ${dark ? "border-slate-600" : "border-slate-200"}`}>
                                    <span className={`text-sm font-semibold tabular-nums ${titleClr}`}>
                                      {row.collected} / {row.maxScore}
                                    </span>
                                    <ScoreBar dark={dark} value={row.collected} max={row.maxScore} />
                                  </td>
                                  <td className={`border px-3 py-3 text-center ${dark ? "border-slate-600" : "border-slate-200"}`}>
                                    <StatusBadge dark={dark} status={row.status} />
                                  </td>
                                  <td className={`border px-3 py-3 ${dark ? "border-slate-600" : "border-slate-200"}`}>
                                    <div className="flex justify-end gap-1.5">
                                      <button
                                        type="button"
                                        title="Ko'rish"
                                        className={`rounded-lg border p-2 transition-colors ${
                                          dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                        }`}
                                      >
                                        <Eye className="h-4 w-4" strokeWidth={2} aria-hidden />
                                      </button>
                                      <button
                                        type="button"
                                        title="Hujjatlar"
                                        className={`rounded-lg border p-2 transition-colors ${
                                          dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                        }`}
                                      >
                                        <FileText className="h-4 w-4" strokeWidth={2} aria-hidden />
                                      </button>
                                      <button
                                        type="button"
                                        title="Batafsil"
                                        className={`rounded-lg border p-2 transition-colors ${
                                          dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                        }`}
                                      >
                                        <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className={`px-4 py-8 text-center text-sm ${subtitle}`}>
                        Bu bo&apos;limda filtr bo&apos;yicha mezon topilmadi. Yangi qator qo&apos;shish uchun yuqoridagi tugmadan foydalaning.
                      </div>
                    )}

                    {sectionRows.length > PREVIEW_ROWS && (
                      <div className={`flex justify-center border-t px-4 py-3 ${dark ? "border-slate-600 bg-slate-900/30" : "border-slate-200 bg-slate-50/80"}`}>
                        <button
                          type="button"
                          onClick={() => toggleShowAllRows(sec.id)}
                          className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                            dark ? "text-teal-300 hover:text-teal-200" : "text-teal-700 hover:text-teal-800"
                          }`}
                        >
                          {showAll ? (
                            <>
                              Kamroq ko&apos;rsatish
                              <ChevronUp className="h-4 w-4" aria-hidden />
                            </>
                          ) : (
                            <>
                              Barcha mezonlarni ko&apos;rish ({sectionRows.length})
                              <ChevronDown className="h-4 w-4" aria-hidden />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {sections.length === 0 && (
          <p className={`text-center text-sm ${subtitle}`}>Hozircha bo&apos;lim yo&apos;q. «Bo&apos;lim qo&apos;shish» dan boshlang.</p>
        )}
      </div>

      <Modal open={createModalOpen} onClose={closeCreateModal} dark={dark}>
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-bold tracking-tight">Mezon qo&apos;shish</h3>
            <button
              type="button"
              onClick={closeCreateModal}
              aria-label="Yopish"
              className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
            >
              <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-base font-semibold">Bo&apos;lim</label>
              <select
                value={createDraft.sectionId || firstSectionId}
                onChange={(e) => setCreateDraft((p) => ({ ...p, sectionId: e.target.value }))}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${selectInput}`}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-base font-semibold">Mezon nomi</label>
              <input
                value={createDraft.title}
                onChange={(e) => setCreateDraft((p) => ({ ...p, title: e.target.value }))}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                placeholder="Masalan: ochiq darslar hisoboti"
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-semibold">Maks. ball</label>
              <input
                type="number"
                min={1}
                value={createDraft.maxScore}
                onChange={(e) => setCreateDraft((p) => ({ ...p, maxScore: e.target.value }))}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onSaveCriterion}
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600"
            >
              Saqlash
            </button>
            <button
              type="button"
              onClick={closeCreateModal}
              className={`inline-flex min-w-[11rem] items-center justify-center rounded-full border px-6 py-3 text-base font-bold transition-colors ${
                dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={sectionModalOpen} onClose={closeSectionModal} dark={dark}>
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-bold tracking-tight">
              {editingSectionId ? "Bo&apos;limni tahrirlash" : "Bo&apos;lim yaratish"}
            </h3>
            <button
              type="button"
              onClick={closeSectionModal}
              aria-label="Yopish"
              className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
            >
              <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-base font-semibold">Bo&apos;lim nomi</label>
              <input
                value={sectionFormDraft.title}
                onChange={(e) => setSectionFormDraft((p) => ({ ...p, title: e.target.value }))}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                placeholder="Masalan: Innovatsion faoliyat"
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-semibold">Bo&apos;lim uchun jami maks. ball</label>
              <input
                type="number"
                min={1}
                value={sectionFormDraft.maxScore}
                onChange={(e) => setSectionFormDraft((p) => ({ ...p, maxScore: e.target.value }))}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onSaveSection}
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600"
            >
              {editingSectionId ? "Saqlash" : "Yaratish"}
            </button>
            <button
              type="button"
              onClick={closeSectionModal}
              className={`inline-flex min-w-[11rem] items-center justify-center rounded-full border px-6 py-3 text-base font-bold transition-colors ${
                dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteSectionTarget} onClose={() => setDeleteSectionTarget(null)} dark={dark}>
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-bold tracking-tight">Bo&apos;limni o&apos;chirish</h3>
            <button
              type="button"
              onClick={() => setDeleteSectionTarget(null)}
              aria-label="Yopish"
              className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
            >
              <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
          <p className={`text-base leading-relaxed ${subtitle}`}>
            <span className={`font-semibold ${titleClr}`}>{deleteSectionTarget?.title}</span> bo&apos;limini o&apos;chirishni tasdiqlaysizmi? Bu bo&apos;limga
            tegishli barcha mezonlar ham ro&apos;yxatdan olib tashlanadi (
            {deleteSectionTarget ? criteriaCountForSection(deleteSectionTarget.id) : 0} ta).
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={confirmDeleteSection}
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-red-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-red-700"
            >
              O&apos;chirish
            </button>
            <button
              type="button"
              onClick={() => setDeleteSectionTarget(null)}
              className={`inline-flex min-w-[11rem] items-center justify-center rounded-full border px-6 py-3 text-base font-bold transition-colors ${
                dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </Modal>

      {notice.open && (
        <div className="pointer-events-none fixed left-1/2 top-4 z-[60] w-[min(92vw,34rem)] -translate-x-1/2">
          <div
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-xl ring-1 ${
              dark ? "bg-emerald-600 text-white ring-white/10" : "bg-emerald-500 text-white ring-emerald-600/30"
            }`}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <CircleCheck className="h-6 w-6 shrink-0 text-white" strokeWidth={2.25} aria-hidden />
              <p className="truncate text-sm font-semibold">{notice.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setNotice({ open: false, message: "" })}
              aria-label="Yopish"
              className="rounded-xl p-1.5 transition-colors hover:bg-white/10"
            >
              <CircleX className="h-6 w-6 text-white" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
