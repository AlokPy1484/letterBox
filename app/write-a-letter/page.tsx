"use client"
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Flower, Send, SendHorizontal } from "lucide-react";
import Image from "next/image";
import stamp from "@/public/stamp.png"
import stamp2 from "@/public/stamp2.png"
import stamp3 from "@/public/stamp3.png"
import NotebookBackground from "./components/PageBackground";
import React, { useEffect, useRef, useState } from "react";
import EntryAnimation from "./components/EntryAnimation";
import { createClient } from "@/lib/supabase/client";
import { LetterData, recipientNameSchema, themeSchema, userNameSchema } from "@/schema/letter";
import z from "zod"



export default function page() {

    // type LetterData = {
    //     id: string,
    //     slug: string,
    //     userName: string,
    //     recipientName: string,
    //     themeKey: string,
    //     message: string
    // }

    //question render controller
    const [currentStep, setCurrentStep] = useState<number>(0)

    const showStep = (step: number) => {
        return currentStep >= step
    }

    const nextStep = () => {
        setCurrentStep(prev => prev + 1)
        console.log(currentStep)
    }



    const [letterData, setLetterData] = useState<LetterData>(() => ({
        id: crypto.randomUUID(),
        slug: crypto.randomUUID().slice(0, 8),
        sender_name: "",
        recipient_name: "",
        theme: "",
        message: ""
    }))


    const updateLetter = <K extends keyof LetterData>(key: K, value: LetterData[K]) => {
        setLetterData(prev => ({
            ...(prev || {}),
            [key]: value
        }))
    }

    const [errors, setErrors] = useState<Partial<Record<keyof LetterData, string>>>({})

    const validaterField = <K extends keyof LetterData>(
        key: K,
        value: LetterData[K],
        schema: z.ZodType
    ) => {
        const result = schema.safeParse(value)

        if (!result.success) {
            setErrors(prev => ({
                ...prev, [key]: result.error.issues[0].message
            }))

            return false
        }


        setErrors(prev => ({
            ...prev, [key]: undefined
        }))

        return true
    }


    const containerRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new MutationObserver(() => {
            container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
        })

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        })

        return () => observer.disconnect()
    }, [])


    const demoLetterData: LetterData = {
        id: "550e8400-e29b-41d4-b716-446651440000",
        slug: "3487gfi34b934",
        sender_name: "Alok",
        recipient_name: "Sarah",
        message: "Happy Birthday ❤️",
        theme: "Yellow",
    };

    const handleFormSubmit = async () => {


        console.log("Real FORM data: ", letterData)

        const supabase = createClient();

        console.log("Running...")

        const { data, error } = await supabase
            .from("letters")
            .insert({
                id: letterData.id,
                slug: letterData.slug,
                sender_name: letterData?.sender_name,
                recipient_name: letterData?.recipient_name,
                theme: letterData?.theme,
                message: letterData?.message
            })
            .select()
            .single()

        if (error) {
            console.error("Error Hai: " + error.message)
            return
        }

        console.log(data)

    }


    return (
        <div ref={containerRef} className="relative flex justify-center items-start w-screen h-screen overflow-scroll bg-orange-200 font-sans">
            <div className="fixed top-0 left-[50%] translate-x-[-50%] flex justify-center w-full backdrop-blur-lg absolute">
                <h1 className=" w-full max-w-lg text-center flex flex-col justify-center items-center my-2 ">
                    <a className="p-2 rounded-2xl">Letter Box</a>
                    <div className="relative w-full h-1 rounded-full  bg-amber-800/50">
                        <span
                            style={{ width: `${(currentStep / 5) * 100}%` }}
                            className="absolute inset-0 rounded-full bg-amber-800 transition-all duration-300 ease-in-out"></span>
                    </div>
                </h1>
            </div>
            <div className="flex flex-col justify-start items-center max-w-4xl w-full h-full ">

                {/* INTRODUCTORY PHRASE */}
                {showStep(0) &&

                    <EntryAnimation onAnimationComplete={nextStep} className="" >
                        <div >
                            <div className="flex text-3xl mt-24 font-medium">
                                👋 Welcome to LetterBox, a little place on the internet where you can create and send thoughtful digital letters.
                            </div>

                            <a className="w-full text-left text-xl">
                                Before we begin, I would like to ask you a few questions to make your letter feel truly personal.
                            </a>
                        </div>
                    </EntryAnimation>}


                <div className="flex flex-col justify-start items-start w-full mt-8 gap-2 ">
                    {/* Question 1 */}

                    {showStep(1) &&
                        <EntryAnimation className="flex flex-col justify-start items-start w-full gap-2 ">

                            <QuestionDialogChat
                                onSubmit={(value) => {
                                    if (!validaterField(
                                        "sender_name",
                                        value,
                                        userNameSchema
                                    )) {
                                        return
                                    }

                                    updateLetter("sender_name", value)
                                    nextStep()
                                }}
                            >

                                What should I call you ?
                            </QuestionDialogChat>

                            {errors.sender_name &&
                                <EntryAnimation className="flex flex-col justify-start items-start w-full gap-2 ">

                                    <QuestionChat className="text-red-500">
                                        {errors.sender_name}
                                    </QuestionChat>
                                </EntryAnimation>}

                        </EntryAnimation>}


                    {/* Question 2 */}
                    {showStep(2) &&
                        <EntryAnimation className="flex flex-col justify-start items-start w-full gap-2 ">
                            <QuestionChat>
                                Hello {letterData?.sender_name} 😊
                            </QuestionChat>
                            <QuestionDialogChat onSubmit={(value) => {
                                if (!validaterField(
                                    "recipient_name",
                                    value,
                                    recipientNameSchema
                                )) {
                                    return
                                }

                                updateLetter("recipient_name", value)
                                nextStep()
                            }}>
                                This letter is dedicated to whome ?
                            </QuestionDialogChat>




                        </EntryAnimation>}

                </div>

                {/* Question 3 */}
                {showStep(3) &&
                    <EntryAnimation className="w-full">
                        <div className="flex flex-col items-start justify-start gap-4 w-full mt-8">
                            <QuestionChat>
                                Pick a theme for your letter {letterData?.recipient_name}, It will shape the mood, colors, and atmosphere of your message, helping us turn your thoughts into something memorable, personal, and meaningful to keep.
                            </QuestionChat>
                            <div className="flex justify-center theme-selector-container w-full mt-16">
                                <ThemeSelectorCard onSubmit={(value) => {
                                    if (!validaterField(
                                        "theme",
                                        value,
                                        themeSchema
                                    )) {
                                        return
                                    }

                                    updateLetter("theme", value)
                                    nextStep()
                                }} />
                            </div>
                            {errors.theme &&
                                <EntryAnimation className="flex flex-col justify-start items-start w-full gap-2 ">

                                    <QuestionChat className="text-red-500">
                                        {errors.theme}
                                    </QuestionChat>
                                </EntryAnimation>}
                        </div>
                    </EntryAnimation>
                }


                {/* Question 4 */}
                {showStep(4) &&
                    <EntryAnimation className=" flex flex-col justify-center items-end w-full gap-2 mt-24 ">
                        <div className="text-2xl mt-8">
                            Pick a theme for your letter, It will shape the mood, colors, and atmosphere of your message, helping us turn your thoughts into something memorable, personal, and meaningful to keep.
                        </div>
                        <div className="flex justify-center w-full  ">
                            <NotebookBackground className="px-10 py-8 rounded-2xl mt-4 ">
                                <textarea className="w-full h-[400px] outline-none" />
                            </NotebookBackground>
                        </div>

                        {/* Submit Button */}
                        <button onClick={(value) => {
                            if (!validaterField(
                                "message",
                                value,
                                messageSchema
                            )) {
                                return
                            }

                            updateLetter("message", value)
                            nextStep()
                        }} className="translate-y-[-100px] flex items-center px-4 py-2 rounded-2xl text-2xl bg-amber-100 mt-10 gap-4">
                            <Send strokeWidth={1.5} size={20} />
                            Render Letter
                        </button>
                    </EntryAnimation>}


            </div>

        </div >
    )

}




export function QuestionDialogChat({ onSubmit, children }: { onSubmit: (value: string) => void, children: React.ReactNode }) {

    const [value, setValue] = useState()

    const handleSubmit = () => {
        onSubmit(value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit()
        }
    }



    // const result = z
    //     .string()
    //     .trim()
    //     .min(2, "Please enter your name")
    //     .safeParse(letterData.userName)


    return (
        <div className="flex flex-col justify-start items-start w-full gap-2 ">
            <div className="px-4 py-2 rounded-2xl text-2xl bg-amber-100 ">
                {children}
            </div>
            <div className="flex justify-end w-full">
                <div className="flex items-center px-4 py-2 rounded-2xl text-2xl bg-amber-100 ">
                    <input type="text" className="appearance-none border-0 outline-none w-full text-left" onKeyDown={handleKeyDown} onChange={(e) => setValue(e.target.value)} />
                    <SendHorizontal strokeWidth={1.5} size={20} onClick={handleSubmit} />
                </div>
            </div>
        </div>
    )
}


export function QuestionChat({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`flex justify-start w-full ${className}`}>
            <div className="px-4 py-2 rounded-2xl text-2xl bg-amber-100 max-w-2xl">
                {children}
            </div>
        </div>
    )
}


export function ThemeSelectorCard({ onSubmit }: { onSubmit: (value: string) => void }) {

    const themeList = [
        {
            name: "Yellow"
        },
        {
            name: "Blue"
        },
        {
            name: "Green"
        },
        {
            name: "Red"
        }
    ]

    const handleClick = (idx: number) => {
        onChange(themeList[idx].name)
        nextStep()

    }



    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl bg-amber-600/40 rounded-2xl p-4 font-mono">
            <div className="group title-container flex  justify-start items-between w-full  gap-4">
                <div className=" w-[60px] relative">
                    <Image src={stamp3} alt="stamp" width={60} className="object-contain absolute inset-0 -rotate-15 group-hover:rotate-0 group-hover:z-10 group-hover:duration-300 group-hover:translate-x-2 transition-all duration-300 ease-in-out " />
                    <Image src={stamp} alt="stamp" width={60} className="absolute inset-0 object-contain rotate-15 group-hover:rotate-0 group-hover:z-10 group-hover:duration-300 group-hover:-translate-x-2 transition-all duration-300 ease-in-out " />

                </div>

                <div className="flex flex-col justify-between gap-2 py-1">
                    <h1 className="text-3xl">Select a theme</h1>
                    <a className="text tracking-tight leading-none">We have curated 5 themes for you, choose the one you like </a>
                </div>
            </div>

            <div className="selector-container flex flex-col justify-start items-center gap-2 p-2 mt-6 w-full ">

                {[...Array(4)].map((_, idx) => (
                    <div
                        onClick={() => onSubmit(themeList[idx].name)}
                        className="group flex justify-start items-center gap-4 w-full p-2 bg-amber-200/30 hover:bg-amber-200/60 rounded-2xl">
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <Flower size={16} className="scale-100 group-hover:scale-120 group-hover:rotate-200 transition-all duration-300 ease-in-out" />
                        </div>
                        <div className="flex flex-col justify-between items-start">
                            <div className="text-xl">Floral</div>
                            <div className="text-sm text-neutral-800">A floral theme with flowers and leaves</div>
                        </div>
                    </div>))}

            </div>



        </div>
    )
}




// @LetterBox1483@

//SupaBaseProjectKey: 
//https://yvtlyewemactgoxinpsj.supabase.co

//SupaBasePublishableKey: 
// sb_publishable_jsNXhvFt3rQd0YHz_WVdZA_napdY9H-