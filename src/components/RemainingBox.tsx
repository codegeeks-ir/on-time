import { Ghost, LucideClockAlert, MapPinX } from 'lucide-react'
import Counter from './Counter'

function RemainingBox({
  RemainingTime,
  timeIndex,
  timeLength,
}: {
  RemainingTime: { hour: number; min: number; sec: number }
  timeIndex: number
  timeLength: number
}) {
  let content

  if (timeLength == 0) {
    content = (
      <>
        <Ghost size={48} />
        <p className="rtl">لیستی برای این برنامه زمانی تعریف نشده است!</p>
      </>
    )
  } else if (timeIndex < 0) {
    content = (
      <>
        <MapPinX size={48} />
        <p className="rtl">اتوبوسی پس از این زمان نیست!</p>
      </>
    )
  } else {
    content = (
      <>
        <span className="rtl flex items-center justify-center gap-1 font-bold">
          <LucideClockAlert size={20} strokeWidth={3} />
          زمان باقی مانده:
        </span>
        <div className="flex items-center justify-center gap-1">
          <Counter value={RemainingTime.hour} places={[10, 1]} fontSize={24} fontWeight={'900'} />
          <span className="text-4xl">:</span>
          <Counter value={RemainingTime.min} places={[10, 1]} fontSize={24} fontWeight={'900'} />
          <span className="text-4xl">:</span>
          <Counter value={RemainingTime.sec} places={[10, 1]} fontSize={24} fontWeight={'900'} />
        </div>
      </>
    )
  }
  return (
    <div className="flex h-32 flex-col items-center justify-center gap-2 rounded bg-neutral-50 text-neutral-600">
      {content}
    </div>
  )
}

export default RemainingBox
