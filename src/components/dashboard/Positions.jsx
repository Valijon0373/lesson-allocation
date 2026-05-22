import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CircleCheck, CircleX, Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import {
  deletePosition,
  fetchAllPositions,
  fetchPositionById,
  savePosition,
  updatePosition,
} from "../../api/positions"
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

export default function Positions({ dark, permissions = [], isAdmin = false }) {
  const { canView, canAdd, canEdit, canDelete } = useMemo(
    () => getCrudPermissions(permissions, "position", isAdmin),
    [permissions, isAdmin]
  )
  const [rows, setRows] = useState(/** @type {import("../../api/positions").PositionRow[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [modal, setModal] = useState({
    open: false,
    type: /** @type {null | "view" | "edit" | "delete" | "create"} */ (null),
    row: null,
  })
  const [editDraft, setEditDraft] = useState({ nameUz: "" })
  const [createDraft, setCreateDraft] = useState({ nameUz: "" })
  const [notice, setNotice] = useState({ open: false, message: "", variant: /** @type {"success" | "danger"} */ ("success") })
  const noticeTimeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null))

  const cardBase = dark ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white shadow-sm"
  const subtitle = dark ? "text-slate-400" : "text-slate-500"
  const title = dark ? "text-slate-100" : "text-slate-900"
  const meta = dark ? "text-slate-500" : "text-slate-400"

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

  const loadPositions = useCallback(async () => {
    setLoading(true)
    setLoadError("")
    try {
      const list = await fetchAllPositions()
      setRows(list)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lavozimlarni yuklab bo'lmadi"
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
    loadPositions()
  }, [canView, loadPositions])

  const openView = async (row) => {
    setModal({ open: true, type: "view", row })
    if (!row?.id) return

    setBusy(true)
    try {
      const fresh = await fetchPositionById(row.id)
      setModal({ open: true, type: "view", row: fresh })
    } catch {
      showNotice("Lavozim ma'lumotlarini yuklab bo'lmadi", "danger")
    } finally {
      setBusy(false)
    }
  }

  const openEdit = (row) => {
    setEditDraft({ nameUz: row?.nameUz ?? "" })
    setModal({ open: true, type: "edit", row })
  }

  const openDelete = (row) => setModal({ open: true, type: "delete", row })

  const openCreate = () => {
    setCreateDraft({ nameUz: "" })
    setModal({ open: true, type: "create", row: null })
  }

  const onSaveEdit = async () => {
    const row = modal.row
    if (!row?.id || busy) return
    const nextName = editDraft.nameUz.trim()
    if (!nextName) return

    setBusy(true)
    try {
      const updated = await updatePosition(row.id, { nameUz: nextName })
      setRows((prev) => prev.map((r) => (r.id === row.id ? updated : r)))
      closeModal()
      showNotice("Lavozim tahrirlandi")
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
      await deletePosition(row.id)
      setRows((prev) => prev.filter((r) => r.id !== row.id))
      closeModal()
      showNotice("Lavozim o'chirildi", "danger")
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
    if (!nextName) return

    setBusy(true)
    try {
      await savePosition({ nameUz: nextName })
      await loadPositions()
      closeModal()
      showNotice("Lavozim qo'shildi")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Qo'shib bo'lmadi"
      showNotice(message, "danger")
    } finally {
      setBusy(false)
    }
  }

  if (!canView) {
    return (
      <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} p-8 text-center`}>
        <p className={`text-lg font-semibold ${title}`}>Ruxsat yo'q</p>
        <p className={`mt-2 text-sm ${subtitle}`}>Lavozimlarni ko'rish uchun ruxsat berilmagan.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} p-5 sm:p-6`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`text-xl font-bold tracking-tight ${title}`}>Lavozim</h2>
          {canAdd && (
            <button
              type="button"
              onClick={openCreate}
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 ${TEAL_BG}`}
            >
              <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
              Qo'shish
            </button>
          )}
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
              onClick={loadPositions}
              className={`mt-3 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              Qayta urinish
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <ul className="flex flex-col gap-3">
            {rows.map((row) => (
              <li key={row.id} className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-4 sm:px-5 ${cardBase}`}>
                <div className="min-w-0 flex-1">
                  <p className={`font-bold leading-snug ${title}`}>{row.nameUz}</p>
                  <p className={`mt-1.5 text-xs ${meta}`}>ID: {row.id}</p>
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
                  {canEdit && (
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
                  )}
                  {canDelete && (
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
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && !loadError && rows.length === 0 && (
          <p className={`text-center text-sm ${subtitle}`}>Hozircha lavozim yo'q.</p>
        )}
      </div>

      <Modal open={modal.open} onClose={closeModal} dark={dark}>
        {modal.type === "view" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">Lavozim ma'lumotlari</h3>
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
              {busy ? (
                <div className={`flex items-center gap-2 text-sm ${subtitle}`}>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Yuklanmoqda...
                </div>
              ) : (
                <>
                  <div>
                    <p className={`text-xs font-semibold ${meta}`}>Lavozim nomi:</p>
                    <p className="mt-1 font-semibold">{modal.row.nameUz}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${meta}`}>ID:</p>
                    <p className="mt-1 font-semibold">{modal.row.id}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {modal.type === "edit" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">Lavozimni tahrirlash</h3>
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
                <label className="text-base font-semibold">Lavozim nomi</label>
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
                disabled={busy}
                className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Saqlanmoqda..." : "Saqlash"}
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
              <h3 className="text-2xl font-bold tracking-tight">Lavozimni o'chirishni tasdiqlaysizmi?</h3>
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
                disabled={busy}
                className="inline-flex min-w-[11rem] items-center justify-center rounded-2xl bg-red-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "O'chirilmoqda..." : "Ha"}
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
              <h3 className="text-2xl font-bold tracking-tight">Lavozim qo'shish</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Yopish"
                className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}
              >
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold">Lavozim nomi</label>
              <input
                value={createDraft.nameUz}
                onChange={(e) => setCreateDraft({ nameUz: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
                placeholder="Masalan: Kafedra mudiri"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onSaveCreate}
                disabled={busy}
                className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Qo'shilmoqda..." : "Qo'shish"}
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
