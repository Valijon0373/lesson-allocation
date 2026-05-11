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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/15 bg-white/15 shadow-lg shadow-slate-950/15 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-[4.25rem] w-full items-center justify-between px-5 sm:h-[4.75rem] sm:px-6 lg:px-10">
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold backdrop-blur-sm ${
                  activePage === "dashboard"
                    ? "bg-indigo-600/95 text-white shadow-md shadow-indigo-900/25"
                    : "border border-white/25 bg-white/20 text-white/90 shadow-inner shadow-white/5"
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate("mezonlar")}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold backdrop-blur-sm ${
                  activePage === "mezonlar"
                    ? "bg-indigo-600/95 text-white shadow-md shadow-indigo-900/25"
                    : "border border-white/25 bg-white/20 text-white/90 shadow-inner shadow-white/5"
                }`}
              >
                Mezonlar
              </button>
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
                className="rounded-lg border border-white/20 bg-slate-950/60 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm"
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
