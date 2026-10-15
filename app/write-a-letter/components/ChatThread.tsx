"use client"

import React, { useEffect, useRef } from "react"

import styles from "../write-letter.module.css"

interface ChatThreadProps {
    children: React.ReactNode
}

export default function ChatThread({ children }: ChatThreadProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when children change
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        const observer = new MutationObserver(() => {
            container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
        })

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={scrollRef}
            className={styles.thread}
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
        >
            <div className={styles.threadInner}>
                {children}
            </div>
        </div>
    )
}
