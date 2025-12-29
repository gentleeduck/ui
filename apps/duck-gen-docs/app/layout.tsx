import type { Metadata } from 'next'
import './globals.css'
import '@gentleduck/motion/css'
import { cn } from '@gentleduck/libs/cn'
import { Toaster } from '@gentleduck/registry-ui-duckui/sonner'
import { KeyProvider } from '@gentleduck/vim/react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { TailwindIndicator } from '~/components/layouts'
import { ThemeProvider } from '~/components/providers'
import { METADATA } from '~/config/metadata'

export const metadata: Metadata = {
  ...METADATA,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
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
            <div vaul-drawer-wrapper="">
              <div className="relative flex min-h-svh flex-col bg-background">{children}</div>
            </div>

            {/* non-critical scripts */}
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
