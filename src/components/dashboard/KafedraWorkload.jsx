import React, { useState, useMemo } from "react"

const initialKafedralar = [
  { name: "Rus tili va adabiyoti", faculty: "Filologiya", semester: "Kuzki semestr", year: "2025-2026", teachers: 8, lecture: 120, practice: 140, lab: 40, total: 300, status: "Me'yorida" },
  { name: "O'zbek tili va adabiyoti", faculty: "Filologiya", semester: "Bahorki semestr", year: "2025-2026", teachers: 10, lecture: 150, practice: 180, lab: 60, total: 390, status: "Me'yorida" },
  { name: "Xorijiy filologiya", faculty: "Filologiya", semester: "Kuzki semestr", year: "2024-2025", teachers: 9, lecture: 130, practice: 160, lab: 50, total: 340, status: "Me'yorida" },
  { name: "Pedagogika va psixologiya", faculty: "Pedagogika", semester: "Kuzki semestr", year: "2025-2026", teachers: 6, lecture: 110, practice: 120, lab: 30, total: 260, status: "Kam yuklangan" },
  { name: "Maktabgacha ta'lim", faculty: "Pedagogika", semester: "Bahorki semestr", year: "2025-2026", teachers: 7, lecture: 120, practice: 130, lab: 30, total: 280, status: "Kam yuklangan" },
  { name: "Matematika va kompyuter texnologiyalari", faculty: "Aniq va tabiiy fanlar", semester: "Kuzki semestr", year: "2025-2026", teachers: 12, lecture: 180, practice: 210, lab: 60, total: 450, status: "Yuklangan" },
  { name: "Tabiiy fanlar", faculty: "Aniq va tabiiy fanlar", semester: "Bahorki semestr", year: "2025-2026", teachers: 8, lecture: 100, practice: 120, lab: 60, total: 280, status: "Me'yorida" },
  { name: "Fizika va astronomiya", faculty: "Aniq va tabiiy fanlar", semester: "Kuzki semestr", year: "2023-2024", teachers: 9, lecture: 110, practice: 130, lab: 80, total: 320, status: "Me'yorida" },
  { name: "Texnologik ta'lim", faculty: "Aniq va tabiiy fanlar", semester: "Bahorki semestr", year: "2024-2025", teachers: 5, lecture: 80, practice: 90, lab: 10, total: 180, status: "Kam yuklangan" },
  { name: "Boshlang'ich ta'lim metodikasi", faculty: "Boshlang'ich ta'lim", semester: "Kuzki semestr", year: "2025-2026", teachers: 10, lecture: 140, practice: 160, lab: 40, total: 340, status: "Me'yorida" },
  { name: "Boshlang'ich ta'lim nazariyasi", faculty: "Boshlang'ich ta'lim", semester: "Bahorki semestr", year: "2025-2026", teachers: 8, lecture: 110, practice: 130, lab: 30, total: 270, status: "Kam yuklangan" },
  { name: "Tarix", faculty: "Ijtimoiy va amaliy fanlar", semester: "Kuzki semestr", year: "2025-2026", teachers: 10, lecture: 160, practice: 180, lab: 10, total: 350, status: "Me'yorida" },
  { name: "Milliy g'oya va falsafa", faculty: "Ijtimoiy va amaliy fanlar", semester: "Bahorki semestr", year: "2024-2025", teachers: 7, lecture: 90, practice: 110, lab: 20, total: 220, status: "Kam yuklangan" },
  { name: "San'atshunoslik", faculty: "Ijtimoiy va amaliy fanlar", semester: "Kuzki semestr", year: "2025-2026", teachers: 6, lecture: 100, practice: 100, lab: 40, total: 240, status: "Kam yuklangan" },
  { name: "Jismoniy madaniyat", faculty: "Ijtimoiy va amaliy fanlar", semester: "Bahorki semestr", year: "2025-2026", teachers: 11, lecture: 150, practice: 190, lab: 80, total: 420, status: "Yuklangan" },
]

export default function KafedraWorkload({ isDark }) {
  const [kafedraFilter, setKafedraFilter] = useState("all")
  const [facultyFilter, setFacultyFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const availableKafedralar = useMemo(() => {
    return [...new Set(initialKafedralar.map(item => item.name))].sort()
  }, [])

  const getStatusColor = (status) => {
    if (isDark) {
      switch (status) {
        case "Yuklangan":
          return "bg-amber-500/15 text-amber-300 border border-amber-500/30"
        case "Me'yorida":
          return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
        case "Kam yuklangan":
          return "bg-rose-500/15 text-rose-300 border border-rose-500/30"
        default:
          return "bg-slate-500/15 text-slate-300 border border-slate-500/30"
      }
    } else {
      switch (status) {
        case "Yuklangan":
          return "bg-amber-50 text-amber-800 border border-amber-200"
        case "Me'yorida":
          return "bg-emerald-50 text-emerald-800 border border-emerald-200"
        case "Kam yuklangan":
          return "bg-rose-50 text-rose-800 border border-rose-200"
        default:
          return "bg-slate-50 text-slate-800 border border-slate-200"
      }
    }
  }

  const filteredData = useMemo(() => {
    return initialKafedralar.filter((item) => {
      const matchesKafedra = kafedraFilter === "all" || item.name === kafedraFilter
      const matchesFaculty = facultyFilter === "all" || item.faculty === facultyFilter
      const matchesSemester = semesterFilter === "all" || item.semester === semesterFilter
      const matchesYear = yearFilter === "all" || item.year === yearFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesKafedra && matchesFaculty && matchesSemester && matchesYear && matchesStatus
    })
  }, [kafedraFilter, facultyFilter, semesterFilter, yearFilter, statusFilter])

  // Sum calculations
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.teachers += curr.teachers
        acc.lecture += curr.lecture
        acc.practice += curr.practice
        acc.lab += curr.lab
        acc.total += curr.total
        return acc
      },
      { teachers: 0, lecture: 0, practice: 0, lab: 0, total: 0 }
    )
  }, [filteredData])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 m-6">
      {/* Title block */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between mb-6 transition-colors duration-300">
        <h3 className="font-semibold text-slate-800 text-lg">Kafedralar dars yuklamasi taqsimoti</h3>
        <span className="text-xs px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
          Jami {filteredData.length} kafedra
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-6 space-y-4 transition-colors duration-300">
        <h4 className="text-sm font-semibold text-slate-700">Saralash va qidiruv</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kafedra</label>
            <select 
              value={kafedraFilter} 
              onChange={(e) => setKafedraFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">Barchasi</option>
              {availableKafedralar.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Fakultet</label>
            <select 
              value={facultyFilter} 
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">Barchasi</option>
              <option value="Filologiya">Filologiya</option>
              <option value="Pedagogika">Pedagogika</option>
              <option value="Aniq va tabiiy fanlar">Aniq va tabiiy fanlar</option>
              <option value="Boshlang'ich ta'lim">Boshlang'ich ta'lim</option>
              <option value="Ijtimoiy va amaliy fanlar">Ijtimoiy va amaliy fanlar</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Semestr</label>
            <select 
              value={semesterFilter} 
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">Barchasi</option>
              <option value="Kuzki semestr">Kuzki semestr</option>
              <option value="Bahorki semestr">Bahorki semestr</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">O'quv yili</label>
            <select 
              value={yearFilter} 
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">Barchasi</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Holati</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">Barchasi</option>
              <option value="Yuklangan">Yuklangan</option>
              <option value="Me'yorida">Me'yorida</option>
              <option value="Kam yuklangan">Kam yuklangan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table block */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[280px] transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap relative">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 sticky top-0 z-10 shadow-sm backdrop-blur-sm">
              <tr>
                <th className="py-3 px-4 font-semibold">Kafedra nomi</th>
                <th className="py-3 px-4 font-semibold">Fakultet</th>
                <th className="py-3 px-4 font-semibold">Semestr</th>
                <th className="py-3 px-4 font-semibold text-center">Yil</th>
                <th className="py-3 px-4 font-semibold text-center">O'qituvchilar</th>
                <th className="py-3 px-4 font-semibold text-right">Ma'ruza</th>
                <th className="py-3 px-4 font-semibold text-right">Amaliy</th>
                <th className="py-3 px-4 font-semibold text-right">Lab</th>
                <th className="py-3 px-4 font-semibold text-right">Jami soat</th>
                <th className="py-3 px-4 font-semibold text-center">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-10 text-center text-slate-500 font-medium">
                    Ma'lumotlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.faculty}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.semester}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{item.year}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{item.teachers}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.lecture}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.practice}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.lab}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">{item.total}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot className="border-t-2 border-slate-200 bg-slate-50/50 font-bold text-slate-800">
                <tr>
                  <td className="py-3.5 px-4" colSpan="4">Jami yig'indi:</td>
                  <td className="py-3.5 px-4 text-center text-indigo-600">{totals.teachers}</td>
                  <td className="py-3.5 px-4 text-right">{totals.lecture}</td>
                  <td className="py-3.5 px-4 text-right">{totals.practice}</td>
                  <td className="py-3.5 px-4 text-right">{totals.lab}</td>
                  <td className="py-3.5 px-4 text-right text-blue-600">{totals.total}</td>
                  <td className="py-3.5 px-4"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
