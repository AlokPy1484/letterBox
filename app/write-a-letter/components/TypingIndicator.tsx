"use client"

import { motion } from "motion/react"

export default function TypingIndicator() {
    return (
        <motion.div
            className="flex justify-start w-full"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-amber-100 text-neutral-900 rounded-2xl rounded-bl-md">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="block w-2 h-2 rounded-full bg-amber-700/60"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </motion.div>
    )
}
