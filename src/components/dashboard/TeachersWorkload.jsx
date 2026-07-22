import React, { useState, useEffect } from "react"
import { Columns, ArrowUpDown, SlidersHorizontal, Eye, Pencil, Copy, History, Trash2 } from "lucide-react"
import TeacherDetailsModal from "./TeacherDetailsModal"

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

export default function TeachersWorkload() {
  const [openActionId, setOpenActionId] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  useEffect(() => {
    const handleClickOutside = () => setOpenActionId(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 m-6">
      {/* Navbar-like Header */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-800 text-lg">O'qituvchilar yuklamasi</h3>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 shadow-sm">
          <Columns className="w-4 h-4" /> Ustunlar
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
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

      {/* Separate Table Block */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap relative">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 sticky top-0 z-10 shadow-sm backdrop-blur-sm">
              <tr>
              <th className="py-3 px-4 font-medium w-12">#</th>
              <th className="py-3 px-4 font-medium">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                  O'qituvchi <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium">Kafedra</th>
              <th className="py-3 px-4 font-medium">Fanlar</th>
              <th className="py-3 px-4 font-medium text-right">Ma'ruza</th>
              <th className="py-3 px-4 font-medium text-right">Amaliy</th>
              <th className="py-3 px-4 font-medium text-right">Lab</th>
              <th className="py-3 px-4 font-medium text-right">Seminar</th>
              <th className="py-3 px-4 font-medium text-right">Mustaqil</th>
              <th className="py-3 px-4 font-medium text-right">
                <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-slate-700">
                  Jami <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium text-right">Kredit</th>
              <th className="py-3 px-4 font-medium text-right">Guruhlar</th>
              <th className="py-3 px-4 font-medium text-right">Talabalar</th>
              <th className="py-3 px-4 font-medium">Holat</th>
              <th className="py-3 px-4 font-medium text-center">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teachersWorkloadData.map((row, idx) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group relative">
                <td className="py-3 px-4 text-slate-500">{idx + 1}</td>
                <td className="py-3 px-4 font-medium text-slate-800">
                  <div className="max-w-[200px] truncate" title={row.name}>
                    {row.name}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">{row.department}</td>
                <td className="py-3 px-4 text-slate-600">{row.subjects}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.lecture}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.practice}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.lab}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.seminar}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.independent}</td>
                <td className="py-3 px-4 text-right font-medium text-slate-800">{row.total}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.credits}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.groups}</td>
                <td className="py-3 px-4 text-right text-slate-600">{row.students}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenActionId(openActionId === row.id ? null : row.id)
                    }}
                    className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm bg-white"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                  
                  {openActionId === row.id && (
                    <div 
                      className="absolute right-14 top-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        onClick={() => {
                          setSelectedTeacher(row)
                          setOpenActionId(null)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Ko'rish
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors">
                        <Pencil className="w-4 h-4" /> Tahrirlash
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <Copy className="w-4 h-4" /> Nusxalash
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors">
                        <History className="w-4 h-4" /> Tarix
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1 pt-3">
                        <Trash2 className="w-4 h-4" /> O'chirish
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
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
