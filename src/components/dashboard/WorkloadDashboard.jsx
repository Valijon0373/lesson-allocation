import React, { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  RefreshCcw,
  Plus,
  LogOut,
  Users,
  BookOpen,
  Clock,
  Activity,
  Columns,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react"
import { BarChart } from "@mui/x-charts/BarChart"
import { PieChart } from "@mui/x-charts/PieChart"
import { LineChart } from "@mui/x-charts/LineChart"
import FacultyWorkloadCards from "./FacultyWorkloadCards"

export default function WorkloadDashboard({ currentUser, isDark }) {
  const [semester, setSemester] = useState("Kuzki semestr")
  const [activeTab, setActiveTab] = useState(currentUser?.facultyId && currentUser?.role !== "admin" ? "Kafedra" : "Fakultet")

  const facultyNamesById = {
    f1: "Filologiya",
    f2: "Pedagogika",
    f3: "Aniq va tabiiy fanlar",
    f4: "Boshlang'ich ta'lim",
    f5: "Ijtimoiy va amaliy fanlar",
    f6: "Magistratura bo'limi",
  }
  const rawFakultetData = [
    { name: "Filologiya", value: 1248 },
    { name: "Pedagogika", value: 890 },
    { name: "Aniq va tabiiy fanlar", value: 1050 },
    { name: "Ijtimoiy va amaliy fanlar", value: 920 },
    { name: "Boshlang'ich ta'lim", value: 720 },
    { name: "Magistratura bo'limi", value: 450 },
  ]
  const fakultetData = currentUser?.facultyId && currentUser?.role !== "admin"
    ? rawFakultetData.filter((d) => d.name === facultyNamesById[currentUser.facultyId] || d.name.includes(facultyNamesById[currentUser.facultyId]?.split(" ")[0]))
    : rawFakultetData

  const kafedraByFaculty = {
    f1: [
      { name: "Rus tili va\nadabiyoti", value: 340 },
      { name: "O'zbek tili va\nadabiyoti", value: 410 },
      { name: "Xorijiy\nfilologiya", value: 380 },
    ],
    f2: [
      { name: "Pedagogika va\npsixologiya", value: 290 },
      { name: "Maktabgacha\nta'lim", value: 310 },
    ],
    f3: [
      { name: "Matematika va komp.\ntexnologiyalari", value: 180 },
      { name: "Tabiiy fanlar", value: 450 },
      { name: "Fizika va\nastronomiya", value: 280 },
      { name: "Texnologik\nta'lim", value: 320 },
    ],
    f4: [
      { name: "Boshlang'ich ta'lim\nmetodikasi", value: 390 },
      { name: "Boshlang'ich ta'lim\nnazariyasi", value: 250 },
    ],
    f5: [
      { name: "Tarix", value: 270 },
      { name: "Milliy g'oya\nva falsafa", value: 420 },
      { name: "San'atshunoslik", value: 300 },
      { name: "Jismoniy\nmadaniyat", value: 160 },
    ],
    f6: [
      { name: "Magistratura\nmutaxassisliklari", value: 450 },
    ],
  }
  const kafedraData = currentUser?.facultyId && currentUser?.role !== "admin" && kafedraByFaculty[currentUser.facultyId]
    ? kafedraByFaculty[currentUser.facultyId]
    : [
        ...kafedraByFaculty.f1, ...kafedraByFaculty.f2, ...kafedraByFaculty.f3, ...kafedraByFaculty.f4, ...kafedraByFaculty.f5, ...kafedraByFaculty.f6
      ]

  const facultyStats = {
    f1: { teachers: "12", subjects: "35", totalHours: "2,450", avgWorkload: "204", remaining: "65" },
    f2: { teachers: "14", subjects: "42", totalHours: "2,880", avgWorkload: "205", remaining: "60" },
    f3: { teachers: "18", subjects: "48", totalHours: "3,420", avgWorkload: "190", remaining: "95" },
    f4: { teachers: "10", subjects: "28", totalHours: "1,950", avgWorkload: "195", remaining: "45" },
    f5: { teachers: "16", subjects: "44", totalHours: "3,100", avgWorkload: "193", remaining: "85" },
    f6: { teachers: "8", subjects: "18", totalHours: "1,200", avgWorkload: "150", remaining: "35" },
  }
  const myStat = currentUser?.facultyId && currentUser?.role !== "admin" && facultyStats[currentUser.facultyId]
    ? facultyStats[currentUser.facultyId]
    : { teachers: "6", subjects: "21", totalHours: "1,136", avgWorkload: "189", remaining: "420" }

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

  const baseTeachers = [
    { id: 1, name: "Karimov Alisher Akbarovich", department: "Rus tili va adabiyoti", faculty: "f1", subjects: 4, lecture: 72, practice: 48, lab: 36, seminar: 18, independent: 54, total: 228, credits: 18, groups: 6, students: 168, status: "Kam yuklangan" },
    { id: 2, name: "Saidova Nilufar Bahodirovna", department: "O'zbek tili va adabiyoti", faculty: "f1", subjects: 3, lecture: 54, practice: 36, lab: 18, seminar: 12, independent: 48, total: 168, credits: 14, groups: 5, students: 135, status: "Kam yuklangan" },
    { id: 3, name: "Rahimov Davron Choriovich", department: "Matematika va komp. texn.", faculty: "f3", subjects: 5, lecture: 90, practice: 60, lab: 54, seminar: 18, independent: 72, total: 294, credits: 22, groups: 7, students: 195, status: "Kam yuklangan" },
    { id: 4, name: "Yusupova Mohira Dilshodovna", department: "Pedagogika va psixologiya", faculty: "f2", subjects: 2, lecture: 36, practice: 24, lab: 0, seminar: 12, independent: 24, total: 96, credits: 8, groups: 3, students: 75, status: "Kam yuklangan" },
    { id: 5, name: "Toshmatov Bekzod Rustamovich", department: "Tarix", faculty: "f5", subjects: 4, lecture: 64, practice: 48, lab: 24, seminar: 16, independent: 48, total: 200, credits: 16, groups: 5, students: 140, status: "Kam yuklangan" },
    { id: 6, name: "Ergasheva Zulfiya Anvarovna", department: "Boshlang'ich ta'lim metodikasi", faculty: "f4", subjects: 3, lecture: 48, practice: 36, lab: 12, seminar: 18, independent: 36, total: 150, credits: 12, groups: 4, students: 105, status: "Kam yuklangan" },
    { id: 7, name: "Usmonov Qodir Bahodirovich", department: "Magistratura mutaxassisliklari", faculty: "f6", subjects: 2, lecture: 36, practice: 24, lab: 12, seminar: 18, independent: 30, total: 120, credits: 10, groups: 2, students: 45, status: "Kam yuklangan" },
  ]
  const relevantBaseTeachers = currentUser?.facultyId && currentUser?.role !== "admin"
    ? baseTeachers.filter(t => t.faculty === currentUser.facultyId)
    : baseTeachers

  const teachersWorkloadData = Array.from({ length: 40 }, (_, i) => {
    const base = relevantBaseTeachers[i % relevantBaseTeachers.length] || baseTeachers[0]
    return {
      ...base,
      id: i + 1,
      name: i < relevantBaseTeachers.length ? base.name : `${base.name.split(" ")[0]} O'qituvchi ${i + 1}`,
    }
  })

  const oqituvchiData = Array.from({ length: 4 }, (_, i) => {
    const teacher = relevantBaseTeachers[i % relevantBaseTeachers.length]
    let baseName = teacher?.name ? `${teacher.name.split(" ")[0]} ${teacher.name.split(" ")[1]?.charAt(0) || ""}.` : `O'qituvchi`
    // Ensure uniqueness
    if (relevantBaseTeachers.length < 4 && i >= relevantBaseTeachers.length) {
      baseName = `${baseName} (${i + 1})`
    }
    return {
      name: baseName.trim(),
      value: 150 + Math.floor(Math.random() * 100)
    }
  })

  // Mock data for Taqsimot tarixi
  const historyData = [
    {
      teacher: relevantBaseTeachers[0]?.name || "Karimov A.A.",
      field: "Amaliy soatlar",
      oldValue: "24",
      newValue: "30",
      by: "Admin User",
      date: "14 Fev 2026, 15:30",
    },
    {
      teacher: relevantBaseTeachers[1]?.name || "Saidova N.B.",
      field: "O'qituvchi",
      oldValue: "Boshqa O'qituvchi",
      newValue: relevantBaseTeachers[1]?.name || "Saidova N.B.",
      by: "Dekanat",
      date: "10 Fev 2026, 19:15",
    },
  ]

  return (
    <div className={`font-sans p-6 pb-20 transition-colors duration-300 ${isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      <div className="mx-auto w-full space-y-6">

        {/* Tab Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <select className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${isDark ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}>
              <option>2025-2026</option>
            </select>
            <div className={`flex p-1 rounded-lg shadow-sm border transition-colors duration-300 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
              {["Kuzki semestr", "Bahorki semestr"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSemester(s)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    semester === s
                      ? "bg-blue-600 text-white shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            { label: "Jami o'qituvchilar", value: myStat.teachers, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Jami fanlar", value: myStat.subjects, icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Jami soatlar", value: myStat.totalHours, icon: Clock, color: "text-violet-500", bg: "bg-violet-50" },
            { label: "O'rtacha yuklama", value: myStat.avgWorkload, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Qolgan soatlar", value: myStat.remaining, icon: Clock, color: "text-cyan-500", bg: "bg-cyan-50" },
          ].map((stat, idx) => (
            <div key={idx} className={`p-4 rounded-xl border shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-md transition-all duration-300 ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-xs font-medium mb-1 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold transition-colors duration-300 ${isDark ? "text-white" : "text-slate-800"}`}>{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDark
                    ? `bg-slate-700 text-amber-400`
                    : `${stat.bg} ${stat.color}`
                } ${
                  isDark && stat.color.includes("blue") ? "bg-blue-500/10 text-blue-400" : ""
                } ${
                  isDark && stat.color.includes("indigo") ? "bg-indigo-500/10 text-indigo-400" : ""
                } ${
                  isDark && stat.color.includes("violet") ? "bg-violet-500/10 text-violet-400" : ""
                } ${
                  isDark && stat.color.includes("emerald") ? "bg-emerald-500/10 text-emerald-400" : ""
                } ${
                  isDark && stat.color.includes("cyan") ? "bg-cyan-500/10 text-cyan-400" : ""
                } ${
                  isDark && stat.color.includes("amber") ? "bg-amber-500/10 text-amber-400" : ""
                } ${
                  isDark && stat.color.includes("rose") ? "bg-rose-500/10 text-rose-400" : ""
                }`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* Charts & Summary */}
        <div className="flex flex-col gap-6">
          <div className={`p-5 rounded-xl border shadow-sm flex flex-col transition-colors duration-300 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          }`}>
            <h3 className={`font-semibold mb-4 transition-colors duration-300 ${isDark ? "text-white" : "text-slate-800"}`}>Taqqoslash va taqsimot</h3>
            <div className={`flex p-1 rounded-lg mb-4 self-start flex-wrap gap-1 transition-colors duration-300 ${
              isDark ? "bg-slate-900" : "bg-slate-100"
            }`}>
              {["Fakultet", "Kafedra", "O'qituvchi", "Soat turlari", "Dinamika"]
                .map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? isDark
                        ? "bg-slate-800 text-white shadow-sm"
                        : "bg-white text-slate-800 shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className={`flex-1 w-full h-[250px] min-h-[250px] flex items-center justify-center relative overflow-hidden ${isDark ? "dark-chart" : ""}`}>
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

                  /* Dark mode support for MUI Charts */
                  .dark-chart .MuiChartsAxis-line {
                    stroke: #475569 !important;
                  }
                  .dark-chart .MuiChartsAxis-tick {
                    stroke: #475569 !important;
                  }
                  .dark-chart .MuiChartsAxis-tickLabel {
                    fill: #94a3b8 !important;
                  }
                  .dark-chart .MuiChartsLegend-label {
                    fill: #e2e8f0 !important;
                  }
                  .dark-chart .MuiChartsGrid-line {
                    stroke: #334155 !important;
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
                      tickLabelStyle: { fontSize: 10 },
                      colorMap: {
                        type: 'ordinal',
                        colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16']
                      }
                    }]}
                    series={[{ data: kafedraData.map((d) => d.value) }]}
                    height={250}
                    margin={{ top: 10, bottom: 45, left: 40, right: 10 }}
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

        </div>

        {/* Har bir fakultet uchun kafedralar taqsimoti */}
        <FacultyWorkloadCards isDark={isDark} currentUser={currentUser} />

        {/* Taqqoslash tarixi */}
        <div className={`p-5 rounded-xl border shadow-sm transition-colors duration-300 ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
        }`}>
          <h3 className={`font-semibold mb-4 transition-colors duration-300 ${isDark ? "text-white" : "text-slate-800"}`}>Taqqoslash tarixi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className={`border-b transition-colors duration-300 ${isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                  <th className="pb-3 pr-4 font-medium">O'qituvchi</th>
                  <th className="pb-3 pr-4 font-medium">Maydon</th>
                  <th className="pb-3 px-4 font-medium">Eski qiymat</th>
                  <th className="pb-3 px-4 font-medium">Yangi qiymat</th>
                  <th className="pb-3 px-4 font-medium">Kim</th>
                  <th className="pb-3 pl-4 font-medium text-right">Sana</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                {historyData.map((row, i) => (
                  <tr key={i} className={`transition-colors ${isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50/50"}`}>
                    <td className={`py-3 pr-4 font-medium transition-colors ${isDark ? "text-white" : "text-slate-800"}`}>{row.teacher}</td>
                    <td className={`py-3 pr-4 transition-colors ${isDark ? "text-slate-300" : "text-slate-600"}`}>{row.field}</td>
                    <td className={`py-3 px-4 transition-colors ${isDark ? "text-slate-400" : "text-slate-500"}`}>{row.oldValue}</td>
                    <td className={`py-3 px-4 font-medium transition-colors ${isDark ? "text-white" : "text-slate-800"}`}>{row.newValue}</td>
                    <td className={`py-3 px-4 transition-colors ${isDark ? "text-slate-300" : "text-slate-600"}`}>{row.by}</td>
                    <td className={`py-3 pl-4 text-right text-xs transition-colors ${isDark ? "text-slate-400" : "text-slate-500"}`}>{row.date}</td>
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
