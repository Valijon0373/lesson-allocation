import { useState } from "react"
import { Eye, EyeOff, Loader2, X } from "lucide-react"
import { Link } from "react-router-dom"
import bgVideo from "../../assets/bg.mp4"
import logoImg from "../../assets/logo.jpg"
import { loginAdmin } from "../../api/auth"

export default function AdminLogin({ onSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    const username = form.username.trim()
    const password = form.password
    if (!username || !password) {
      setError("Login va parolni kiriting")
      return
    }

    setBusy(true)
    setError("")
    try {
      await loginAdmin(username, password)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirish amalga oshmadi")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        aria-hidden
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        className="relative z-10 w-full max-w-[420px] rounded-2xl bg-white px-8 pb-8 pt-10 shadow-xl shadow-black/20 ring-1 ring-slate-200/90"
      >
          <Link
            to="/"
            className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Yopish"
          >
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </Link>

          <div className="flex flex-col items-center text-center">
            <img
              src={logoImg}
              alt=""
              className="h-[88px] w-[88px] rounded-full border border-slate-200 object-cover shadow-sm"
            />
            <h1 id="admin-login-title" className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Tizimga Kirish
            </h1>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-1.5 text-left">
              <label htmlFor="admin-login-field" className="block text-sm font-bold text-slate-900">
                Login
              </label>
              <input
                id="admin-login-field"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="Loginni kiriting"
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-blue-500/0 transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="admin-password-field" className="block text-sm font-bold text-slate-900">
                Parol
              </label>
              <div className="relative">
                <input
                  id="admin-password-field"
                  autoComplete="current-password"
                  type={passwordVisible ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Parolni kiriting"
                  className="w-full rounded-md border border-slate-300 py-2.5 pl-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-blue-500/0 transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setPasswordVisible((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label={passwordVisible ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {busy ? "Kutilmoqda..." : "Kirish"}
            </button>
          </form>
      </div>
    </div>
  )
}
