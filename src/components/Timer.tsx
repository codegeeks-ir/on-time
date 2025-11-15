import { useEffect, useRef, useState, memo, useMemo } from 'react'
import type { scheduleType } from '../lib/xlsxLoader'
import { AnimatePresence, motion } from 'motion/react'
import TimeList from './TimeList'
import RemainingBox from './RemainingBox'

function Timer({
  timer,
  format24,
  activeTimer,
}: {
  timer: scheduleType
  format24: boolean
  activeTimer: number
}) {
  const [current, setCurrent] = useState(new Date())
  const timerRef = useRef<number | null>(null)
  const [activeSub, setActiveSub] = useState(0)

  // Keep activeSub bounded in an effect (safe)
  useEffect(() => {
    if (activeSub >= timer.subSchedule.length) setActiveSub(0)
  }, [activeSub, timer.subSchedule.length])

  // times is pure derived data
  const times = useMemo(() => {
    return timer.subSchedule[activeSub]?.times ?? []
  }, [activeSub, timer.subSchedule])

  // computeIndex: pure helper — deterministic, synchronous
  const computeIndex = (timesArr: string[], now: Date) => {
    if (!timesArr || timesArr.length === 0) return -1
    const total = now.getHours() * 60 + now.getMinutes()
    for (let i = 0; i < timesArr.length; i++) {
      const [h, m] = timesArr[i].split(':').map(Number)
      const t = h * 60 + m
      if (total < t) return i
      if (total === t && i < timesArr.length - 1) return i + 1
    }
    return -1
  }

  // DERIVED synchronously during render: no state, no flicker
  const derivedIndex = useMemo(() => computeIndex(times, current), [times, current])

  // RemainingTime computed from derivedIndex (also synchronous)
  const RemainingTime = useMemo(() => {
    if (derivedIndex < 0 || !times[derivedIndex]) return { hour: 0, min: 0, sec: 0 }

    const [h, m] = times[derivedIndex].split(':').map(Number)
    const nowSec = current.getHours() * 3600 + current.getMinutes() * 60 + current.getSeconds()
    const targetSec = h * 3600 + m * 60
    const diff = Math.max(targetSec - nowSec, 0)

    return {
      hour: Math.floor(diff / 3600),
      min: Math.floor((diff % 3600) / 60),
      sec: diff % 60,
    }
  }, [times, derivedIndex, current])

  // tick every second
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCurrent(new Date())
    }, 1000)
    return () => {
      if (timerRef.current != null) clearInterval(timerRef.current)
    }
  }, [])

  // Sub schedule buttons (unchanged)
  function timesManager() {
    if (timer.subSchedule.length > 0) {
      return (
        <div className="rtl m-4 flex justify-center gap-3 text-sm">
          {timer.subSchedule.map((sub, index) => (
            <button
              type="button"
              key={sub.name ?? index}
              className={activeSub === index ? 'selected glass-button' : 'glass-button'}
              onClick={() => setActiveSub(index)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <>
      <div className="rtl flex gap-2 text-2xl font-bold text-neutral-600">
        <div className="items-cente roundedr flex h-14 flex-1 justify-center overflow-hidden bg-neutral-50 p-3 text-lg font-black tracking-wide">
          <AnimatePresence mode="wait">
            <motion.h2
              initial={{ marginTop: '-50px', opacity: 0 }}
              animate={{ marginTop: 0, opacity: 1 }}
              exit={{ marginTop: '50px', opacity: 0 }}
              key={timer.origin}
            >
              {timer.origin}
            </motion.h2>
          </AnimatePresence>
        </div>

        <div className="flex h-14 w-12 items-center justify-center rounded bg-neutral-50 p-3 text-lg font-black tracking-wide">
          <h2>به</h2>
        </div>

        <div className="flex h-14 flex-1 items-center justify-center overflow-hidden rounded bg-neutral-50 p-3 text-lg font-black tracking-wide">
          <AnimatePresence mode="wait">
            <motion.h2
              initial={{ marginTop: '-50px', opacity: 0 }}
              animate={{ marginTop: 0, opacity: 1 }}
              exit={{ marginTop: '50px', opacity: 0 }}
              key={timer.destiny}
            >
              {timer.destiny}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-md">
        <RemainingBox
          RemainingTime={RemainingTime}
          timeIndex={derivedIndex}
          timeLength={times.length}
        />

        {timesManager()}

        <TimeList times={times} timeIndex={derivedIndex} format24={format24} />

        {timer.comment && (
          <motion.div
            className="rtl mt-8 text-right leading-5 text-neutral-600"
            initial={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
          >
            <span className="text-darker font-bold">یادداشت‌ها:&nbsp; </span>
            {timer.comment.split('\n').map((comment, i) => (
              <p key={i} className="mt-2">
                {comment}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </>
  )
}

export default memo(Timer)
