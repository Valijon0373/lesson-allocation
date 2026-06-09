import Button from "./Button.jsx"

export default function Navbar({
  activePage,
  onNavigate,
  currentUser,
  logoSrc,
  logoAlt = "Logo",
  userRoleLabel,
  onLogout,
  onOpenLogin,
}) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 shadow-lg shadow-slate-950/40">
      <div className="flex h-[4.25rem] w-full items-center justify-between px-5 sm:h-[4.75rem] sm:px-6 lg:px-10">
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${
                  activePage === "dashboard"
                    ? "bg-white text-indigo-700 shadow-md shadow-slate-900/15"
                    : "border border-white/25 bg-slate-700/50 text-white/90"
                }`}
              >
                Statistika
              </button>
              {currentUser?.role === "expert" && (
              <button
                type="button"
                onClick={() => onNavigate("oqituvchilar")}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${
                  activePage === "oqituvchilar"
                    ? "bg-white text-indigo-700 shadow-md shadow-slate-900/15"
                    : "border border-white/25 bg-slate-700/50 text-white/90"
                }`}
              >
                O'qituvchilar
              </button>
              )}
              {currentUser?.role !== "expert" && (
              <button
                type="button"
                onClick={() => onNavigate("mezonlar")}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${
                  activePage === "mezonlar"
                    ? "bg-white text-indigo-700 shadow-md shadow-slate-900/15"
                    : "border border-white/25 bg-slate-700/50 text-white/90"
                }`}
              >
                Mezonlar
              </button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className="h-14 w-14 rounded-xl bg-white/70 p-1 object-contain shadow-sm sm:h-16 sm:w-16"
                />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-white/20 shadow-inner shadow-white/10 sm:h-16 sm:w-16" />
              )}
              <div className="hidden leading-tight sm:block">
                <p className="text-base font-semibold text-white/95">URSPI</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="text-right text-xs">
                <p className="font-semibold text-white drop-shadow-sm">{currentUser.fullName}</p>
                <p className="text-white/75">{userRoleLabel}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg border border-white/20 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Chiqish
              </button>
            </>
          ) : (
            <Button
              type="button"
              onClick={onOpenLogin}
              style={{ height: "3.25rem", padding: "0 2.25rem", fontSize: "0.95rem" }}
            />
          )}
        </div>
      </div>
    </nav>
  )
}
