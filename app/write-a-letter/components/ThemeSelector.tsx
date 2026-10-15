"use client"

import { Check } from "lucide-react"
import Image from "next/image"
import stamp from "@/public/stamp.png"
import stamp3 from "@/public/stamp3.png"
import { motion, useReducedMotion } from "motion/react"
import ThemeIcon, { type ThemeIconName } from "./ThemeIcon"
import styles from "../write-letter.module.css"

const themes: { name: string; label: string; description: string; color: string; tint: string; icon: ThemeIconName }[] = [
    { name: "Yellow", label: "Sunshine", icon: "sunshine", description: "Warm and cheerful, like a sunny day", color: "#e2aa32", tint: "#fff0bd" },
    { name: "Blue", label: "Ocean", icon: "ocean", description: "Calm and serene, like a peaceful sea", color: "#6396ad", tint: "#e1edf0" },
    { name: "Green", label: "Forest", icon: "forest", description: "Fresh and natural, like a woodland walk", color: "#7e9872", tint: "#e7ecda" },
    { name: "Red", label: "Passion", icon: "passion", description: "Bold and heartfelt, like a warm embrace", color: "#c47c6e", tint: "#f6e2d8" },
]

export default function ThemeSelector({ onSelect, disabled = false, selected }: {
    onSelect: (theme: string) => void; disabled?: boolean; selected?: string
}) {
    const reduceMotion = useReducedMotion()
    return (
        <motion.section className={styles.themeCard} aria-label="Letter theme" initial={{ y: reduceMotion ? 0 : 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.4 }}>
            <div className={styles.themeHeading}>
                <div className={styles.stamps} aria-hidden="true">
                    <Image src={stamp3} alt="" width={48} className={styles.stampBack} />
                    <Image src={stamp} alt="" width={48} className={styles.stampFront} />
                </div>
                <div><p className={styles.eyebrow}>Set the mood</p><h2>Select a theme</h2></div>
            </div>
            <p className={styles.themeIntro}>Four little worlds. Pick the one that feels like your letter.</p>
            <div className={styles.themeOptions}>
                {themes.map(theme => {
                    const isSelected = selected === theme.name
                    return <button key={theme.name} type="button" aria-pressed={isSelected} disabled={disabled} onClick={() => onSelect(theme.name)} className={`${styles.themeOption} ${isSelected ? styles.selected : ""}`}>
                        <span className={styles.themeSwatch} style={{ background: theme.tint, color: theme.color }} aria-hidden="true"><ThemeIcon theme={theme.icon} /></span>
                        <span className={styles.themeText}><span className={styles.themeName}>{theme.label}</span><span className={styles.themeDescription}>{theme.description}</span></span>
                        <span className={styles.selectionMark} aria-hidden="true">{isSelected && <Check size={16} />}</span>
                    </button>
                })}
            </div>
        </motion.section>
    )
}
