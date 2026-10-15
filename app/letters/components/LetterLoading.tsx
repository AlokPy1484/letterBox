"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"
import styles from "./letter-loading.module.css"

const messages = ["Finding your letter…", "A little patience for something personal…", "Your words are worth the wait…"]

export default function LetterLoading({ state = "loading", onRetry }: {
    state?: "loading" | "not-found" | "error"; onRetry?: () => void
}) {
    const reduceMotion = useReducedMotion()
    const [messageIndex, setMessageIndex] = useState(0)
    const loading = state === "loading"
    useEffect(() => {
        if (!loading || reduceMotion) return
        const timer = setInterval(() => setMessageIndex(index => (index + 1) % messages.length), 3000)
        return () => clearInterval(timer)
    }, [loading, reduceMotion])

    const title = loading ? "Opening your letter" : state === "not-found" ? "Letter not found" : "A little interruption"
    const message = loading ? messages[reduceMotion ? 0 : messageIndex]
        : state === "not-found" ? "We couldn’t find this letter. Please check the link."
        : "Your letter couldn’t be loaded. Please try again."

    return <main className={styles.screen} aria-busy={loading}>
        <Link href="https://letter-box-landing.vercel.app" className={styles.brand}>Letter Box <span aria-hidden="true">✳</span></Link>
        <div className={styles.center}>
            <div className={`${styles.envelope} ${loading ? styles.floating : ""}`}>
                <svg className={styles.art} viewBox="0 0 600 500" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <path d="M22 205Q22 192 36 183L285 25Q300 16 315 25L564 183Q578 192 578 205V443Q578 475 548 475H52Q22 475 22 443Z" fill="#f8e8c8" stroke="#ead0a5" />
                    <rect x="60" y="100" width="480" height="315" rx="22" fill="#fff5df" stroke="#ead0a5" />
                    <path d="M22 205L300 401L578 205V443Q578 475 548 475H52Q22 475 22 443Z" fill="#fff0ce" stroke="#ead0a5" />
                    <path d="M30 462L205 333M570 462L395 333" fill="none" stroke="#dcb889" strokeWidth="1.3" />
                    <path d="M24 207L300 403L576 207" fill="none" stroke="#fff9e9" strokeWidth="2" />
                    <circle cx="300" cy="399" r="30" fill="#dca02b" stroke="#b78026" strokeWidth="2" />
                    <circle cx="300" cy="399" r="23" fill="#efb541" stroke="#bd8527" />
                    <path d="M300 412s-15-9-15-18c0-8 10-10 15-3 5-7 15-5 15 3 0 9-15 18-15 18Z" fill="#b47a20" stroke="#a8711f" />
                </svg>
                <div className={styles.paperText}>
                    <p className={styles.eyebrow}>A little something, just for you</p>
                    <h1>{title}</h1>
                    <div className={styles.messageArea}>
                        <p key={loading ? messageIndex : state} className={styles.message}>{message}</p>
                    </div>
                    {loading && <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>}
                </div>
            </div>
            {/* Keep screen-reader announcements stable rather than repeating decorative copy. */}
            <span className={styles.srOnly} role="status">{loading ? "Loading your letter. Please wait." : message}</span>
            {!loading && <div className={styles.actions}>
                {state === "error" && <button type="button" onClick={onRetry}>Try again</button>}
                <Link href="/">Return home</Link>
            </div>}
        </div>
        <p className={styles.caption}>Thoughtful words. Worth the wait.</p>
    </main>
}
