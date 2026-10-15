import { fetchedLetterSchema } from "@/app/types/letters"
import { createClient } from "./client"

export async function fetchLetter(slug: string, signal?: AbortSignal) {
    if (!slug.trim()) return null
    const query = createClient().from("letters").select("*").eq("slug", slug).abortSignal(signal ?? new AbortController().signal)
    const { data, error } = await query.maybeSingle()
    if (error) throw error
    return data === null ? null : fetchedLetterSchema.parse(data)
}
