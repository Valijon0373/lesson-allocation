import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CircleCheck, CircleX, Eye, Loader2, Pencil, Plus, Search, Trash2, ArrowUpDown, SlidersHorizontal } from "lucide-react"
import { fetchAllDepartments, fetchAllSubjects, saveSubject, updateSubject, deleteSubject, fetchSubjectById } from "../../data/mockApi"
import { getCrudPermissions } from "../../data/permissionLabels"

const TEAL_BG = "bg-teal-500"

function Modal({ open, onClose, dark, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-14">
      <button type="button" aria-label="Yopish" className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-2xl rounded-2xl border p-6 text-lg shadow-xl ${
          dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default function Subjects({ dark, permissions = [], isAdmin = false }) {
  // Using department permissions as fallback for now since subject permissions might not exist yet
  const { canView, canAdd, canEdit, canDelete } = useMemo(
    () => getCrudPermissions(permissions, "department", isAdmin), // Or "subject" if available
    [permissions, isAdmin]
  )
  const [rows, setRows] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [searchDraft, setSearchDraft] = useState("")
  const [searchApplied, setSearchApplied] = useState("")
  const [openActionsFor, setOpenActionsFor] = useState(null)
  const [modal, setModal] = useState({
    open: false,
    type: null,
    row: null,
  })

  const initialDraft = {
    departmentId: "",
    nameUz: "",
    semester: "Kuzki semestr",
    total: 0,
    lecture: 0,
    practice: 0,
    lab: 0,
    rating: 0,
    seminar: 0,
    independent: 0,
    credits: 0,
    groups: 0,
    students: 0,
  }

  const [editDraft, setEditDraft] = useState(initialDraft)
  const [createDraft, setCreateDraft] = useState(initialDraft)
  const [notice, setNotice] = useState({ open: false, message: "", variant: "success" })
  const noticeTimeoutRef = useRef(null)
  const [filterSemester, setFilterSemester] = useState("Kuzki semestr")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")

  const departmentNames = useMemo(() => {
    const map = {}
    for (const d of departments) map[d.id] = d.nameUz
    return map
  }, [departments])

  const filtered = useMemo(() => {
    const q = searchApplied.trim().toLowerCase()
    
    // 1. Text search
    let list = rows
    if (q) {
      list = list.filter(
        (row) =>
          row.nameUz.toLowerCase().includes(q) ||
          (row.departmentName ?? departmentNames[row.departmentId] ?? "").toLowerCase().includes(q),
      )
    }

    // 2. Semester filter
    if (filterSemester !== "all") {
      list = list.filter((row) => (row.semester || "Kuzki semestr") === filterSemester)
    }

    // 3. Department filter
    if (filterDepartment !== "all") {
      list = list.filter((row) => row.departmentId === filterDepartment)
    }

    // 4. Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.nameUz.localeCompare(b.nameUz)
      }
      if (sortBy === "name-desc") {
        return b.nameUz.localeCompare(a.nameUz)
      }
      if (sortBy === "total-desc") {
        return (b.total || 0) - (a.total || 0)
      }
      if (sortBy === "total-asc") {
        return (a.total || 0) - (b.total || 0)
      }
      return 0
    })

    return list
  }, [rows, searchApplied, departmentNames, filterSemester, filterDepartment, sortBy])

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

  const departmentLabel = (departmentId) => departmentNames[departmentId] ?? ""

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError("")
    try {
      const deptList = await fetchAllDepartments()
      setDepartments(deptList)
      const names = Object.fromEntries(deptList.map((d) => [d.id, d.nameUz]))
      const list = await fetchAllSubjects(names)
      setRows(list.map((r) => ({ ...r, departmentName: r.departmentName || names[r.departmentId] || "" })))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fanlarni yuklab bo'lmadi"
      setLoadError(message)
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!canView) {
      setLoading(false)
      setRows([])
      setLoadError("")
      return
    }
    loadData()
  }, [canView, loadData])

  const openView = async (row) => {
    setModal({ open: true, type: "view", row })
    if (!row?.id) return

    setBusy(true)
    try {
      const fresh = await fetchSubjectById(row.id, departmentNames)
      setModal({
        open: true,
        type: "view",
        row: { ...fresh, departmentName: fresh.departmentName || departmentLabel(fresh.departmentId) },
      })
    } catch {
      showNotice("Fan ma'lumotlarini yuklab bo'lmadi", "danger")
    } finally {
      setBusy(false)
    }
  }

  const openEdit = (row) => {
    setEditDraft({
      departmentId: row?.departmentId ?? "",
      nameUz: row?.nameUz ?? "",
      semester: row?.semester ?? "Kuzki semestr",
      total: row?.total ?? 0,
      lecture: row?.lecture ?? 0,
      practice: row?.practice ?? 0,
      lab: row?.lab ?? 0,
      rating: row?.rating ?? 0,
      seminar: row?.seminar ?? 0,
      independent: row?.independent ?? 0,
      credits: row?.credits ?? 0,
      groups: row?.groups ?? 0,
      students: row?.students ?? 0,
    })
    setModal({ open: true, type: "edit", row })
  }

  const openDelete = (row) => setModal({ open: true, type: "delete", row })

  const openCreate = () => {
    setCreateDraft({ ...initialDraft, departmentId: departments[0]?.id ?? "" })
    setModal({ open: true, type: "create", row: null })
  }

  const isWorkloadInvalid = (draft) => {
    const activeHoursSum = (draft.lecture || 0) + 
                           (draft.practice || 0) + 
                           (draft.lab || 0) + 
                           (draft.rating || 0) + 
                           (draft.seminar || 0)
    return activeHoursSum > (draft.total || 0)
  }

  const onSaveEdit = async () => {
    const row = modal.row
    if (!row?.id || busy) return
    const nextName = editDraft.nameUz.trim()
    const nextDepartmentId = editDraft.departmentId
    if (!nextName || !nextDepartmentId) return

    if (isWorkloadInvalid(editDraft)) {
      showNotice("Ma'ruza + Amaliy + Laboratoriya + Reyting + Seminar soatlari yig'indisi Jami soatdan oshib ketmasligi kerak!", "danger")
      return
    }

    setBusy(true)
    try {
      const updated = await updateSubject(row.id, { ...editDraft, nameUz: nextName, departmentId: nextDepartmentId }, departmentNames)
      const withLabel = { ...updated, departmentName: updated.departmentName || departmentLabel(updated.departmentId) }
      setRows((prev) => prev.map((r) => (r.id === row.id ? withLabel : r)))
      closeModal()
      showNotice("Fan tahrirlandi")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Saqlab bo'lmadi"
      showNotice(message, "danger")
    } finally {
      setBusy(false)
    }
  }

  const onConfirmDelete = async () => {
    const row = modal.row
    if (!row?.id || busy) return

    setBusy(true)
    try {
      await deleteSubject(row.id)
      setRows((prev) => prev.filter((r) => r.id !== row.id))
      closeModal()
      showNotice("Fan o'chirildi", "danger")
    } catch (err) {
      const message = err instanceof Error ? err.message : "O'chirib bo'lmadi"
      showNotice(message, "danger")
    } finally {
      setBusy(false)
    }
  }

  const onSaveCreate = async () => {
    if (busy) return
    const nextName = createDraft.nameUz.trim()
    const nextDepartmentId = createDraft.departmentId
    if (!nextName || !nextDepartmentId) return

    if (isWorkloadInvalid(createDraft)) {
      showNotice("Ma'ruza + Amaliy + Laboratoriya + Reyting + Seminar soatlari yig'indisi Jami soatdan oshib ketmasligi kerak!", "danger")
      return
    }

    setBusy(true)
    try {
      await saveSubject({ ...createDraft, nameUz: nextName, departmentId: nextDepartmentId }, departmentNames)
      await loadData()
      closeModal()
      showNotice("Fan qo'shildi")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Qo'shib bo'lmadi"
      showNotice(message, "danger")
    } finally {
      setBusy(false)
    }
  }

  const departmentSelect = (value, onChange) => (
    <select
      value={value}
      onChange={onChange}
      disabled={departments.length === 0}
      className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
    >
      {departments.length === 0 ? (
        <option value="">Kafedralar yuklanmadi</option>
      ) : (
        departments.map((d) => (
          <option key={d.id} value={d.id} className={dark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"}>
            {d.nameUz}
          </option>
        ))
      )}
    </select>
  )

  const getDraftTotal = (draft) => {
    return draft.total !== undefined && draft.total !== 0 
      ? draft.total 
      : (draft.lecture || 0) + 
        (draft.practice || 0) + 
        (draft.lab || 0) + 
        (draft.seminar || 0) + 
        (draft.independent || 0)
  }

  const handleTotalHoursChange = (value, draft, setDraft) => {
    const totalVal = Number(value) || 0
    const creditsVal = parseFloat((totalVal / 30).toFixed(2))

    setDraft(p => ({
      ...p,
      total: totalVal,
      credits: creditsVal,
    }))
  }

  const handleHoursFieldChange = (field, value, draft, setDraft) => {
    let numValue = Number(value) || 0
    if (["lecture", "practice", "lab", "rating", "seminar"].includes(field)) {
      if (draft.total && numValue > draft.total) {
        numValue = draft.total
      }
    }
    const nextDraft = { ...draft, [field]: numValue }
    setDraft(nextDraft)
  }

  const renderWorkloadInputs = (draft, setDraft) => {
    const currentTotal = getDraftTotal(draft)

    const getAvailable = (field) => {
      const sumOthers = 
        (field === "lecture" ? 0 : Number(draft.lecture || 0)) +
        (field === "practice" ? 0 : Number(draft.practice || 0)) +
        (field === "lab" ? 0 : Number(draft.lab || 0)) +
        (field === "rating" ? 0 : Number(draft.rating || 0)) +
        (field === "seminar" ? 0 : Number(draft.seminar || 0));
      return Math.max(0, (draft.total || 0) - sumOthers);
    };

    return (
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold">Jami soat</label>
          <input 
            type="number" 
            min="0" 
            value={currentTotal || ""} 
            onChange={(e) => handleTotalHoursChange(e.target.value, draft, setDraft)} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold">Kredit</label>
          <input 
            type="number" 
            min="0" 
            step="0.01"
            value={draft.credits || ""} 
            onChange={(e) => setDraft(p => ({ ...p, credits: Number(e.target.value) }))} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1 group">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Ma'ruza (soat)</label>
            {draft.total > 0 && (
              <span className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                Mavjud: {getAvailable("lecture")}
              </span>
            )}
          </div>
          <input 
            type="number" 
            min="0" 
            max={draft.total || undefined}
            value={draft.lecture || ""} 
            onChange={(e) => handleHoursFieldChange("lecture", e.target.value, draft, setDraft)} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1 group">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Amaliy (soat)</label>
            {draft.total > 0 && (
              <span className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                Mavjud: {getAvailable("practice")}
              </span>
            )}
          </div>
          <input 
            type="number" 
            min="0" 
            max={draft.total || undefined}
            value={draft.practice || ""} 
            onChange={(e) => handleHoursFieldChange("practice", e.target.value, draft, setDraft)} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1 group">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Laboratoriya (soat)</label>
            {draft.total > 0 && (
              <span className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                Mavjud: {getAvailable("lab")}
              </span>
            )}
          </div>
          <input 
            type="number" 
            min="0" 
            max={draft.total || undefined}
            value={draft.lab || ""} 
            onChange={(e) => handleHoursFieldChange("lab", e.target.value, draft, setDraft)} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1 group">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Reyting (soat)</label>
            {draft.total > 0 && (
              <span className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                Mavjud: {getAvailable("rating")}
              </span>
            )}
          </div>
          <input 
            type="number" 
            min="0" 
            max={draft.total || undefined}
            value={draft.rating || ""} 
            onChange={(e) => handleHoursFieldChange("rating", e.target.value, draft, setDraft)} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1 group">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Seminar (soat)</label>
            {draft.total > 0 && (
              <span className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                Mavjud: {getAvailable("seminar")}
              </span>
            )}
          </div>
          <input 
            type="number" 
            min="0" 
            max={draft.total || undefined}
            value={draft.seminar || ""} 
            onChange={(e) => handleHoursFieldChange("seminar", e.target.value, draft, setDraft)} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold">Mustaqil ta'lim (soat)</label>
          <input 
            type="number" 
            min="0" 
            value={draft.independent || ""} 
            onChange={(e) => handleHoursFieldChange("independent", e.target.value, draft, setDraft)} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold">Guruhlar soni</label>
          <input 
            type="number" 
            min="0" 
            value={draft.groups || ""} 
            onChange={(e) => setDraft(p => ({ ...p, groups: Number(e.target.value) }))} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold">Talabalar soni</label>
          <input 
            type="number" 
            min="0" 
            value={draft.students || ""} 
            onChange={(e) => setDraft(p => ({ ...p, students: Number(e.target.value) }))} 
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} 
          />
        </div>
      </div>
    )
  }

  if (!canView) {
    return (
      <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} p-8 text-center`}>
        <p className={`text-lg font-semibold ${title}`}>Ruxsat yo'q</p>
        <p className={`mt-2 text-sm ${subtitle}`}>Fanlarni ko'rish uchun ruxsat berilmagan.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} overflow-hidden shadow-sm`}>
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`text-xl font-bold tracking-tight ${title}`}>Fanlar va Yuklamalar</h2>
          {canAdd && (
            <button
              type="button"
              onClick={openCreate}
              disabled={loading || departments.length === 0}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 ${TEAL_BG}`}
            >
              <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
              Qo'shish
            </button>
          )}
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
              placeholder="Fan qidirish..."
              disabled={loading}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 ${inputWrap}`}
            />
          </div>
          <button
            type="button"
            onClick={() => setSearchApplied(searchDraft)}
            disabled={loading}
            className={`inline-flex shrink-0 items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 sm:min-w-[7.5rem] ${
              dark ? "border-blue-500/90 text-blue-400 hover:bg-slate-700/80" : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            Qidirish
          </button>
        </div>

        {/* Filters and Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold ${subtitle}`}>Semestr bo'yicha</label>
            <div className={`flex p-1 rounded-lg shadow-sm border transition-colors duration-300 w-fit ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              {["Kuzki semestr", "Bahorki semestr"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterSemester(s)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    filterSemester === s
                      ? "bg-blue-600 text-white shadow-sm"
                      : dark
                      ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold ${subtitle}`}>Kafedra bo'yicha</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`}
            >
              <option value="all">Barchasi</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameUz}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold ${subtitle}`}>Tartiblash</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`}
            >
              <option value="name-asc">Nomi bo'yicha (A-Z)</option>
              <option value="name-desc">Nomi bo'yicha (Z-A)</option>
              <option value="total-desc">Jami soat (Kamayish)</option>
              <option value="total-asc">Jami soat (O'sish)</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className={`flex items-center justify-center gap-2 py-10 text-sm ${subtitle}`}>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Yuklanmoqda...
          </div>
        )}

        {!loading && loadError && (
          <div className="py-6 text-center">
            <p className={`text-sm ${subtitle}`}>{loadError}</p>
            <button
              type="button"
              onClick={loadData}
              className={`mt-3 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              Qayta urinish
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm mt-4 min-h-[280px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold w-12 text-center">№</th>
                  <th className="py-3 px-4 font-semibold">Fan Nomi</th>
                  <th className="py-3 px-4 font-semibold">Kafedra</th>
                  <th className="py-3 px-4 font-semibold text-center">Semestr</th>
                  <th className="py-3 px-4 font-semibold text-right">Ma'ruza</th>
                  <th className="py-3 px-4 font-semibold text-right">Amaliy</th>
                  <th className="py-3 px-4 font-semibold text-right">Lab</th>
                  <th className="py-3 px-4 font-semibold text-right">Reyting</th>
                  <th className="py-3 px-4 font-semibold text-right">Seminar</th>
                  <th className="py-3 px-4 font-semibold text-right text-slate-900">Jami</th>
                  <th className="py-3 px-4 font-semibold text-right">Kredit</th>
                  <th className="py-3 px-4 font-semibold text-right">Mustaqil</th>
                  <th className="py-3 px-4 font-semibold text-right text-indigo-600">Umumiy soat</th>
                  <th className="py-3 px-4 font-semibold text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row, index) => {
                  const isBottom = index > 0 && index >= Math.floor(filtered.length / 2);
                  return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-500 font-medium">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{row.nameUz}</td>
                    <td className="py-3 px-4 text-slate-600">{row.departmentName || departmentLabel(row.departmentId)}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{row.semester || "Kuzki semestr"}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.lecture}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.practice}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.lab}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.rating || 0}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.seminar}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800 bg-slate-50/50">{row.total}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.credits}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.independent}</td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-700 bg-indigo-50/20">{(row.total || 0) + (row.independent || 0)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="relative inline-flex">
                        <button
                          type="button"
                          onClick={() => setOpenActionsFor((prev) => (prev === row.id ? null : row.id))}
                          className={`inline-flex items-center justify-center rounded-lg border p-2.5 transition-colors ${
                            dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-300 text-slate-700 hover:bg-slate-100"
                          }`}
                          aria-label="Amallar menyusi"
                          aria-expanded={openActionsFor === row.id}
                        >
                          <SlidersHorizontal className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                        </button>

                        {openActionsFor === row.id && (
                          <div
                            className={`absolute right-0 ${isBottom ? "bottom-full mb-2" : "top-full mt-2"} z-50 min-w-52 rounded-xl border p-1 shadow-lg ${
                              dark ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionsFor(null)
                                openView(row)
                              }}
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                                dark ? "text-blue-400 hover:bg-slate-700/80" : "text-blue-700 hover:bg-blue-50"
                              }`}
                            >
                              <Eye className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                              Ko'rish
                            </button>
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionsFor(null)
                                  openEdit(row)
                                }}
                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                                  dark ? "text-emerald-400 hover:bg-slate-700/80" : "text-emerald-700 hover:bg-emerald-50"
                                }`}
                              >
                                <Pencil className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                                Tahrirlash
                              </button>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionsFor(null)
                                  openDelete(row)
                                }}
                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                                  dark ? "text-red-400 hover:bg-slate-700/80" : "text-red-700 hover:bg-red-50"
                                }`}
                              >
                                <Trash2 className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                                O'chirish
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={14} className="py-8 text-center text-slate-500">
                      Natija topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal.open} onClose={closeModal} dark={dark}>
        {modal.type === "view" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">Fan va Yuklama</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="space-y-4 text-base">
              {busy ? (
                <div className={`flex items-center gap-2 text-sm ${subtitle}`}>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Yuklanmoqda...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="col-span-3">
                      <p className={`text-xs font-semibold ${meta}`}>Fan nomi:</p>
                      <p className="mt-1 font-bold text-slate-900">{modal.row.nameUz}</p>
                    </div>
                    <div className="col-span-3">
                      <p className={`text-xs font-semibold ${meta}`}>Kafedra:</p>
                      <p className="mt-1 font-semibold">{modal.row.departmentName || departmentLabel(modal.row.departmentId)}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${meta}`}>Semestr:</p>
                      <p className="mt-1 font-semibold">{modal.row.semester || "Kuzki semestr"}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${meta}`}>Kredit:</p>
                      <p className="mt-1 font-semibold">{modal.row.credits}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${meta}`}>Umumiy soat:</p>
                      <p className="mt-1 font-bold text-teal-600">{modal.row.total}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Ma'ruza</div>
                      <div className="font-semibold">{modal.row.lecture}</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Amaliy</div>
                      <div className="font-semibold">{modal.row.practice}</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Laboratoriya</div>
                      <div className="font-semibold">{modal.row.lab}</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Reyting</div>
                      <div className="font-semibold">{modal.row.rating || 0}</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Seminar</div>
                      <div className="font-semibold">{modal.row.seminar}</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Mustaqil t.</div>
                      <div className="font-semibold">{modal.row.independent}</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm col-span-3">
                      <div className="text-xs text-slate-500 mb-1">Guruhlar/Talaba</div>
                      <div className="font-semibold">{modal.row.groups} / {modal.row.students}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {modal.type === "edit" && modal.row && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold tracking-tight">Fan va Yuklamani tahrirlash</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-6 w-6 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Semestr</label>
                <select
                  value={editDraft.semester}
                  onChange={(e) => setEditDraft((p) => ({ ...p, semester: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                >
                  <option value="Kuzki semestr">Kuzki semestr</option>
                  <option value="Bahorki semestr">Bahorki semestr</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Kafedra</label>
                {departmentSelect(editDraft.departmentId, (e) => setEditDraft((p) => ({ ...p, departmentId: e.target.value })))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Fan nomi</label>
                <input
                  value={editDraft.nameUz}
                  onChange={(e) => setEditDraft((p) => ({ ...p, nameUz: e.target.value }))}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                />
              </div>
              
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-semibold text-sm mb-2 text-slate-700">Yuklama soatlari</h4>
                {renderWorkloadInputs(editDraft, setEditDraft)}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {isWorkloadInvalid(editDraft) && (
                <div className="w-full text-xs font-semibold text-red-500 mb-2">
                  ⚠️ Ma'ruza + Amaliy + Laboratoriya + Reyting + Seminar soatlari Jami soatdan oshib ketdi!
                </div>
              )}
              <button
                type="button"
                onClick={onSaveEdit}
                disabled={busy || isWorkloadInvalid(editDraft)}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Saqlanmoqda..." : "Saqlash"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className={`flex-1 inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
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
              <h3 className="text-xl font-bold tracking-tight">Fanni o'chirishni tasdiqlaysizmi?</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-6 w-6 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={busy}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "O'chirilmoqda..." : "Ha"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
              >
                Yo'q
              </button>
            </div>
          </div>
        )}

        {modal.type === "create" && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold tracking-tight">Fan qo'shish</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-6 w-6 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Semestr</label>
                <select
                  value={createDraft.semester}
                  onChange={(e) => setCreateDraft((p) => ({ ...p, semester: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                >
                  <option value="Kuzki semestr">Kuzki semestr</option>
                  <option value="Bahorki semestr">Bahorki semestr</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Kafedra</label>
                {departmentSelect(createDraft.departmentId, (e) => setCreateDraft((p) => ({ ...p, departmentId: e.target.value })))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Fan nomi</label>
                <input
                  value={createDraft.nameUz}
                  onChange={(e) => setCreateDraft((p) => ({ ...p, nameUz: e.target.value }))}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                  placeholder="Masalan: Dasturlash asoslari"
                />
              </div>
              
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-semibold text-sm mb-2 text-slate-700">Yuklama soatlari</h4>
                {renderWorkloadInputs(createDraft, setCreateDraft)}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {isWorkloadInvalid(createDraft) && (
                <div className="w-full text-xs font-semibold text-red-500 mb-2">
                  ⚠️ Ma'ruza + Amaliy + Laboratoriya + Reyting + Seminar soatlari Jami soatdan oshib ketdi!
                </div>
              )}
              <button
                type="button"
                onClick={onSaveCreate}
                disabled={busy || isWorkloadInvalid(createDraft)}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Qo'shilmoqda..." : "Qo'shish"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className={`flex-1 inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
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
