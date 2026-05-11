export default function Users({ dark }) {
  return (
    <div className={`rounded-xl border p-8 text-center ${dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
      <p className={`text-lg font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>Foydalanuvchilar</p>
      <p className={`mt-2 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Bu bo'lim tez orada qo'shiladi.</p>
    </div>
  )
}

