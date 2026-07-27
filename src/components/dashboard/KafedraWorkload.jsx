import React, { useState, useMemo } from "react"

const initialKafedralar = [
  // Filologiya Fakulteti
  { name: "Rus tili va adabiyoti", faculty: "Filologiya", semester: "Kuzki semestr", subjectName: "Rus adabiyoti tarixi", lecture: 80, practice: 60, lab: 0, rating: 20, seminar: 40, total: 200, independent: 60, status: "Taqsimlangan" },
  { name: "O'zbek tili va adabiyoti", faculty: "Filologiya", semester: "Bahorki semestr", subjectName: "Hozirgi o'zbek adabiyoti", lecture: 100, practice: 80, lab: 0, rating: 30, seminar: 50, total: 260, independent: 70, status: "To'liq taqsimlanmagan" },
  { name: "Xorijiy filologiya", faculty: "Filologiya", semester: "Kuzki semestr", subjectName: "Chet tili o'qitish metodikasi", lecture: 60, practice: 90, lab: 0, rating: 20, seminar: 30, total: 200, independent: 80, status: "Taqsimlanmagan" },
  // Pedagogika Fakulteti
  { name: "Pedagogika va psixologiya", faculty: "Pedagogika", semester: "Bahorki semestr", subjectName: "Umumiy psixologiya", lecture: 120, practice: 80, lab: 20, rating: 40, seminar: 60, total: 320, independent: 100, status: "Taqsimlangan" },
  { name: "Maktabgacha ta'lim", faculty: "Pedagogika", semester: "Kuzki semestr", subjectName: "Maktabgacha ta'lim pedagogikasi", lecture: 90, practice: 70, lab: 0, rating: 30, seminar: 50, total: 240, independent: 80, status: "To'liq taqsimlanmagan" },
  // Aniq va tabiiy fanlar Fakulteti
  { name: "Matematika va kompyuter texnologiyalari", faculty: "Aniq va tabiiy fanlar", semester: "Kuzki semestr", subjectName: "Matematik analiz", lecture: 140, practice: 100, lab: 60, rating: 40, seminar: 0, total: 340, independent: 120, status: "Taqsimlanmagan" },
  { name: "Tabiiy fanlar", faculty: "Aniq va tabiiy fanlar", semester: "Bahorki semestr", subjectName: "Ekologiya asoslari", lecture: 90, practice: 80, lab: 30, rating: 30, seminar: 50, total: 280, independent: 80, status: "Taqsimlangan" },
  { name: "Fizika va astronomiya", faculty: "Aniq va tabiiy fanlar", semester: "Kuzki semestr", subjectName: "Kvant fizikasi", lecture: 100, practice: 90, lab: 50, rating: 30, seminar: 50, total: 320, independent: 90, status: "To'liq taqsimlanmagan" },
  { name: "Texnologik ta'lim", faculty: "Aniq va tabiiy fanlar", semester: "Bahorki semestr", subjectName: "Chizmachilik", lecture: 60, practice: 50, lab: 10, rating: 20, seminar: 40, total: 180, independent: 50, status: "Taqsimlanmagan" },
  // Boshlang'ich ta'lim Fakulteti
  { name: "Boshlang'ich ta'lim metodikasi", faculty: "Boshlang'ich ta'lim", semester: "Kuzki semestr", subjectName: "O'qish metodikasi", lecture: 110, practice: 90, lab: 40, rating: 40, seminar: 60, total: 340, independent: 90, status: "Taqsimlangan" },
  { name: "Boshlang'ich ta'lim nazariyasi", faculty: "Boshlang'ich ta'lim", semester: "Bahorki semestr", subjectName: "Pedagogik nazariya", lecture: 90, practice: 80, lab: 30, rating: 20, seminar: 50, total: 270, independent: 70, status: "To'liq taqsimlanmagan" },
  // Ijtimoiy va amaliy fanlar Fakulteti
  { name: "Tarix", faculty: "Ijtimoiy va amaliy fanlar", semester: "Kuzki semestr", subjectName: "O'zbekiston tarixi", lecture: 120, practice: 100, lab: 10, rating: 40, seminar: 80, total: 350, independent: 95, status: "Taqsimlanmagan" },
  { name: "Milliy g'oya va falsafa", faculty: "Ijtimoiy va amaliy fanlar", semester: "Bahorki semestr", subjectName: "Falsafa asoslari", lecture: 70, practice: 60, lab: 20, rating: 20, seminar: 50, total: 220, independent: 60, status: "Taqsimlangan" },
  { name: "San'atshunoslik", faculty: "Ijtimoiy va amaliy fanlar", semester: "Kuzki semestr", subjectName: "Tasviriy san'at", lecture: 80, practice: 70, lab: 40, rating: 20, seminar: 30, total: 240, independent: 65, status: "To'liq taqsimlanmagan" },
  { name: "Jismoniy madaniyat", faculty: "Ijtimoiy va amaliy fanlar", semester: "Bahorki semestr", subjectName: "Sport o'yinlari", lecture: 140, practice: 120, lab: 60, rating: 40, seminar: 60, total: 420, independent: 110, status: "Taqsimlanmagan" },
  // Magistratura bo'limi
  { name: "Magistratura mutaxassisliklari", faculty: "Magistratura bo'limi", semester: "Kuzki semestr", subjectName: "Ilmiy tadqiqot metodologiyasi", lecture: 140, practice: 100, lab: 40, rating: 50, seminar: 70, total: 400, independent: 110, status: "To'liq taqsimlanmagan" },
]

const mockTeachers = [
  { id: 1, name: "Karimov Alisher Akbarovich", department: "Rus tili va adabiyoti", status: "Kam yuklangan", total: 228 },
  { id: 2, name: "Saidova Nilufar Bahodirovna", department: "O'zbek tili va adabiyoti", status: "Kam yuklangan", total: 168 },
  { id: 3, name: "Rahimov Davron Choriovich", department: "Matematika va komp. texn.", status: "Kam yuklangan", total: 294 },
  { id: 4, name: "Yusupova Mohira Dilshodovna", department: "Pedagogika va psixologiya", status: "Kam yuklangan", total: 96 },
  { id: 5, name: "Toshmatov Bekzod Rustamovich", department: "Tarix", status: "Kam yuklangan", total: 200 },
  { id: 6, name: "Ergasheva Zulfiya Anvarovna", department: "Boshlang'ich ta'lim metodikasi", status: "Kam yuklangan", total: 150 },
  { id: 7, name: "Usmonov Qodir Bahodirovich", department: "Magistratura mutaxassisliklari", status: "Kam yuklangan", total: 120 },
];

export default function KafedraWorkload({ isDark, currentUser }) {
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
  const facultyNamesById = {
    f1: "Filologiya",
    f2: "Pedagogika",
    f3: "Aniq va tabiiy fanlar",
    f4: "Boshlang'ich ta'lim",
    f5: "Ijtimoiy va amaliy fanlar",
    f6: "Magistratura bo'limi",
  }
  const myFacultyName = currentUser?.facultyId && currentUser?.role !== "admin" ? facultyNamesById[currentUser.facultyId] : null
  const [kafedraFilter, setKafedraFilter] = useState("all")
  const [facultyFilter, setFacultyFilter] = useState(myFacultyName || "all")
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
    const list = myFacultyName ? kafedralar.filter(k => k.faculty === myFacultyName) : kafedralar
    return [...new Set(list.map(item => item.name))].sort()
  }, [kafedralar, myFacultyName])

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
      const matchesFaculty = myFacultyName ? item.faculty === myFacultyName : (facultyFilter === "all" || item.faculty === facultyFilter)
      const matchesSemester = semesterFilter === "all" || item.semester === semesterFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesKafedra && matchesFaculty && matchesSemester && matchesStatus
    })
  }, [kafedralar, kafedraFilter, facultyFilter, semesterFilter, statusFilter, myFacultyName])

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
              value={myFacultyName || facultyFilter}
              disabled={Boolean(myFacultyName)}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors bg-white disabled:bg-slate-100 disabled:text-slate-500"
            >
              {myFacultyName ? (
                <option value={myFacultyName}>{myFacultyName}</option>
              ) : (
                <>
                  <option value="all">Barchasi</option>
                  <option value="Filologiya">Filologiya</option>
                  <option value="Pedagogika">Pedagogika</option>
                  <option value="Aniq va tabiiy fanlar">Aniq va tabiiy fanlar</option>
                  <option value="Boshlang'ich ta'lim">Boshlang'ich ta'lim</option>
                  <option value="Ijtimoiy va amaliy fanlar">Ijtimoiy va amaliy fanlar</option>
                  <option value="Magistratura bo'limi">Magistratura bo'limi</option>
                </>
              )}
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
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-300 p-4 overflow-y-auto">
          <div 
            className={`bg-white rounded-3xl shadow-2xl border border-slate-100/80 overflow-hidden transition-all duration-500 ease-out flex flex-col w-full my-auto ${
              isTaqsimlashOpen 
                ? "max-w-5xl h-[640px] max-h-[90vh]" 
                : "max-w-2xl h-auto max-h-[90vh]"
            }`}
          >
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {/* Left Side: Subject Workload Details */}
              <div 
                className={`p-6 flex flex-col justify-between overflow-y-auto h-full transition-all duration-500 ${
                  isTaqsimlashOpen 
                    ? "w-full md:w-[400px] shrink-0 border-r border-slate-200/80 bg-slate-50/50" 
                    : "w-full"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-150 px-3 py-1 rounded-full shadow-2xs">
                      {selectedWorkload.semester}
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedWorkload(null);
                        setIsTaqsimlashOpen(false);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors font-bold text-sm shadow-2xs"
                      title="Yopish"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-slate-850 mb-1 leading-snug tracking-tight">
                    {selectedWorkload.subjectName}
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-slate-100/90 px-2.5 py-1 rounded-md text-slate-650 font-medium">
                      Fakultet: <strong className="text-slate-800 font-bold">{selectedWorkload.faculty}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 bg-slate-100/90 px-2.5 py-1 rounded-md text-slate-650 font-medium">
                      Kafedra: <strong className="text-slate-800 font-bold">{selectedWorkload.name}</strong>
                    </span>
                  </p>

                  <div className={`grid gap-2.5 mb-5 ${isTaqsimlashOpen ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4 gap-3 mb-6"}`}>
                    {/* Ma'ruza */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between items-center text-center shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5 group-hover:text-indigo-600 transition-colors">Ma'ruza</span>
                      <span className="text-base font-black text-slate-800 my-0.5">{selectedWorkload.lecture} <span className="text-[11px] font-semibold text-slate-500 font-normal">soat</span></span>
                      {selectedWorkload.lecture - (selectedWorkload.allocated?.lecture || 0) > 0 ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50/90 px-2 py-0.5 rounded-md mt-1 border border-emerald-200/60 w-full truncate">
                          Mavjud: {selectedWorkload.lecture - (selectedWorkload.allocated?.lecture || 0)} soat
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md mt-1 border border-slate-200/60 w-full truncate">
                          Mavjud: 0 soat
                        </span>
                      )}
                    </div>

                    {/* Seminar */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between items-center text-center shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5 group-hover:text-indigo-600 transition-colors">Seminar</span>
                      <span className="text-base font-black text-slate-800 my-0.5">{selectedWorkload.seminar || 0} <span className="text-[11px] font-semibold text-slate-500 font-normal">soat</span></span>
                      {(selectedWorkload.seminar || 0) - (selectedWorkload.allocated?.seminar || 0) > 0 ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50/90 px-2 py-0.5 rounded-md mt-1 border border-emerald-200/60 w-full truncate">
                          Mavjud: {(selectedWorkload.seminar || 0) - (selectedWorkload.allocated?.seminar || 0)} soat
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md mt-1 border border-slate-200/60 w-full truncate">
                          Mavjud: 0 soat
                        </span>
                      )}
                    </div>

                    {/* Laboratoriya */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between items-center text-center shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5 group-hover:text-indigo-600 transition-colors">Laboratoriya</span>
                      <span className="text-base font-black text-slate-800 my-0.5">{selectedWorkload.lab || 0} <span className="text-[11px] font-semibold text-slate-500 font-normal">soat</span></span>
                      {(selectedWorkload.lab || 0) - (selectedWorkload.allocated?.lab || 0) > 0 ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50/90 px-2 py-0.5 rounded-md mt-1 border border-emerald-200/60 w-full truncate">
                          Mavjud: {(selectedWorkload.lab || 0) - (selectedWorkload.allocated?.lab || 0)} soat
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md mt-1 border border-slate-200/60 w-full truncate">
                          Mavjud: 0 soat
                        </span>
                      )}
                    </div>

                    {/* Amaliy */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between items-center text-center shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5 group-hover:text-indigo-600 transition-colors">Amaliy</span>
                      <span className="text-base font-black text-slate-800 my-0.5">{selectedWorkload.practice || 0} <span className="text-[11px] font-semibold text-slate-500 font-normal">soat</span></span>
                      {(selectedWorkload.practice || 0) - (selectedWorkload.allocated?.practice || 0) > 0 ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50/90 px-2 py-0.5 rounded-md mt-1 border border-emerald-200/60 w-full truncate">
                          Mavjud: {(selectedWorkload.practice || 0) - (selectedWorkload.allocated?.practice || 0)} soat
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md mt-1 border border-slate-200/60 w-full truncate">
                          Mavjud: 0 soat
                        </span>
                      )}
                    </div>

                    {/* Reyting */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between items-center text-center shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5 group-hover:text-indigo-600 transition-colors">Reyting</span>
                      <span className="text-base font-black text-slate-800 my-0.5">{selectedWorkload.rating || 0} <span className="text-[11px] font-semibold text-slate-500 font-normal">soat</span></span>
                      {(selectedWorkload.rating || 0) - (selectedWorkload.allocated?.rating || 0) > 0 ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50/90 px-2 py-0.5 rounded-md mt-1 border border-emerald-200/60 w-full truncate">
                          Mavjud: {(selectedWorkload.rating || 0) - (selectedWorkload.allocated?.rating || 0)} soat
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md mt-1 border border-slate-200/60 w-full truncate">
                          Mavjud: 0 soat
                        </span>
                      )}
                    </div>

                    {/* Mustaqil ta'lim */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between items-center text-center shadow-2xs hover:border-slate-300 transition-all duration-200">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Mustaqil ta'lim</span>
                      <span className="text-base font-black text-slate-800 my-0.5">{selectedWorkload.independent || 0} <span className="text-[11px] font-normal text-slate-500">soat</span></span>
                      <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md mt-1 border border-slate-200/60 w-full truncate">
                        Yuklama
                      </span>
                    </div>

                    {/* Kredit */}
                    <div className="bg-indigo-50/40 rounded-2xl border border-indigo-150 p-3 flex flex-col justify-between items-center text-center shadow-2xs hover:border-indigo-300 transition-all duration-200">
                      <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider mb-0.5">Kredit</span>
                      <span className="text-base font-black text-indigo-700 my-0.5">{(selectedWorkload.total / 30).toFixed(1)} <span className="text-[11px] font-normal text-indigo-500">kredit</span></span>
                      <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100/60 px-2 py-0.5 rounded-md mt-1 border border-indigo-200/60 w-full truncate">
                        30 soat/kredit
                      </span>
                    </div>

                    {/* Jami soat */}
                    <div className="bg-slate-100 rounded-2xl border border-slate-300 p-3 flex flex-col justify-between items-center text-center shadow-2xs hover:border-slate-400 transition-all duration-200">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">Jami soat</span>
                      <span className="text-base font-black text-slate-800 my-0.5">{selectedWorkload.total} <span className="text-[11px] font-semibold text-slate-500 font-normal">soat</span></span>
                      <span className="text-[10px] text-slate-700 font-bold bg-slate-200/80 px-2 py-0.5 rounded-md mt-1 border border-slate-300/60 w-full truncate">
                        Umumiy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200/60 flex items-center gap-3">
                  {!isTaqsimlashOpen ? (
                    <>
                      <button
                        onClick={() => setIsTaqsimlashOpen(true)}
                        className="flex-1 py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-extrabold transition-all duration-200 shadow-md hover:shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                      >
                        <span>⚡</span> Taqsimlash
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWorkload(null);
                          setIsTaqsimlashOpen(false);
                        }}
                        className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors duration-200"
                      >
                        Yopish
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsTaqsimlashOpen(false)}
                      className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors duration-200 flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <span>←</span> Taqsimlashni yopish
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side: Teachers List or Allocation Form */}
              {isTaqsimlashOpen && (
                <>
                  {selectedTeacherToAssign ? (
                    <div className="w-full md:flex-1 p-6 flex flex-col bg-slate-50/70 justify-between h-full overflow-hidden border-l border-slate-200/80 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
                          <div className="flex items-center gap-2.5">
                            <button 
                              onClick={() => setSelectedTeacherToAssign(null)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors text-xs font-bold shadow-2xs"
                              title="Ortga"
                            >
                              ←
                            </button>
                            <div>
                              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">Ajratiladigan soat miqdori</span>
                              <h4 className="text-sm font-black text-slate-800">{selectedTeacherToAssign.name}</h4>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 py-1 rounded-md">
                            {selectedTeacherToAssign.status}
                          </span>
                        </div>

                        <div className="bg-indigo-50/80 border border-indigo-150 p-3 rounded-xl mb-4 text-[11px] text-indigo-950 flex gap-2 items-start shadow-2xs">
                          <span className="text-sm">💡</span>
                          <p className="leading-relaxed font-medium">
                            Ushbu o'qituvchiga dars yuklamasidan qancha soat berilishini belgilang. Qavs ichida fanning taqsimlanmagan (mavjud) soatlari ko'rsatilgan.
                          </p>
                        </div>

                        <div className="space-y-2.5 mb-4">
                          {/* Lecture input */}
                          {selectedWorkload.lecture > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                                  <span className="text-xs font-bold text-slate-800">Ma'ruza</span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium mt-0.5 pl-4">
                                  Umumiy: {selectedWorkload.lecture} soat • <strong className="text-emerald-600">Mavjud: {selectedWorkload.lecture - selectedWorkload.allocated.lecture} soat</strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <input 
                                  type="number"
                                  min="0"
                                  max={selectedWorkload.lecture - selectedWorkload.allocated.lecture}
                                  value={assignHours.lecture}
                                  onChange={(e) => handleAssignHoursChange("lecture", e.target.value)}
                                  placeholder="0"
                                  className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition-colors"
                                />
                                <span className="text-xs font-bold text-slate-400">soat</span>
                              </div>
                            </div>
                          )}

                          {/* Seminar input */}
                          {selectedWorkload.seminar > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                                  <span className="text-xs font-bold text-slate-800">Seminar</span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium mt-0.5 pl-4">
                                  Umumiy: {selectedWorkload.seminar} soat • <strong className="text-emerald-600">Mavjud: {selectedWorkload.seminar - selectedWorkload.allocated.seminar} soat</strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <input 
                                  type="number"
                                  min="0"
                                  max={selectedWorkload.seminar - selectedWorkload.allocated.seminar}
                                  value={assignHours.seminar}
                                  onChange={(e) => handleAssignHoursChange("seminar", e.target.value)}
                                  placeholder="0"
                                  className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition-colors"
                                />
                                <span className="text-xs font-bold text-slate-400">soat</span>
                              </div>
                            </div>
                          )}

                          {/* Practice input */}
                          {selectedWorkload.practice > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                                  <span className="text-xs font-bold text-slate-800">Amaliy</span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium mt-0.5 pl-4">
                                  Umumiy: {selectedWorkload.practice} soat • <strong className="text-emerald-600">Mavjud: {selectedWorkload.practice - selectedWorkload.allocated.practice} soat</strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <input 
                                  type="number"
                                  min="0"
                                  max={selectedWorkload.practice - selectedWorkload.allocated.practice}
                                  value={assignHours.practice}
                                  onChange={(e) => handleAssignHoursChange("practice", e.target.value)}
                                  placeholder="0"
                                  className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition-colors"
                                />
                                <span className="text-xs font-bold text-slate-400">soat</span>
                              </div>
                            </div>
                          )}

                          {/* Lab input */}
                          {selectedWorkload.lab > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                  <span className="text-xs font-bold text-slate-800">Laboratoriya</span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium mt-0.5 pl-4">
                                  Umumiy: {selectedWorkload.lab} soat • <strong className="text-emerald-600">Mavjud: {selectedWorkload.lab - selectedWorkload.allocated.lab} soat</strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <input 
                                  type="number"
                                  min="0"
                                  max={selectedWorkload.lab - selectedWorkload.allocated.lab}
                                  value={assignHours.lab}
                                  onChange={(e) => handleAssignHoursChange("lab", e.target.value)}
                                  placeholder="0"
                                  className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition-colors"
                                />
                                <span className="text-xs font-bold text-slate-400">soat</span>
                              </div>
                            </div>
                          )}

                          {/* Rating input */}
                          {selectedWorkload.rating > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                                  <span className="text-xs font-bold text-slate-800">Reyting</span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium mt-0.5 pl-4">
                                  Umumiy: {selectedWorkload.rating} soat • <strong className="text-emerald-600">Mavjud: {selectedWorkload.rating - selectedWorkload.allocated.rating} soat</strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <input 
                                  type="number"
                                  min="0"
                                  max={selectedWorkload.rating - selectedWorkload.allocated.rating}
                                  value={assignHours.rating}
                                  onChange={(e) => handleAssignHoursChange("rating", e.target.value)}
                                  placeholder="0"
                                  className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-right font-extrabold text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition-colors"
                                />
                                <span className="text-xs font-bold text-slate-400">soat</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80 shrink-0 flex items-center gap-2.5">
                        <button
                          onClick={() => setSelectedTeacherToAssign(null)}
                          className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors duration-200 shrink-0 shadow-2xs"
                        >
                          Bekor qilish
                        </button>
                        <button
                          onClick={submitAssignment}
                          className="flex-1 py-2.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                        >
                          <span>✓</span> Taqsimotni saqlash
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full md:flex-1 p-6 flex flex-col bg-slate-50/70 justify-between h-full overflow-hidden border-l border-slate-200/80 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center justify-between mb-4 shrink-0">
                        <div>
                          <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                            O'qituvchini tanlang
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Dars soatlarini taqsimlash uchun o'qituvchi tanlang</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-lg">
                            {filteredTeachers.length} nafar
                          </span>
                          <button 
                            onClick={() => setIsTaqsimlashOpen(false)}
                            className="text-slate-400 hover:text-slate-600 text-base font-semibold px-1"
                            title="Yopish"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="relative mb-3 shrink-0">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                        <input 
                          type="text"
                          placeholder="O'qituvchi ism-sharifi bo'yicha qidirish..."
                          value={teacherSearch}
                          onChange={(e) => setTeacherSearch(e.target.value)}
                          className="w-full rounded-xl border border-slate-200/80 pl-9 pr-8 py-2.5 text-xs outline-none bg-white text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-2xs font-medium"
                        />
                        {teacherSearch && (
                          <button 
                            onClick={() => setTeacherSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 -mr-1">
                        {filteredTeachers.length === 0 ? (
                          <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed border-slate-200 m-2">
                            <span className="text-2xl block mb-2">🔍</span>
                            <p className="text-xs font-bold text-slate-600">O'qituvchi topilmadi</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Qidiruv so'zini o'zgartirib ko'ring</p>
                          </div>
                        ) : (
                          filteredTeachers.map((teacher) => (
                            <div 
                              key={teacher.id}
                              onClick={() => handleAssignTeacherClick(teacher)}
                              className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all duration-200 group flex items-center justify-between"
                            >
                              <div className="min-w-0 flex-1 pr-3 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                  {teacher.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                    {teacher.name}
                                  </h5>
                                  <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                                    {teacher.department} • <span className="text-indigo-600 font-semibold">{teacher.status}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0 flex items-center gap-2">
                                <div className="flex flex-col items-end">
                                  <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                    {teacher.total} soat
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-medium mt-0.5">Yuklamasi</span>
                                </div>
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-0 -translate-x-2 font-bold text-xs">
                                  →
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
