import type { Metadata } from 'next'
import './globals.css'
import '@gentleduck/motion/css'
// import 'public/r/themes.css'
import { TailwindIndicator, ThemeProvider } from '@gentleduck/docs/client'
import { cn } from '@gentleduck/libs/cn'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AppClientProviders } from '~/components/app-client-providers'
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
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableColorScheme enableSystem>
          <AppClientProviders>
            <DocsAppProvider docs={docsEntries} docsConfig={docsConfig} siteConfig={docsSiteConfig}>
              <ThemeWrapper>
                <div vaul-drawer-wrapper="">
                  <div className="relative flex min-h-svh flex-col bg-background">{children}</div>
                </div>

                <SpeedInsights />
                <VercelAnalytics />
                {process.env.NODE_ENV === 'development' && <TailwindIndicator />}
              </ThemeWrapper>
            </DocsAppProvider>
          </AppClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
