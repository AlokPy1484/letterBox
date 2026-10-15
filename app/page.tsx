"use Client"

import Letter from "@/components/LetterComponent";



export default function page() {

  const themes = [
    {
      id: "yellow",
      name: "Default",
      backgroundImage: "/themes/defaultBg.jpeg",
      secImage: "/themes/defaultImage.jpeg",
      textHighlight: "oklch(75% 0.183 55.934 / 0.5)",
      themeSong: "/themes/defaultAudio.mp3"
    },
    {
      id: "blue",
      name: "Default",
      backgroundImage: "/themes/blue-background.png",
      secImage: "/themes/blue-detail.png",
      textHighlight: "oklch(75% 0.12 240 / 0.5)",
      themeSong: "/themes/defaultAudio.mp3"
    },
    {
      id: "green",
      name: "Default",
      backgroundImage: "/themes/green-background.png",
      secImage: "/themes/green-detail.png",
      textHighlight: "oklch(75% 0.12 145 / 0.5)",
      themeSong: "/themes/defaultAudio.mp3"
    },
    {
      id: "red",
      name: "Default",
      backgroundImage: "/themes/red-background.png",
      secImage: "/themes/red-detail.png",
      textHighlight: "oklch(75% 0.14 25 / 0.5)",
      themeSong: "/themes/defaultAudio.mp3"
    }
  ]

  const letterData = {
    message: "Letter Box is a digital letter-sending platform inspired by typo.love, created for moments that deserve more than a simple text message. It allows you to turn your thoughts, memories, and emotions into beautifully designed digital letters that feel personal and meaningful. Instead of sending another ordinary message, Letter Box gives you a space to express yourself through carefully crafted visuals, typography, music, images, and words. Each letter is designed to reflect the care, warmth, and emotion behind your message, making the experience feel closer to receiving a handwritten letter. Whether it’s a birthday, confession, thank-you, apology, or simply a reminder that someone matters, Letter Box makes every message feel special, intimate, and memorable.",
    id: "a5d105f1-d8d6-48b8-bfb6-348a3a117f48",
    slug: "demo",
    sender_name: "Pandey",
    recipient_name: "Shrey",
    theme: "Green" as const,
    created_at: "15 FEB 2025"
  }

  const ThemeID = 3

  const theme = themes[ThemeID]

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Letter themeSong={theme.themeSong} backgroundImage={theme.backgroundImage} secImage={theme.secImage} textHighlight={theme.textHighlight} letterData={letterData} />
    </div>
  )
}
