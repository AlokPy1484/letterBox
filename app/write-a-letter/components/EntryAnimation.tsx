import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

export default function EntryAnimation({ children, className }: { children: ReactNode; className?: string }) {
    const reduceMotion = useReducedMotion()
    return <motion.div className={className} initial={{ y: reduceMotion ? 0 : 4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.6 }}>{children}</motion.div>
}
