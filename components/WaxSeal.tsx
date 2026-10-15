import { useId } from "react"

const waxColors: Record<string, { light: string; base: string; dark: string }> = {
    Yellow: { light: "#e4b75e", base: "#ba8535", dark: "#76501e" },
    Blue: { light: "#91b8c9", base: "#58859f", dark: "#2c5068" },
    Green: { light: "#a8b783", base: "#758a53", dark: "#43552e" },
    Red: { light: "#d5917e", base: "#b56354", dark: "#743b34" },
}

export default function WaxSeal({ theme }: { theme: string }) {
    const id = useId().replace(/:/g, "")
    const colors = waxColors[theme] || waxColors.Yellow
    const edge = "M61 8 C71 5 78 14 87 16 C98 18 97 28 104 35 C111 42 106 50 111 60 C115 70 105 76 102 86 C99 95 89 94 81 102 C73 109 66 102 56 107 C45 112 40 101 30 100 C19 99 22 89 14 81 C6 73 13 66 9 57 C4 47 14 42 16 32 C18 21 28 24 35 15 C42 7 51 13 61 8 Z"
    return (
        <svg role="img" aria-label={`Letterbox LB wax seal, ${theme.toLowerCase()} theme`} viewBox="0 0 120 120" className="h-24 w-24 shrink-0 overflow-visible">
            <defs>
                <radialGradient id={`${id}-wax`} cx="35%" cy="25%" r="80%">
                    <stop offset="0" stopColor={colors.light} />
                    <stop offset=".58" stopColor={colors.base} />
                    <stop offset="1" stopColor={colors.dark} />
                </radialGradient>
                <linearGradient id={`${id}-rim`} x2=".6" y2="1">
                    <stop stopColor={colors.light} />
                    <stop offset="1" stopColor={colors.dark} />
                </linearGradient>
                <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="170%">
                    <feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="#21170c" floodOpacity=".35" />
                </filter>
                <filter id={`${id}-grain`}>
                    <feTurbulence type="fractalNoise" baseFrequency=".48" numOctaves="3" seed="8" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComposite in2="SourceGraphic" operator="in" />
                    <feBlend in="SourceGraphic" mode="soft-light" />
                </filter>
            </defs>
            <g filter={`url(#${id}-shadow)`}>
                <path d={edge} fill={`url(#${id}-wax)`} stroke={colors.dark} strokeWidth=".7" />
                <path d={edge} fill={colors.base} opacity=".12" filter={`url(#${id}-grain)`} />
                <circle cx="60" cy="58" r="36" fill="none" stroke={`url(#${id}-rim)`} strokeWidth="5" />
                <circle cx="60" cy="59" r="32.5" fill="none" stroke={colors.dark} strokeOpacity=".35" strokeWidth="1.2" />
                <path d="M29 43 A34 34 0 0 1 75 26" fill="none" stroke={colors.light} strokeOpacity=".65" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M18 39 Q20 29 29 27 M85 93 Q95 91 96 82" fill="none" stroke={colors.light} strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
                <text x="60" y="71" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontSize="34" letterSpacing="-1.5" fill={colors.light} opacity=".65">LB</text>
                <text x="60" y="69.5" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontSize="34" letterSpacing="-1.5" fill={colors.dark}>LB</text>
            </g>
        </svg>
    )
}
