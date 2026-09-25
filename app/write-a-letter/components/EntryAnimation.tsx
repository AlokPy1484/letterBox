import { motion } from "motion/react"






export default function EntryAnimation({ children, className, ...props }: { children: React.ReactNode, className: string, props: any }) {
    return (
        <motion.div
            {...props}
            className={className}
            initial={{
                y: 4,
                opacity: 0
            }}
            animate={{
                y: 0,
                opacity: 1
            }}
            transition={{
                duration: 0.6,
                ease: "easeInOut"
            }}>

            {children}
        </motion.div>
    )
}