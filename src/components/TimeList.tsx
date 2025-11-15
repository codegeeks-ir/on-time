import { AnimatePresence, motion, Variants } from 'motion/react'

const TimeList = ({
  times,
  timeIndex,
  format24,
}: {
  times: string[]
  timeIndex: number
  format24: boolean
}) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }

  function format(time: string) {
    if (format24) return time
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

  return (
    <motion.ul className="mt-5 grid grid-cols-4 gap-3 text-sm">
      <AnimatePresence mode="popLayout">
        {times.map((time, index) => (
          <motion.li
            key={time}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${
              index === timeIndex
                ? 'bg-primary shadow-primary ripple text-white'
                : 'bg-neutral-100 text-neutral-700 shadow-neutral-100'
            } relative rounded-xl px-2 py-3 font-bold tracking-widest shadow`}
          >
            {format(time)}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}

export default TimeList
