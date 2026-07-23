import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CircleCheck, CircleX, Eye, Loader2, Pencil, Plus, Search, Trash2, ArrowUpDown } from "lucide-react"
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
        className={`relative z-10 w-full max-w-lg rounded-2xl border p-6 text-lg shadow-xl ${
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
  const [modal, setModal] = useState({
    open: false,
    type: null,
    row: null,
  })

  const initialDraft = {
    departmentId: "",
    nameUz: "",
    lecture: 0,
    practice: 0,
    lab: 0,
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

  const departmentNames = useMemo(() => {
    const map = {}
    for (const d of departments) map[d.id] = d.nameUz
    return map
  }, [departments])

  const filtered = useMemo(() => {
    const q = searchApplied.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (row) =>
        row.nameUz.toLowerCase().includes(q) ||
        (row.departmentName ?? departmentNames[row.departmentId] ?? "").toLowerCase().includes(q),
    )
  }, [rows, searchApplied, departmentNames])

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
      lecture: row?.lecture ?? 0,
      practice: row?.practice ?? 0,
      lab: row?.lab ?? 0,
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

  const onSaveEdit = async () => {
    const row = modal.row
    if (!row?.id || busy) return
    const nextName = editDraft.nameUz.trim()
    const nextDepartmentId = editDraft.departmentId
    if (!nextName || !nextDepartmentId) return

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

  const renderWorkloadInputs = (draft, setDraft) => (
    <div className="grid grid-cols-2 gap-4 mt-2">
      <div className="space-y-1">
        <label className="text-xs font-semibold">Ma'ruza (soat)</label>
        <input type="number" min="0" value={draft.lecture} onChange={(e) => setDraft(p => ({ ...p, lecture: Number(e.target.value) }))} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold">Amaliy (soat)</label>
        <input type="number" min="0" value={draft.practice} onChange={(e) => setDraft(p => ({ ...p, practice: Number(e.target.value) }))} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold">Laboratoriya (soat)</label>
        <input type="number" min="0" value={draft.lab} onChange={(e) => setDraft(p => ({ ...p, lab: Number(e.target.value) }))} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold">Seminar (soat)</label>
        <input type="number" min="0" value={draft.seminar} onChange={(e) => setDraft(p => ({ ...p, seminar: Number(e.target.value) }))} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold">Mustaqil ta'lim (soat)</label>
        <input type="number" min="0" value={draft.independent} onChange={(e) => setDraft(p => ({ ...p, independent: Number(e.target.value) }))} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold">Kredit</label>
        <input type="number" min="0" value={draft.credits} onChange={(e) => setDraft(p => ({ ...p, credits: Number(e.target.value) }))} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold">Guruhlar soni</label>
        <input type="number" min="0" value={draft.groups} onChange={(e) => setDraft(p => ({ ...p, groups: Number(e.target.value) }))} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold">Talabalar soni</label>
        <input type="number" min="0" value={draft.students} onChange={(e) => setDraft(p => ({ ...p, students: Number(e.target.value) }))} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${input}`} />
      </div>
    </div>
  )

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
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm mt-4">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Fan Nomi</th>
                  <th className="py-3 px-4 font-semibold">Kafedra</th>
                  <th className="py-3 px-4 font-semibold text-right">Ma'ruza</th>
                  <th className="py-3 px-4 font-semibold text-right">Amaliy</th>
                  <th className="py-3 px-4 font-semibold text-right">Lab</th>
                  <th className="py-3 px-4 font-semibold text-right">Seminar</th>
                  <th className="py-3 px-4 font-semibold text-right">Mustaqil</th>
                  <th className="py-3 px-4 font-semibold text-right text-slate-900">Jami</th>
                  <th className="py-3 px-4 font-semibold text-right">Kredit</th>
                  <th className="py-3 px-4 font-semibold text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{row.nameUz}</td>
                    <td className="py-3 px-4 text-slate-600">{row.departmentName || departmentLabel(row.departmentId)}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.lecture}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.practice}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.lab}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.seminar}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.independent}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800 bg-slate-50/50">{row.total}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{row.credits}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openView(row)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Ko'rish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Tahrirlash"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => openDelete(row)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
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
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="col-span-2">
                      <p className={`text-xs font-semibold ${meta}`}>Fan nomi:</p>
                      <p className="mt-1 font-bold text-slate-900">{modal.row.nameUz}</p>
                    </div>
                    <div className="col-span-2">
                      <p className={`text-xs font-semibold ${meta}`}>Kafedra:</p>
                      <p className="mt-1 font-semibold">{modal.row.departmentName || departmentLabel(modal.row.departmentId)}</p>
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
                      <div className="text-xs text-slate-500 mb-1">Seminar</div>
                      <div className="font-semibold">{modal.row.seminar}</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Mustaqil t.</div>
                      <div className="font-semibold">{modal.row.independent}</div>
                    </div>
                    <div className="p-3 border rounded-lg text-center bg-white shadow-sm">
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
              <button
                type="button"
                onClick={onSaveEdit}
                disabled={busy}
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
              <button
                type="button"
                onClick={onSaveCreate}
                disabled={busy}
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
