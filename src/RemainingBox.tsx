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
  return (
    <div className="flex h-32 flex-col items-center justify-center gap-2 rounded bg-neutral-50 text-neutral-600">
      {/* no list defined */}
      {timeLength == 0 && (
        <div className="rtl flex h-32 flex-col items-center justify-center gap-3 rounded bg-neutral-50 font-bold text-neutral-600">
          <Ghost size={48} />
          <p>لیستی برای این برنامه زمانی تعریف نشده است!</p>
        </div>
      )}
      {/* no bus after this time */}
      {timeLength !== 0 && timeIndex < 0 && (
        <div className="rtl flex h-32 flex-col items-center justify-center gap-3 rounded bg-neutral-50 font-bold text-neutral-600">
          <MapPinX size={48} />
          <p>اتوبوسی پس از این زمان نیست!</p>
        </div>
      )}
      {/* the actuall remaning box */}
      {timeLength !== 0 && timeIndex >= 0 && (
        <>
          <span className="rtl flex items-center justify-center font-bold">زمان باقی مانده:</span>
          <div className="flex items-center justify-center gap-1">
            <LucideClockAlert size={24} />
            <Counter value={RemainingTime.hour} places={[10, 1]} fontSize={24} fontWeight={'900'} />
            <span className="text-4xl">:</span>
            <Counter value={RemainingTime.min} places={[10, 1]} fontSize={24} fontWeight={'900'} />
            <span className="text-4xl">:</span>
            <Counter value={RemainingTime.sec} places={[10, 1]} fontSize={24} fontWeight={'900'} />
          </div>
        </>
      )}
    </div>
  )
}

export default RemainingBox
