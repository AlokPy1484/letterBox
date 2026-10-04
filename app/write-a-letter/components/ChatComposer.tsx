"use client"

import React, { useCallback, useEffect, useMemo, useRef } from "react"

interface ChatComposerProps {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    disabled?: boolean
    placeholder?: string
    /** When true, morph into the expanded letter editor card */
    expanded?: boolean
}

const MAX_ROWS = 6
const LINE_HEIGHT = 24 // px per line

function wordCount(text: string): number {
    const trimmed = text.trim()
    if (!trimmed) return 0
    return trimmed.split(/\s+/).length
}

/** Decorative toolbar icon button (non-functional for now) */
function ToolbarButton({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <button
            type="button"
            tabIndex={-1}
            title={title}
            className="flex items-center justify-center rounded-md transition-colors duration-150 hover:bg-black/[0.06] active:bg-black/[0.10]"
            style={{
                width: "32px",
                height: "32px",
                color: "rgba(0,0,0,0.55)",
                cursor: "default",
            }}
        >
            {children}
        </button>
    )
}

export default function ChatComposer({
    value,
    onChange,
    onSend,
    disabled = false,
    placeholder = "Type your answer…",
    expanded = false,
}: ChatComposerProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const canSend = value.trim().length > 0 && !disabled

    const words = useMemo(() => wordCount(value), [value])

    // Auto-resize textarea (only in compact mode)
    const adjustHeight = useCallback(() => {
        if (expanded) return // expanded mode uses flex layout
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        const maxHeight = LINE_HEIGHT * MAX_ROWS
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
        el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
    }, [expanded])

    useEffect(() => {
        adjustHeight()
    }, [value, adjustHeight])

    // Keep focus on the textarea after send / mode change
    useEffect(() => {
        if (!disabled) {
            textareaRef.current?.focus()
        }
    }, [disabled, expanded])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // In expanded mode, Enter adds a newline; Ctrl/Cmd+Enter sends
        if (expanded) {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                if (canSend) onSend()
            }
            return
        }
        // Compact mode: Enter sends, Shift+Enter adds newline
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (canSend) onSend()
        }
    }

    // ── Shared SVG send icon ──────────────────────────────────────────────
    const sendIcon = (
        <svg viewBox="0 0 20 20" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.095 2.54C3.02 2.503 2.936 2.49 2.853 2.502C2.771 2.514 2.694 2.551 2.632 2.607C2.571 2.664 2.528 2.737 2.509 2.819C2.49 2.9 2.496 2.985 2.526 3.063L4.895 9.418C5.035 9.794 5.035 10.207 4.895 10.582L2.527 16.938C2.497 17.015 2.491 17.1 2.51 17.181C2.529 17.262 2.572 17.336 2.633 17.392C2.694 17.448 2.771 17.485 2.854 17.497C2.936 17.509 3.02 17.496 3.095 17.46L18.095 10.377C18.166 10.343 18.227 10.29 18.269 10.223C18.311 10.156 18.334 10.079 18.334 10C18.334 9.921 18.311 9.844 18.269 9.777C18.227 9.71 18.166 9.657 18.095 9.623L3.095 2.54Z"
                fill="none"
                stroke="#332A18"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5 10H18.333"
                fill="none"
                stroke="#332A18"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    return (
        <div className="sticky bottom-0 z-30 w-full">
            {/* Gradient fade */}
            <div className="pointer-events-none h-8 bg-gradient-to-t from-orange-200 to-transparent" />

            <div className="bg-orange-200 pb-[env(safe-area-inset-bottom,0px)]">
                <div className="mx-auto max-w-3xl px-4 pb-4">
                    <div
                        className={`
                            flex flex-col
                            transition-all duration-[400ms]
                            focus-within:border-[#FFAD00]
                            ${expanded ? "expanded-composer" : ""}
                        `}
                        style={{
                            backgroundColor: "#FFD479",
                            borderRadius: "28px",
                            border: expanded ? "1.2px solid #FFAD00" : "1.2px solid transparent",
                            minHeight: expanded ? "400px" : undefined,
                            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        {/* ── Toolbar + separator (expanded only) ── */}
                        {expanded && (
                            <div className="flex-shrink-0 transition-opacity duration-300" style={{ transitionDelay: "150ms" }}>
                                {/* Toolbar icons */}
                                <div
                                    className="flex items-center gap-0.5 px-3 pt-2.5 pb-2"
                                    role="toolbar"
                                    aria-label="Formatting toolbar (decorative)"
                                >
                                    {/* Bold */}
                                    <ToolbarButton title="Bold">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                                            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                                        </svg>
                                    </ToolbarButton>

                                    {/* Italic */}
                                    <ToolbarButton title="Italic">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="19" y1="4" x2="10" y2="4" />
                                            <line x1="14" y1="20" x2="5" y2="20" />
                                            <line x1="15" y1="4" x2="9" y2="20" />
                                        </svg>
                                    </ToolbarButton>

                                    {/* Underline */}
                                    <ToolbarButton title="Underline">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                                            <line x1="4" y1="21" x2="20" y2="21" />
                                        </svg>
                                    </ToolbarButton>

                                    {/* Strikethrough */}
                                    <ToolbarButton title="Strikethrough">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 4H9a3 3 0 0 0-3 3 3 3 0 0 0 3 3h6" />
                                            <path d="M8 20h7a3 3 0 0 0 3-3 3 3 0 0 0-3-3H4" />
                                            <line x1="3" y1="12" x2="21" y2="12" />
                                        </svg>
                                    </ToolbarButton>

                                    {/* Divider */}
                                    <div className="mx-1.5" style={{ width: "1px", height: "18px", background: "rgba(0,0,0,0.15)" }} />

                                    {/* Link */}
                                    <ToolbarButton title="Link">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                    </ToolbarButton>

                                    {/* Bullet list */}
                                    <ToolbarButton title="Bullet list">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="8" y1="6" x2="21" y2="6" />
                                            <line x1="8" y1="12" x2="21" y2="12" />
                                            <line x1="8" y1="18" x2="21" y2="18" />
                                            <circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none" />
                                            <circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" />
                                            <circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none" />
                                        </svg>
                                    </ToolbarButton>

                                    {/* Ordered list */}
                                    <ToolbarButton title="Ordered list">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="10" y1="6" x2="21" y2="6" />
                                            <line x1="10" y1="12" x2="21" y2="12" />
                                            <line x1="10" y1="18" x2="21" y2="18" />
                                            <text x="1.5" y="8" fontSize="8" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif" fontWeight="600">1</text>
                                            <text x="1.5" y="14.5" fontSize="8" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif" fontWeight="600">2</text>
                                            <text x="1.5" y="20.5" fontSize="8" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif" fontWeight="600">3</text>
                                        </svg>
                                    </ToolbarButton>

                                    {/* Divider */}
                                    <div className="mx-1.5" style={{ width: "1px", height: "18px", background: "rgba(0,0,0,0.15)" }} />

                                    {/* Quote */}
                                    <ToolbarButton title="Quote">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
                                            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                                        </svg>
                                    </ToolbarButton>
                                </div>

                                {/* Separator line */}
                                <div style={{ height: "1px", background: "#FFDB8E", margin: "0 10px", width: "calc(100% - 20px)" }} />
                            </div>
                        )}

                        {/* ── Main input area ── */}
                        {expanded ? (
                            /* Expanded: full-height textarea */
                            <div className="flex-1 flex flex-col px-6 py-4 min-h-0">
                                <textarea
                                    ref={textareaRef}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={disabled}
                                    placeholder={placeholder}
                                    aria-label="Letter message"
                                    className="flex-1 resize-none bg-transparent outline-none disabled:opacity-50"
                                    style={{
                                        fontSize: "16px",
                                        lineHeight: "28px",
                                        fontFamily: '"Inter", system-ui, sans-serif',
                                        color: "#000000",
                                        minHeight: "280px",
                                    }}
                                />
                            </div>
                        ) : (
                            /* Compact: single-line auto-resize */
                            <div className="flex items-center gap-2 px-4 py-1.5">
                                <textarea
                                    ref={textareaRef}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={disabled}
                                    placeholder={placeholder}
                                    rows={1}
                                    aria-label="Message input"
                                    className="composer-input flex-1 resize-none bg-transparent outline-none disabled:opacity-50"
                                    style={{
                                        fontSize: "16px",
                                        lineHeight: "20px",
                                        fontFamily: '"Inter", system-ui, sans-serif',
                                        color: "#000000",
                                        maxHeight: `${LINE_HEIGHT * MAX_ROWS}px`,
                                    }}
                                />
                                <button
                                    onClick={onSend}
                                    disabled={!canSend}
                                    aria-label="Send message"
                                    className="flex-shrink-0 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                                    style={{
                                        width: "38px",
                                        height: "38px",
                                        borderRadius: "50%",
                                        backgroundColor: "#FEAD00",
                                    }}
                                >
                                    {sendIcon}
                                </button>
                            </div>
                        )}

                        {/* ── Bottom bar (expanded only): separator + word count + send ── */}
                        {expanded && (
                            <>
                                <div
                                    className="flex-shrink-0"
                                    style={{
                                        height: "1px",
                                        background: "#FFDB8E",
                                        margin: "0 10px",
                                        width: "calc(100% - 20px)",
                                    }}
                                />
                                <div
                                    className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 transition-opacity duration-300"
                                    style={{ transitionDelay: "150ms" }}
                                >
                                    {/* Word counter */}
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            lineHeight: "16px",
                                            fontFamily: '"Inter", system-ui, sans-serif',
                                            color: "rgba(0,0,0,0.45)",
                                        }}
                                    >
                                        {words}/500 words
                                    </span>

                                    {/* Send button */}
                                    <button
                                        onClick={onSend}
                                        disabled={!canSend}
                                        aria-label="Send letter"
                                        className="flex items-center gap-1.5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                                        style={{
                                            height: "38px",
                                            paddingInline: "16px",
                                            borderRadius: "28px",
                                            backgroundColor: "#FEAD00",
                                            border: "2px solid #FFC13F",
                                            fontSize: "16px",
                                            lineHeight: "20px",
                                            fontFamily: '"Inter", system-ui, sans-serif',
                                            color: "#000000",
                                        }}
                                    >
                                        Send
                                        {sendIcon}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Hint text — changes based on mode */}
                    {!expanded && (
                        <p className="text-center text-xs mt-2 select-none" style={{ color: "rgba(0,0,0,0.35)" }}>
                            Press Enter to send · Shift+Enter for new line
                        </p>
                    )}
                    {expanded && (
                        <p className="text-center text-xs mt-2 select-none" style={{ color: "rgba(0,0,0,0.35)" }}>
                            Press ⌘+Enter to send
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
