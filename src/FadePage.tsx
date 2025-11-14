import { motion } from 'motion/react'
function FadePage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: 'easeIn', duration: 0.3, delay: 0.1 }}
      key={location.pathname}
    >
      {children}
    </motion.div>
  )
}

export default FadePage
