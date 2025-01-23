import '@/styles/globals.scss'
import { Metadata, Viewport } from 'next'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Analytics } from '@/components/ui'
import { ThemeProvider } from '@/components/providers'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { DefaultToaster } from '@/registry/registry-ui-components/toast'
import { ScrollArea } from '@/registry/default/ui'
import { DefaultSonner } from '@/registry/registry-ui-components/sonner'
// import { Toaster as NewYorkToaster } from '@/registry/default/ui/'

import localFont from 'next/font/local'
import { TRPCReactProvider } from '@/trpc/react'

// Font files can be colocated inside of `pages`
const EmojiFont = localFont({ src: '../assets/fonts/font.ttf' })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Server Components', 'Radix UI'],
  authors: [
    {
      name: 'shadcn',
      url: 'https://shadcn.com',
    },
  ],
  creator: 'shadcn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@shadcn',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
      >
        <head />
        <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div vaul-drawer-wrapper="">
                <ScrollArea className="h-[100vh]">
                  <div className="relative flex min-h-screen flex-col bg-background">{children}</div>
                </ScrollArea>
              </div>
              <ThemeSwitcher />
              <Analytics />
              <DefaultSonner />
              <DefaultToaster />
              <TailwindIndicator />
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </>
  )
}
// <NewYorkToaster />
