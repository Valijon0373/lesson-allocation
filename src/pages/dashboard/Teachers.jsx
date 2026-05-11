import { useRef, useState } from "react"
import { CircleCheck, CircleX, Eye, LockKeyhole, Pencil, Plus, Trash2 } from "lucide-react"

const TEAL_BG = "bg-teal-500"
const FAKULTETLAR = ["Pedagogika", "Filologiya", "Axborot texnologiyalari", "Iqtisodiyot"]
const KAFEDRALAR = ["Matematika", "Ingliz tili", "Informatika", "Buxgalteriya hisobi"]

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

export default function Teachers({ dark }) {
  const [rows, setRows] = useState([
    {
      id: "t-sample-1",
      fakultet: "Filologiya",
      kafedra: "Ingliz tili",
      fio: "Shahnoza Qodirova",
      login: "shahnoza1111",
      password: "teacher123",
    },
    {
      id: "t-sample-2",
      fakultet: "Pedagogika",
      kafedra: "Matematika",
      fio: "Dilshod Karimov",
      login: "dilshod2026",
      password: "teacher234",
    },
    {
      id: "t-sample-3",
      fakultet: "Filologiya",
      kafedra: "Xorijiy tillar va tilshunoslik",
      fio: "Aziza Rahimova",
      login: "aziza_it",
      password: "teacher345",
    },
    {
      id: "t-sample-4",
      fakultet: "Filologiya",
      kafedra: "Ingliz tili",
      fio: "Javohir Sobirov",
      login: "javohir_acc",
      password: "teacher456",
    },
    {
      id: "t-sample-5",
      fakultet: "Filologiya",
      kafedra: "Ingliz tili",
      fio: "Malika Nurmatova",
      login: "malika_eng",
      password: "teacher567",
    },
    {
      id: "t-sample-6",
      fakultet: "Pedagogika",
      kafedra: "Matematika",
      fio: "Sardor Islomov",
      login: "sardor_math",
      password: "teacher678",
    },
  ])
  const [modal, setModal] = useState({
    open: false,
    type: /** @type {null | "view" | "edit" | "credentials" | "delete" | "create"} */ (null),
    row: null,
  })
  const [editDraft, setEditDraft] = useState({
    fakultet: FAKULTETLAR[0],
    kafedra: KAFEDRALAR[0],
    fio: "",
    login: "",
    password: "",
  })
  const [createDraft, setCreateDraft] = useState({
    fakultet: FAKULTETLAR[0],
    kafedra: KAFEDRALAR[0],
    fio: "",
    login: "",
    password: "",
  })
  const [credentialsDraft, setCredentialsDraft] = useState({
    password: "",
  })
  const [searchDraft, setSearchDraft] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [notice, setNotice] = useState({ open: false, message: "", variant: /** @type {"success" | "danger"} */ ("success") })
  const noticeTimeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null))

  const cardBase = dark ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white shadow-sm"
  const subtitle = dark ? "text-slate-400" : "text-slate-500"
  const title = dark ? "text-slate-100" : "text-slate-900"
  const meta = dark ? "text-slate-500" : "text-slate-400"

  const input = dark
    ? "border-slate-600 bg-slate-900/40 text-slate-100 placeholder:text-slate-600"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
  const selectInput = `${input} ${
    dark ? "[&>option]:bg-slate-800 [&>option]:text-slate-100" : "[&>option]:bg-white [&>option]:text-slate-900"
  }`

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

  const openView = (row) => setModal({ open: true, type: "view", row })

  const openEdit = (row) => {
    setEditDraft({
      fakultet: row?.fakultet ?? FAKULTETLAR[0],
      kafedra: row?.kafedra ?? KAFEDRALAR[0],
      fio: row?.fio ?? "",
      login: row?.login ?? "",
      password: row?.password ?? "",
    })
    setModal({ open: true, type: "edit", row })
  }

  const openDelete = (row) => setModal({ open: true, type: "delete", row })

  const openCredentials = (row) => {
    setCredentialsDraft({
      password: row?.password ?? "",
    })
    setModal({ open: true, type: "credentials", row })
  }

  const openCreate = () => {
    setCreateDraft({
      fakultet: FAKULTETLAR[0],
      kafedra: KAFEDRALAR[0],
      fio: "",
      login: "",
      password: "",
    })
    setModal({ open: true, type: "create", row: null })
  }

  const onSaveEdit = () => {
    const row = modal.row
    if (!row?.id) return

    const fio = editDraft.fio.trim()
    const login = editDraft.login.trim()
    const password = editDraft.password.trim()
    if (!fio || !login || !password) return

    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? { ...r, fakultet: editDraft.fakultet, kafedra: editDraft.kafedra, fio, login, password }
          : r
      )
    )
    closeModal()
    showNotice("Muvaffaqiyatli o'zgartirildi")
  }

  const onConfirmDelete = () => {
    const row = modal.row
    if (!row?.id) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    closeModal()
    showNotice("Muvaffaqiyatli o'chirildi", "danger")
  }

  const onSaveCredentials = () => {
    const row = modal.row
    if (!row?.id) return

    const password = credentialsDraft.password.trim()
    if (!password) return

    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, password } : r)))
    closeModal()
    showNotice("Muvaffaqiyatli o'zgartirildi")
  }

  const onSaveCreate = () => {
    const fio = createDraft.fio.trim()
    const login = createDraft.login.trim()
    const password = createDraft.password.trim()
    if (!fio || !login || !password) return

    const newRow = {
      id: `t-${Date.now()}`,
      fakultet: createDraft.fakultet,
      kafedra: createDraft.kafedra,
      fio,
      login,
      password,
    }
    setRows((prev) => [newRow, ...prev])
    closeModal()
    showNotice("Muvaffaqiyatli qo'shildi")
  }

  const filteredRows = rows.filter((row) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return [row.fakultet, row.kafedra, row.fio, row.login].some((value) => value.toLowerCase().includes(q))
  })

  return (
    <div className={`rounded-2xl border ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} p-5 sm:p-6`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`text-xl font-bold tracking-tight ${title}`}>O'qituvchilar</h2>
          <button
            type="button"
            onClick={openCreate}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 ${TEAL_BG}`}
          >
            <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
            Qo'shish
          </button>
        </div>
        <div className="flex w-full flex-nowrap items-center gap-2">
          <input
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="O'qituvchini izlash"
            className={`min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`}
          />
          <button
            type="button"
            onClick={() => setSearchQuery(searchDraft)}
            className={`inline-flex shrink-0 items-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
              dark ? "border-teal-500 text-teal-300 hover:bg-slate-700/70" : "border-teal-600 text-teal-700 hover:bg-teal-50"
            }`}
          >
            Qidirish
          </button>
        </div>

        <div className={`overflow-x-auto rounded-xl border ${cardBase}`}>
          <table className={`min-w-full border-collapse text-sm ${dark ? "border-slate-700" : "border-slate-200"}`}>
            <thead className={dark ? "bg-slate-900/40" : "bg-slate-50"}>
              <tr>
                <th className={`border px-4 py-3 text-left text-sm font-bold ${dark ? "border-slate-700" : "border-slate-200"} ${title}`}>Fakultet</th>
                <th className={`border px-4 py-3 text-left text-sm font-bold ${dark ? "border-slate-700" : "border-slate-200"} ${title}`}>Kafedra</th>
                <th className={`border px-4 py-3 text-left text-sm font-bold ${dark ? "border-slate-700" : "border-slate-200"} ${title}`}>F.I.O</th>
                <th className={`border px-4 py-3 text-left text-sm font-bold ${dark ? "border-slate-700" : "border-slate-200"} ${title}`}>Login</th>
                <th className={`border px-4 py-3 text-right text-sm font-bold ${dark ? "border-slate-700" : "border-slate-200"} ${title}`}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td className={`border px-4 py-3 text-sm ${dark ? "border-slate-700" : "border-slate-200"} ${subtitle}`}>{row.fakultet}</td>
                  <td className={`border px-4 py-3 text-sm ${dark ? "border-slate-700" : "border-slate-200"} ${subtitle}`}>{row.kafedra}</td>
                  <td className={`border px-4 py-3 text-sm font-semibold ${dark ? "border-slate-700" : "border-slate-200"} ${title}`}>{row.fio}</td>
                  <td className={`border px-4 py-3 text-sm ${dark ? "border-slate-700" : "border-slate-200"}`}>
                    <span className={`font-bold ${title}`}>{row.login}</span>
                  </td>
                  <td className={`border px-4 py-3 ${dark ? "border-slate-700" : "border-slate-200"}`}>
                    <div className="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openCredentials(row)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          dark
                            ? "border-amber-500/80 text-amber-400 hover:bg-slate-700/80"
                            : "border-amber-600 text-amber-600 hover:bg-amber-50"
                        }`}
                      >
                        <LockKeyhole className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                        Parolni o'zgartirish
                      </button>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows.length === 0 && (
          <p className={`text-center text-sm ${subtitle}`}>{searchQuery ? "Qidiruv bo'yicha natija topilmadi." : "Hozircha o'qituvchi yo'q."}</p>
        )}
      </div>

      <Modal open={modal.open} onClose={closeModal} dark={dark}>
        {modal.type === "view" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">O'qituvchi ma'lumotlari</h3>
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
              <div><p className={`text-xs font-semibold ${meta}`}>Fakultet:</p><p className="mt-1 font-semibold">{modal.row.fakultet}</p></div>
              <div><p className={`text-xs font-semibold ${meta}`}>Kafedra:</p><p className="mt-1 font-semibold">{modal.row.kafedra}</p></div>
              <div><p className={`text-xs font-semibold ${meta}`}>F.I.O:</p><p className="mt-1 font-semibold">{modal.row.fio}</p></div>
              <div><p className={`text-xs font-semibold ${meta}`}>Login:</p><p className="mt-1 font-semibold">{modal.row.login}</p></div>
              <div><p className={`text-xs font-semibold ${meta}`}>Parol:</p><p className="mt-1 font-semibold">{modal.row.password}</p></div>
              <div><p className={`text-xs font-semibold ${meta}`}>ID:</p><p className="mt-1 font-semibold">{modal.row.id}</p></div>
            </div>
          </div>
        )}

        {modal.type === "edit" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">O'qituvchini tahrirlash</h3>
              <button type="button" onClick={closeModal} aria-label="Yopish" className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}>
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-base font-semibold">Fakultet</label><select value={editDraft.fakultet} onChange={(e) => setEditDraft((p) => ({ ...p, fakultet: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${selectInput}`}>{FAKULTETLAR.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              <div className="space-y-2"><label className="text-base font-semibold">Kafedra</label><select value={editDraft.kafedra} onChange={(e) => setEditDraft((p) => ({ ...p, kafedra: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${selectInput}`}>{KAFEDRALAR.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              <div className="space-y-2"><label className="text-base font-semibold">F.I.O</label><input value={editDraft.fio} onChange={(e) => setEditDraft((p) => ({ ...p, fio: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`} /></div>
              <div className="space-y-2"><label className="text-base font-semibold">Login</label><input value={editDraft.login} onChange={(e) => setEditDraft((p) => ({ ...p, login: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`} /></div>
              <div className="space-y-2"><label className="text-base font-semibold">Parol</label><input type="password" value={editDraft.password} onChange={(e) => setEditDraft((p) => ({ ...p, password: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`} /></div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" onClick={onSaveEdit} className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600">Saqlash</button>
              <button type="button" onClick={closeModal} className={`inline-flex min-w-[11rem] items-center justify-center rounded-full border px-6 py-3 text-base font-bold transition-colors ${dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"}`}>Bekor qilish</button>
            </div>
          </div>
        )}

        {modal.type === "delete" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">O'qituvchini o'chirishni tasdiqlaysizmi?</h3>
              <button type="button" onClick={closeModal} aria-label="Yopish" className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}>
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button type="button" onClick={onConfirmDelete} className="inline-flex min-w-[11rem] items-center justify-center rounded-2xl bg-red-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600">Ha</button>
              <button type="button" onClick={closeModal} className="inline-flex min-w-[11rem] items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600">Yo'q</button>
            </div>
          </div>
        )}

        {modal.type === "credentials" && modal.row && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">Parolini o'zgartirish</h3>
              <button type="button" onClick={closeModal} aria-label="Yopish" className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}>
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-base font-semibold">Login</label>
                <input value={modal.row.login} readOnly className={`w-full rounded-lg border px-4 py-3 text-base ${input}`} />
              </div>
              <div className="space-y-2"><label className="text-base font-semibold">Parol</label><input type="password" value={credentialsDraft.password} onChange={(e) => setCredentialsDraft((p) => ({ ...p, password: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`} placeholder="Yangi parol kiriting" /></div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" onClick={onSaveCredentials} className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600">Saqlash</button>
              <button type="button" onClick={closeModal} className={`inline-flex min-w-[11rem] items-center justify-center rounded-full border px-6 py-3 text-base font-bold transition-colors ${dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"}`}>Bekor qilish</button>
            </div>
          </div>
        )}

        {modal.type === "create" && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">O'qituvchi qo'shish</h3>
              <button type="button" onClick={closeModal} aria-label="Yopish" className={`-mt-2 rounded-lg p-2 transition-colors ${dark ? "hover:bg-slate-700/70" : "hover:bg-slate-100"}`}>
                <CircleX className={`h-7 w-7 ${dark ? "text-white" : "text-slate-900"}`} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-base font-semibold">Fakultet</label><select value={createDraft.fakultet} onChange={(e) => setCreateDraft((p) => ({ ...p, fakultet: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${selectInput}`}>{FAKULTETLAR.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              <div className="space-y-2"><label className="text-base font-semibold">Kafedra</label><select value={createDraft.kafedra} onChange={(e) => setCreateDraft((p) => ({ ...p, kafedra: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${selectInput}`}>{KAFEDRALAR.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              <div className="space-y-2"><label className="text-base font-semibold">F.I.O</label><input value={createDraft.fio} onChange={(e) => setCreateDraft((p) => ({ ...p, fio: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`} placeholder="Masalan:F.I.O" /></div>
              <div className="space-y-2"><label className="text-base font-semibold">Login</label><input value={createDraft.login} onChange={(e) => setCreateDraft((p) => ({ ...p, login: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`} placeholder="Teacher.login" /></div>
              <div className="space-y-2"><label className="text-base font-semibold">Parol</label><input type="password" value={createDraft.password} onChange={(e) => setCreateDraft((p) => ({ ...p, password: e.target.value }))} className={`w-full rounded-lg border px-4 py-3 text-base outline-none ring-teal-500/0 transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${input}`} placeholder="Parol kiriting" /></div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" onClick={onSaveCreate} className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-600">Qo'shish</button>
              <button type="button" onClick={closeModal} className={`inline-flex min-w-[11rem] items-center justify-center rounded-full border px-6 py-3 text-base font-bold transition-colors ${dark ? "border-slate-600 text-slate-200 hover:bg-slate-700/70" : "border-slate-200 text-slate-800 hover:bg-slate-50"}`}>Bekor qilish</button>
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
