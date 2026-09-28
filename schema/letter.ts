import { z } from "zod"

export const userNameSchema = z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Your name is too long 😅")


export const recipientNameSchema = z
    .string()
    .trim()
    .min(2, "Recipient name must be at least 2 characters")
    .max(50, "Recipient name is too long 😅")


export const themeSchema = z
    .enum(["Red", "Green", "Blue", "Yellow"])


export const messageSchema = z
    .string()
    .trim()
    .min(10, "Bro, write a meaningful message 😅")
    .max(5000, "Your message is too long")



export const letterSchema = z.object({
    id: z.uuid(),
    slug: z.string().min(1),
    sender_name: userNameSchema,
    recipient_name: recipientNameSchema,
    theme: themeSchema,
    message: messageSchema
})



export type LetterData = z.infer<typeof letterSchema>