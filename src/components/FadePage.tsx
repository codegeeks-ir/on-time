import { motion } from 'motion/react'
function FadePage({ children, title }: { children: React.ReactNode; title: string }) {
  const css = `.header{min-height:100px;!important}`
  return (
    <div className="rtl mx-auto flex max-w-3xl flex-col gap-6">
      <style>{css}</style>
      <h1 className="border-primary text-primary border-b text-2xl font-bold">{title}</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeIn', duration: 0.3, delay: 0.1 }}
        key={location.pathname}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default FadePage
