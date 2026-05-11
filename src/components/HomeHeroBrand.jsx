import { useEffect, useState } from "react"

/** Asosiy sahifa — "110" va o'rtada oq chiziqdagi "BALLIK TIZIM" brendi (CSS, #2b59ad). */
const BRAND = "#2b59ad"
const WELCOME_FULL = "Xush kelibsiz!"

const TYPE_MS = 58
const PAUSE_AT_FULL_MS = 2200

function WelcomeTypewriter() {
  const [len, setLen] = useState(0)
  const typing = len < WELCOME_FULL.length

  useEffect(() => {
    let cancelled = false
    let tid = 0
    let pos = 0

    const schedule = (ms, fn) => {
      tid = window.setTimeout(fn, ms)
    }

    const tick = () => {
      if (cancelled) return
      if (pos < WELCOME_FULL.length) {
        pos += 1
        setLen(pos)
        schedule(TYPE_MS, tick)
      } else {
        schedule(PAUSE_AT_FULL_MS, () => {
          if (cancelled) return
          pos = 0
          setLen(0)
          schedule(TYPE_MS, tick)
        })
      }
    }

    schedule(TYPE_MS, tick)
    return () => {
      cancelled = true
      window.clearTimeout(tid)
    }
  }, [])

  return (
    <p
      className="relative min-h-[2.75rem] max-w-xl text-center text-2xl font-semibold tracking-tight text-white drop-shadow-sm sm:min-h-[3.25rem] sm:text-3xl"
      aria-label={WELCOME_FULL}
      aria-live="off"
    >
      <span>{WELCOME_FULL.slice(0, len)}</span>
      {typing && (
        <span
          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.08em] animate-pulse bg-white/90 align-middle"
          aria-hidden
        />
      )}
    </p>
  )
}

export default function HomeHeroBrand() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 px-2 sm:gap-7">
      <header className="max-w-xl text-center">
        <p className="text-lg font-medium leading-snug text-white/90 sm:text-xl">
          Urganch davlat Pedagogika Instituti
        </p>
      </header>
      <div
        className="relative inline-block text-center drop-shadow-[0_6px_28px_rgba(0,0,0,0.22)]"
        style={{ color: BRAND }}
        aria-label="110 ballik tizim"
      >
        <span
          className="flex items-baseline justify-center gap-[0.03em] font-black leading-[0.82] tracking-[-0.07em] antialiased"
          style={{
            fontSize: "clamp(5.5rem, 28vw, 14rem)",
          }}
        >
          <span
            className="inline-block [clip-path:polygon(0_11%,_13%_0,_100%_0,_100%_100%,_0_100%)]"
            aria-hidden
          >
            1
          </span>
          <span
            className="inline-block [clip-path:polygon(0_11%,_13%_0,_100%_0,_100%_100%,_0_100%)]"
            aria-hidden
          >
            1
          </span>
          <span className="inline-block rounded-[0.14em] px-[0.02em]">0</span>
        </span>
        <div
          className="pointer-events-none absolute left-1/2 top-[calc(50%+1em)] z-10 flex w-[108%] max-w-[min(100%,42rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white py-[0.22em] shadow-[0_0_0_1px_rgba(43,89,173,0.08)]"
          aria-hidden
        >
          <span
            className="whitespace-nowrap font-bold uppercase tracking-[0.22em] sm:tracking-[0.32em]"
            style={{
              color: BRAND,
              fontSize: "clamp(0.65rem, 3vw, 1.05rem)",
            }}
          >
            Ballik tizimga
          </span>
        </div>
      </div>
      <WelcomeTypewriter />
    </div>
  )
}
