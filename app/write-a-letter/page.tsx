"use client"


import React, { useCallback, useEffect, useRef, useState } from "react"
import { submitLetter } from "@/lib/supabase/submit-letter"
import { LetterData, letterSchema, messageSchema, recipientNameSchema, themeSchema, userNameSchema } from "@/schema/letter"
import z from "zod"
import Link from "next/link"

import ChatThread from "./components/ChatThread"
import ChatComposer from "./components/ChatComposer"
import MessageBubble from "./components/MessageBubble"
import ThemeSelector from "./components/ThemeSelector"
import TypingIndicator from "./components/TypingIndicator"

import EntryAnimation from "./components/EntryAnimation"
import LetterPreview, { type LetterPreviewData } from "./components/LetterPreview"
import styles from "./write-letter.module.css"


// ─── Conversation step definitions ───────────────────────────────────────────

type Step =
    | "welcome"
    | "ask_name"
    | "ask_recipient"
    | "ask_theme"
    | "ask_message"
    | "submitting"
    | "done"
    | "failed"

interface ChatMessage {
    id: string
    role: "assistant" | "user"
    content: string
    /** Special inline widget to render instead of/after content */
    widget?: "theme_selector"
    submission?: "pending" | "saved" | "failed"
    letterUrl?: string
    preview?: LetterPreviewData
}

// Assistant prompts for each step
const ASSISTANT_PROMPTS: Partial<Record<Step, string[]>> = {
    ask_name: ["What should I call you?"],
    ask_recipient: [], // dynamic — set with name
    ask_theme: [
        "Pick a theme for your letter. It will shape the mood, colors, and atmosphere of your message, helping us turn your thoughts into something memorable, personal, and meaningful to keep.",
    ],
    ask_message: [
        "Now write your letter! Pour your heart out — this is the message your recipient will read.",
    ],
}

// ─── Main page component ─────────────────────────────────────────────────────

export default function WriteALetterPage() {
    // ── State ──────────────────────────────────────────────────────────────
    const [currentStep, setCurrentStep] = useState<Step>("welcome")
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [, setErrors] = useState<Partial<Record<keyof LetterData, string>>>({})

    const [letterData, setLetterData] = useState<Omit<LetterData, "theme"> & { theme: LetterData["theme"] | "" }>(() => ({
        id: crypto.randomUUID(),
        slug: crypto.randomUUID().slice(0, 8),
        sender_name: "",
        recipient_name: "",
        theme: "",
        message: "",
    }))

    const inFlight = useRef(false)
    const submittedPayload = useRef<LetterData | null>(null)
    const [submissionBubbleId, setSubmissionBubbleId] = useState<string | null>(null)

    // ── Helpers ────────────────────────────────────────────────────────────
    const updateLetter = <K extends keyof LetterData>(key: K, value: LetterData[K]) => {
        setLetterData(prev => ({ ...prev, [key]: value }))
    }

    const validateField = <K extends keyof LetterData>(
        key: K,
        value: LetterData[K],
        schema: z.ZodType
    ): boolean => {
        const result = schema.safeParse(value)
        if (!result.success) {
            setErrors(prev => ({ ...prev, [key]: result.error.issues[0].message }))
            return false
        }
        setErrors(prev => ({ ...prev, [key]: undefined }))
        return true
    }

    const addMessage = useCallback((msg: Omit<ChatMessage, "id">) => {
        setMessages(prev => [...prev, { ...msg, id: crypto.randomUUID() }])
    }, [])

    const addAssistantMessage = useCallback(
        (content: string, widget?: ChatMessage["widget"]) => {
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                addMessage({ role: "assistant", content, widget })
            }, 600)
        },
        [addMessage]
    )

    // ── Step transitions ───────────────────────────────────────────────────

    // Welcome → ask_name on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentStep("ask_name")
        }, 1200)
        return () => clearTimeout(timer)
    }, [])

    // Schedule conversational prompts and cancel them if the step changes.
    useEffect(() => {
        if (currentStep === "welcome" || currentStep === "submitting" || currentStep === "done" || currentStep === "failed") return
        const content = currentStep === "ask_recipient" ? `Hello ${letterData.sender_name} 😊`
            : ASSISTANT_PROMPTS[currentStep]?.[0]
        if (!content) return
        const typingTimer = setTimeout(() => setIsTyping(true), 0)
        const promptTimer = setTimeout(() => {
            setIsTyping(false)
            addMessage({ role: "assistant", content })
        }, 600)
        const followupTimer = setTimeout(() => {
            if (currentStep === "ask_recipient") addMessage({ role: "assistant", content: "This letter is dedicated to whom?" })
            if (currentStep === "ask_theme") addMessage({ role: "assistant", content: "", widget: "theme_selector" })
        }, 1000)
        return () => {
            clearTimeout(typingTimer)
            clearTimeout(promptTimer)
            clearTimeout(followupTimer)
        }
    }, [currentStep, letterData.sender_name, addMessage])

    // ── Form submit (Supabase) ─────────────────────────────────────────────
    const handleFormSubmit = async (finalData: LetterData, retry = false) => {
        if (inFlight.current) return
        inFlight.current = true
        submittedPayload.current = finalData
        setCurrentStep("submitting")
        setIsTyping(false)
        const statusId = retry && submissionBubbleId ? submissionBubbleId : crypto.randomUUID()
        setSubmissionBubbleId(statusId)
        const pending: ChatMessage = { id: statusId, role: "assistant", content: "Sending your letter…", submission: "pending" }
        setMessages(prev => retry ? prev.map(msg => msg.id === statusId ? pending : msg) : [...prev, pending])

        try {
            const saved = await submitLetter(finalData)
            // Local development uses the requested HTTP link; deployed links use the current origin.
            const origin = window.location.hostname === "localhost" ? "http://localhost:3000" : window.location.origin
            const letterUrl = `${origin}/letters/${encodeURIComponent(saved.slug)}`
            setMessages(prev => [...prev.map(msg => msg.id === statusId ? { ...msg, content: "Your letter was saved successfully. It’s ready to share.", submission: "saved" as const } : msg), {
                id: crypto.randomUUID(), role: "assistant", content: "You can view your letter at:", letterUrl,
                preview: { theme: finalData.theme, sender_name: finalData.sender_name, recipient_name: finalData.recipient_name },
            }])
            setLetterMessage("")
            setCurrentStep("done")
        } catch {
            setMessages(prev => prev.map(msg => msg.id === statusId ? { ...msg, content: "Your letter couldn’t be saved. Your words are still here. Please try again.", submission: "failed" as const } : msg))
            setCurrentStep("failed")
        } finally {
            inFlight.current = false
        }
    }

    const handleRetry = () => {
        if (currentStep !== "failed" || !submittedPayload.current) return
        void handleFormSubmit(submittedPayload.current, true)
    }

    const handleEditLetter = () => {
        if (currentStep === "failed" && !inFlight.current) setCurrentStep("ask_message")
    }

    // ── Composer send handler ──────────────────────────────────────────────
    const handleSend = () => {
        const trimmed = inputValue.trim()
        if (!trimmed) return

        if (currentStep === "ask_name") {
            if (!validateField("sender_name", trimmed, userNameSchema)) {
                addMessage({ role: "user", content: trimmed })
                addAssistantMessage(userNameSchema.safeParse(trimmed).error?.issues[0].message || "Please enter a valid name.")
                return
            }
            addMessage({ role: "user", content: trimmed })
            updateLetter("sender_name", trimmed)
            setInputValue("")
            setCurrentStep("ask_recipient")
        } else if (currentStep === "ask_recipient") {
            if (!validateField("recipient_name", trimmed, recipientNameSchema)) {
                addMessage({ role: "user", content: trimmed })
                addAssistantMessage(recipientNameSchema.safeParse(trimmed).error?.issues[0].message || "Please enter a valid name.")
                setInputValue("")
                return
            }
            addMessage({ role: "user", content: trimmed })
            updateLetter("recipient_name", trimmed)
            setInputValue("")
            setCurrentStep("ask_theme")
        }
    }

    // ── Theme selection handler ────────────────────────────────────────────
    const handleThemeSelect = (value: string) => {
        const result = themeSchema.safeParse(value)
        if (!result.success) return
        const theme = result.data
        addMessage({ role: "user", content: `Theme: ${theme}` })
        updateLetter("theme", themeSchema.parse(theme))
        setCurrentStep("ask_message")
    }

    // ── Message (letter body) submit handler ───────────────────────────────
    const [letterMessage, setLetterMessage] = useState("")

    const handleLetterSubmit = () => {
        if (currentStep !== "ask_message" || inFlight.current || isTyping) return
        const trimmed = letterMessage.trim()
        if (!validateField("message", trimmed, messageSchema)) {
            addAssistantMessage(messageSchema.safeParse(trimmed).error?.issues[0].message || "Please write a longer letter.")
            return
        }
        const parsed = letterSchema.safeParse({ ...letterData, message: trimmed })
        if (!parsed.success) {
            addAssistantMessage("Please check your letter details before sending.")
            return
        }
        addMessage({ role: "user", content: trimmed })
        setLetterData(parsed.data)
        void handleFormSubmit(parsed.data)
    }

    // ── Determine if composer is disabled ──────────────────────────────────
    const isExpanded = currentStep === "ask_message"

    const composerDisabled =
        isTyping ||
        currentStep === "welcome" ||
        currentStep === "ask_theme" ||
        currentStep === "submitting" ||
        currentStep === "failed" ||
        currentStep === "done"

    // ── Progress calculation ───────────────────────────────────────────────
    const stage = { welcome: 1, ask_name: 1, ask_recipient: 2, ask_theme: 3, ask_message: 4, submitting: 4, done: 4, failed: 4 }[currentStep]
    const stageNames = ["Your name", "Recipient", "Theme", "Letter"]
    const progressLabel = currentStep === "submitting" ? "Saving your letter…"
        : currentStep === "done" ? "Your letter is ready"
        : currentStep === "failed" ? "Letter not saved"
        : `Step ${stage} of 4 · ${stageNames[stage - 1]}`

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.headerRow}>
                        <Link href="https://letter-box-landing.vercel.app" className={styles.brand}>Letter Box<span aria-hidden="true">✳</span></Link>
                        <span className={styles.progressLabel} role="status">{progressLabel}</span>
                    </div>
                    <div className={styles.progress} role="progressbar" aria-label="Letter creation progress" aria-valuemin={0} aria-valuemax={4} aria-valuenow={currentStep === "done" ? 4 : stage - 1} aria-valuetext={progressLabel}>
                        {stageNames.map((name, index) => <span key={name} className={`${styles.progressSegment} ${index < stage - 1 || currentStep === "done" ? styles.complete : ""} ${index === stage - 1 && currentStep !== "done" ? styles.current : ""}`} />)}
                    </div>
                </div>
            </header>

            {/* ── Chat thread (scrollable area) ── */}
            <ChatThread>
                <EntryAnimation className={styles.welcome}>
                    <p className={styles.eyebrow}>A little thought. A lasting keepsake.</p>
                    <h1>A letter, from the heart.</h1>
                    <p className={styles.intro}>Welcome to LetterBox, a little place for thoughtful digital letters. A few simple questions will help make yours feel personal.</p>
                </EntryAnimation>

                {/* Message bubbles */}
                {messages.map((msg) => {
                    // Theme selector widget
                    if (msg.widget === "theme_selector") {
                        return (
                            <ThemeSelector
                                key={msg.id}
                                onSelect={handleThemeSelect}
                                selected={letterData.theme}
                                disabled={currentStep !== "ask_theme"}
                            />
                        )
                    }


                    return (
                        <React.Fragment key={msg.id}>
                            <MessageBubble role={msg.role}>
                                <div className={msg.submission === "pending" ? styles.sendingStatus : undefined}>
                                    {msg.submission === "pending" && <span className={styles.sendingDots} aria-hidden="true"><i /><i /><i /></span>}
                                    <span>{msg.content}</span>
                                </div>
                                {msg.letterUrl && <a className={styles.letterLink} href={msg.letterUrl}>{msg.letterUrl}</a>}
                                {msg.submission === "failed" && msg.id === submissionBubbleId && currentStep === "failed" && <div className={styles.submissionActions}>
                                    <button type="button" onClick={handleRetry}>Retry</button>
                                    <button type="button" onClick={handleEditLetter}>Edit letter</button>
                                </div>}
                            </MessageBubble>
                            {msg.letterUrl && msg.preview && <LetterPreview href={msg.letterUrl} letter={msg.preview} />}
                        </React.Fragment>
                    )
                })}

                {/* Typing indicator */}
                {isTyping && <TypingIndicator />}

                {/* Bottom spacer so content isn't hidden behind composer */}
                <div className="h-4 flex-shrink-0" />
            </ChatThread>

            {/* ── Fixed bottom composer (morphs into letter editor) ── */}
            <ChatComposer
                value={isExpanded ? letterMessage : inputValue}
                onChange={isExpanded ? setLetterMessage : setInputValue}
                onSend={isExpanded ? handleLetterSubmit : handleSend}
                disabled={composerDisabled}
                expanded={isExpanded}
                submitting={currentStep === "submitting"}
                complete={false}
                placeholder={
                    currentStep === "submitting" ? "Saving your letter…"
                        : currentStep === "done" ? "Your letter is ready to share"
                        : currentStep === "failed" ? "Use Retry or Edit letter above"
                        : isExpanded
                        ? "Write your letter here…"
                        : currentStep === "ask_name"
                            ? "Enter your name…"
                            : currentStep === "ask_recipient"
                                ? "Enter the recipient's name…"
                                : currentStep === "ask_theme"
                                    ? "Select a theme above…"
                                    : "Type your answer…"
                }
            />
        </main>
    )
}
