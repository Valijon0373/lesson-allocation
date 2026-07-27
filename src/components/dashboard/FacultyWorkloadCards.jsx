import React, { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

function useCountUp(end, duration = 1400) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp = null
    let animationFrameId

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOutProgress * end))

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    animationFrameId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animationFrameId)
  }, [end, duration])

  return count
}

function AnimatedNumber({ end, suffix = "", prefix = "", duration = 1400 }) {
  const count = useCountUp(end, duration)
  return <span>{prefix}{count}{suffix}</span>
}

const FACULTY_WORKLOAD_DATA = [
  {
    id: "f5",
    name: "Ijtimoiy va amaliy fanlar fakulteti",
    totalUnallocated: 85,
    percentage: 76,
    departments: [
      { name: "Milliy g'oya va fal...", full: "Milliy g'oya va falsafa", allocated: 65, unallocated: 20 },
      { name: "Tarix", full: "Tarix", allocated: 90, unallocated: 25 },
      { name: "San'atshunoslik", full: "San'atshunoslik", allocated: 75, unallocated: 20 },
      { name: "Jismoniy madaniyat", full: "Jismoniy madaniyat", allocated: 110, unallocated: 20 },
    ]
  },
  {
    id: "f1",
    name: "Filologiya fakulteti",
    totalUnallocated: 65,
    percentage: 83,
    departments: [
      { name: "O'zbek tili va adab...", full: "O'zbek tili va adabiyoti", allocated: 120, unallocated: 20 },
      { name: "Rus tili va adab...", full: "Rus tili va adabiyoti", allocated: 95, unallocated: 15 },
      { name: "Xorijiy filologiya", full: "Xorijiy filologiya", allocated: 110, unallocated: 30 },
    ]
  },
  {
    id: "f2",
    name: "Pedagogika fakulteti",
    totalUnallocated: 60,
    percentage: 85,
    departments: [
      { name: "Pedagogika va psix...", full: "Pedagogika va psixologiya", allocated: 140, unallocated: 25 },
      { name: "Maktabgacha ta'lim", full: "Maktabgacha ta'lim", allocated: 115, unallocated: 20 },
    ]
  },
  {
    id: "f3",
    name: "Aniq va tabiiy fanlar fakulteti",
    totalUnallocated: 95,
    percentage: 82,
    departments: [
      { name: "Matematika va komp...", full: "Matematika va kompyuter texnologiyalari", allocated: 160, unallocated: 40 },
      { name: "Tabiiy fanlar", full: "Tabiiy fanlar", allocated: 150, unallocated: 25 },
      { name: "Fizika va astron...", full: "Fizika va astronomiya", allocated: 130, unallocated: 30 },
      { name: "Texnologik ta'lim", full: "Texnologik ta'lim", allocated: 110, unallocated: 20 },
    ]
  },
  {
    id: "f4",
    name: "Boshlang'ich ta'lim fakulteti",
    totalUnallocated: 45,
    percentage: 85,
    departments: [
      { name: "Boshlang'ich met...", full: "Boshlang'ich ta'lim metodikasi", allocated: 135, unallocated: 25 },
      { name: "Boshlang'ich naz...", full: "Boshlang'ich ta'lim nazariyasi", allocated: 115, unallocated: 20 },
    ]
  },
  {
    id: "f6",
    name: "Magistratura bo'limi",
    totalUnallocated: 35,
    percentage: 88,
    departments: [
      { name: "Aniq fanlar mag...", full: "Aniq va tabiiy fanlar magistraturasi", allocated: 80, unallocated: 15 },
      { name: "Gumanitar mag...", full: "Gumanitar va ijtimoiy fanlar magistraturasi", allocated: 90, unallocated: 20 },
    ]
  }
]

function CustomTooltip({ active, payload, label, isDark }) {
  if (active && payload && payload.length) {
    const allocatedVal = payload.find(p => p.dataKey === "allocated")?.value || 0
    const unallocatedVal = payload.find(p => p.dataKey === "unallocated")?.value || 0
    const fullDepartmentName = payload[0]?.payload?.full || label

    return (
      <div className={`p-3.5 rounded-xl border shadow-xl text-xs space-y-2 z-50 ${
        isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <p className="font-bold text-sm border-b pb-1.5 border-slate-200 dark:border-slate-700">{fullDepartmentName}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Taqsimlangan:</span>
          </div>
          <strong className="font-bold text-emerald-600 dark:text-emerald-400">{allocatedVal} soat</strong>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
            <span>Taqsimlanmagan:</span>
          </div>
          <strong className="font-bold text-rose-500 dark:text-rose-400">{unallocatedVal} soat</strong>
        </div>
      </div>
    )
  }
  return null
}

function ArcGauge({ percentage, isDark }) {
  const animatedPercentage = useCountUp(percentage, 1500)
  const radius = 55
  const strokeWidth = 14
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * (240 / 360)
  const strokeDashoffset = arcLength - (arcLength * animatedPercentage) / 100

  return (
    <div className="flex flex-col items-center justify-center relative py-2">
      <svg className="w-44 h-36" viewBox="0 0 160 140" style={{ transform: "rotate(150deg)" }}>
        <circle
          cx="80"
          cy="70"
          r={radius}
          stroke={isDark ? "#334155" : "#f1f5f9"}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="80"
          cy="70"
          r={radius}
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "stroke-dashoffset 0.08s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
          {animatedPercentage}%
        </span>
        <span className={`text-sm font-semibold mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Taqsimot
        </span>
      </div>
    </div>
  )
}

export default function FacultyWorkloadCards({ isDark, currentUser }) {
  const visibleFaculties = currentUser?.facultyId && currentUser?.role !== "admin"
    ? FACULTY_WORKLOAD_DATA.filter((f) => f.id === currentUser.facultyId)
    : FACULTY_WORKLOAD_DATA

  return (
    <div className="space-y-6">
      {visibleFaculties.map((faculty) => (
        <div
          key={faculty.id}
          className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 ${
            isDark
              ? "bg-slate-800/90 border-slate-700/80 hover:border-slate-600"
              : "bg-white border-slate-200/80 hover:shadow-md"
          }`}
        >
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                {faculty.name}
              </h3>
              <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Kafedralar bo&apos;yicha taqsimot
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span
                className={`px-3.5 py-1 rounded-full text-sm font-semibold transition-colors ${
                  isDark
                    ? "bg-indigo-950/60 text-indigo-300 border border-indigo-800/50"
                    : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                }`}
              >
                <AnimatedNumber end={faculty.totalUnallocated} suffix=" soat" />
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">
                <AnimatedNumber end={faculty.percentage} suffix="%" />
              </span>
            </div>
          </div>

          {/* Card Content: Bar Chart (Left) + Arc Gauge (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              {/* Legend */}
              <div className="flex items-center gap-6 mb-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>Taqsimlangan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-rose-400 inline-block"></span>
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>Taqsimlanmagan</span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={faculty.departments} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#f1f5f9"} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip isDark={isDark} />}
                      cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
                    />
                    <Bar dataKey="allocated" name="Taqsimlangan" stackId="a" fill="#34d399" />
                    <Bar dataKey="unallocated" name="Taqsimlanmagan" stackId="a" fill="#f87171" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Arc Gauge */}
            <div className="flex flex-col items-center justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-700/60 pl-0 lg:pl-6">
              <ArcGauge percentage={faculty.percentage} isDark={isDark} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
