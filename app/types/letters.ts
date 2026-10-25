import { letterSchema } from "@/schema/letter"
import { z } from "zod"

export const fetchedLetterSchema = letterSchema.extend({ created_at: z.string().nullable() })
export type LetterDataType = z.infer<typeof fetchedLetterSchema>
