"use client"

import Image from "next/image";
import background from "../public/02-real.png"
import prop from "../public/01.avif"
import loni from "../public/03-loni.jpeg"
import loni2 from "../public/04-loni.jpeg"
import { MoveLeft, MoveRight, Pause, Play, Speaker, Volume2, VolumeX } from "lucide-react";
import Noise from "../components/Noise"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { AnimatePresence, motion, scale } from "motion/react"
import styles from "../components/AudioPlayer/AudioPlayer.module.css"
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";




export default function Home() {


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

  const audioRef = useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)


  const handleTogglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()

    }
    else {
      audioRef.current.play()

    }
    setIsPlaying(!isPlaying)
  }
  const handleProgressUpdate = () => {
    if (!audioRef.current) return;

    const { currentTime, duration } = audioRef.current;

    if (!Number.isFinite(duration) || duration === 0) return;

    setProgress((currentTime / duration) * 100);

    const current = Number(currentTime / 60).toFixed(2)
    setCurrTime(current)
  };

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



  const [currTime, setCurrTime] = useState<number | null>()

  const handleChangeProgress = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!audioRef.current) return;

    const value = Number(e.target.value);
    const duration = audioRef.current.duration;

    if (!Number.isFinite(duration)) return;


    audioRef.current.currentTime = (value / 100) * duration;

    setProgress(value);

  };

  const [typingComplete, setTypingComplete] = useState(false)
  const [typingKey, setTypingKey] = useState(0)

  const text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta placeat rerum obcaecati sapiente similique? Velit magni a adipisci, fuga illum temporibus officiis autem minus veniam aperiam ratione, possimus sunt quisquam! Lorem ipsum dolor sit amet consectetur adipisicing elit.Perferendis aliquam voluptates facere corrupti dolores omnis at repudiandae explicabo expedita ex quae, ipsum incidunt odio aspernatur beatae blanditiis corporis.Ratione, quisquam! Lorem ipsum dolor sit amet consectetur adipisicing elit.Perferendis aliquam voluptates facere corrupti dolores omnis at repudiandae explicabo expedita ex quae, ipsum incidunt odio aspernatur beatae blanditiis corporis.Ratione, quisquam! Lorem ipsum dolor sit amet consectetur adipisicing elit.Perferendis aliquam voluptates facere corrupti dolores omnis at repudiandae explicabo expedita ex quae, ipsum incidunt odio aspernatur beatae blanditiis corporis.Ratione, quisquam!"

  // const text = "Hello World"

  const handleRestartTyping = () => {
    setTypingComplete(false)
    setTypingKey(prev => prev + 1)

  }

  useEffect(() => {
    const typeSpeed = 75

    const timer = setTimeout(() => {
      setTypingComplete(true)
    }, (text.length * typeSpeed) + 300)

    return () => clearTimeout(timer)
  }, [handleRestartTyping])


  const [audioTitle, setAudioTitle] = useState<string | null>()
  const [audioDuration, setAudioDuration] = useState<number | null>()


  const handleMetadataFill = () => {
    if (!audioRef.current) return

    setAudioTitle(audioRef.current.title)
    const duration = Number(audioRef.current?.duration / 60).toFixed(2)
    setAudioDuration(duration)

  }


  useEffect(() => {
    handleMetadataFill()
    handleProgressUpdate()

  }, [])


  const [isMuted, setIsMuted] = useState<Boolean | null>(false)

  const handleMuteToggle = () => {
    if (!audioRef.current) return

    const updatedMute = !isMuted

    audioRef.current.volume = isMuted ? 0 : 1
    setIsMuted(updatedMute)
  }




  return (
    <div className="w-screen h-dvh overflow-hidden">

      <span>
        <Image src={loni} alt="background" className="absolute inset-0 object-cover w-full h-full z-0" />
      </span>
      <span className="absolute left-0 bottom-0 object-cover w-full h-[20dvh] z-0 bg-gradient-to-t from-white/70 to-transparent z-10 pointer-events-none"></span>


      <div className="relative flex flex-col  justify-between items-center w-screen h-dvh p-4 md:p-8 text-neutral-100">

        <Noise
          patternSize={250}
          patternScaleX={2}
          patternScaleY={2}
          patternRefreshInterval={12}
          patternAlpha={20}

        />

        <div className="flex justify-between items-center w-full text-xs  z-10 py-4">
          <a className="flex justify-center items-center gap-2 bg-orange-400/40 p-1 rounded-xl">
            <MoveLeft strokeWidth={1} size={16} />
            PREVIOUS LETTER
          </a>
          <a className="flex justify-center items-center gap-2 bg-orange-400/40 p-1 rounded-xl">
            NEXT LETTER
            <MoveRight strokeWidth={1} size={16} />
          </a>
        </div>

        <div className="relative ">
          <div className=" w-full max-w-[672px] max-h-[50vh] md:max-h-[60vh] overflow-scroll md:text-2xl mx-auto md:px-2 px-12 my-8  z-10 "
            ref={containerRef}>
            {/* <span className="absolute inset-0 h-[8vh] bg-radial-to-b from-white/5 to-transparent backdrop-blur-xs"></span>
            <span className="absolute bottom-0 left-0  h-[8vh] w-full bg-radial-to-t from-white/5 to-transparent backdrop-blur-xs z-10"></span> */}


            <TypingAnimation as="span"
              key={typingKey}
              className="inline bg-orange-400/40 rounded-sm px-2 py-1 leading-[2.6rem] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] z-100"
              typeSpeed={75}
              startOnView={false}
              onAnimationComplete={() => setTypingComplete(true)}
            >
              {text}
            </TypingAnimation>
            {typingComplete &&
              <button className="text-sm bg-orange-500 px-4 p-2 rounded-md text-neutral-700 mx-1 my-6 cursor-pointer" onClick={handleRestartTyping}>Play again</button>}
          </div>
        </div>


        <div className="flex flex-col justify-end items-between gap-8 w-full">
          <div className="flex justify-between items-end w-full text-xs z-10">
            <span className="flex flex-col justify-center items-start">
              <a>TO: SHREY</a>
              <a>FROM: PANDEY</a>
              <a>SUMITTED: 15 FEB 2025 AT 02:07</a>
            </span>

            {/* Music Player */}
            <div className="hidden md:flex justify-center text-black w-full">

              <audio ref={audioRef} src="/yellow.mp3" title="Yellow by Coldplay" onTimeUpdate={handleProgressUpdate} />
              {/* <source src="/yellow.mp3" type="audio/mpeg" />
              Your browser does not support the audio element. */}
              <div className="flex justify-between items-center gap-4 w-full max-w-[300px] ">
                <div className="rounded-full  border-[0.8px] border-neutral-400 p-2 mt-2 mb-1 cursor-pointer" onClick={handleTogglePlay}>
                  {isPlaying ? <Pause fill="black" size={16} /> : <Play fill="black" size={16} />}
                </div>
                <div className="flex flex-col justify-between items-start w-full h-full">
                  <div className="flex justify-between items-center w-full text-[12px] text-neutral-200">
                    <a className="">{audioTitle}</a>
                    {/* <a> {audioDuration}</a> */}
                  </div>
                  <input type="range" min={0} max={100} onChange={(e) => handleChangeProgress(e)} value={progress} className={`${styles.slider} w-full z-100`}
                    style={{
                      background: `linear-gradient(to right, white ${progress}%, #404040 ${progress}%)`,
                    }} />
                  <div className="flex justify-between w-full text-neutral-100">
                    <a>{currTime}</a>
                    <a className="">{audioDuration}</a>
                  </div>
                </div>
                <div className="rounded-full  p-2 mt-2 mb-1 cursor-pointer" onClick={handleMuteToggle}>
                  {isMuted ? <Volume2 fill="oklch(55.6% 0 none)" strokeOpacity={0.1} size={16} /> : <VolumeX fill="oklch(55.6% 0 none)" strokeOpacity={0.1} size={16} />}
                </div>

              </div>
            </div>




            <motion.span className="relative  group z-[9999]"
              variants={parentVariants}
              initial="rest"
              whileHover="hover">


              <Image src={prop} alt="prop" className=" w-36 md:w-46 h-24 object-cover hover:backdrop-blur-2xl  z-100" />
              <span className=" absolute inset-0 w-full h-full bg-neutral-300 z-100 opacity-0 hover:opacity-60 transition-opacity duration-300 ease-in-out"></span>

              <AnimatePresence>
                <motion.div className="absolute bottom-34 right-0 flex flex-col justify-center items-center gap-4 bg-neutral-200 p-4 "
                  variants={childVariants}>
                  <Image src={loni2} alt="postal image" className="object-cover min-w-[180px] z-[9999] " />
                  <a className="text-neutral-900 flex justify-center w-full pt-2">Loni Kalbhor</a>
                </motion.div>
              </AnimatePresence>

            </motion.span>
          </div>

          {/* Music Player */}
          <div className="flex md:hidden justify-center text-black w-full z-[9999]">

            <audio ref={audioRef} src="/yellow.mp3" title="Yellow by Coldplay" onTimeUpdate={handleProgressUpdate} className="" />
            {/* <source src="/yellow.mp3" type="audio/mpeg" />
              Your browser does not support the audio element. */}
            <div className="flex justify-between items-center gap-4 w-full z-[9999] ">
              <div className="rounded-full border border-[0.8px] border-neutral-400 p-2 mt-2 mb-1" onClick={handleTogglePlay}>
                {isPlaying ? <Pause fill="black" size={16} /> : <Play fill="black" size={16} />}
              </div>
              <div className="flex flex-col justify-between items-start w-full h-full">
                <a className="text-[12px] text-neutral-200">{audioRef.current?.title}</a>
                <input type="range" min={0} max={100} onChange={(e) => handleChangeProgress(e)} value={progress} className={`${styles.slider} w-full`}
                  style={{
                    background: `linear-gradient(to right, white ${progress}%, #404040 ${progress}%)`,

                  }} />
                <div className="flex justify-between w-full text-xs text-neutral-100">
                  <a>{currTime}</a>
                  <a className="">{audioDuration}</a>
                </div>
              </div>


            </div>
          </div>
        </div>

      </div>
    </div>
  )
}



