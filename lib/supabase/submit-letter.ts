import { z } from "zod"
import { letterSchema, type LetterData } from "@/schema/letter"
import { createClient } from "./client"

const savedLetterSchema = z.object({ id: z.uuid(), slug: z.string().min(1) })

/** Keep the same ID on retries so an uncertain response cannot create two letters. */
export async function submitLetter(input: LetterData) {
    const payload = letterSchema.parse(input)
    const supabase = createClient()
    const { data, error } = await supabase.from("letters").insert({ ...payload, created_at: new Date().toISOString() }).select("id, slug").single()
    if (!error) return savedLetterSchema.parse(data)

    // The insert may have succeeded before the original response was interrupted.
    if (error.code === "23505") {
        const existing = await supabase.from("letters").select("*").eq("id", payload.id).single()
        const parsed = letterSchema.safeParse(existing.data)
        if (!existing.error && parsed.success && Object.keys(payload).every(key => {
            const field = key as keyof LetterData
            return parsed.data[field] === payload[field]
        })) return savedLetterSchema.parse(parsed.data)
    }
    throw error
}
