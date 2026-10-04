"use client"

import { motion } from "motion/react"
import React from "react"

export type MessageRole = "assistant" | "user"

interface MessageBubbleProps {
    role: MessageRole
    children: React.ReactNode
    className?: string
}

export default function MessageBubble({ role, children, className = "" }: MessageBubbleProps) {
    const isUser = role === "user"

    return (
        <motion.div
            className={`flex w-full ${isUser ? "justify-end" : "justify-start"} ${className}`}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <div
                className={`
                    max-w-[80%] px-4 py-2.5 text-lg leading-relaxed
                    ${isUser
                        ? "bg-amber-800 text-amber-50 rounded-2xl rounded-br-md"
                        : "bg-amber-100 text-neutral-900 rounded-2xl rounded-bl-md"
                    }
                `}
            >
                {children}
            </div>
        </motion.div>
    )
}
