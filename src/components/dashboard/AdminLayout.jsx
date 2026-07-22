import React from "react"
import { LayoutDashboard, Users, BookOpen, Clock } from "lucide-react"
import logoImg from "../../assets/logo.jpg"

export default function AdminLayout({ activeTab, onTabChange, children }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "oqituvchilar", label: "O'qituvchilar", icon: Users },
    { id: "fanlar", label: "Fanlar", icon: BookOpen },
    { id: "soatlar", label: "Soatlar", icon: Clock },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col flex-shrink-0">
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
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
        {children}
      </main>
    </div>
  )
}
