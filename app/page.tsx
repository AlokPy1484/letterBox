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
      backgroundImage: "https://placehold.co/1440x900?text=Blue+Background",
      secImage: "https://placehold.co/200x180?text=Blue+Sec+Image",
      textHighlight: "oklch(75% 0.12 240 / 0.5)",
      themeSong: "/themes/defaultAudio.mp3"
    },
    {
      id: "green",
      name: "Default",
      backgroundImage: "https://placehold.co/1440x900?text=Green+Background",
      secImage: "https://placehold.co/200x180?text=Green+Sec+Image",
      textHighlight: "oklch(75% 0.12 145 / 0.5)",
      themeSong: "/themes/defaultAudio.mp3"
    },
    {
      id: "red",
      name: "Default",
      backgroundImage: "https://placehold.co/1440x900?text=Red+Background",
      secImage: "https://placehold.co/200x180?text=Red+Sec+Image",
      textHighlight: "oklch(75% 0.14 25 / 0.5)",
      themeSong: "/themes/defaultAudio.mp3"
    }
  ]

  const letterData = {
    message: "Letter Box is a digital letter-sending platform inspired by typo.love, created for moments that deserve more than a simple text message. It allows you to turn your thoughts, memories, and emotions into beautifully designed digital letters that feel personal and meaningful. Instead of sending another ordinary message, Letter Box gives you a space to express yourself through carefully crafted visuals, typography, music, images, and words. Each letter is designed to reflect the care, warmth, and emotion behind your message, making the experience feel closer to receiving a handwritten letter. Whether it’s a birthday, confession, thank-you, apology, or simply a reminder that someone matters, Letter Box makes every message feel special, intimate, and memorable.",
    userName: "Pandey",
    recipient: "Shrey",
    date: "15 FEB 2025"
  }

  const ThemeID = 3

  const theme = themes[ThemeID]

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Letter themeSong={theme.themeSong} backgroundImage={theme.backgroundImage} secImage={theme.secImage} textHighlight={theme.textHighlight} letterData={letterData} />
    </div>
  )
}