import React, { useState, useMemo } from "react"

const initialKafedralar = [
  { name: "Rus tili va adabiyoti", faculty: "Filologiya", semester: "Kuzki semestr", subjectName: "Rus tili grammatikasi", lecture: 100, practice: 80, lab: 40, rating: 30, seminar: 50, total: 300, independent: 80, status: "Taqsimlangan" },
  { name: "O'zbek tili va adabiyoti", faculty: "Filologiya", semester: "Bahorki semestr", subjectName: "Hozirgi o'zbek adabiyoti", lecture: 120, practice: 100, lab: 60, rating: 40, seminar: 70, total: 390, independent: 100, status: "To'liq taqsimlanmagan" },
  { name: "Xorijiy filologiya", faculty: "Filologiya", semester: "Kuzki semestr", subjectName: "Ingliz tili fonetikasi", lecture: 110, practice: 90, lab: 50, rating: 35, seminar: 55, total: 340, independent: 90, status: "Taqsimlanmagan" },
  { name: "Pedagogika va psixologiya", faculty: "Pedagogika", semester: "Kuzki semestr", subjectName: "Umumiy pedagogika", lecture: 80, practice: 70, lab: 30, rating: 30, seminar: 50, total: 260, independent: 70, status: "Taqsimlangan" },
  { name: "Maktabgacha ta'lim", faculty: "Pedagogika", semester: "Bahorki semestr", subjectName: "Bolalar psixologiyasi", lecture: 90, practice: 80, lab: 30, rating: 30, seminar: 50, total: 280, independent: 75, status: "To'liq taqsimlanmagan" },
  { name: "Matematika va kompyuter texnologiyalari", faculty: "Aniq va tabiiy fanlar", semester: "Kuzki semestr", subjectName: "Oliy matematika", lecture: 150, practice: 120, lab: 60, rating: 45, seminar: 75, total: 450, independent: 120, status: "Taqsimlanmagan" },
  { name: "Tabiiy fanlar", faculty: "Aniq va tabiiy fanlar", semester: "Bahorki semestr", subjectName: "Ekologiya asoslari", lecture: 90, practice: 80, lab: 30, rating: 30, seminar: 50, total: 280, independent: 80, status: "Taqsimlangan" },
  { name: "Fizika va astronomiya", faculty: "Aniq va tabiiy fanlar", semester: "Kuzki semestr", subjectName: "Kvant fizikasi", lecture: 100, practice: 90, lab: 50, rating: 30, seminar: 50, total: 320, independent: 90, status: "To'liq taqsimlanmagan" },
  { name: "Texnologik ta'lim", faculty: "Aniq va tabiiy fanlar", semester: "Bahorki semestr", subjectName: "Chizmachilik", lecture: 60, practice: 50, lab: 10, rating: 20, seminar: 40, total: 180, independent: 50, status: "Taqsimlanmagan" },
  { name: "Boshlang'ich ta'lim metodikasi", faculty: "Boshlang'ich ta'lim", semester: "Kuzki semestr", subjectName: "O'qish metodikasi", lecture: 110, practice: 90, lab: 40, rating: 40, seminar: 60, total: 340, independent: 90, status: "Taqsimlangan" },
  { name: "Boshlang'ich ta'lim nazariyasi", faculty: "Boshlang'ich ta'lim", semester: "Bahorki semestr", subjectName: "Pedagogik nazariya", lecture: 90, practice: 80, lab: 30, rating: 20, seminar: 50, total: 270, independent: 70, status: "To'liq taqsimlanmagan" },
  { name: "Tarix", faculty: "Ijtimoiy va amaliy fanlar", semester: "Kuzki semestr", subjectName: "O'zbekiston tarixi", lecture: 120, practice: 100, lab: 10, rating: 40, seminar: 80, total: 350, independent: 95, status: "Taqsimlanmagan" },
  { name: "Milliy g'oya va falsafa", faculty: "Ijtimoiy va amaliy fanlar", semester: "Bahorki semestr", subjectName: "Falsafa asoslari", lecture: 70, practice: 60, lab: 20, rating: 20, seminar: 50, total: 220, independent: 60, status: "Taqsimlangan" },
  { name: "San'atshunoslik", faculty: "Ijtimoiy va amaliy fanlar", semester: "Kuzki semestr", subjectName: "Tasviriy san'at", lecture: 80, practice: 70, lab: 40, rating: 20, seminar: 30, total: 240, independent: 65, status: "To'liq taqsimlanmagan" },
  { name: "Jismoniy madaniyat", faculty: "Ijtimoiy va amaliy fanlar", semester: "Bahorki semestr", subjectName: "Sport o'yinlari", lecture: 140, practice: 120, lab: 60, rating: 40, seminar: 60, total: 420, independent: 110, status: "Taqsimlanmagan" },
]

const mockTeachers = [
  { id: 1, name: "Karimov Alisher Akbarovich", department: "Dasturiy injiniring", status: "Kam yuklangan", total: 228 },
  { id: 2, name: "Saidova Nilufar Bahodirovna", department: "Kompyuter fanlari", status: "Kam yuklangan", total: 168 },
  { id: 3, name: "Rahimov Davron Choriovich", department: "Dasturiy injiniring", status: "Kam yuklangan", total: 294 },
  { id: 4, name: "Yusupova Mohira Dilshodovna", department: "Buxgalteriya hisobi", status: "Kam yuklangan", total: 96 },
  { id: 5, name: "Toshmatov Bekzod Rustamovich", department: "Kompyuter fanlari", status: "Kam yuklangan", total: 200 },
  { id: 6, name: "Ergasheva Zulfiya Anvarovna", department: "Boshlang'ich ta'lim", status: "Kam yuklangan", total: 150 },
];

export default function KafedraWorkload({ isDark }) {
  const [kafedralar, setKafedralar] = useState(() => 
    initialKafedralar.map(item => {
      let allocated = { lecture: 0, practice: 0, lab: 0, rating: 0, seminar: 0 };
      if (item.status === "Taqsimlangan") {
        allocated = {
          lecture: item.lecture,
          practice: item.practice,
          lab: item.lab,
          rating: item.rating || 0,
          seminar: item.seminar || 0
        };
      } else if (item.status === "To'liq taqsimlanmagan") {
        allocated = {
          lecture: Math.floor(item.lecture / 2),
          practice: Math.floor(item.practice / 2),
          lab: Math.floor(item.lab / 2),
          rating: Math.floor((item.rating || 0) / 2),
          seminar: Math.floor((item.seminar || 0) / 2)
        };
      }
      return { ...item, allocated };
    })
  )
  const [kafedraFilter, setKafedraFilter] = useState("all")
  const [facultyFilter, setFacultyFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal and allocation states
  const [selectedWorkload, setSelectedWorkload] = useState(null)
  const [isTaqsimlashOpen, setIsTaqsimlashOpen] = useState(false)
  const [teacherSearch, setTeacherSearch] = useState("")
  const [assignToast, setAssignToast] = useState(null)
  const [selectedTeacherToAssign, setSelectedTeacherToAssign] = useState(null)
  const [assignHours, setAssignHours] = useState({ lecture: 0, practice: 0, lab: 0, rating: 0, seminar: 0 })

  const availableKafedralar = useMemo(() => {
    return [...new Set(kafedralar.map(item => item.name))].sort()
  }, [kafedralar])

  const getStatusColor = (status) => {
    if (isDark) {
      switch (status) {
        case "Taqsimlanmagan":
          return "bg-rose-500/25 text-rose-200 border border-rose-500/40"
        case "To'liq taqsimlanmagan":
          return "bg-amber-500/25 text-amber-200 border border-amber-500/40"
        case "Taqsimlangan":
          return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
        default:
          return "bg-slate-500/15 text-slate-300 border border-slate-500/30"
      }
    } else {
      switch (status) {
        case "Taqsimlanmagan":
          return "bg-red-100 text-red-900 border border-red-300"
        case "To'liq taqsimlanmagan":
          return "bg-amber-100 text-amber-900 border border-amber-300"
        case "Taqsimlangan":
          return "bg-emerald-50 text-emerald-850 border border-emerald-200"
        default:
          return "bg-slate-50 text-slate-800 border border-slate-200"
      }
    }
  }

  const filteredData = useMemo(() => {
    return kafedralar.filter((item) => {
      const matchesKafedra = kafedraFilter === "all" || item.name === kafedraFilter
      const matchesFaculty = facultyFilter === "all" || item.faculty === facultyFilter
      const matchesSemester = semesterFilter === "all" || item.semester === semesterFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesKafedra && matchesFaculty && matchesSemester && matchesStatus
    })
  }, [kafedralar, kafedraFilter, facultyFilter, semesterFilter, statusFilter])

  const filteredTeachers = useMemo(() => {
    return mockTeachers.filter(t => 
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.department.toLowerCase().includes(teacherSearch.toLowerCase())
    );
  }, [teacherSearch]);

  const handleAssignTeacherClick = (teacher) => {
    setSelectedTeacherToAssign(teacher);
    setAssignHours({
      lecture: selectedWorkload.lecture - selectedWorkload.allocated.lecture,
      practice: selectedWorkload.practice - selectedWorkload.allocated.practice,
      lab: selectedWorkload.lab - selectedWorkload.allocated.lab,
      rating: (selectedWorkload.rating || 0) - (selectedWorkload.allocated.rating || 0),
      seminar: (selectedWorkload.seminar || 0) - (selectedWorkload.allocated.seminar || 0)
    });
  };

  const handleAssignHoursChange = (field, value) => {
    const num = Math.max(0, Number(value) || 0);
    const maxVal = selectedWorkload[field] - selectedWorkload.allocated[field];
    setAssignHours(prev => ({
      ...prev,
      [field]: num > maxVal ? maxVal : num
    }));
  };

  const submitAssignment = () => {
    setKafedralar(prev => prev.map(item => {
      if (item.subjectName === selectedWorkload.subjectName && item.name === selectedWorkload.name) {
        const nextAllocated = {
          lecture: item.allocated.lecture + assignHours.lecture,
          practice: item.allocated.practice + assignHours.practice,
          lab: item.allocated.lab + assignHours.lab,
          rating: item.allocated.rating + assignHours.rating,
          seminar: item.allocated.seminar + assignHours.seminar
        };

        const totalHours = item.lecture + item.practice + item.lab + (item.rating || 0) + (item.seminar || 0);
        const allocatedSum = nextAllocated.lecture + nextAllocated.practice + nextAllocated.lab + nextAllocated.rating + nextAllocated.seminar;

        let status = "Taqsimlanmagan";
        if (allocatedSum === totalHours) {
          status = "Taqsimlangan";
        } else if (allocatedSum > 0) {
          status = "To'liq taqsimlanmagan";
        }

        return {
          ...item,
          allocated: nextAllocated,
          status
        };
      }
      return item;
    }));

    setAssignToast(`"${selectedWorkload.subjectName}" fani soatlari ${selectedTeacherToAssign.name}ga muvaffaqiyatli biriktirildi!`);
    setSelectedWorkload(null);
    setSelectedTeacherToAssign(null);
    setIsTaqsimlashOpen(false);
    setTimeout(() => {
      setAssignToast(null);
    }, 4000);
  };

  // Sum calculations
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.lecture += curr.lecture
        acc.practice += curr.practice
        acc.lab += curr.lab
        acc.rating += curr.rating || 0
        acc.seminar += curr.seminar || 0
        acc.total += curr.total
        acc.independent += curr.independent
        return acc
      },
      { lecture: 0, practice: 0, lab: 0, rating: 0, seminar: 0, total: 0, independent: 0 }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
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
            <label className="block text-xs font-medium text-slate-500 mb-1">Holati</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">Barchasi</option>
              <option value="Taqsimlanmagan">Taqsimlanmagan</option>
              <option value="To'liq taqsimlanmagan">To'liq taqsimlanmagan</option>
              <option value="Taqsimlangan">Taqsimlangan</option>
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
                <th className="py-3 px-4 font-semibold">Fan nomi</th>
                <th className="py-3 px-4 font-semibold text-right">Ma'ruza</th>
                <th className="py-3 px-4 font-semibold text-right">Seminar</th>
                <th className="py-3 px-4 font-semibold text-right">Amaliy</th>
                <th className="py-3 px-4 font-semibold text-right">Lab</th>
                <th className="py-3 px-4 font-semibold text-right">Rayting soat</th>
                <th className="py-3 px-4 font-semibold text-right text-slate-900">Jami soat</th>
                <th className="py-3 px-4 font-semibold text-right">Mustaqil</th>
                <th className="py-3 px-4 font-semibold text-center">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="12" className="py-10 text-center text-slate-500 font-medium">
                    Ma'lumotlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredData.map((item, i) => (
                  <tr
                    key={i}
                    className={`transition-colors ${
                      item.status === "Taqsimlanmagan"
                        ? isDark
                          ? "bg-rose-900/30 text-rose-100 hover:bg-rose-900/40"
                          : "bg-red-100 text-red-950 hover:bg-red-200/60"
                        : item.status === "To'liq taqsimlanmagan"
                        ? isDark
                          ? "bg-amber-900/30 text-amber-100 hover:bg-amber-900/40"
                          : "bg-amber-100 text-amber-950 hover:bg-amber-200/60"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.faculty}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.semester}</td>
                    <td 
                      onClick={() => {
                        setSelectedWorkload(item);
                        setIsTaqsimlashOpen(false);
                        setTeacherSearch("");
                      }}
                      className="py-3.5 px-4 font-semibold text-indigo-650 dark:text-indigo-400 hover:underline hover:text-indigo-850 cursor-pointer whitespace-normal max-w-xs transition-colors duration-200"
                    >
                      {item.subjectName}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.lecture}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.seminar || 0}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.practice}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.lab}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.rating || 0}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800 bg-slate-50/30">{item.total}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{item.independent}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md text-center leading-tight ${getStatusColor(item.status)}`}>
                        {item.status === "To'liq taqsimlanmagan" ? (
                          <>
                            To'liq<br />taqsimlanmagan
                          </>
                        ) : (
                          item.status
                        )}
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
                  <td className="py-3.5 px-4 text-right">{totals.lecture}</td>
                  <td className="py-3.5 px-4 text-right">{totals.seminar}</td>
                  <td className="py-3.5 px-4 text-right">{totals.practice}</td>
                  <td className="py-3.5 px-4 text-right">{totals.lab}</td>
                  <td className="py-3.5 px-4 text-right">{totals.rating}</td>
                  <td className="py-3.5 px-4 text-right text-blue-600">{totals.total}</td>
                  <td className="py-3.5 px-4 text-right text-slate-800">{totals.independent}</td>
                  <td className="py-3.5 px-4"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modal dialog block */}
      {selectedWorkload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col w-full max-w-[95vw] h-[90vh] max-h-[90vh]">
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {/* Left Side: Subject Workload Details */}
              <div className={`p-6 flex-1 flex flex-col justify-between overflow-y-auto h-full ${isTaqsimlashOpen ? "border-r border-slate-100" : ""}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {selectedWorkload.semester}
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedWorkload(null);
                        setIsTaqsimlashOpen(false);
                      }}
                      className="text-slate-400 hover:text-slate-650 text-base font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">
                    {selectedWorkload.subjectName}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Fakultet: <span className="font-semibold text-slate-700">{selectedWorkload.faculty}</span> • Kafedra: <span className="font-semibold text-slate-700">{selectedWorkload.name}</span>
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Ma'ruza */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 flex flex-col justify-center items-center text-center shadow-xs hover:border-indigo-200 hover:shadow-xs transition-all duration-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ma'ruza</span>
                      <span className="text-lg font-extrabold text-slate-800">{selectedWorkload.lecture} soat</span>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1">Mavjud: {selectedWorkload.lecture - selectedWorkload.allocated.lecture} soat</span>
                    </div>

                    {/* Seminar */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 flex flex-col justify-center items-center text-center shadow-xs hover:border-indigo-200 hover:shadow-xs transition-all duration-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seminar</span>
                      <span className="text-lg font-extrabold text-slate-800">{selectedWorkload.seminar || 0} soat</span>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1">Mavjud: {(selectedWorkload.seminar || 0) - (selectedWorkload.allocated.seminar || 0)} soat</span>
                    </div>

                    {/* Laboratoriya */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 flex flex-col justify-center items-center text-center shadow-xs hover:border-indigo-200 hover:shadow-xs transition-all duration-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Laboratoriya</span>
                      <span className="text-lg font-extrabold text-slate-800">{selectedWorkload.lab} soat</span>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1">Mavjud: {selectedWorkload.lab - selectedWorkload.allocated.lab} soat</span>
                    </div>

                    {/* Amaliy */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 flex flex-col justify-center items-center text-center shadow-xs hover:border-indigo-200 hover:shadow-xs transition-all duration-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amaliy</span>
                      <span className="text-lg font-extrabold text-slate-800">{selectedWorkload.practice} soat</span>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1">Mavjud: {selectedWorkload.practice - selectedWorkload.allocated.practice} soat</span>
                    </div>

                    {/* Reyting */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 flex flex-col justify-center items-center text-center shadow-xs hover:border-indigo-200 hover:shadow-xs transition-all duration-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reyting</span>
                      <span className="text-lg font-extrabold text-slate-800">{selectedWorkload.rating || 0} soat</span>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1">Mavjud: {(selectedWorkload.rating || 0) - (selectedWorkload.allocated.rating || 0)} soat</span>
                    </div>

                    {/* Jami soat */}
                    <div className="bg-blue-50/40 border border-blue-150 rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-xs">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Jami soat</span>
                      <span className="text-lg font-extrabold text-blue-700">{selectedWorkload.total} soat</span>
                    </div>
                  </div>

                  {/* Centered bottom row for independent study and credits */}
                  <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
                    {/* Mustaqil ta'lim */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 flex flex-col justify-center items-center text-center shadow-xs hover:border-indigo-200 hover:shadow-xs transition-all duration-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mustaqil ta'lim</span>
                      <span className="text-lg font-extrabold text-slate-800">{selectedWorkload.independent || 0} soat</span>
                    </div>

                    {/* Kredit */}
                    <div className="bg-indigo-50/40 border border-indigo-150 rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-xs">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Kredit</span>
                      <span className="text-lg font-extrabold text-indigo-700">{(selectedWorkload.total / 30).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  {!isTaqsimlashOpen && (
                    <button
                      onClick={() => setIsTaqsimlashOpen(true)}
                      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
                    >
                      Taqsimlash
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedWorkload(null);
                      setIsTaqsimlashOpen(false);
                    }}
                    className={`py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors duration-200 ${isTaqsimlashOpen ? "w-full" : "w-1/3"}`}
                  >
                    Yopish
                  </button>
                </div>
              </div>

              {/* Right Side: Teachers List or Allocation Form */}
              {isTaqsimlashOpen && (
                <>
                  {selectedTeacherToAssign ? (
                    <div className="w-full md:flex-1 p-6 flex flex-col bg-slate-50/50 justify-between overflow-y-auto h-full border-l border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <button 
                            onClick={() => setSelectedTeacherToAssign(null)}
                            className="text-xs text-indigo-650 hover:text-indigo-855 font-semibold flex items-center gap-1"
                          >
                            ← Ortga
                          </button>
                          <span className="text-slate-350 font-light">|</span>
                          <h4 className="text-xs font-bold text-slate-800">Taqsimlash: {selectedTeacherToAssign.name}</h4>
                        </div>

                        <p className="text-[11px] text-slate-500 mb-4 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/50">
                          Ushbu o'qituvchiga dars yuklamasidan qancha soat berilishini belgilang. Qavs ichida fanning taqsimlanmagan (mavjud) soatlari ko'rsatilgan.
                        </p>

                        <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1 mb-4">
                          {/* Lecture input */}
                          {selectedWorkload.lecture > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-300 transition-colors flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ma'ruza</span>
                                <span className="text-[10.5px] text-emerald-600 font-bold">Mavjud: {selectedWorkload.lecture - selectedWorkload.allocated.lecture} soat</span>
                              </div>
                              <input 
                                type="number"
                                min="0"
                                max={selectedWorkload.lecture - selectedWorkload.allocated.lecture}
                                value={assignHours.lecture}
                                onChange={(e) => handleAssignHoursChange("lecture", e.target.value)}
                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:border-indigo-500 outline-none"
                              />
                            </div>
                          )}

                          {/* Seminar input */}
                          {selectedWorkload.seminar > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-300 transition-colors flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Seminar</span>
                                <span className="text-[10.5px] text-emerald-600 font-bold">Mavjud: {selectedWorkload.seminar - selectedWorkload.allocated.seminar} soat</span>
                              </div>
                              <input 
                                type="number"
                                min="0"
                                max={selectedWorkload.seminar - selectedWorkload.allocated.seminar}
                                value={assignHours.seminar}
                                onChange={(e) => handleAssignHoursChange("seminar", e.target.value)}
                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:border-indigo-500 outline-none"
                              />
                            </div>
                          )}

                          {/* Practice input */}
                          {selectedWorkload.practice > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-300 transition-colors flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Amaliy</span>
                                <span className="text-[10.5px] text-emerald-600 font-bold">Mavjud: {selectedWorkload.practice - selectedWorkload.allocated.practice} soat</span>
                              </div>
                              <input 
                                type="number"
                                min="0"
                                max={selectedWorkload.practice - selectedWorkload.allocated.practice}
                                value={assignHours.practice}
                                onChange={(e) => handleAssignHoursChange("practice", e.target.value)}
                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:border-indigo-500 outline-none"
                              />
                            </div>
                          )}

                          {/* Lab input */}
                          {selectedWorkload.lab > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-300 transition-colors flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Laboratoriya</span>
                                <span className="text-[10.5px] text-emerald-600 font-bold">Mavjud: {selectedWorkload.lab - selectedWorkload.allocated.lab} soat</span>
                              </div>
                              <input 
                                type="number"
                                min="0"
                                max={selectedWorkload.lab - selectedWorkload.allocated.lab}
                                value={assignHours.lab}
                                onChange={(e) => handleAssignHoursChange("lab", e.target.value)}
                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:border-indigo-500 outline-none"
                              />
                            </div>
                          )}

                          {/* Rating input */}
                          {selectedWorkload.rating > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-300 transition-colors flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Reyting</span>
                                <span className="text-[10.5px] text-emerald-600 font-bold">Mavjud: {selectedWorkload.rating - selectedWorkload.allocated.rating} soat</span>
                              </div>
                              <input 
                                type="number"
                                min="0"
                                max={selectedWorkload.rating - selectedWorkload.allocated.rating}
                                value={assignHours.rating}
                                onChange={(e) => handleAssignHoursChange("rating", e.target.value)}
                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:border-indigo-500 outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={submitAssignment}
                        className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors duration-200 shadow-sm"
                      >
                        Saqlash
                      </button>
                    </div>
                  ) : (
                    <div className="w-full md:flex-1 p-6 flex flex-col bg-slate-50/50 overflow-y-auto h-full border-l border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-800">O'qituvchilar ro'yxati</h4>
                        <button 
                          onClick={() => setIsTaqsimlashOpen(false)}
                          className="text-xs text-indigo-600 hover:text-indigo-850 font-semibold"
                        >
                          Yopish
                        </button>
                      </div>

                      <input 
                        type="text"
                        placeholder="O'qituvchini qidirish..."
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none bg-white text-slate-700 mb-4 focus:border-indigo-500 transition-colors shadow-xs"
                      />

                      <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px]">
                        {filteredTeachers.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-6">O'qituvchilar topilmadi</p>
                        ) : (
                          filteredTeachers.map((teacher) => (
                            <div 
                              key={teacher.id}
                              onClick={() => handleAssignTeacherClick(teacher)}
                              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all duration-200 group flex items-center justify-between"
                            >
                              <div className="min-w-0 flex-1 pr-3">
                                <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                  {teacher.name}
                                </h5>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {teacher.department} • {teacher.status}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-bold text-slate-650 bg-slate-100 px-2 py-0.5 rounded">
                                  {teacher.total} soat
                                </span>
                                <div className="text-[9px] text-indigo-500 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Tanlash →
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {assignToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg font-semibold text-xs z-50 animate-bounce flex items-center gap-2">
          <span>✓</span> {assignToast}
        </div>
      )}
    </div>
  )
}
