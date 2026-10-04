"use client"

import React, { useEffect, useRef } from "react"

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
            className="flex-1 overflow-y-auto overflow-x-hidden"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
        >
            <div className="mx-auto max-w-3xl w-full px-4 py-4 flex flex-col gap-3">
                {children}
            </div>
        </div>
    )
}
