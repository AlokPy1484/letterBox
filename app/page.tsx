"use client"

import Image from "next/image";
import background from "../public/02-real.png"
import prop from "../public/01.avif"
import loni from "../public/03-loni.jpeg"
import loni2 from "../public/04-loni.jpeg"
import { MoveLeft, MoveRight } from "lucide-react";
import Noise from "../components/Noise"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { AnimatePresence, motion, scale } from "motion/react"






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


  return (
    <div className="w-screen h-dvh">

      <span>
        <Image src={loni} alt="background" className="absolute inset-0 object-cover w-full h-dvh z-0" />
      </span>
      <div className="relative flex flex-col  justify-between items-center w-screen h-dvh p-8 text-neutral-100">

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




        <div className=" w-full max-w-[672px] md:text-2xl mx-auto  z-10 ">
          <TypingAnimation as="span"
            className="inline bg-orange-400/40 rounded-sm px-2 py-1 leading-[2.6rem] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] z-100"
            typeSpeed={75}
            startOnView={false}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta placeat rerum obcaecati sapiente similique? Velit magni a adipisci, fuga illum temporibus officiis autem minus veniam aperiam ratione, possimus sunt quisquam!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis aliquam voluptates facere corrupti dolores omnis at repudiandae explicabo expedita ex quae, ipsum incidunt odio aspernatur beatae blanditiis corporis. Ratione, quisquam!
          </TypingAnimation>
        </div>



        <div className="flex justify-between items-center w-full text-xs z-10">
          <span className="flex flex-col justify-center items-start">
            <a>TO: SHREY</a>
            <a>FROM: PANDEY</a>
            <a>SUMITTED: 15 FEB 2025 AT 02:07</a>
          </span>
          <motion.span className="absolute right-8 bottom-8 group"
            variants={parentVariants}
            initial="rest"
            whileHover="hover">


            <Image src={prop} alt="prop" className=" w-36 h-24 object-cover hover:backdrop-blur-2xl  z-100" />
            <span className=" absolute inset-0 w-full h-full bg-neutral-300 z-50 opacity-0 hover:opacity-60 transition-opacity duration-300 ease-in-out"></span>

            <AnimatePresence>
              <motion.div className="absolute bottom-34 right-0 flex flex-col justify-center items-center gap-4 bg-neutral-200 p-4 "
                variants={childVariants}>
                <Image src={loni2} alt="postal image" className="object-cover min-w-[180px]" />
                <a className="text-neutral-900 flex justify-center w-full pt-2">Loni Kalbhor</a>
              </motion.div>
            </AnimatePresence>

          </motion.span>
        </div>

      </div>
    </div>
  )
}



