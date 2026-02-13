import type { Metadata } from 'next'
import './globals.css'
import '@gentleduck/motion/css'
import { DocsProvider, TailwindIndicator, ThemeProvider } from '@gentleduck/docs/client'
import { cn } from '@gentleduck/libs/cn'
import { Toaster } from '@gentleduck/registry-ui-duckui/sonner'
import { KeyProvider } from '@gentleduck/vim/react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Geist_Mono, Montserrat } from 'next/font/google'
import { docsConfig } from '~/config/docs'
import { METADATA } from '~/config/metadata'
import { META_THEME_COLORS, siteConfig } from '~/config/site'
import { docs } from '../.velite'

const geistSans = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})

const docsEntries = docs.map((doc) => {
  const slug = doc.slug.startsWith('/') ? doc.slug : `/${doc.slug}`
  return {
    component: doc.component,
    content: doc.body,
    permalink: slug,
    slug,
    title: doc.title,
  }
})

const docsSiteConfig = {
  ...siteConfig,
  metaThemeColors: META_THEME_COLORS,
}

export const metadata: Metadata = {
  ...METADATA,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`} dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var raw = localStorage.getItem('fontType');
                  var fontType = raw ? JSON.parse(raw) : 'mono';
                  var family = fontType === 'sans'
                    ? 'var(--font-geist-sans, "Montserrat"), sans-serif'
                    : 'var(--font-geist-mono, "Geist Mono"), monospace';
                  document.documentElement.style.setProperty('font-family', family, 'important');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={cn('duck min-h-svh bg-background antialiased')}>
        <KeyProvider timeoutMs={100}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableColorScheme
            enableSystem>
            <DocsProvider docs={docsEntries} docsConfig={docsConfig} siteConfig={docsSiteConfig}>
              <div vaul-drawer-wrapper="">
                <div className="relative flex min-h-svh flex-col bg-background">{children}</div>
              </div>
            </DocsProvider>

            <SpeedInsights />
            <VercelAnalytics />
            <Toaster />
            {process.env.NODE_ENV === 'development' && <TailwindIndicator />}
          </ThemeProvider>
        </KeyProvider>
      </body>
    </html>
  )
}
