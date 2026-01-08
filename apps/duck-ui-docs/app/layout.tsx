import type { Metadata } from 'next'
import './globals.css'
import '@gentleduck/motion/css'
import { TailwindIndicator, ThemeProvider } from '@gentleduck/docs'
import { cn } from '@gentleduck/libs/cn'
import 'public/r/themes.css'
import { Toaster } from '@gentleduck/registry-ui-duckui/sonner'
import { KeyProvider } from '@gentleduck/vim/react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { DocsAppProvider } from '~/components/docs-provider'
import { ThemeWrapper } from '~/components/themes'
import { docsConfig } from '~/config/docs'
import { METADATA } from '~/config/metadata'
import { META_THEME_COLORS, siteConfig } from '~/config/site'
import { docs } from '../.velite'

const docsEntries = docs.map((doc) => {
  const slug = doc.slug.startsWith('/') ? doc.slug : `/${doc.slug}`
  return {
    component: doc.component,
    content: doc.body,
    permalink: slug,
    slug,
    title: doc.title,
    toc: doc.toc,
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
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
        )}
        {/* Preload critical fonts */}
        <link as="font" crossOrigin="anonymous" href="/fonts/Geist-VF.woff2" rel="preload" type="font/woff2" />
        <link as="font" crossOrigin="anonymous" href="/fonts/GeistMono-VF.woff2" rel="preload" type="font/woff2" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  let fontType = localStorage.getItem('fontType'); 
                  let family = fontType === 'sans'
                    ? 'var(--font-sans-geist)'
                    : 'var(--font-mono-geist)';

                  // Preferred: set as inline style property with priority
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
            <DocsAppProvider docs={docsEntries} docsConfig={docsConfig} siteConfig={docsSiteConfig}>
              <ThemeWrapper>
                <div vaul-drawer-wrapper="">
                  <div className="relative flex min-h-svh flex-col bg-background">{children}</div>
                </div>

                {/* non-critical scripts */}
                <SpeedInsights />
                <VercelAnalytics />
                <Toaster />
                {process.env.NODE_ENV === 'development' && <TailwindIndicator />}
              </ThemeWrapper>
            </DocsAppProvider>
          </ThemeProvider>
        </KeyProvider>
      </body>
    </html>
  )
}
