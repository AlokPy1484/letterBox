"use client"

import Letter from "@/components/LetterComponent"
import { type LetterDataType } from "@/app/types/letters"
import { fetchLetter } from "@/lib/supabase/fetch-letter"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import LetterLoading from "../components/LetterLoading"
import styles from "../components/letter-loading.module.css"

type FetchState = { slug: string; attempt: number } & (
    | { status: "loading" | "not-found" | "error" }
    | { status: "ready"; letter: LetterDataType }
)

export default function LetterPage() {
    const { slug } = useParams<{ slug: string }>()
    const [attempt, setAttempt] = useState(0)
    const [result, setResult] = useState<FetchState | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        void fetchLetter(slug, controller.signal).then(letter => {
            if (!controller.signal.aborted) setResult(letter
                ? { slug, attempt, status: "ready", letter }
                : { slug, attempt, status: "not-found" })
        }).catch(() => {
            if (!controller.signal.aborted) setResult({ slug, attempt, status: "error" })
        })
        return () => controller.abort()
    }, [slug, attempt])

    // A new slug or retry must never show the previous letter while it loads.
    const current = result?.slug === slug && result.attempt === attempt ? result : null
    if (!current || current.status === "loading") return <LetterLoading />
    if (current.status !== "ready") return <LetterLoading state={current.status} onRetry={() => setAttempt(value => value + 1)} />
    return <div key={slug} className={styles.reveal}><Letter letterData={current.letter} /></div>
}
