"use client"
import Image from "next/image";
import WaxSeal from "./WaxSeal"
import { Bookmark, Home } from "lucide-react";
import { TypingAnimation } from "@/components/ui/typing-animation"
import { AnimatePresence, motion } from "motion/react"
import AudioPlayerControls from "./AudioPlayer/AudioPlayerControls"
import { useEffect, useRef, useState } from "react";
import type { LetterDataType } from "@/app/types/letters";
import { formatLetterDate } from "@/lib/format-letter-date";


export default function Letter({ letterData }: { letterData: LetterDataType; backgroundImage?: string; secImage?: string; textHighlight?: string; themeSong?: string }) {

    const submittedDate = formatLetterDate(letterData.created_at)


    const parentVariants = {
        rest: {},
        hover: {}
    }

    const childVariants = {
        rest: {
            scale: 0.9,
            opacity: 0,
            y: 10,
            display: "none"
        },

        hover: {
            scale: 1,
            opacity: 1,
            y: 0,
            display: "block"
        }
    }

    type LetterThemeType = {
        id: string,
        name: string,
        backgroundImage: string,
        secImage: string,
        textHighlight: string,
        themeSong: string
    }

    const letterThemes: LetterThemeType[] = [
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
            backgroundImage: "/themes/blue-background.png",
            secImage: "/themes/blue-detail.png",
            textHighlight: "oklch(75% 0.12 240 / 0.5)",
            themeSong: "/themes/defaultAudio.mp3"
        },
        {
            id: "Green",
            name: "Default",
            backgroundImage: "/themes/green-background.png",
            secImage: "/themes/green-detail.png",
            textHighlight: "oklch(75% 0.12 145 / 0.5)",
            themeSong: "/themes/defaultAudio.mp3"
        },
        {
            id: "Red",
            name: "Default",
            backgroundImage: "/themes/red-background.png",
            secImage: "/themes/red-detail.png",
            textHighlight: "oklch(75% 0.14 25 / 0.5)",
            themeSong: "/themes/defaultAudio.mp3"
        },
        {
            id: "Demo",
            name: "Default",
            backgroundImage: "https://placehold.co/1440x900?text=Demo+Background",
            secImage: "https://placehold.co/200x180?text=Demo+Sec+Image",
            textHighlight: "oklch(75% 0.14 25 / 0.5)",
            themeSong: "/themes/defaultAudio.mp3"
        }
    ]

    const themeState = letterThemes.find(theme => theme.id === letterData.theme) || letterThemes[0]

    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currTime, setCurrTime] = useState(0)
    const [audioDuration, setAudioDuration] = useState(0)
    const [audioError, setAudioError] = useState<string | null>(null)

    const handleTogglePlay = async () => {
        const audio = audioRef.current
        if (!audio) return
        setAudioError(null)
        if (!audio.paused) {
            audio.pause()
            return
        }
        try {
            await audio.play()
        } catch (error) {
            // A pause or source change can cancel a pending play request.
            if (error instanceof Error && error.name === "AbortError") return
            setIsPlaying(false)
            setAudioError("Audio could not play. Please try again.")
        }
    }

    const handleProgressUpdate = () => {
        const audio = audioRef.current
        if (!audio) return
        const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0
        setAudioDuration(duration)
        setCurrTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0)
        setProgress(duration ? Math.min(100, Math.max(0, audio.currentTime / duration * 100)) : 0)
    }

    const handleMuteToggle = () => {
        const audio = audioRef.current
        if (audio) audio.muted = !audio.muted
    }

    const containerRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new MutationObserver(() => {
            container.scrollTop = container.scrollHeight
        })

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        })

        return () => observer.disconnect()
    }, [])



    const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current
        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return
        const value = Math.min(100, Math.max(0, Number(e.target.value)))
        audio.currentTime = (value / 100) * audio.duration
        handleProgressUpdate()
    }

    const [typingComplete, setTypingComplete] = useState(false)
    const [typingKey, setTypingKey] = useState(0)

    // const text = "Hello World"

    const handleRestartTyping = () => {
        setTypingComplete(false)
        setTypingKey(prev => prev + 1)

    }

    // useEffect(() => {
    //     const typeSpeed = 75

    //     const timer = setTimeout(() => {
    //         setTypingComplete(true)
    //     }, (letterData.message.length * typeSpeed) + 300)

    //     return () => clearTimeout(timer)
    // }, [handleRestartTyping])


    return (
        <div className="w-screen h-dvh overflow-hidden">
            <audio
                key={themeState.themeSong}
                ref={audioRef}
                src={themeState.themeSong}
                preload="metadata"
                onLoadedMetadata={handleProgressUpdate}
                onDurationChange={handleProgressUpdate}
                onTimeUpdate={handleProgressUpdate}
                onSeeked={handleProgressUpdate}
                onPlay={() => { setIsPlaying(true); setAudioError(null) }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => { setIsPlaying(false); handleProgressUpdate() }}
                onVolumeChange={event => setIsMuted(event.currentTarget.muted)}
                onEmptied={() => { setIsPlaying(false); setProgress(0); setCurrTime(0); setAudioDuration(0); setAudioError(null) }}
                onError={() => { setIsPlaying(false); setAudioError("Audio is unavailable. Please try again.") }}
            />
            {audioError && <p role="status" className="absolute top-20 inset-x-4 z-20 text-center text-sm text-white">{audioError}</p>}

            <span>
                <Image src={themeState?.backgroundImage} alt="background" className="absolute inset-0 object-cover w-full h-full z-0" width={1920} height={1080} unoptimized />
            </span>
            <span className="absolute left-0 bottom-0 object-cover w-full h-[20dvh] z-0 bg-gradient-to-t from-white/70 to-transparent z-10 pointer-events-none"></span>


            <div className="relative flex flex-col  justify-between items-center w-screen h-dvh p-4 md:p-8 text-neutral-100">

                {/* <Noise
          patternSize={250}
          patternScaleX={2}
          patternScaleY={2}
          patternRefreshInterval={12}
          patternAlpha={20}

        /> */}

                <div className="flex justify-between items-center w-full text-xs  z-10 py-4">
                    <a
                        style={{
                            backgroundColor: themeState?.textHighlight
                        }}
                        className="flex justify-center items-center gap-2  px-2 p-1 rounded-xl uppercase">
                        <Home strokeWidth={1} size={16} />
                        Return Home
                    </a>
                    <a
                        style={{
                            backgroundColor: themeState?.textHighlight
                        }}
                        className="flex justify-center items-center gap-2 px-2 p-1 rounded-xl uppercase">
                        Archive Letter
                        <Bookmark strokeWidth={1} size={16} />
                    </a>
                </div>

                <div className="relative ">
                    <div className=" w-full max-w-[672px] max-h-[50vh] md:max-h-[60vh] overflow-scroll md:text-2xl mx-auto md:px-2 px-12 my-8  z-10 "
                        ref={containerRef}>
                        {/* <span className="absolute inset-0 h-[8vh] bg-radial-to-b from-white/5 to-transparent backdrop-blur-xs"></span>
            <span className="absolute bottom-0 left-0  h-[8vh] w-full bg-radial-to-t from-white/5 to-transparent backdrop-blur-xs z-10"></span> */}


                        <TypingAnimation as="span"
                            key={typingKey}
                            className="inline  rounded-sm px-2 py-1 leading-[2.6rem] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] z-100"
                            style={{
                                backgroundColor: themeState?.textHighlight
                            }}
                            typeSpeed={75}
                            startOnView={false}
                            onAnimationComplete={() => setTypingComplete(true)}
                        >
                            {letterData.message}

                        </TypingAnimation>
                        {typingComplete &&
                            <button className="text-sm bg-orange-500 px-4 p-2 rounded-md text-neutral-700 mx-1 my-6 cursor-pointer" onClick={handleRestartTyping}>Play again</button>}
                    </div>
                </div>


                <div className="flex flex-col justify-end items-between gap-8 w-full">
                    <div className="flex justify-between items-end w-full text-xs z-10">
                        <span className="flex flex-col justify-center items-start uppercase whitespace-nowrap">
                            <a>TO: {letterData.recipient_name}</a>
                            <a>FROM: {letterData.sender_name}</a>
                            {submittedDate && <span className="normal-case">SUBMITTED: {submittedDate}</span>}
                        </span>

                        <div className="hidden md:flex justify-center w-full min-w-0 px-4">
                            <div className="w-full max-w-[300px]"><AudioPlayerControls theme={themeState.id} isPlaying={isPlaying} isMuted={isMuted} progress={progress} currentTime={currTime} duration={audioDuration} onTogglePlay={handleTogglePlay} onToggleMute={handleMuteToggle} onSeek={handleChangeProgress} /></div>
                        </div>

                        <motion.span className="relative  group z-[9999]"
                            variants={parentVariants}
                            initial="rest"
                            whileHover="hover">


                            <span className="flex w-36 md:w-46 h-24 justify-end items-center">
                                <WaxSeal theme={themeState.id} />
                            </span>

                            <AnimatePresence>
                                <motion.div className="absolute bottom-34 right-0 flex flex-col justify-center items-center gap-4 bg-neutral-200 p-4 "
                                    variants={childVariants}>
                                    <Image src={themeState?.secImage} alt="postal image" width={1000} height={1000} className="object-cover min-w-[180px] z-[9999]" unoptimized />
                                    <a className="text-neutral-900 flex justify-center w-full pt-2">Loni Kalbhor</a>
                                </motion.div>
                            </AnimatePresence>

                        </motion.span>
                    </div>

                    <div className="flex md:hidden justify-center w-full z-[9999]">
                        <AudioPlayerControls theme={themeState.id} isPlaying={isPlaying} isMuted={isMuted} progress={progress} currentTime={currTime} duration={audioDuration} onTogglePlay={handleTogglePlay} onToggleMute={handleMuteToggle} onSeek={handleChangeProgress} />
                    </div>
                </div>

            </div>
        </div >
    )
}
