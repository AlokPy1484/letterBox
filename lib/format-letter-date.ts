const submittedDateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    timeZone: "Asia/Kolkata",
})

export function formatLetterDate(createdAt: string | null | undefined): string | null {
    if (!createdAt) return null

    const date = new Date(createdAt)
    if (Number.isNaN(date.getTime())) return null

    const parts = submittedDateFormatter.formatToParts(date)
    const day = Number(parts.find(part => part.type === "day")!.value)
    const month = parts.find(part => part.type === "month")!.value
    const year = parts.find(part => part.type === "year")!.value
    const suffix = day % 100 >= 11 && day % 100 <= 13
        ? "th"
        : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] || "th"

    return `${day}${suffix} ${month} ${year}`
}
