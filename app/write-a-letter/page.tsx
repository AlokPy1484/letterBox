"use client"


import React, { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { LetterData, messageSchema, recipientNameSchema, themeSchema, userNameSchema } from "@/schema/letter"
import z from "zod"

import ChatThread from "./components/ChatThread"
import ChatComposer from "./components/ChatComposer"
import MessageBubble from "./components/MessageBubble"
import ThemeSelector from "./components/ThemeSelector"
import TypingIndicator from "./components/TypingIndicator"

import EntryAnimation from "./components/EntryAnimation"


// ─── Conversation step definitions ───────────────────────────────────────────

type Step =
    | "welcome"
    | "ask_name"
    | "ask_recipient"
    | "ask_theme"
    | "ask_message"
    | "submitting"
    | "done"

interface ChatMessage {
    id: string
    role: "assistant" | "user"
    content: string
    /** Special inline widget to render instead of/after content */
    widget?: "theme_selector"
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
    const [errors, setErrors] = useState<Partial<Record<keyof LetterData, string>>>({})

    const [letterData, setLetterData] = useState<LetterData>(() => ({
        id: crypto.randomUUID(),
        slug: crypto.randomUUID().slice(0, 8),
        sender_name: "",
        recipient_name: "",
        theme: "",
        message: "",
    }))

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

    // When step changes, push the corresponding assistant prompt
    useEffect(() => {
        if (currentStep === "welcome") return

        if (currentStep === "ask_name") {
            addAssistantMessage(ASSISTANT_PROMPTS.ask_name![0])
        } else if (currentStep === "ask_recipient") {
            addAssistantMessage(`Hello ${letterData.sender_name} 😊`)
            setTimeout(() => {
                addMessage({
                    role: "assistant",
                    content: "This letter is dedicated to whom?",
                })
            }, 1000)
        } else if (currentStep === "ask_theme") {
            addAssistantMessage(ASSISTANT_PROMPTS.ask_theme![0])
            setTimeout(() => {
                addMessage({
                    role: "assistant",
                    content: "",
                    widget: "theme_selector",
                })
            }, 1000)
        } else if (currentStep === "ask_message") {
            addAssistantMessage(ASSISTANT_PROMPTS.ask_message![0])
        } else if (currentStep === "done") {
            addAssistantMessage("Your letter has been created! ✨ It's on its way.")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep])

    // ── Form submit (Supabase) ─────────────────────────────────────────────
    const handleFormSubmit = async (finalData: LetterData) => {
        setCurrentStep("submitting")
        setIsTyping(true)

        console.log("Real FORM data: ", finalData)

        const supabase = createClient()

        const { data, error } = await supabase
            .from("letters")
            .insert({
                id: finalData.id,
                slug: finalData.slug,
                sender_name: finalData.sender_name,
                recipient_name: finalData.recipient_name,
                theme: finalData.theme,
                message: finalData.message,
            })
            .select()
            .single()

        setIsTyping(false)

        if (error) {
            console.error("Error Hai: " + error.message)
            addMessage({
                role: "assistant",
                content: `Something went wrong: ${error.message}. Please try again.`,
            })
            setCurrentStep("ask_message")
            return
        }

        console.log(data)
        setCurrentStep("done")
    }

    // ── Composer send handler ──────────────────────────────────────────────
    const handleSend = () => {
        const trimmed = inputValue.trim()
        if (!trimmed) return

        if (currentStep === "ask_name") {
            if (!validateField("sender_name", trimmed, userNameSchema)) {
                addMessage({ role: "user", content: trimmed })
                addAssistantMessage(errors.sender_name || "Please enter a valid name.")
                return
            }
            addMessage({ role: "user", content: trimmed })
            updateLetter("sender_name", trimmed)
            setInputValue("")
            // Use functional update of letterData via a ref-like approach
            setLetterData(prev => {
                const updated = { ...prev, sender_name: trimmed }
                // Transition happens after state update
                setTimeout(() => setCurrentStep("ask_recipient"), 100)
                return updated
            })
        } else if (currentStep === "ask_recipient") {
            if (!validateField("recipient_name", trimmed, recipientNameSchema)) {
                addMessage({ role: "user", content: trimmed })
                setTimeout(() => {
                    // Re-read errors after validation sets them
                    setErrors(prev => {
                        if (prev.recipient_name) {
                            addMessage({
                                role: "assistant",
                                content: prev.recipient_name,
                            })
                        }
                        return prev
                    })
                }, 100)
                setInputValue("")
                return
            }
            addMessage({ role: "user", content: trimmed })
            updateLetter("recipient_name", trimmed)
            setInputValue("")
            setTimeout(() => setCurrentStep("ask_theme"), 100)
        }
    }

    // ── Theme selection handler ────────────────────────────────────────────
    const handleThemeSelect = (theme: string) => {
        if (!validateField("theme", theme, themeSchema)) return
        addMessage({ role: "user", content: `Theme: ${theme}` })
        updateLetter("theme", theme)
        setTimeout(() => setCurrentStep("ask_message"), 100)
    }

    // ── Message (letter body) submit handler ───────────────────────────────
    const [letterMessage, setLetterMessage] = useState("")

    const handleLetterSubmit = () => {
        const trimmed = letterMessage.trim()
        if (!validateField("message", trimmed, messageSchema)) {
            setErrors(prev => {
                if (prev.message) {
                    addMessage({ role: "assistant", content: prev.message })
                }
                return prev
            })
            return
        }
        addMessage({ role: "user", content: trimmed })
        setLetterMessage("")

        setLetterData(prev => {
            const updated = { ...prev, message: trimmed }
            setTimeout(() => handleFormSubmit(updated), 100)
            return updated
        })
    }

    // ── Determine if composer is disabled ──────────────────────────────────
    const isExpanded = currentStep === "ask_message"

    const composerDisabled =
        isTyping ||
        currentStep === "welcome" ||
        currentStep === "ask_theme" ||
        currentStep === "submitting" ||
        currentStep === "done"

    // ── Progress calculation ───────────────────────────────────────────────
    const stepProgress: Record<Step, number> = {
        welcome: 0,
        ask_name: 1,
        ask_recipient: 2,
        ask_theme: 3,
        ask_message: 4,
        submitting: 4.5,
        done: 5,
    }
    const progress = stepProgress[currentStep] / 5

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col w-screen h-dvh bg-orange-200 font-sans">
            {/* ── Fixed header / progress bar ── */}
            <div className="flex-shrink-0 z-30 w-full backdrop-blur-lg bg-orange-200/80">
                <div className="mx-auto max-w-3xl w-full flex flex-col items-center py-2 px-4">
                    <a className="p-2 rounded-2xl font-medium">Letter Box</a>
                    <div className="relative w-full h-1 rounded-full bg-amber-800/50">
                        <span
                            style={{ width: `${progress * 100}%` }}
                            className="absolute inset-0 rounded-full bg-amber-800 transition-all duration-300 ease-in-out"
                        />
                    </div>
                </div>
            </div>

            {/* ── Chat thread (scrollable area) ── */}
            <ChatThread>
                {/* Welcome card — existing design preserved exactly */}
                <EntryAnimation className="">
                    <div className="mb-4">
                        <div className="flex text-3xl mt-4 font-medium">
                            👋 Welcome to LetterBox, a little place on the internet where you can create and send thoughtful digital letters.
                        </div>
                        <a className="w-full text-left text-xl block mt-2">
                            Before we begin, I would like to ask you a few questions to make your letter feel truly personal.
                        </a>
                    </div>
                </EntryAnimation>

                {/* Message bubbles */}
                {messages.map((msg) => {
                    // Theme selector widget
                    if (msg.widget === "theme_selector") {
                        return (
                            <ThemeSelector
                                key={msg.id}
                                onSelect={handleThemeSelect}
                                disabled={currentStep !== "ask_theme"}
                            />
                        )
                    }


                    return (
                        <MessageBubble key={msg.id} role={msg.role}>
                            {msg.content}
                        </MessageBubble>
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
                placeholder={
                    isExpanded
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
        </div>
    )
}
