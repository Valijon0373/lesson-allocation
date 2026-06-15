import { useEffect, useState } from "react"
import { Commet } from "react-loading-indicators"
import { fetchTeachersRatingInfo } from "../api/teachers"

export default function Rating() {
  const [ratingList, setRatingList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchTeachersRatingInfo()
        if (!cancelled) setRatingList(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Reyting yuklanmadi")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Reyting</h3>
        <div className="mt-3 flex items-center justify-center py-8">
          <Commet color="#4f46e5" size="small" text="" textColor="" />
        </div>
      </article>
    )
  }

  if (error) {
    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Reyting</h3>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {error}
        </p>
      </article>
    )
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Reyting</h3>
      <div className="mt-3 max-h-96 space-y-2 overflow-y-auto">
        {ratingList.map((item, index) => (
          <div
            key={`${item.teacherName}-${index}`}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
          >
            <p className="text-sm text-slate-700">
              {index + 1}. {item.teacherName}
            </p>
            <p className="text-sm font-bold text-indigo-700">{item.rating} ball</p>
          </div>
        ))}
        {ratingList.length === 0 && (
          <p className="text-sm text-slate-500">Hozircha reyting ma'lumotlari yo'q.</p>
        )}
      </div>
    </article>
  )
}