import { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react'
import type { scheduleType } from './xlsxLoader'
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

  const calcRemainingTime = useCallback(
    (time: string) => {
      if (!time) return
      const [hour, min] = time.split(':').map((item) => parseInt(item, 10))
      const currentInt =
        current.getHours() * 3600 + current.getMinutes() * 60 + current.getSeconds()
      const target = hour * 3600 + min * 60
      const remainingTime = target - currentInt
      const remainingHour = Math.floor(remainingTime / 3600)
      Math.floor(remainingTime / 3600)
      if (currentInt >= target) return 'PASS'
      if (remainingHour > 0) {
        return 'بیشتر از یک ساعت'
      }
      return `${remainingHour > 0 ? `${remainingHour} ساعت،` : ''} ${Math.floor(
        (remainingTime % 3600) / 60
      )} دقیقه، ${Math.floor((remainingTime % 3600) % 60)} ثانیه`
    },
    [current]
  )

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

  function format(time: string) {
    if (format24) return time
    else {
      const [hour, min] = time.split(':').map((item) => parseInt(item, 10))
      return (
        <span className="relative">
          {hour > 12
            ? `${hour - 12}:${String(min).padStart(2, '0')}`
            : `${hour}:${String(min).padStart(2, '0')}`}
          <span className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-5 text-x2sm opacity-50">
            {hour > 12 ? 'ب.ظ' : 'ق.ظ'}
          </span>
        </span>
      )
    }
  }

  return (
    <>
      <h2 className="text-2xl font-extrabold text-zinc-600">{`${timer.origin} به ${timer.destiny}`}</h2>
      <div className="mx-auto mt-5 max-w-sm">
        {timeIndex >= 0 ? (
          <p className="rtl text-zinc-500">
            زمان باقی‌مانده: {calcRemainingTime(times[timeIndex])}
          </p>
        ) : (
          <p className="rtl text-zinc-500">اتوبوسی پس از این زمان نیست</p>
        )}
        {timesManager()}
        {times.length == 0 && (
          <p className="rtl text-zinc-500">لیستی برای این برنامه زمانی تعریف نشده است</p>
        )}
        <ul className="rtl mt-5 grid grid-cols-4 gap-3 text-sm">
          {times.map((time, index) => (
            <li
              key={time.toString()}
              className={
                index === timeIndex
                  ? 'time-box animate-pulse bg-primary shadow-primary'
                  : 'time-box'
              }
            >
              {format(time)}
            </li>
          ))}
        </ul>
                {timer.comment && <p className='rtl mt-10 text-neutral-600 leading-loose'><span className='font-bold'>یادداشت:&nbsp; </span>{timer.comment}</p>}
      </div>
    </>
  )
}

export default memo(Timer)
