"use client"
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Flower, Send, SendHorizontal } from "lucide-react";
import Image from "next/image";
import stamp from "@/public/stamp.png"
import stamp2 from "@/public/stamp2.png"
import stamp3 from "@/public/stamp3.png"
import NotebookBackground from "./components/PageBackground";
import { useEffect, useRef, useState } from "react";
import { TypingAnimation } from "@/components/ui/typing-animation";
import EntryAnimation from "./components/EntryAnimation";


export default function page() {


    const [visibleQuestion, setVisibleQuestion] = useState(-1)
    const [username, setUsername] = useState<string | null>(null)
    const [recipient, setRecipient] = useState<string | null>(null)
    const [theme, setTheme] = useState<number | null>(null)
    const [message, setMessage] = useState<string | null>(null)


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


    return (
        <div ref={containerRef} className="relative flex justify-center items-start w-screen h-screen overflow-scroll bg-orange-200 font-sans">
            <div className="fixed top-0 left-[50%] translate-x-[-50%] flex justify-center w-full backdrop-blur-lg absolute">
                <h1 className=" w-full max-w-lg text-center flex flex-col justify-center items-center my-2 ">
                    <a className="p-2 rounded-2xl">Letter Box</a>
                    <div className="relative w-full h-1 rounded-full  bg-amber-800/50">
                        <span
                            style={{ width: `${(visibleQuestion / 4) * 100}%` }}
                            className="absolute inset-0 rounded-full bg-amber-800"></span>
                    </div>
                </h1>
            </div>
            <div className="flex flex-col justify-start items-center max-w-4xl w-full h-full ">

                {/* INTRODUCTORY PHRASE */}
                {visibleQuestion >= -1 &&

                    <EntryAnimation onAnimationComplete={() => { setVisibleQuestion(0) }} className="" >
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

                    {visibleQuestion >= 0 &&
                        <EntryAnimation className="flex flex-col justify-start items-start w-full gap-2 ">
                            <div className="flex flex-col justify-start items-start w-full gap-2 ">
                                <div className="px-4 py-2 rounded-2xl text-2xl bg-amber-100 ">
                                    What should I call you ?
                                </div>
                                <UserAnswerBox setVisibleQuestion={setVisibleQuestion} setAnswer={setUsername} />
                            </div>
                        </EntryAnimation>}


                    {/* Question 2 */}
                    {visibleQuestion >= 1 &&
                        <EntryAnimation className="flex flex-col justify-start items-start w-full gap-2 ">
                            <div className="px-4 py-2 rounded-2xl text-2xl bg-amber-100 ">
                                Hello {username} 😊
                            </div>
                            <div className="px-4 py-2 rounded-2xl text-2xl bg-amber-100 ">
                                This letter is dedicated to whome ?
                            </div>
                            <UserAnswerBox setVisibleQuestion={setVisibleQuestion} setAnswer={setRecipient} />
                        </EntryAnimation>}

                </div>

                {/* Question 3 */}
                {visibleQuestion >= 2 &&
                    <EntryAnimation className="">
                        <div>
                            <div className="text-2xl mt-8">
                                Pick a theme for your letter, It will shape the mood, colors, and atmosphere of your message, helping us turn your thoughts into something memorable, personal, and meaningful to keep.
                            </div>
                            <div className="flex justify-center theme-selector-container w-full mt-16">
                                <ThemeSelectorCard setTheme={setTheme} setVisibleQuestion={setVisibleQuestion} />
                            </div>
                        </div>
                    </EntryAnimation>
                }


                {/* Question 4 */}
                {visibleQuestion >= 3 &&
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
                        <button className="translate-y-[-100px] flex items-center px-4 py-2 rounded-2xl text-2xl bg-amber-100 mt-10 gap-4">
                            <Send strokeWidth={1.5} size={20} />
                            Render Letter
                        </button>
                    </EntryAnimation>}


            </div>

        </div >
    )

}




export function UserAnswerBox({ setVisibleQuestion, setAnswer }: { setVisibleQuestion: (value: number) => void, setAnswer: (value: string) => void }) {

    const handleSend = () => {
        setVisibleQuestion((prev) => (prev + 1))
    }

    return (
        <div className="flex justify-end w-full">
            <div className="flex items-center px-4 py-2 rounded-2xl text-2xl bg-amber-100 ">
                <input type="text" className="appearance-none border-0 outline-none w-full text-left" onChange={(e) => { setAnswer(e.target.value) }} />
                <SendHorizontal strokeWidth={1.5} size={20} onClick={handleSend} />
            </div>
        </div>
    )
}




export function ThemeSelectorCard({ setTheme, setVisibleQuestion }: { setTheme: (value: string) => void, setVisibleQuestion: (value: number) => void }) {

    const handleClick = (idx: number) => {
        setTheme(idx)
        setVisibleQuestion((prev) => (prev + 1))

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
                        onClick={() => handleClick(idx)}
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