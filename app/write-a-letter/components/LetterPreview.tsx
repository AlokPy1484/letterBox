import type { CSSProperties } from "react"
import { ArrowUpRight, Bookmark, Home, Music2 } from "lucide-react"
import WaxSeal from "@/components/WaxSeal"
import type { LetterData } from "@/schema/letter"
import styles from "../write-letter.module.css"

const presets = {
    Yellow: { label: "Sunshine", background: "/themes/defaultBg.jpeg", highlight: "#ba853580" },
    Blue: { label: "Ocean", background: "/themes/blue-background.png", highlight: "#58859f80" },
    Green: { label: "Forest", background: "/themes/green-background.png", highlight: "#758a5380" },
    Red: { label: "Passion", background: "/themes/red-background.png", highlight: "#b5635480" },
} satisfies Record<LetterData["theme"], { label: string; background: string; highlight: string }>

export type LetterPreviewData = Pick<LetterData, "theme" | "sender_name" | "recipient_name">

export default function LetterPreview({ href, letter }: { href: string; letter: LetterPreviewData }) {
    const preset = presets[letter.theme]
    return (
        <a href={href} className={styles.letterPreview} aria-label={`Open your letter to ${letter.recipient_name}, ${preset.label} theme`}>
            <div className={styles.previewScene} style={{ backgroundImage: `url("${preset.background}")`, "--preview-highlight": preset.highlight } as CSSProperties} aria-hidden="true">
                <div className={styles.previewNav}>
                    <span><Home /> Return home</span>
                    <span>Archive letter <Bookmark /></span>
                </div>
                <div className={styles.previewWords}>
                    <span>Some words deserve a little more care.</span><br />
                    <span>A little warmth. A place to stay.</span><br />
                    <span>This little letter is just for you.</span>
                </div>
                <div className={styles.previewBottom}>
                    <span className={styles.previewNames}>To: {letter.recipient_name}<br />From: {letter.sender_name}</span>
                    <span className={styles.previewMusic}><Music2 /> ━━━━━━ ──</span>
                    <span className={styles.previewSeal}><WaxSeal theme={letter.theme} /></span>
                </div>
            </div>
            <span className={styles.previewCaption}>{preset.label} · Your letter <span>Open letter <ArrowUpRight size={14} /></span></span>
        </a>
    )
}
