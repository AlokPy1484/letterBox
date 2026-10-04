"use client"

import { Flower } from "lucide-react"
import Image from "next/image"
import stamp from "@/public/stamp.png"
import stamp3 from "@/public/stamp3.png"
import { motion } from "motion/react"

interface ThemeSelectorProps {
    onSelect: (theme: string) => void
    disabled?: boolean
}

const themeList = [
    { name: "Yellow", label: "Sunshine", description: "Warm and cheerful, like a sunny day" },
    { name: "Blue", label: "Ocean", description: "Calm and serene, like a peaceful sea" },
    { name: "Green", label: "Forest", description: "Fresh and natural, like a woodland walk" },
    { name: "Red", label: "Passion", description: "Bold and heartfelt, like a warm embrace" },
]

export default function ThemeSelector({ onSelect, disabled = false }: ThemeSelectorProps) {
    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex flex-col justify-center items-center w-full bg-amber-600/40 rounded-2xl p-4 font-mono">
                <div className="group title-container flex justify-start items-between w-full gap-4">
                    <div className="w-[60px] relative">
                        <Image src={stamp3} alt="stamp" width={60} className="object-contain absolute inset-0 -rotate-15 group-hover:rotate-0 group-hover:z-10 group-hover:duration-300 group-hover:translate-x-2 transition-all duration-300 ease-in-out" />
                        <Image src={stamp} alt="stamp" width={60} className="absolute inset-0 object-contain rotate-15 group-hover:rotate-0 group-hover:z-10 group-hover:duration-300 group-hover:-translate-x-2 transition-all duration-300 ease-in-out" />
                    </div>

                    <div className="flex flex-col justify-between gap-2 py-1">
                        <h2 className="text-2xl font-semibold">Select a theme</h2>
                        <span className="text-sm tracking-tight leading-none">We have curated 4 themes for you, choose the one you like</span>
                    </div>
                </div>

                <div className="flex flex-col justify-start items-center gap-2 p-2 mt-4 w-full">
                    {themeList.map((theme) => (
                        <button
                            key={theme.name}
                            disabled={disabled}
                            onClick={() => onSelect(theme.name)}
                            className="group flex justify-start items-center gap-4 w-full p-2 bg-amber-200/30 hover:bg-amber-200/60 rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                        >
                            <div className="p-2 bg-yellow-100 rounded-full">
                                <Flower size={16} className="scale-100 group-hover:scale-120 group-hover:rotate-200 transition-all duration-300 ease-in-out" />
                            </div>
                            <div className="flex flex-col justify-between items-start">
                                <div className="text-lg font-medium">{theme.label}</div>
                                <div className="text-sm text-neutral-800">{theme.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
