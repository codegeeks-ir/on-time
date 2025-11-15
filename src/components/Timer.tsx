import { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react'
import type { scheduleType } from '../lib/xlsxLoader'
import { AnimatePresence, motion } from 'motion/react'
import TimeList from './TimeList'
import RemainingBox from './RemainingBox'
function Timer({ timer, format24 }: { timer: scheduleType; format24: boolean }) {
  const [current, setCurrent] = useState(new Date())
  const [timeIndex, setTimeIndex] = useState(0)
  const timerRef = useRef(0)
  const [activeSub, setActiveSub] = useState(0)

  const times = useMemo((): string[] => {
    if (activeSub < timer.subSchedule.length) {
      return timer.subSchedule[activeSub].times
    } else {
      setActiveSub(0)
      return timer.subSchedule[0].times
    }
  }, [activeSub, timer])

  // This function only depends on `timer.times`, so we use useCallback to avoid re-creating it.
  const closestTime = useCallback(
    (hour: number, min: number): [string, number] => {
      const timeList = times
      const total = hour * 60 + min
      for (let i = 0; i < timeList.length; i++) {
        const [targetHour, targetMin] = timeList[i].split(':')
        const target = parseInt(targetHour, 10) * 60 + parseInt(targetMin, 10)
        if (total < target) {
          return [timeList[i], i]
        } else if (total === target && i < timeList.length - 1) {
          return [timeList[i + 1], i + 1]
        }
      }
      return ['-1', -1]
    },
    [times]
  )

  const RemainingTime = useMemo(() => {
    if (timeIndex < 0 || times[timeIndex] == null) return { hour: 0, min: 0, sec: 0 }
    const time = times[timeIndex]
    const [hour, min] = time.split(':').map((item) => parseInt(item, 10))
    const currentInt = current.getHours() * 3600 + current.getMinutes() * 60 + current.getSeconds()
    const target = hour * 3600 + min * 60
    const totalTime = target - currentInt
    const remainingHour = Math.floor(totalTime / 3600)
    const remainingMin = Math.floor((totalTime % 3600) / 60)
    const remainingSec = Math.floor((totalTime % 3600) % 60)
    return {
      hour: remainingHour,
      min: remainingMin,
      sec: remainingSec,
    }
  }, [times, timeIndex, current])

  // Effect to update `current` every second without affecting the parent component
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(new Date())
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [])

  // Effect to calculate the closest time only when `timer.times` changes
  useEffect(() => {
    const [, index] = closestTime(current.getHours(), current.getMinutes())
    setTimeIndex(index)
  }, [closestTime, current])

  function timesManager() {
    if (timer.subSchedule.length > 0) {
      const subSelector = timer.subSchedule.map((sub, index) => {
        return (
          <button
            type="button"
            className={activeSub === index ? 'selected glass-button' : 'glass-button'}
            onClick={() => setActiveSub(index)}
            key={sub.name}
          >
            {sub.name}
          </button>
        )
      })
      return <div className="rtl m-4 flex justify-center gap-3 text-sm">{subSelector}</div>
    }
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
        <div className="flex h-14 items-center justify-center rounded bg-neutral-50 p-3 text-lg font-black tracking-wide">
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
      <div className="mx-auto mt-4 max-w-md">
        <RemainingBox
          RemainingTime={RemainingTime}
          timeIndex={timeIndex}
          timeLength={times.length}
        />
        {timesManager()}
        <TimeList times={times} timeIndex={timeIndex} format24={format24} />
        {timer.comment && (
          <motion.div
            className="rtl mt-8 text-right leading-5 text-neutral-600"
            initial={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
          >
            <span className="text-darker font-bold">یادداشت‌ها:&nbsp; </span>
            {timer.comment.split('\n').map((comment, index) => (
              <p key={comment} className="mt-2">
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
