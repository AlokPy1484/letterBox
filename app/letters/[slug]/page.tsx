"use client"
import { LetterDataType } from "@/app/types/letters";
import Letter from "@/components/LetterComponent";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function page() {

    const params = useParams()

    const [currLetterData, setCurrLetterData] = useState<LetterDataType>({
        message: "text message",
        sender_name: "sender_name",
        recipient_name: "recipient_name",
        created_at: "date",
        theme: "theme"
    })


    const getLetterData = async (slug: string) => {
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
            sender_name: data.sender_name,
            recipient_name: data.recipient_name,
            created_at: data.created_at,
            theme: data.theme
        })
    }

    useEffect(() => {
        getLetterData(params.slug)

    }, [])

    // useEffect(() => {
    //     console.log("Letter data state:", currLetterData)
    //     console.log("Theme Data:", themes.find(t => t.id === currLetterData?.theme))
    //     setThemeState(themes.find(t => t.id === currLetterData?.theme) || themes[2])
    // }, [currLetterData])


    // const theme = themes[2]

    return (
        <div className="flex justify-center items-center w-full h-full ">
            <Letter letterData={currLetterData} />

            {/* <a className="text-2xl text-black">
                {currLetterData.message}
            </a> */}
        </div>
    )
}