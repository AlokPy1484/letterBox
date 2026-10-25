"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import type { KeyboardEvent } from "react"
import { ArrowUp, Check, LoaderCircle, Send } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import styles from "../write-letter.module.css"

interface ChatComposerProps {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    disabled?: boolean
    placeholder?: string
    expanded?: boolean
    submitting?: boolean
    complete?: boolean
}

export default function ChatComposer({ value, onChange, onSend, disabled = false, placeholder = "Type your answer…", expanded = false, submitting = false, complete = false }: ChatComposerProps) {
    const reduceMotion = useReducedMotion()
    const morphTransition = {
        duration: reduceMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    }
    const revealTransition = { duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.15 }
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const canSend = !!value.trim() && !disabled
    const words = value.trim() ? value.trim().split(/\s+/).length : 0

    useLayoutEffect(() => {
        const input = inputRef.current
        if (!input) return
        if (expanded) {
            input.style.removeProperty("height")
            input.style.removeProperty("overflow-y")
            return
        }
        input.style.height = "auto"
        input.style.height = `${Math.min(input.scrollHeight, 144)}px`
        input.style.overflowY = input.scrollHeight > 144 ? "auto" : "hidden"
    }, [value, expanded])

    useEffect(() => {
        if (!disabled) inputRef.current?.focus()
    }, [disabled, expanded])

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.nativeEvent.isComposing) return
        if (event.key === "Enter" && (expanded ? event.metaKey || event.ctrlKey : !event.shiftKey)) {
            event.preventDefault()
            if (canSend) onSend()
        }
    }

    return <footer className={styles.composerDock}>
        <div className={styles.composerInner}>
            {complete ? <div className={styles.completion} role="status"><Check size={18} />Your thoughtful words are ready to share.</div> :
                <motion.div
                    layout={!reduceMotion}
                    initial={false}
                    animate={{ borderRadius: expanded ? 24 : 28 }}
                    transition={{ ...morphTransition, layout: morphTransition }}
                    className={`${styles.composer} ${expanded ? styles.expandedComposer : ""}`}
                >
                    <AnimatePresence initial={false} mode="popLayout">
                        {expanded && <motion.div key="editor-heading" layout={reduceMotion ? false : "position"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ ...revealTransition, layout: morphTransition }} className={styles.editorHeading}><span className={styles.eyebrow}>Your letter</span><span className={styles.editorNote}>Take your time. Make it yours.</span></motion.div>}
                    </AnimatePresence>
                    <motion.div layout={reduceMotion ? false : "position"} transition={{ layout: morphTransition }} className={expanded ? styles.editorInputArea : styles.compactInputArea}>
                        <motion.textarea layout={reduceMotion ? false : "position"} transition={{ layout: morphTransition }} ref={inputRef} value={value} onChange={event => onChange(event.target.value)} onKeyDown={handleKeyDown} disabled={disabled} placeholder={placeholder} rows={expanded ? 6 : 1} aria-label={expanded ? "Letter message" : "Message input"} aria-describedby={expanded ? "letter-count" : undefined} className={styles.input} />
                        <AnimatePresence initial={false} mode="popLayout">
                            {!expanded && <motion.button key="compact-send" layout={reduceMotion ? false : "position"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.12 }} type="button" onClick={onSend} disabled={!canSend} aria-label="Send message" className={`${styles.sendButton} ${styles.roundSend}`}><ArrowUp size={20} /></motion.button>}
                        </AnimatePresence>
                    </motion.div>
                    <AnimatePresence initial={false} mode="popLayout">
                        {expanded && <motion.div key="editor-footer" layout={reduceMotion ? false : "position"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ ...revealTransition, layout: morphTransition }} className={styles.editorFooter}>
                            <span id="letter-count" className={`${styles.wordCount} ${value.trim().length > 5000 ? styles.overLimit : ""}`}>{words} {words === 1 ? "word" : "words"}<span>{value.trim().length.toLocaleString()} / 5,000 characters</span></span>
                            <button type="button" onClick={onSend} disabled={!canSend} className={styles.sendButton}>{submitting ? <>Creating…<LoaderCircle size={16} className={styles.spinner} /></> : <>Create letter<Send size={16} /></>}</button>
                        </motion.div>}
                    </AnimatePresence>
                </motion.div>}
            {!complete && <p className={styles.inputHint}>{disabled ? "Follow your letter’s progress in the conversation above" : expanded ? "⌘ / Ctrl + Enter to create your letter" : "Enter to send · Shift + Enter for a new line"}</p>}
        </div>
    </footer>
}
