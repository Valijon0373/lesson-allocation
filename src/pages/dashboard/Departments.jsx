import { useMemo, useRef, useState } from "react"
import { CircleCheck, CircleX, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react"

const TEAL_BG = "bg-teal-500"

const MAVJUD_FAKULTETLAR = [
  { id: "f-1", nameUz: "Filologiya Fakulteti", nameRu: "Факультет филологии" },
  { id: "f-2", nameUz: "Pedagogika Fakulteti", nameRu: "Факультет Педагогики" },
  { id: "f-3", nameUz: "Aniq va tabiiy fanlar Fakulteti", nameRu: "Факультет точных и естественных наук" },
  { id: "f-4", nameUz: "Ijtimoiy va amaliy fanlar Fakulteti", nameRu: "Факультет социальных и прикладных наук" },
  { id: "f-5", nameUz: "Boshlang'ich ta'lim Fakulteti", nameRu: "Факультет начального образования" },
]

const KAFEDRALAR_ROYXATI = [
  { id: "k-1", nameUz: "Rus tili va adabiyoti kafedrasi", nameRu: "Кафедра русского языка и литературы", fakultet: "Filologiya Fakulteti" },
  { id: "k-2", nameUz: "O'zbek tili va adabiyoti kafedrasi", nameRu: "Кафедра узбекского языка и литературы", fakultet: "Filologiya Fakulteti" },
  { id: "k-3", nameUz: "Xorijiy tillar va tilshunoslik kafedrasi", nameRu: "Кафедра иностранных языков и лингвистики", fakultet: "Filologiya Fakulteti" },
  { id: "k-4", nameUz: "Pedagogika nazariyasi va tarix kafedrasi", nameRu: "Кафедра теории и истории педагогики", fakultet: "Pedagogika Fakulteti" },
  { id: "k-5", nameUz: "Psixologiya kafedrasi", nameRu: "Кафедра психологии", fakultet: "Pedagogika Fakulteti" },
  { id: "k-6", nameUz: "Maxsus pedagogika va inklyuziv ta'lim kafedrasi", nameRu: "Кафедра специальной педагогики и инклюзивного образования", fakultet: "Pedagogika Fakulteti" },
  { id: "k-7", nameUz: "Matematika va informatika o'qitish metodikasi kafedrasi", nameRu: "Кафедра методики преподавания математики и информатики", fakultet: "Aniq va tabiiy fanlar Fakulteti" },
  { id: "k-8", nameUz: "Fizika va astronomiya kafedrasi", nameRu: "Кафедра физики и астрономии", fakultet: "Aniq va tabiiy fanlar Fakulteti" },
  { id: "k-9", nameUz: "Kimyo va biologiya kafedrasi", nameRu: "Кафедра химии и биологии", fakultet: "Aniq va tabiiy fanlar Fakulteti" },
  { id: "k-10", nameUz: "Tarix va ijtimoiy fanlar kafedrasi", nameRu: "Кафедра истории и общественных наук", fakultet: "Ijtimoiy va amaliy fanlar Fakulteti" },
  { id: "k-11", nameUz: "Geografiya va ekologiya ta'limi kafedrasi", nameRu: "Кафедра географического и экологического образования", fakultet: "Ijtimoiy va amaliy fanlar Fakulteti" },
  { id: "k-12", nameUz: "Jismoniy tarbiya va sport kafedrasi", nameRu: "Кафедра физического воспитания и спорта", fakultet: "Ijtimoiy va amaliy fanlar Fakulteti" },
  { id: "k-13", nameUz: "Boshlang'ich ta'lim metodikasi kafedrasi", nameRu: "Кафедра методики начального образования", fakultet: "Boshlang'ich ta'lim Fakulteti" },
  { id: "k-14", nameUz: "Maktabgacha ta'lim kafedrasi", nameRu: "Кафедра дошкольного образования", fakultet: "Boshlang'ich ta'lim Fakulteti" },
  { id: "k-15", nameUz: "Bolalar rivojlanishi va ergonomika kafedrasi", nameRu: "Кафедра развития детей и эргономики", fakultet: "Boshlang'ich ta'lim Fakulteti" },
]

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

export default function Departments({ dark }) {
  const [rows, setRows] = useState(() => KAFEDRALAR_ROYXATI)
  const [searchDraft, setSearchDraft] = useState("")
  const [searchApplied, setSearchApplied] = useState("")
  const [modal, setModal] = useState({
    open: false,
    type: /** @type {null | "view" | "edit" | "delete" | "create"} */ (null),
    row: null,
  })
  const [editDraft, setEditDraft] = useState({ fakultet: "", nameUz: "" })
  const [createDraft, setCreateDraft] = useState({ fakultet: "", nameUz: "" })
  const [notice, setNotice] = useState({ open: false, message: "", variant: /** @type {"success" | "danger"} */ ("success") })
  const noticeTimeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null))

  const filtered = useMemo(() => {
    const q = searchApplied.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => row.nameUz.toLowerCase().includes(q) || row.fakultet.toLowerCase().includes(q))
  }, [rows, searchApplied])

  const cardBase = dark ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white shadow-sm"
  const subtitle = dark ? "text-slate-400" : "text-slate-500"
  const title = dark ? "text-slate-100" : "text-slate-900"
  const meta = dark ? "text-slate-500" : "text-slate-400"
  const inputWrap = dark
    ? "border-slate-600 bg-slate-800/80 text-slate-100 placeholder:text-slate-500"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"

  const input = dark
    ? "border-slate-600 bg-slate-900/40 text-slate-100 placeholder:text-slate-600"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"

  const closeModal = () => setModal({ open: false, type: null, row: null })
  const closeNotice = () => setNotice({ open: false, message: "", variant: "success" })

  const showNotice = (message, variant = "success") => {
    setNotice({ open: true, message, variant })
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current)
    noticeTimeoutRef.current = setTimeout(() => {
      setNotice({ open: false, message: "", variant: "success" })
      noticeTimeoutRef.current = null
    }, 1300)
  }

  const fakultetOptions = useMemo(() => MAVJUD_FAKULTETLAR.map((f) => f.nameUz), [])

  const openView = (row) => setModal({ open: true, type: "view", row })

  const openEdit = (row) => {
    setEditDraft({ fakultet: row?.fakultet ?? "", nameUz: row?.nameUz ?? "" })
    setModal({ open: true, type: "edit", row })
  }

  const openDelete = (row) => setModal({ open: true, type: "delete", row })

  const openCreate = () => {
    setCreateDraft({ fakultet: fakultetOptions[0] ?? "", nameUz: "" })
    setModal({ open: true, type: "create", row: null })
  }

  const onSaveEdit = () => {
    const row = modal.row
    if (!row?.id) return
    const nextName = editDraft.nameUz.trim()
    const nextFac = editDraft.fakultet.trim()
    if (!nextName || !nextFac) return
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, nameUz: nextName, fakultet: nextFac } : r)))
    closeModal()
    showNotice("Muvaqqatli Tahrirlandi")
  }

  const onConfirmDelete = () => {
    const row = modal.row
    if (!row?.id) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    closeModal()
    showNotice("Muvaqqatli O'chirildi", "danger")
  }

  const onSaveCreate = () => {
    const nextName = createDraft.nameUz.trim()
    const nextFac = createDraft.fakultet.trim()
    if (!nextName || !nextFac) return
    const newRow = { id: `k-${Date.now()}`, nameUz: nextName, nameRu: "", fakultet: nextFac }
    setRows((prev) => [newRow, ...prev])
    closeModal()
    showNotice("Muvaqqatli Qo'shildi")
  }

  return (
    <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} p-5 sm:p-6`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`text-xl font-bold tracking-tight ${title}`}>Kafedralar</h2>
          <button
            type="button"
            onClick={openCreate}
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
              dark ? "border-blue-500/90 text-blue-400 hover:bg-slate-700/80" : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            Qidirish
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {filtered.map((row) => (
            <li key={row.id} className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-4 sm:px-5 ${cardBase}`}>
              <div className="min-w-0 flex-1">
                <p className={`font-bold leading-snug ${title}`}>{row.nameUz}</p>
                <p className={`mt-1.5 text-xs ${meta}`}>Fakultet: {row.fakultet}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                <button
                  type="button"
                  onClick={() => openView(row)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dark ? "border-blue-500/80 text-blue-400 hover:bg-slate-700/80" : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Eye className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  Ko'rish
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(row)}
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
                  onClick={() => openDelete(row)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dark ? "border-red-500/80 text-red-400 hover:bg-slate-700/80" : "border-red-600 text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Trash2 className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  O'chirish
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && <p className={`text-center text-sm ${subtitle}`}>Natija topilmadi.</p>}
      </div>

      <Modal open={modal.open} onClose={closeModal} dark={dark}>
        {modal.type === "view" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">Kafedra ma'lumotlari</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="space-y-3 text-base">
              <div>
                <p className={`text-xs font-semibold ${meta}`}>Fakultet:</p>
                <p className="mt-1 font-semibold">{modal.row.fakultet}</p>
              </div>
              <div>
                <p className={`text-xs font-semibold ${meta}`}>Kafedra nomi:</p>
                <p className="mt-1 font-semibold">{modal.row.nameUz}</p>
              </div>
            </div>
          </div>
        )}

        {modal.type === "edit" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">Kafedrani tahrirlash</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-base font-semibold">Fakultet</label>
                <select
                  value={editDraft.fakultet}
                  onChange={(e) => setEditDraft((p) => ({ ...p, fakultet: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                >
                  {fakultetOptions.map((opt) => (
                    <option key={opt} value={opt} className={dark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-base font-semibold">Kafedra nomi</label>
                <input
                  value={editDraft.nameUz}
                  onChange={(e) => setEditDraft((p) => ({ ...p, nameUz: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onSaveEdit}
                className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600"
              >
                Saqlash
              </button>
              <button
                type="button"
                onClick={closeModal}
                className={`inline-flex min-w-[11rem] items-center justify-center rounded-full border px-6 py-3 text-base font-bold transition-colors ${
                  dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}

        {modal.type === "delete" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">Kafedrani o'chirishni tasdiqlaysizmi?</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onConfirmDelete}
                className="inline-flex min-w-[11rem] items-center justify-center rounded-2xl bg-red-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600"
              >
                Ha
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex min-w-[11rem] items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600"
              >
                Yo'q
              </button>
            </div>
          </div>
        )}

        {modal.type === "create" && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">Kafedra qo'shish</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-base font-semibold">Fakultet</label>
                <select
                  value={createDraft.fakultet}
                  onChange={(e) => setCreateDraft((p) => ({ ...p, fakultet: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                >
                  {fakultetOptions.map((opt) => (
                    <option key={opt} value={opt} className={dark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-base font-semibold">Kafedra nomi</label>
                <input
                  value={createDraft.nameUz}
                  onChange={(e) => setCreateDraft((p) => ({ ...p, nameUz: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                  placeholder="Masalan: Psixologiya kafedrasi"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onSaveCreate}
                className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600"
              >
                Qo'shish
              </button>
              <button
                type="button"
                onClick={closeModal}
                className={`inline-flex min-w-[11rem] items-center justify-center rounded-full border px-6 py-3 text-base font-bold transition-colors ${
                  dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}
      </Modal>

      {notice.open && (
        <div className="pointer-events-none fixed left-1/2 top-4 z-[60] w-[min(92vw,34rem)] -translate-x-1/2">
          <div
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-xl ring-1 ${
              notice.variant === "danger"
                ? dark
                  ? "bg-red-600 text-white ring-white/10"
                  : "bg-red-500 text-white ring-red-600/30"
                : dark
                  ? "bg-emerald-600 text-white ring-white/10"
                  : "bg-emerald-500 text-white ring-emerald-600/30"
            }`}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <CircleCheck className="h-6 w-6 shrink-0 text-white" strokeWidth={2.25} aria-hidden />
              <p className="truncate text-sm font-semibold">{notice.message}</p>
            </div>
            <button type="button" onClick={closeNotice} aria-label="Yopish" className="rounded-xl p-1.5 transition-colors hover:bg-white/10">
              <CircleX className="h-6 w-6 text-white" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

