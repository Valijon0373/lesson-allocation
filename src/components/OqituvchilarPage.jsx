import { useMemo, useState } from "react"
import { Eye, Search, SlidersHorizontal, TrendingUp } from "lucide-react"

export default function OqituvchilarPage({
  teachers,
  ranking,
  positions,
  departments,
  loading = false,
  loadError = "",
  onSelectTeacher,
}) {
  const [searchDraft, setSearchDraft] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [facultyFilter, setFacultyFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [openActionsFor, setOpenActionsFor] = useState(null)

  const getTeacherFaculty = (teacher) => {
    if (teacher.facultyName) return teacher.facultyName
    const dept = departments.find((d) => d.id === teacher.departmentId)
    return dept?.facultyName || ""
  }

  const getTeacherDepartment = (teacher) => {
    return (
      departments.find((d) => d.id === teacher.departmentId)?.name ||
      teacher.department ||
      ""
    )
  }

  const merged = useMemo(() => ranking, [ranking])

  const facultyOptions = useMemo(() => {
    const names = new Set(merged.map(getTeacherFaculty).filter(Boolean))
    return [...names].sort((a, b) => a.localeCompare(b, "uz"))
  }, [merged, departments])

  const departmentOptions = useMemo(() => {
    const names = new Set(
      merged
        .filter((teacher) => {
          if (facultyFilter === "all") return true
          return getTeacherFaculty(teacher) === facultyFilter
        })
        .map(getTeacherDepartment)
        .filter(Boolean),
    )
    return [...names].sort((a, b) => a.localeCompare(b, "uz"))
  }, [merged, departments, facultyFilter])

  const filteredTeachers = merged.filter((teacher) => {
    const facultyName = getTeacherFaculty(teacher)
    const deptName = getTeacherDepartment(teacher)

    if (facultyFilter !== "all" && facultyName !== facultyFilter) return false
    if (departmentFilter !== "all" && deptName !== departmentFilter) return false

    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    const posName = positions.find((p) => p.id === teacher.positionId)?.name || ""
    return [teacher.fullName, deptName, posName, facultyName].some((v) =>
      String(v).toLowerCase().includes(q),
    )
  })

  return (
    <section className="min-h-screen w-full bg-white">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="space-y-6">
          <div className="p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  O'qituvchilar
                </h2>
              </div>

              {loadError && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  O'qituvchilarni API dan yuklashda xatolik: {loadError}
                </p>
              )}

              {/* Filters */}
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={facultyFilter}
                  onChange={(e) => {
                    setFacultyFilter(e.target.value)
                    setDepartmentFilter("all")
                  }}
                  className="w-full min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-shadow focus:border-slate-400 focus:ring-2 focus:ring-slate-200/60 sm:min-w-[12rem]"
                >
                  <option value="all">Barcha fakultetlar</option>
                  {facultyOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full min-w-0 flex-1 rounded-lg border border-teal-500 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-shadow focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 sm:min-w-[12rem]"
                >
                  <option value="all">Barcha kafedralar</option>
                  {departmentOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <input
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setSearchQuery(searchDraft)
                  }}
                  placeholder="O'qituvchini izlash"
                  className="w-full min-w-0 flex-[1.5] rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 sm:min-w-[12rem]"
                />
                <button
                  type="button"
                  onClick={() => setSearchQuery(searchDraft)}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-teal-600 px-4 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 sm:w-auto"
                >
                  <Search className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                  Qidirish
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-900">
                        №
                      </th>
                      <th className="border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Fakultet
                      </th>
                      <th className="border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Kafedra
                      </th>
                      <th className="border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Lavozim
                      </th>
                      <th className="border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-900">
                        F.I.O
                      </th>
                      <th className="border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-900">
                        Ball
                      </th>
                      <th className="border border-slate-200 px-4 py-3 text-right text-sm font-bold text-slate-900">
                        Amallar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td
                          colSpan={7}
                          className="border border-slate-200 px-4 py-8 text-center text-sm text-slate-500"
                        >
                          O'qituvchilar yuklanmoqda...
                        </td>
                      </tr>
                    )}
                    {!loading &&
                      filteredTeachers.map((teacher, index) => {
                        const facultyName =
                          teacher.facultyName ||
                          (teacher.departmentId
                            ? (() => {
                                const dept = departments.find((d) => d.id === teacher.departmentId)
                                return dept?.facultyName || ""
                              })()
                            : "") ||
                          "-"
                        const posName =
                          (teacher.positionId
                            ? positions.find((p) => p.id === teacher.positionId)?.name
                            : null) || "-"
                        const deptName =
                          (teacher.departmentId
                            ? departments.find((d) => d.id === teacher.departmentId)?.name
                            : null) ||
                          teacher.department ||
                          "-"
                        return (
                          <tr key={teacher.id}>
                            <td className="border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-900">
                              {index + 1}
                            </td>
                            <td className="border border-slate-200 px-4 py-3 text-sm text-slate-500">
                              {facultyName}
                            </td>
                            <td className="border border-slate-200 px-4 py-3 text-sm text-slate-500">
                              {deptName}
                            </td>
                            <td className="border border-slate-200 px-4 py-3 text-sm text-slate-500">
                              {posName}
                            </td>
                            <td className="border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
                              {teacher.fullName}
                            </td>
                            <td className="border border-slate-200 px-4 py-3">
                              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                                {teacher.total} ball
                              </span>
                            </td>
                            <td className="border border-slate-200 px-4 py-3 text-center">
                              <div className="relative inline-flex">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenActionsFor((prev) =>
                                      prev === teacher.id ? null : teacher.id,
                                    )
                                  }
                                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2.5 text-slate-700 transition-colors hover:bg-slate-100"
                                  aria-label="Amallar menyusi"
                                  aria-expanded={openActionsFor === teacher.id}
                                >
                                  <SlidersHorizontal
                                    className="h-5 w-5"
                                    strokeWidth={1.9}
                                    aria-hidden
                                  />
                                </button>

                                {openActionsFor === teacher.id && (
                                  <div className="absolute right-0 top-full z-20 mt-2 min-w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenActionsFor(null)
                                        onSelectTeacher(teacher)
                                      }}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                                    >
                                      <Eye
                                        className="h-4 w-4 shrink-0"
                                        strokeWidth={1.75}
                                        aria-hidden
                                      />
                                      Ko'rish
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenActionsFor(null)
                                        onSelectTeacher(teacher)
                                      }}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                                    >
                                      <TrendingUp
                                        className="h-4 w-4 shrink-0"
                                        strokeWidth={1.75}
                                        aria-hidden
                                      />
                                      Reyting
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    {!loading && filteredTeachers.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="border border-slate-200 px-4 py-8 text-center text-sm text-slate-500"
                        >
                          {searchQuery || facultyFilter !== "all" || departmentFilter !== "all"
                            ? "Qidiruv bo'yicha natija topilmadi."
                            : teachers.length === 0
                              ? "API dan o'qituvchilar topilmadi. Tizimga API orqali kiring."
                              : "Hozircha o'qituvchilar ro'yxati bo'sh."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {(searchQuery || facultyFilter !== "all" || departmentFilter !== "all") &&
                !loading &&
                filteredTeachers.length === 0 && (
                <p className="text-center text-sm text-slate-500">
                  Qidiruv bo'yicha natija topilmadi.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
