"use client"

import { ReactNode } from "react"

interface NotebookBackgroundProps {
    children?: ReactNode
    className?: string
}

export default function NotebookBackground({
    children,
    className = "",
}: NotebookBackgroundProps) {
    return (
        <div
            className={`relative min-h-[400px] w-full overflow-hidden bg-amber-600/40 ${className}`}
            style={{
                backgroundImage: `
          repeating-linear-gradient(
            transparent,
            transparent 31px,
            rgba(0, 102, 204, 0.15) 31px,
            rgba(0, 102, 204, 0.15) 32px
          )
        `,
                backgroundPosition: "0 48px",
            }}
        >
            {/* Paper grain */}
            <div
                className="pointer-events-none absolute inset-0 z-20 opacity-[0.035]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Main margin line */}
            <div className="pointer-events-none absolute bottom-0 left-[80px] top-0 z-10 w-px bg-[#a6383b]/60" />

            {/* Secondary margin line */}
            <div className="pointer-events-none absolute bottom-0 left-[84px] top-0 z-10 w-px bg-[#a6383b]/30" />

            {/* Content */}
            <div className="relative z-30">{children}</div>
        </div>
    )
}