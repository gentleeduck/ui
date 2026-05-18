import type { Metadata } from 'next'
import { Inria_Serif, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-inria-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DocDuck — Collaborative Document Editor',
  description: 'A collaborative document editor showcasing @gentleduck/iam',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="bun" className={`${jetbrainsMono.variable} ${inriaSerif.variable}`}>
      <body className={jetbrainsMono.className}>
        {children}
        <Toaster position="top-center" closeButton />
      </body>
    </html>
  )
}
