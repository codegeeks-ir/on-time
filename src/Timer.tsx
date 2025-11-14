import { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react'
import type { scheduleType } from './xlsxLoader'
import { LucideClockAlert, MapPinX } from 'lucide-react'
import Counter from './Counter'
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

  function format(time: string) {
    if (format24) return time
    else {
      const [hour, min] = time.split(':').map((item) => parseInt(item, 10))
      return (
        <span className="relative">
          {hour > 12
            ? `${hour - 12}:${String(min).padStart(2, '0')}`
            : `${hour}:${String(min).padStart(2, '0')}`}
          <span className="text-x2sm absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-5 opacity-50">
            {hour > 12 ? 'ب.ظ' : 'ق.ظ'}
          </span>
        </span>
      )
    }
  }

  return (
    <>
      <div className="rtl flex gap-2 text-2xl font-bold text-neutral-600">
        <h2 className="flex h-14 flex-1 items-center justify-center rounded bg-neutral-50 p-3 text-lg font-black tracking-wide">
          {timer.origin}
        </h2>
        <h2 className="flexjustify-center h-14 items-center rounded bg-neutral-50 p-3 text-lg font-black tracking-wide">
          به
        </h2>
        <h2 className="flexjustify-center items-cente roundedr h-14 flex-1 bg-neutral-50 p-3 text-lg font-black tracking-wide">
          {timer.destiny}
        </h2>
      </div>
      <div className="mx-auto mt-4 max-w-md">
        {timeIndex >= 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 rounded bg-neutral-50 p-5 text-neutral-600">
            <span className="rtl font-bold">زمان باقی مانده:</span>
            <div className="flex items-center justify-center gap-1">
              <LucideClockAlert size={24} />

              <Counter
                value={RemainingTime.hour}
                places={[10, 1]}
                fontSize={24}
                fontWeight={'900'}
              />
              <span className="text-4xl">:</span>
              <Counter
                value={RemainingTime.min}
                places={[10, 1]}
                fontSize={24}
                fontWeight={'900'}
              />
              <span className="text-4xl">:</span>
              <Counter
                value={RemainingTime.sec}
                places={[10, 1]}
                fontSize={24}
                fontWeight={'900'}
              />
            </div>

            <div className="rtl flex gap-2"></div>
          </div>
        ) : (
          times.length > 0 && (
            <div className="rtl flex flex-col items-center justify-center gap-3 rounded bg-neutral-50 p-5 font-bold text-neutral-600">
              <MapPinX size={48} />
              <p>اتوبوسی پس از این زمان نیست!</p>
            </div>
          )
        )}
        {timesManager()}
        {times.length == 0 && (
          <div className="rtl flex flex-col items-center justify-center gap-3 rounded bg-neutral-50 p-5 font-bold text-neutral-600">
            <MapPinX size={48} />
            <p>لیستی برای این برنامه زمانی تعریف نشده است!</p>
          </div>
        )}
        <ul className="rtl mt-5 grid grid-cols-4 gap-3 text-sm">
          {times.map((time, index) => (
            <li
              key={time.toString()}
              className={`${index === timeIndex ? 'bg-primary shadow-primary ripple text-white' : 'bg-neutral-100 text-neutral-700 shadow-neutral-100'} relative rounded-xl px-2 py-3 font-bold tracking-widest shadow`}
            >
              {format(time)}
            </li>
          ))}
        </ul>
        {timer.comment && (
          <div className="rtl mt-8 text-right leading-5 text-neutral-600">
            <span className="text-darker font-bold">یادداشت‌ها:&nbsp; </span>
            {timer.comment.split('\n').map((comment, index) => (
              <p key={comment} className="mt-2">
                {comment}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default memo(Timer)
