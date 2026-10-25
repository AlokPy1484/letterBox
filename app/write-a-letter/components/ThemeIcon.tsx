import styles from "../write-letter.module.css"

export type ThemeIconName = "sunshine" | "ocean" | "forest" | "passion"

/** Small stationery illustrations; interaction belongs to the containing option. */
export default function ThemeIcon({ theme }: { theme: ThemeIconName }) {
    return (
        <svg className={styles.themeIcon} width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            {theme === "sunshine" && <>
                <g className={styles.sunRays}>
                    <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.8 6.8l2.1 2.1M23.1 23.1l2.1 2.1M6.8 25.2l2.1-2.1M23.1 8.9l2.1-2.1" />
                </g>
                <circle className={styles.sunCenter} cx="16" cy="16" r="6" fill="currentColor" fillOpacity=".12" />
            </>}
            {theme === "ocean" && <>
                <g className={styles.waveBack}>
                    <path d="M4 13c3.2 0 3.2-3.5 6.4-3.5s3.2 3.5 6.4 3.5 3.2-3.5 6.4-3.5 3.2 3.5 4.8 3.5" />
                </g>
                <g className={styles.waveFront}>
                    <path d="M4 21c3.2 0 3.2-3.5 6.4-3.5s3.2 3.5 6.4 3.5 3.2-3.5 6.4-3.5 3.2 3.5 4.8 3.5" />
                    <path d="M8 25h16" opacity=".4" />
                </g>
            </>}
            {theme === "forest" && <g className={styles.leafSprig}>
                <path d="M16 28V13" />
                <path d="M16 20C7 20 5 14 6 7c7 0 11 5 10 13Z" fill="currentColor" fillOpacity=".12" />
                <path d="M16 15c0-7 4-11 10-11 1 7-2 11-10 11Z" fill="currentColor" fillOpacity=".12" />
                <path d="m10 12 6 8m0-5 5-6" opacity=".7" />
            </g>}
            {theme === "passion" && <>
                <path className={styles.heartBody} d="M15 26S4 19.3 4 12.4C4 6.4 11.3 5.2 15 10c3.7-4.8 11-3.6 11 2.4C26 19.3 15 26 15 26Z" fill="currentColor" fillOpacity=".14" />
                <path className={styles.heartSparkle} d="m27 3 .8 2.2L30 6l-2.2.8L27 9l-.8-2.2L24 6l2.2-.8Z" fill="currentColor" strokeWidth="1" />
            </>}
        </svg>
    )
}
