import type { Metadata } from 'next'
import './globals.css'
import '@gentleduck/motion/css'
import { cn } from '@gentleduck/libs/cn'
import 'public/r/themes.css'
import { Toaster } from '@gentleduck/registry-ui-duckui/sonner'
import { KeyProvider } from '@gentleduck/vim/react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { TailwindIndicator } from '~/components/layouts'
import { ThemeProvider } from '~/components/providers'
import { ThemeWrapper } from '~/components/themes'
import { METADATA } from '~/config/metadata'
import { siteConfig } from '~/config/site'

export const metadata: Metadata = {
  ...METADATA,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {}
