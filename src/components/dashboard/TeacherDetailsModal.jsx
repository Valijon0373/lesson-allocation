import React, { useState } from "react"
import { X, Mail, Phone } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

export default function TeacherDetailsModal({ teacher, onClose }) {
  const [activeTab, setActiveTab] = useState("Fanlar")
  const [scheduleYear, setScheduleYear] = useState("2025-2026")
  const [scheduleMonth, setScheduleMonth] = useState("Sentyabr")
  const [scheduleWeek, setScheduleWeek] = useState("1")

  // Mock data for Fanlar tab
  const subjectsData = [
    { name: "Web dasturlash", lecture: 30, practice: 30, lab: 15, credits: 6, groups: "SE-401, SE-402" },
    { name: "Ma'lumotlar bazasi", lecture: 20, practice: 15, lab: 15, credits: 5, groups: "CS-301" },
    { name: "Sun'iy intellekt asoslari", lecture: 22, practice: 0, lab: 22, credits: 5, groups: "AI-201" },
  ]

  // Mock data for Grafik tab
  const semesterData = [
    { name: "Kuzki semestr", value: 130 },
    { name: "Bahorki semestr", value: 98 },
  ]

  const yearData = [
    { name: "2023-2024", value: 320 },
    { name: "2024-2025", value: 345 },
    { name: "2025-2026", value: 228 },
  ]

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-4xl h-full shadow-2xl relative animate-in slide-in-from-right duration-300 overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">O'qituvchi yuklamasi</h2>
            <p className="text-sm text-slate-500 mt-1">Fanlar, guruhlar, haftalik jadval va semestr taqsimoti</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Card */}
          <div className="border border-slate-200 rounded-xl p-5 mb-8 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
              {teacher?.name?.split(' ').map(n => n[0]).join('').substring(0,2) || 'KA'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">{teacher?.name || "Karimov Alisher Akbarovich"}</h3>
              <p className="text-slate-600 text-sm mt-1">Dotsent · {teacher?.department || "Dasturiy injiniring"}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">Axborot texnologiyalari</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">Fan doktori</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">{teacher?.rate ? `${teacher.rate.toFixed(2)} stavka` : "1.00 stavka"}</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">{teacher?.total || 228} soat</span>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> t1@institute.uz
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +998 90 123 45 67
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg w-max mb-6">
            {["Fanlar", "Jadval", "Grafik"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? "bg-white text-slate-800 shadow-sm border border-slate-200/60" 
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            
            {/* Fanlar Tab */}
            {activeTab === "Fanlar" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-medium">Fan</th>
                      <th className="py-3 px-4 font-medium">Ma'ruza</th>
                      <th className="py-3 px-4 font-medium">Amaliy</th>
                      <th className="py-3 px-4 font-medium">Lab</th>
                      <th className="py-3 px-4 font-medium">Jami</th>
                      <th className="py-3 px-4 font-medium">Kredit</th>
                      <th className="py-3 px-4 font-medium">Guruhlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjectsData.map((sub, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-800">{sub.name}</td>
                        <td className="py-3 px-4 text-slate-600">{sub.lecture}</td>
                        <td className="py-3 px-4 text-slate-600">{sub.practice}</td>
                        <td className="py-3 px-4 text-slate-600">{sub.lab}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{sub.lecture + sub.practice + sub.lab}</td>
                        <td className="py-3 px-4 text-slate-600">{sub.credits}</td>
                        <td className="py-3 px-4 text-slate-600">{sub.groups}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-200 bg-slate-50/50 font-bold text-slate-800">
                    <tr>
                      <td className="py-3 px-4">Jami:</td>
                      <td className="py-3 px-4">{subjectsData.reduce((sum, s) => sum + s.lecture, 0)}</td>
                      <td className="py-3 px-4">{subjectsData.reduce((sum, s) => sum + s.practice, 0)}</td>
                      <td className="py-3 px-4">{subjectsData.reduce((sum, s) => sum + s.lab, 0)}</td>
                      <td className="py-3 px-4 text-blue-600">{subjectsData.reduce((sum, s) => sum + s.lecture + s.practice + s.lab, 0)}</td>
                      <td className="py-3 px-4">{subjectsData.reduce((sum, s) => sum + s.credits, 0)}</td>
                      <td className="py-3 px-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            {/* Jadval Tab */}
            {activeTab === "Jadval" && (
              <div className="space-y-6">
                {/* Date Filters: Year, Month, Week - simple, clean inline style */}
                <div className="flex flex-wrap gap-x-6 gap-y-3 items-center py-2 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-black font-bold">O'quv yili:</label>
                    <select 
                      value={scheduleYear} 
                      onChange={(e) => setScheduleYear(e.target.value)}
                      className="light-select border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 outline-none bg-white focus:border-blue-500 transition-colors font-medium shadow-sm"
                    >
                      <option>2025-2026</option>
                      <option>2024-2025</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-black font-bold">Oy:</label>
                    <select 
                      value={scheduleMonth} 
                      onChange={(e) => setScheduleMonth(e.target.value)}
                      className="light-select border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 outline-none bg-white focus:border-blue-500 transition-colors font-medium shadow-sm"
                    >
                      {["Sentyabr", "Oktabr", "Noyabr", "Dekabr", "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun"].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-black font-bold">Hafta:</label>
                    <select 
                      value={scheduleWeek} 
                      onChange={(e) => setScheduleWeek(e.target.value)}
                      className="light-select border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 outline-none bg-white focus:border-blue-500 transition-colors font-medium shadow-sm"
                    >
                      <option value="1">1-hafta</option>
                      <option value="2">2-hafta</option>
                      <option value="3">3-hafta</option>
                      <option value="4">4-hafta</option>
                    </select>
                  </div>
                  <div className="ml-auto text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Haftalik yuklama: <span className="text-blue-600 dark:text-blue-400">{scheduleWeek === "1" ? "12 soat" : scheduleWeek === "2" ? "8 soat" : "10 soat"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-4 min-w-[700px]">
                  {["Du", "Se", "Ch", "Pa", "Ju", "Sh"].map((day, i) => (
                    <div key={day} className="flex flex-col gap-3">
                      <div className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{day}</div>
                      
                      {/* Week 1 */}
                      {scheduleWeek === "1" && day === "Se" && (
                        <>
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm">
                            <div className="text-xs font-bold text-blue-700 mb-1">09:00</div>
                            <div className="text-sm font-semibold text-blue-900 leading-tight">Web dasturlash</div>
                            <div className="text-xs text-blue-600 mt-1.5 font-medium">SE-401</div>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 shadow-sm">
                            <div className="text-xs font-bold text-emerald-700 mb-1">11:00</div>
                            <div className="text-sm font-semibold text-emerald-900 leading-tight">Web dasturlash</div>
                            <div className="text-xs text-emerald-600 mt-1.5 font-medium">SE-401</div>
                          </div>
                        </>
                      )}
                      {scheduleWeek === "1" && day === "Pa" && (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 shadow-sm">
                          <div className="text-xs font-bold text-purple-700 mb-1">14:00</div>
                          <div className="text-sm font-semibold text-purple-900 leading-tight">Ma'lumotlar bazasi</div>
                          <div className="text-xs text-purple-600 mt-1.5 font-medium">CS-301</div>
                        </div>
                      )}

                      {/* Week 2 */}
                      {scheduleWeek === "2" && day === "Se" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm">
                          <div className="text-xs font-bold text-blue-700 mb-1">09:00</div>
                          <div className="text-sm font-semibold text-blue-900 leading-tight">Web dasturlash</div>
                          <div className="text-xs text-blue-600 mt-1.5 font-medium">SE-401</div>
                        </div>
                      )}
                      {scheduleWeek === "2" && day === "Pa" && (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 shadow-sm">
                          <div className="text-xs font-bold text-purple-700 mb-1">14:00</div>
                          <div className="text-sm font-semibold text-purple-900 leading-tight">Ma'lumotlar bazasi</div>
                          <div className="text-xs text-purple-600 mt-1.5 font-medium">CS-301</div>
                        </div>
                      )}

                      {/* Week 3 */}
                      {scheduleWeek === "3" && day === "Ch" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm">
                          <div className="text-xs font-bold text-amber-700 mb-1">10:00</div>
                          <div className="text-sm font-semibold text-amber-900 leading-tight">Sun'iy intellekt</div>
                          <div className="text-xs text-amber-600 mt-1.5 font-medium">AI-201</div>
                        </div>
                      )}
                      {scheduleWeek === "3" && day === "Ju" && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 shadow-sm">
                          <div className="text-xs font-bold text-emerald-700 mb-1">13:00</div>
                          <div className="text-sm font-semibold text-emerald-900 leading-tight">Web dasturlash</div>
                          <div className="text-xs text-emerald-600 mt-1.5 font-medium">SE-401</div>
                        </div>
                      )}

                      {/* Week 4 */}
                      {scheduleWeek === "4" && day === "Du" && (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 shadow-sm">
                          <div className="text-xs font-bold text-purple-700 mb-1">09:00</div>
                          <div className="text-sm font-semibold text-purple-900 leading-tight">Ma'lumotlar bazasi</div>
                          <div className="text-xs text-purple-600 mt-1.5 font-medium">CS-301</div>
                        </div>
                      )}
                      {scheduleWeek === "4" && day === "Sh" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm">
                          <div className="text-xs font-bold text-amber-700 mb-1">11:00</div>
                          <div className="text-sm font-semibold text-amber-900 leading-tight">Sun'iy intellekt</div>
                          <div className="text-xs text-amber-600 mt-1.5 font-medium">AI-201</div>
                        </div>
                      )}

                      {/* Empty slots placeholders */}
                      {((scheduleWeek === "1" && day !== "Se" && day !== "Pa") ||
                        (scheduleWeek === "2" && day !== "Se" && day !== "Pa") ||
                        (scheduleWeek === "3" && day !== "Ch" && day !== "Ju") ||
                        (scheduleWeek === "4" && day !== "Du" && day !== "Sh")) && (
                        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl h-24 bg-transparent"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grafik Tab */}
            {activeTab === "Grafik" && (
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-4">Semestr bo'yicha</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={semesterData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} formatter={(value) => [`${value} soat`, "yuklama"]} />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={200} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-4">Yillar bo'yicha</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} formatter={(value) => [`${value} soat`, "yuklama"]} />
                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={150} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}
