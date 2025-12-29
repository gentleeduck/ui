import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
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

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
