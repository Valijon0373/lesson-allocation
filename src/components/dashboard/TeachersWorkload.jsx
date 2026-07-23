import React, { useState, useEffect } from "react"
import { Columns, ArrowUpDown, SlidersHorizontal, Eye, Pencil, Copy, History, Trash2 } from "lucide-react"
import TeacherDetailsModal from "./TeacherDetailsModal"

const TbColumns3 = (props) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M3 3m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z"></path>
    <path d="M9 3v18"></path>
    <path d="M15 3v18"></path>
  </svg>
)

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
  const rates = [1.0, 0.75, 0.5, 1.5, 1.25, 0.25]
  return {
    ...base,
    id: i + 1,
    name: i < 6 ? base.name : `${base.name.split(" ")[0]} O'qituvchi ${i + 1}`,
    total: base.lecture + base.practice + base.lab + base.seminar,
    rate: rates[i % rates.length],
  }
})

export default function TeachersWorkload() {
  const [openActionId, setOpenActionId] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isColumnsDropdownOpen, setIsColumnsDropdownOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    oqituvchi: true,
    kafedra: true,
    rate: true,
    fanlar: true,
    maruza: true,
    amaliy: true,
    lab: true,
    seminar: true,
    mustaqil: true,
    jami: true,
    reyting: true,
    guruhlar: true,
    talabalar: true,
    holat: true,
  })

  const columnsList = [
    { id: "oqituvchi", label: "O'qituvchi" },
    { id: "kafedra", label: "Kafedra" },
    { id: "rate", label: "Ish stavkasi" },
    { id: "fanlar", label: "Fanlar" },
    { id: "maruza", label: "Ma'ruza" },
    { id: "amaliy", label: "Amaliy" },
    { id: "lab", label: "Lab" },
    { id: "seminar", label: "Seminar" },
    { id: "jami", label: "Jami" },
    { id: "mustaqil", label: "Mustaqil" },
    { id: "reyting", label: "Reyting" },
    { id: "guruhlar", label: "Guruhlar" },
    { id: "talabalar", label: "Talabalar" },
    { id: "holat", label: "Holat" },
  ]

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionId(null)
      setIsColumnsDropdownOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 m-6">
      {/* Combined Header and Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 text-lg">O'qituvchilar yuklamasi</h3>
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsColumnsDropdownOpen(!isColumnsDropdownOpen)
              }}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 shadow-sm"
            >
              <TbColumns3 className="w-4 h-4" /> Ustunlar
            </button>
            
            {isColumnsDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-[420px] rounded-xl border border-slate-150 bg-white shadow-lg p-4.5 z-50 transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-[10px] font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">Ustunlarni sozlash</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  {columnsList.map((col) => (
                    <label 
                      key={col.id}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition-colors"
                    >
                      <input 
                        type="checkbox"
                        checked={visibleColumns[col.id]}
                        onChange={() => setVisibleColumns(prev => ({
                          ...prev,
                          [col.id]: !prev[col.id]
                        }))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                      />
                      <span className="truncate">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 my-4 dark:border-slate-700"></div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <select className="w-full sm:w-auto flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white">
            <option>Barcha fakultetlar</option>
            <option>Filologiya</option>
            <option>Pedagogika</option>
            <option>Aniq va tabiiy fanlar</option>
            <option>Ijtimoiy va amaliy</option>
            <option>Boshlang'ich ta'lim</option>
          </select>
          <select className="w-full sm:w-auto flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white">
            <option>Barcha kafedralar</option>
            <option>Rus tili</option>
            <option>O'zbek tili</option>
            <option>Xorijiy tillar</option>
            <option>Matematika</option>
            <option>Informatika</option>
          </select>
          <input 
            type="text" 
            placeholder="O'qituvchini izlash" 
            className="w-full sm:w-auto flex-[2] border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors"
          />
          <button className="w-full sm:w-auto px-6 py-2 border border-teal-500 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors text-sm">
            Qidirish
          </button>
        </div>
      </div>

      {/* Separate Table Block */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[280px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap relative">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 sticky top-0 z-10 shadow-sm backdrop-blur-sm">
              <tr>
                <th className="py-3 px-4 font-medium w-12">#</th>
                {visibleColumns.oqituvchi && (
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                      O'qituvchi <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                )}
                {visibleColumns.kafedra && <th className="py-3 px-4 font-medium">Kafedra</th>}
                {visibleColumns.rate && <th className="py-3 px-4 font-medium text-center">Ish stavkasi</th>}
                {visibleColumns.fanlar && <th className="py-3 px-4 font-medium">Fanlar</th>}
                {visibleColumns.maruza && <th className="py-3 px-4 font-medium text-right">Ma'ruza</th>}
                {visibleColumns.amaliy && <th className="py-3 px-4 font-medium text-right">Amaliy</th>}
                {visibleColumns.lab && <th className="py-3 px-4 font-medium text-right">Lab</th>}
                {visibleColumns.seminar && <th className="py-3 px-4 font-medium text-right">Seminar</th>}
                {visibleColumns.jami && (
                  <th className="py-3 px-4 font-medium text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-slate-700">
                      Jami <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                )}
                {visibleColumns.mustaqil && <th className="py-3 px-4 font-medium text-right">Mustaqil</th>}
                {visibleColumns.reyting && <th className="py-3 px-4 font-medium text-right">Reyting</th>}
                {visibleColumns.guruhlar && <th className="py-3 px-4 font-medium text-right">Guruhlar</th>}
                {visibleColumns.talabalar && <th className="py-3 px-4 font-medium text-right">Talabalar</th>}
                {visibleColumns.holat && <th className="py-3 px-4 font-medium">Holat</th>}
                <th className="py-3 px-4 font-medium text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachersWorkloadData.map((row, idx) => {
                const isBottom = idx > 0 && idx >= Math.floor(teachersWorkloadData.length / 2);
                return (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group relative">
                  <td className="py-3 px-4 text-slate-500">{idx + 1}</td>
                  {visibleColumns.oqituvchi && (
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <div className="max-w-[200px] truncate" title={row.name}>
                        {row.name}
                      </div>
                    </td>
                  )}
                  {visibleColumns.kafedra && <td className="py-3 px-4 text-slate-600">{row.department}</td>}
                  {visibleColumns.rate && (
                    <td className="py-3 px-4 text-center text-sm font-semibold text-slate-600">
                      {row.rate.toFixed(2)}
                    </td>
                  )}
                  {visibleColumns.fanlar && <td className="py-3 px-4 text-slate-600">{row.subjects}</td>}
                  {visibleColumns.maruza && <td className="py-3 px-4 text-right text-slate-600">{row.lecture}</td>}
                  {visibleColumns.amaliy && <td className="py-3 px-4 text-right text-slate-600">{row.practice}</td>}
                  {visibleColumns.lab && <td className="py-3 px-4 text-right text-slate-600">{row.lab}</td>}
                  {visibleColumns.seminar && <td className="py-3 px-4 text-right text-slate-600">{row.seminar}</td>}
                  {visibleColumns.jami && <td className="py-3 px-4 text-right font-medium text-slate-800">{row.total}</td>}
                  {visibleColumns.mustaqil && <td className="py-3 px-4 text-right text-slate-600">{row.independent}</td>}
                  {visibleColumns.reyting && (
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold dark:text-amber-400">
                        {Math.min(5.0, (3.5 + (row.students / 250) * 1.0 + (row.total / 300) * 0.5)).toFixed(1)} ★
                      </span>
                    </td>
                  )}
                  {visibleColumns.guruhlar && <td className="py-3 px-4 text-right text-slate-600">{row.groups}</td>}
                  {visibleColumns.talabalar && <td className="py-3 px-4 text-right text-slate-600">{row.students}</td>}
                  {visibleColumns.holat && (
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        {row.status}
                      </span>
                    </td>
                  )}
                <td className="py-3 px-4 text-center">
                  <div className="relative inline-flex">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenActionId(openActionId === row.id ? null : row.id)
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2.5 text-slate-700 hover:text-slate-800 hover:bg-slate-100 transition-colors shadow-sm bg-white"
                      aria-label="Amallar menyusi"
                    >
                      <SlidersHorizontal className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                    </button>
                    
                    {openActionId === row.id && (
                      <div 
                        className={`absolute right-0 ${isBottom ? "bottom-full mb-2" : "top-full mt-2"} z-50 min-w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={() => {
                            setSelectedTeacher(row)
                            setOpenActionId(null)
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden /> Ko'rish
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors">
                          <Pencil className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden /> Tahrirlash
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors">
                          <Copy className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden /> Nusxalash
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors">
                          <History className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden /> Tarix
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden /> O'chirish
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        </div>
      </div>
      
      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <TeacherDetailsModal 
          teacher={selectedTeacher} 
          onClose={() => setSelectedTeacher(null)} 
        />
      )}
    </div>
  )
}
