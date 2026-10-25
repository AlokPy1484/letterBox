export function formatAudioTime(seconds: number): string {
    const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}
