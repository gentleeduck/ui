// import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"
// import { GeistMono } from "geist/font/mono"
import { JetBrains_Mono as FontMono, Inter as FontSans } from 'next/font/google'

// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// })
export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})
