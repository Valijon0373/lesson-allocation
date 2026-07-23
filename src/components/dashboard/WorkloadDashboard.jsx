import React, { useState } from "react"
import {
  Moon,
  RefreshCcw,
  FileText,
  Printer,
  Plus,
  LogOut,
  Users,
  BookOpen,
  Clock,
  Activity,
  AlertTriangle,
  TrendingDown,
  Search,
  Columns,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react"
import { BarChart } from "@mui/x-charts/BarChart"
import { PieChart } from "@mui/x-charts/PieChart"
import { LineChart } from "@mui/x-charts/LineChart"
export default function WorkloadDashboard({ onLogout, currentUser }) {
  const [semester, setSemester] = useState("1-semestr")
  const [activeTab, setActiveTab] = useState("Fakultet")

  const fakultetData = [
    { name: "Filologiya", value: 1248 },
    { name: "Pedagogika", value: 890 },
    { name: "Aniq va tabiiy fanlar", value: 1050 },
    { name: "Ijtimoiy va amaliy", value: 920 },
    { name: "Boshlang'ich ta'lim", value: 720 },
  ]
  const kafedraData = [
    { name: "Rus tili", value: 340 },
    { name: "O'zbek tili", value: 410 },
    { name: "Xorijiy tillar", value: 380 },
    { name: "Ped. nazariyasi", value: 290 },
    { name: "Psixologiya", value: 310 },
    { name: "Maxsus ped.", value: 180 },
    { name: "Mat. va inf.", value: 450 },
    { name: "Fizika", value: 280 },
    { name: "Kimyo va bio.", value: 320 },
    { name: "Tarix", value: 390 },
    { name: "Geografiya", value: 250 },
    { name: "Jis. tarbiya", value: 270 },
    { name: "Boshlang'ich", value: 420 },
    { name: "Maktabgacha", value: 300 },
    { name: "Bolalar rivoj.", value: 160 },
  ]
  const oqituvchiData = [
    { name: "Aliyev A.", value: 180 },
    { name: "Valiyev V.", value: 240 },
    { name: "Ganiyev G.", value: 150 },
    { name: "Botirov B.", value: 290 },
  ]
  const soatTurlariData = [
    { id: 0, value: 45, label: "Ma'ruza" },
    { id: 1, value: 35, label: "Amaliy" },
    { id: 2, value: 15, label: "Seminar" },
    { id: 3, value: 5, label: "Labaratoriya" },
  ]
  const dinamikaData = [
    { month: "Sen", value: 180 },
    { month: "Okt", value: 220 },
    { month: "Noy", value: 240 },
    { month: "Dek", value: 210 },
    { month: "Yan", value: 260 },
    { month: "Fev", value: 280 },
  ]

  // Mock data for Yuklama xulosasi
  const summaryData = [
    {
      level: "Kafedra",
      name: "Mat. va inf. o'qitish metodikasi",
      total: 456,
      average: 228,
      min: 162,
      max: 294,
      diff: 132,
    },
    {
      level: "Fakultet",
      name: "Aniq va tabiiy fanlar",
      total: 1248,
      average: 208,
      min: 96,
      max: 294,
      diff: 198,
    },
    {
      level: "Institut",
      name: "Institut bo'yicha jami",
      total: 2184,
      average: 182,
      min: 96,
      max: 294,
      diff: 198,
    },
  ]

  const baseTeachers = [
    {
      id: 1,
      name: "Karimov Alisher Akbarovich",
      department: "Dasturiy injiniring",
      subjects: 4,
      lecture: 72,
      practice: 48,
      lab: 36,
      seminar: 18,
      independent: 54,
      total: 228,
      credits: 18,
      groups: 6,
      students: 168,
      status: "Kam yuklangan",
    },
    {
      id: 2,
      name: "Saidova Nilufar Bahodirovna",
      department: "Kompyuter fanlari",
      subjects: 3,
      lecture: 54,
      practice: 36,
      lab: 24,
      seminar: 12,
      independent: 42,
      total: 168,
      credits: 14,
      groups: 4,
      students: 112,
      status: "Kam yuklangan",
    },
    {
      id: 3,
      name: "Rahimov Davron Choriovich",
      department: "Dasturiy injiniring",
      subjects: 5,
      lecture: 90,
      practice: 60,
      lab: 48,
      seminar: 24,
      independent: 72,
      total: 294,
      credits: 22,
      groups: 8,
      students: 224,
      status: "Kam yuklangan",
    },
    {
      id: 4,
      name: "Yusupova Mohira Dilshodovna",
      department: "Buxgalteriya hisobi",
      subjects: 2,
      lecture: 36,
      practice: 24,
      lab: 0,
      seminar: 12,
      independent: 24,
      total: 96,
      credits: 8,
      groups: 3,
      students: 84,
      status: "Kam yuklangan",
    },
    {
      id: 5,
      name: "Toshmatov Bekzod Rustamovich",
      department: "Kompyuter fanlari",
      subjects: 4,
      lecture: 64,
      practice: 40,
      lab: 32,
      seminar: 16,
      independent: 48,
      total: 200,
      credits: 16,
      groups: 5,
      students: 140,
      status: "Kam yuklangan",
    },
    {
      id: 6,
      name: "Ergasheva Zulfiya Anvarovna",
      department: "Boshlang'ich ta'lim",
      subjects: 3,
      lecture: 48,
      practice: 36,
      lab: 12,
      seminar: 18,
      independent: 36,
      total: 150,
      credits: 12,
      groups: 4,
      students: 105,
      status: "Kam yuklangan",
    },
  ]

  const teachersWorkloadData = Array.from({ length: 40 }, (_, i) => {
    const base = baseTeachers[i % baseTeachers.length]
    return {
      ...base,
      id: i + 1,
      name: i < 6 ? base.name : `${base.name.split(" ")[0]} O'qituvchi ${i + 1}`,
    }
  })

  // Mock data for Fan taqsimoti
  const allocationData = [
    {
      subject: "Web dasturlash",
      faculty: "Axborot texnologiyalari",
      course: 4,
      group: "SE-401",
      lecture: 30,
      practice: 30,
      lab: 15,
      seminar: 0,
      total: 75,
      teacher: "Karimov A.A.",
      status: "Tasdiqlangan",
    },
    {
      subject: "Ma'lumotlar bazasi",
      faculty: "Axborot texnologiyalari",
      course: 3,
      group: "CS-301",
      lecture: 30,
      practice: 15,
      lab: 30,
      seminar: 0,
      total: 75,
      teacher: "Saidova N.B.",
      status: "Tayinlangan",
    },
    {
      subject: "Algoritmlar",
      faculty: "Axborot texnologiyalari",
      course: 2,
      group: "SE-202",
      lecture: 30,
      practice: 15,
      lab: 15,
      seminar: 15,
      total: 75,
      teacher: "Rahimov D.C.",
      status: "Kutilmoqda",
    },
  ]

  // Mock data for Taqsimot tarixi
  const historyData = [
    {
      teacher: "Karimov A.A.",
      field: "Amaliy soatlar",
      oldValue: "24",
      newValue: "30",
      by: "Admin User",
      date: "14 Fev 2026, 15:30",
    },
    {
      teacher: "Saidova N.B.",
      field: "O'qituvchi",
      oldValue: "Toshmatov B.R.",
      newValue: "Saidova N.B.",
      by: "Dekanat",
      date: "10 Fev 2026, 19:15",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Tasdiqlangan":
        return "bg-green-100 text-green-700"
      case "Tayinlangan":
        return "bg-blue-100 text-blue-700"
      case "Kutilmoqda":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 pb-20">
      <div className="mx-auto w-full space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dars yuklamasi boshqaruvi</h1>
            <p className="text-sm text-slate-500 mt-1">O'qituvchilar soatlari, fan taqsimoti va semestr statistikasi</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">

            <button className="p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
              <Moon className="w-4 h-4 text-slate-600" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
              <RefreshCcw className="w-4 h-4" /> Yangilash
            </button>
            <button className="p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
              <FileText className="w-4 h-4 text-slate-600" />
            </button>
            <button className="p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
              <Printer className="w-4 h-4 text-slate-600" />
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-600/20">
              <Plus className="w-4 h-4" /> Taqsimot yaratish
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-rose-50 text-rose-600 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Chiqish
            </button>
          </div>
        </div>

        {/* Tab Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700">
              <option>2025-2026</option>
            </select>
            <div className="flex p-1 bg-white rounded-lg shadow-sm border border-slate-100">
              {["1-semestr", "2-semestr", "Yozgi semestr"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSemester(s)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    semester === s ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
          {[
            { label: "Jami o'qituvchilar", value: "6", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Jami fanlar", value: "21", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Jami soatlar", value: "1,136", icon: Clock, color: "text-violet-500", bg: "bg-violet-50" },
            { label: "O'rtacha yuklama", value: "189", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Qolgan soatlar", value: "420", icon: Clock, color: "text-cyan-500", bg: "bg-cyan-50" },
            { label: "Yuklangan", value: "0", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Kam yuklangan", value: "6", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-50" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 mb-2">Filtrlar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Fakultet", "Kafedra", "Ta'lim turi", "Ta'lim shakli", "Kurs", "Guruh", "O'qituvchi", "Fan", "Til"].map((filter) => (
              <div key={filter}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{filter}</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 transition-all">
                  <option>Barchasi</option>
                </select>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="O'qituvchi yoki kafedra bo'yicha qidirish..."
              className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>



        {/* Charts & Summary */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-4">Taqqoslash va taqsimot</h3>
            <div className="flex bg-slate-100 p-1 rounded-lg mb-4 self-start flex-wrap gap-1">
              {["Fakultet", "Kafedra", "O'qituvchi", "Soat turlari", "Dinamika"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 w-full h-[250px] min-h-[250px] flex items-center justify-center relative overflow-hidden">
              <style>
                {`
                  .vertical-wipe {
                    animation: verticalWipe 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
                  @keyframes verticalWipe {
                    0% { clip-path: inset(100% 0 -10% 0); opacity: 0; }
                    100% { clip-path: inset(-10% 0 -10% 0); opacity: 1; }
                  }
                  .horizontal-wipe {
                    animation: horizontalWipe 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
                  @keyframes horizontalWipe {
                    0% { clip-path: inset(-10% 100% -10% -10%); opacity: 0; }
                    100% { clip-path: inset(-10% -10% -10% -10%); opacity: 1; }
                  }
                  .fade-scale {
                    animation: fadeScale 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
                  @keyframes fadeScale {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                  }

                  /* Dinamika chizig'i animatsiyasi */
                  .slow-draw {
                    animation: slowDrawWipe 4s ease-out forwards;
                  }
                  @keyframes slowDrawWipe {
                    0% { clip-path: inset(-20% 100% -20% -20%); }
                    100% { clip-path: inset(-20% -20% -20% -20%); }
                  }
                  
                  .MuiChartsGrid-line {
                    stroke-dasharray: 4 4;
                    stroke: #e2e8f0;
                  }
                `}
              </style>

              {activeTab === "Fakultet" && (
                <div className="w-full h-full vertical-wipe">
                  <BarChart
                    xAxis={[{ 
                      scaleType: "band", 
                      data: fakultetData.map((d) => d.name),
                      colorMap: {
                        type: 'ordinal',
                        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']
                      }
                    }]}
                    series={[{ data: fakultetData.map((d) => d.value) }]}
                    height={250}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                  />
                </div>
              )}
              {activeTab === "Kafedra" && (
                <div className="w-full h-full vertical-wipe">
                  <BarChart
                    xAxis={[{ 
                      scaleType: "band", 
                      data: kafedraData.map((d) => d.name),
                      colorMap: {
                        type: 'ordinal',
                        colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16']
                      }
                    }]}
                    series={[{ data: kafedraData.map((d) => d.value) }]}
                    height={250}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                  />
                </div>
              )}
              {activeTab === "O'qituvchi" && (
                <div className="w-full h-full horizontal-wipe">
                  <BarChart
                    layout="horizontal"
                    yAxis={[{ 
                      scaleType: "band", 
                      data: oqituvchiData.map((d) => d.name),
                      colorMap: {
                        type: 'ordinal',
                        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316']
                      }
                    }]}
                    series={[{ data: oqituvchiData.map((d) => d.value) }]}
                    height={250}
                    margin={{ top: 10, bottom: 30, left: 100, right: 10 }}
                  />
                </div>
              )}
              {activeTab === "Soat turlari" && (
                <div className="w-full h-full flex items-center justify-center fade-scale">
                  <PieChart
                    series={[{ data: soatTurlariData, innerRadius: 40, outerRadius: 100, paddingAngle: 2, cornerRadius: 4 }]}
                    height={250}
                    margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  />
                </div>
              )}
              {activeTab === "Dinamika" && (
                <div className="w-full h-full relative slow-draw">
                  <LineChart
                    xAxis={[{ scaleType: "point", data: dinamikaData.map((d) => d.month) }]}
                    yAxis={[{ min: 0, max: 280 }]}
                    series={[{ 
                      data: dinamikaData.map((d) => d.value), 
                      color: "#6366f1", 
                      curve: "monotoneX",
                      showMark: true,
                    }]}
                    height={250}
                    margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
                    grid={{ horizontal: true, vertical: true }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Yuklama xulosasi</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th className="pb-3 pr-4 font-medium">Daraja</th>
                    <th className="pb-3 pr-4 font-medium">Nomi</th>
                    <th className="pb-3 px-2 font-medium text-right">Jami</th>
                    <th className="pb-3 px-2 font-medium text-right">O'rtacha</th>
                    <th className="pb-3 px-2 font-medium text-right">Min</th>
                    <th className="pb-3 px-2 font-medium text-right">Max</th>
                    <th className="pb-3 pl-2 font-medium text-right">Farq</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summaryData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pr-4 text-slate-600">{row.level}</td>
                      <td className="py-3 pr-4 font-medium text-slate-800">{row.name}</td>
                      <td className="py-3 px-2 text-right font-medium text-slate-700">{row.total}</td>
                      <td className="py-3 px-2 text-right text-slate-600">{row.average}</td>
                      <td className="py-3 px-2 text-right text-slate-600">{row.min}</td>
                      <td className="py-3 px-2 text-right text-slate-600">{row.max}</td>
                      <td className="py-3 pl-2 text-right font-medium text-slate-700">{row.diff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fan taqsimoti */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Fan taqsimoti</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Fan</th>
                  <th className="pb-3 pr-4 font-medium">Fakultet</th>
                  <th className="pb-3 px-2 font-medium">Kurs</th>
                  <th className="pb-3 px-2 font-medium">Guruh</th>
                  <th className="pb-3 px-2 font-medium text-right">Ma'ruza</th>
                  <th className="pb-3 px-2 font-medium text-right">Amaliy</th>
                  <th className="pb-3 px-2 font-medium text-right">Lab</th>
                  <th className="pb-3 px-2 font-medium text-right">Seminar</th>
                  <th className="pb-3 px-2 font-medium text-right">Soat</th>
                  <th className="pb-3 px-4 font-medium">O'qituvchi</th>
                  <th className="pb-3 pl-2 font-medium">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allocationData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-800">{row.subject}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.faculty}</td>
                    <td className="py-3 px-2 text-slate-600">{row.course}</td>
                    <td className="py-3 px-2 text-slate-600">{row.group}</td>
                    <td className="py-3 px-2 text-right text-slate-600">{row.lecture}</td>
                    <td className="py-3 px-2 text-right text-slate-600">{row.practice}</td>
                    <td className="py-3 px-2 text-right text-slate-600">{row.lab}</td>
                    <td className="py-3 px-2 text-right text-slate-600">{row.seminar}</td>
                    <td className="py-3 px-2 text-right font-medium text-slate-800">{row.total}</td>
                    <td className="py-3 px-4 text-slate-700">{row.teacher}</td>
                    <td className="py-3 pl-2">
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Taqsimot tarixi */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Taqsimot tarixi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 pr-4 font-medium">O'qituvchi</th>
                  <th className="pb-3 pr-4 font-medium">Maydon</th>
                  <th className="pb-3 px-4 font-medium">Eski qiymat</th>
                  <th className="pb-3 px-4 font-medium">Yangi qiymat</th>
                  <th className="pb-3 px-4 font-medium">Kim</th>
                  <th className="pb-3 pl-4 font-medium text-right">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-800">{row.teacher}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.field}</td>
                    <td className="py-3 px-4 text-slate-500">{row.oldValue}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{row.newValue}</td>
                    <td className="py-3 px-4 text-slate-600">{row.by}</td>
                    <td className="py-3 pl-4 text-slate-500 text-right text-xs">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
