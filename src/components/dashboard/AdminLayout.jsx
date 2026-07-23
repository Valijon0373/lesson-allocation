import React, { useState } from "react"
import { LayoutDashboard, Users, BookOpen, Clock, Moon, Sun, RefreshCcw, LogOut, Columns } from "lucide-react"
import logoImg from "../../assets/logo.jpg"

const RxHamburgerMenu = (props) => (
  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1.5 7.5C1.22386 7.5 1 7.72386 1 8C1 8.27614 1.22386 8.5 1.5 8.5H13.5C13.7761 8.5 14 8.27614 14 8C14 7.72386 13.7761 7.5 13.5 7.5H1.5ZM1.5 12C1.22386 12 1 12.2239 1 12.5C1 12.7761 1.22386 13 1.5 13H13.5C13.7761 13 14 12.7761 14 12.5C14 12.2239 13.7761 12 13.5 12H1.5Z" fill="currentColor"></path>
  </svg>
)

export default function AdminLayout({
  activeTab,
  onTabChange,
  children,
  isDark,
  setIsDark,
  isRefreshing,
  handleRefresh,
  onLogout,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "kafedra-yuklamasi", label: "Kafedra yuklamasi", icon: Columns },
    { id: "oqituvchilar", label: "O'qituvchilar", icon: Users },
    { id: "fanlar", label: "Fanlar", icon: BookOpen },
    { id: "soatlar", label: "Soatlar", icon: Clock },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-100 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${
        isSidebarOpen ? "w-[260px]" : "w-0 border-r-0"
      }`}>
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-10 h-10 rounded-full border border-slate-200" />
          <div>
            <h1 className="font-bold text-slate-800 text-sm">UrSPI</h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider">YUKLAMA TIZIMI</p>
          </div>
        </div>

        <div className="p-4 flex-1">
          <p className="text-[11px] font-bold text-slate-400 mb-4 px-2 tracking-wider">ASOSIY MENU</p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-sm" />}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 border-b transition-colors duration-300 ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 ${
                isDark ? "text-slate-200" : "text-slate-600"
              }`}
              title={isSidebarOpen ? "Menyuni yashirish" : "Menyuni ko'rsatish"}
            >
              <RxHamburgerMenu className="w-7 h-7" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"}`}>Dars yuklamasi boshqaruvi</h1>
              <p className={`text-sm mt-1 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-500"}`}>O'qituvchilar soatlari, fan taqsimoti va semestr statistikasi</p>
            </div>
          </div>

          {/* Top navigation links: Dashboard, Kafedra yuklamasi, O'qituvchilar, Fanlar */}
          <div className={`flex items-center gap-1.5 p-1 rounded-lg transition-colors duration-300 ${
            isDark ? "bg-slate-900" : "bg-slate-100"
          }`}>
            <button
              onClick={() => onTabChange("dashboard")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "dashboard"
                  ? isDark
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-white text-slate-800 shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onTabChange("kafedra-yuklamasi")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "kafedra-yuklamasi"
                  ? isDark
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-white text-slate-800 shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Kafedra yuklamasi
            </button>
            <button
              onClick={() => onTabChange("oqituvchilar")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "oqituvchilar"
                  ? isDark
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-white text-slate-800 shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              O'qituvchilar
            </button>
            <button
              onClick={() => onTabChange("fanlar")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "fanlar"
                  ? isDark
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-white text-slate-800 shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Fanlar
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 border rounded-md transition-colors duration-300 ${
                isDark ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-400" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
              }`}
              title={isDark ? "Yorug' rejim" : "Tungi rejim"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-md transition-colors duration-300 text-sm font-medium ${
                isDark ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} /> {isRefreshing ? "Yangilanmoqda..." : "Yangilash"}
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-md transition-colors text-sm font-medium ${
                  isDark ? "border-slate-700 bg-slate-800 hover:bg-rose-950/40 text-rose-400" : "border-slate-200 bg-white hover:bg-rose-50 text-rose-600"
                }`}
              >
                <LogOut className="w-4 h-4" /> Chiqish
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Children Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
