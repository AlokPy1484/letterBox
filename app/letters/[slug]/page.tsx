"use client"
import Letter from "@/components/LetterComponent";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function page() {

    const themes = [
        {
            id: "Yellow",
            name: "Default",
            backgroundImage: "/themes/defaultBg.jpeg",
            secImage: "/themes/defaultImage.jpeg",
            textHighlight: "oklch(75% 0.183 55.934 / 0.5)",
            themeSong: "/themes/defaultAudio.mp3"
        },
        {
            id: "Blue",
            name: "Default",
            backgroundImage: "https://placehold.co/1440x900?text=Blue+Background",
            secImage: "https://placehold.co/200x180?text=Blue+Sec+Image",
            textHighlight: "oklch(75% 0.12 240 / 0.5)",
            themeSong: "/themes/defaultAudio.mp3"
        },
        {
            id: "Green",
            name: "Default",
            backgroundImage: "https://placehold.co/1440x900?text=Green+Background",
            secImage: "https://placehold.co/200x180?text=Green+Sec+Image",
            textHighlight: "oklch(75% 0.12 145 / 0.5)",
            themeSong: "/themes/defaultAudio.mp3"
        },
        {
            id: "Red",
            name: "Default",
            backgroundImage: "https://placehold.co/1440x900?text=Red+Background",
            secImage: "https://placehold.co/200x180?text=Red+Sec+Image",
            textHighlight: "oklch(75% 0.14 25 / 0.5)",
            themeSong: "/themes/defaultAudio.mp3"
        }
    ]

    // const letterData = {
    //     message: "Letter Box is a digital letter-sending platform inspired by typo.love, created for moments that deserve more than a simple text message. It allows you to turn your thoughts, memories, and emotions into beautifully designed digital letters that feel personal and meaningful. Instead of sending another ordinary message, Letter Box gives you a space to express yourself through carefully crafted visuals, typography, music, images, and words. Each letter is designed to reflect the care, warmth, and emotion behind your message, making the experience feel closer to receiving a handwritten letter. Whether it’s a birthday, confession, thank-you, apology, or simply a reminder that someone matters, Letter Box makes every message feel special, intimate, and memorable.",
    //     userName: "Pandey",
    //     recipient: "Shrey",
    //     date: "15 FEB 2025"
    // }

    const params = useParams()

    const [themeState, setThemeState] = useState(themes[0])
    const [currLetterData, setCurrLetterData] = useState({})


    const getLetterData = async (slug) => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from("letters")
            .select("*")
            .eq("slug", slug)
            .single()

        if (error) {
            console.log(error)
            return
        }

        console.log("Supabse response: ", data)

        // const letterData = {
        //     message: data.message,
        //     userName: data.user_name,
        //     recipient: data.recipient,
        //     date: data.date
        // }
        setCurrLetterData({
            message: data.message,
            userName: data.sender_name,
            recipient: data.recipient_name,
            date: data.created_at,
            theme: data.theme
        })
    }

    useEffect(() => {
        getLetterData(params.slug)

    }, [])

    useEffect(() => {
        console.log("Letter data state:", currLetterData)
        console.log("Theme Data:", themes.find(t => t.id === currLetterData?.theme))
        setThemeState(themes.find(t => t.id === currLetterData?.theme) || themes[2])
    }, [currLetterData])


    // const theme = themes[2]

    return (
        <div className="flex justify-center items-center w-full h-full ">
            <Letter themeSong={themeState.themeSong} backgroundImage={themeState.backgroundImage} secImage={themeState.secImage} textHighlight={themeState.textHighlight} letterData={currLetterData} />

            {/* <a className="text-2xl text-black">
                {currLetterData.message}
            </a> */}
        </div>
    )
}