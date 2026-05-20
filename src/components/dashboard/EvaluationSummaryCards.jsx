import { BarChart3, ClipboardList, Trophy } from "lucide-react"
import { CRITERIA, DEMO_CRITERIA_EVAL, TOTAL_MAX_SCORE } from "../../data/criteria.js"

function ScoreBar({ dark, value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
      <div
        className="dashboard-scorebar-in h-full rounded-full bg-teal-500 transition-[width] duration-300"
        style={{ width: `${pct}%`, animationDelay: "220ms" }}
      />
    </div>
  )
}

/** Dashboard: umumiy natija — jami ball va mezonlar soni */
export default function EvaluationSummaryCards({ dark }) {
  const subtitle = dark ? "text-slate-400" : "text-slate-500"
  const titleClr = dark ? "text-slate-100" : "text-slate-900"
  const cardBase = dark ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white shadow-sm"

  const totalCollected = CRITERIA.reduce((sum, c) => sum + (DEMO_CRITERIA_EVAL[c.id]?.collected ?? 0), 0)

  const totalPercent = TOTAL_MAX_SCORE > 0 ? ((totalCollected / TOTAL_MAX_SCORE) * 100).toFixed(1) : "0"

  const statCards = [
    {
      key: "max",
      icon: Trophy,
      iconWrap: dark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600",
      value: `${TOTAL_MAX_SCORE} / ${TOTAL_MAX_SCORE}`,
      label: "Jami maksimal ball",
    },
    {
      key: "collected",
      icon: BarChart3,
      iconWrap: dark ? "bg-teal-500/15 text-teal-300" : "bg-teal-50 text-teal-600",
      value: `${totalCollected} / ${TOTAL_MAX_SCORE}`,
      label: "Jami yig'ilgan ball",
      extra: (
        <div className="mt-3 space-y-1">
          <ScoreBar dark={dark} value={totalCollected} max={TOTAL_MAX_SCORE} />
          <p className={`text-xs font-semibold ${subtitle}`}>{totalPercent}%</p>
        </div>
      ),
    },
    {
      key: "criteria",
      icon: ClipboardList,
      iconWrap: dark ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-600",
      value: String(CRITERIA.length),
      label: "Mezonlar soni",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="dashboard-stat-in" style={{ animationDelay: "0ms" }}>
        <h2 className={`text-xl font-bold tracking-tight sm:text-2xl ${titleClr}`}>Umumiy natija</h2>
        <p className={`mt-1 text-sm ${subtitle}`}>Mezonlar bo'yicha yig'ilgan ball va holat</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map(({ key, icon: Icon, iconWrap, value, label, extra }, i) => (
          <div
            key={key}
            className={`dashboard-stat-in rounded-xl border p-4 ${cardBase}`}
            style={{ animationDelay: `${70 + i * 75}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}>
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-lg font-bold tracking-tight ${titleClr}`}>{value}</p>
                <p className={`text-sm ${subtitle}`}>{label}</p>
                {extra}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
