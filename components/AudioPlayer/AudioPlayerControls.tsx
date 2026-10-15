import { Pause, Play, Sprout, Volume2, VolumeX } from "lucide-react"
import type { ChangeEvent, CSSProperties } from "react"
import { formatAudioTime } from "@/lib/format-audio-time"
import styles from "./AudioPlayer.module.css"

type Props = {
    theme: string
    isPlaying: boolean
    isMuted: boolean
    progress: number
    currentTime: number
    duration: number
    onTogglePlay: () => void
    onToggleMute: () => void
    onSeek: (event: ChangeEvent<HTMLInputElement>) => void
}

const accents: Record<string, string> = { Yellow: "#956b32", Blue: "#526f83", Green: "#62734c", Red: "#a06453" }

export default function AudioPlayerControls({ theme, isPlaying, isMuted, progress, currentTime, duration, onTogglePlay, onToggleMute, onSeek }: Props) {
    return (
        <section aria-label="Letter soundtrack" className={styles.player} style={{ "--ink": accents[theme] || accents.Yellow, "--progress": `${progress}%` } as CSSProperties}>
            <div className={styles.card}>
                <span className={styles.tab}>A LITTLE SOUNDTRACK</span>
                <span className={styles.stamp} aria-hidden="true"><Sprout size={19} strokeWidth={1} /></span>
                <div className={styles.topRow}>
                    <div className={styles.trackInfo}><span className={styles.title}>Yellow</span><span className={styles.artist}>Coldplay</span></div>
                    <div className={styles.buttons}>
                        <button type="button" className={styles.playButton} onClick={onTogglePlay} aria-label={isPlaying ? "Pause audio" : "Play audio"} aria-pressed={isPlaying}>
                            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                        </button>
                        <button type="button" className={styles.muteButton} onClick={onToggleMute} aria-label={isMuted ? "Unmute audio" : "Mute audio"} aria-pressed={isMuted}>
                            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>
                    </div>
                </div>
                <input type="range" min={0} max={100} step={0.1} value={progress} onChange={onSeek} disabled={duration <= 0} aria-label="Seek audio" aria-valuetext={`${formatAudioTime(currentTime)} of ${formatAudioTime(duration)}`} className={styles.slider} />
                <div className={styles.times}><span>{formatAudioTime(currentTime)}</span><span>{formatAudioTime(duration)}</span></div>
            </div>
        </section>
    )
}
