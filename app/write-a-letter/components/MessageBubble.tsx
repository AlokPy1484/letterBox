"use client"

import { motion, useReducedMotion } from "motion/react"
import React from "react"

import styles from "../write-letter.module.css"

export type MessageRole = "assistant" | "user"

interface MessageBubbleProps {
    role: MessageRole
    children: React.ReactNode
    className?: string
}

export default function MessageBubble({ role, children, className = "" }: MessageBubbleProps) {
    const reduceMotion = useReducedMotion()
    const isUser = role === "user"

    return (
        <motion.div
            className={`flex w-full ${isUser ? "justify-end" : "justify-start"} ${className}`}
            initial={{ y: reduceMotion ? 0 : 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
        >
            <div
                className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}
            >
                {children}
            </div>
        </motion.div>
    )
}
