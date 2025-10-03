import type { Metadata } from 'next'
import './globals.css'
import '@gentleduck/motion/css'
import './mdx.css'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <meta content={siteConfig.name} property="og:site_name" />
        <meta content={siteConfig.url} property="og:url" />
        <link rel="icon" href="/icons/light/favicon-48x48.png" type="image/png" sizes="48x48" />

        <link rel="icon" href="/icons/light/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icons/light/favicon-16x16.png" type="image/png" sizes="16x16" />

        <link rel="icon" href="/icons/light/favicon-32x32.png" media="(prefers-color-scheme: light)" type="image/png" />
        <link rel="icon" href="/icons/dark/favicon-32x32.png" media="(prefers-color-scheme: dark)" type="image/png" />

        <link rel="apple-touch-icon" href="/icons/light/apple-touch-icon.png" />

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
      <body className={cn('min-h-svh bg-background antialiased duck')}>
        <KeyProvider timeoutMs={100}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableColorScheme
            enableSystem>
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
          </ThemeProvider>
        </KeyProvider>
      </body>
    </html>
  )
}
