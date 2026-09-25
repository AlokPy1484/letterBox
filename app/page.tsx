import Letter from "@/components/LetterComponent";
import loni from "../public/03-loni.jpeg"
import loni2 from "../public/04-loni.jpeg"



export default function page() {

  const letterData = {
    message: "Letter Box is a digital letter-sending platform inspired by typo.love, created for moments that deserve more than a simple text message. It allows you to turn your thoughts, memories, and emotions into beautifully designed digital letters that feel personal and meaningful. Instead of sending another ordinary message, Letter Box gives you a space to express yourself through carefully crafted visuals, typography, music, images, and words. Each letter is designed to reflect the care, warmth, and emotion behind your message, making the experience feel closer to receiving a handwritten letter. Whether it’s a birthday, confession, thank-you, apology, or simply a reminder that someone matters, Letter Box makes every message feel special, intimate, and memorable.",
    userName: "Pandey",
    recipient: "Shrey",
    date: "15 FEB 2025"
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Letter backgroundImage={loni} secImage={loni2} textHighlight="oklch(75% 0.183 55.934 / 0.5)" letterData={letterData} />
    </div>
  )
}