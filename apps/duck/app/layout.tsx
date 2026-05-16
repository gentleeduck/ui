/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: This layout bootstraps the stored font preset before hydration. */
import type { Metadata } from 'next'
import '~/public/r/themes.css'
import './globals.css'
import { ThemeProvider } from '@gentleduck/docs/client'
import { cn } from '@gentleduck/libs/cn'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { AppClientProviders } from '~/components/app-client-providers'
import { DocsAppProvider } from '~/components/docs-provider'
import { TailwindIndicator } from '~/components/layouts/tailwind-indicator'
import { ThemeWrapper } from '~/components/themes'
import { docsConfig } from '~/config/docs'
import { METADATA } from '~/config/metadata'
import { siteConfig } from '~/config/site'
import { fontMono } from '~/lib/fonts'

export const metadata: Metadata = {
  ...METADATA,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={fontMono.variable}
      dir="ltr"
      lang="en"
      style={{ overflowY: 'scroll', scrollbarGutter: 'stable' }}
      suppressHydrationWarning>
      <head>
        {/* @graph entity bundle: Organization + WebSite (SearchAction sitelinks) + SoftwareApplication + SiteNavigationElement. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://gentleduck.org/#organization',
                  name: 'gentleduck',
                  alternateName: ['gentleduck/ui', 'gentleduck.org'],
                  url: 'https://gentleduck.org',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://gentleduck.org/og/root.png',
                    width: 1400,
                    height: 628,
                  },
                  sameAs: [
                    'https://github.com/gentleeduck/gentleduck',
                    'https://x.com/wild_ducka',
                    'https://opencollective.com/gentelduck',
                  ],
                  founder: {
                    '@type': 'Person',
                    name: 'Ahmed Ayob',
                    url: 'https://github.com/wildduck2',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://gentleduck.org/#website',
                  url: 'https://gentleduck.org',
                  name: 'gentleduck',
                  description:
                    'The gentleduck ecosystem — UI components, headless primitives, a CLI, calendar engine, file uploads, structured logging, identity & access management, and project templates.',
                  publisher: { '@id': 'https://gentleduck.org/#organization' },
                  inLanguage: 'en',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://gentleduck.org/search?q={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://gentleduck.org/#app',
                  name: 'gentleduck/ui',
                  description: 'Headless primitives, styled components, a CLI, and pre-built blocks for React.',
                  applicationCategory: 'DeveloperApplication',
                  operatingSystem: 'Any',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                  url: 'https://gentleduck.org',
                  author: { '@id': 'https://gentleduck.org/#organization' },
                  license: 'https://opensource.org/licenses/MIT',
                  programmingLanguage: ['TypeScript', 'React'],
                },
                {
                  '@type': 'SiteNavigationElement',
                  '@id': 'https://gentleduck.org/#nav',
                  name: [
                    'Introduction',
                    'Installation',
                    'Packages',
                    'Duck UI',
                    'Duck Primitives',
                    'Duck CLI',
                    'Duck Calendar',
                    'Duck Vim',
                    'Skills',
                    'MCP',
                    'Changelog',
                    'FAQs',
                  ],
                  url: [
                    'https://gentleduck.org/www/introduction',
                    'https://gentleduck.org/www/installation',
                    'https://gentleduck.org/www/packages',
                    'https://gentleduck.org/duck-ui',
                    'https://gentleduck.org/duck-primitives',
                    'https://gentleduck.org/duck-cli',
                    'https://gentleduck.org/duck-calendar',
                    'https://gentleduck.org/duck-vim',
                    'https://gentleduck.org/skills',
                    'https://gentleduck.org/mcp',
                    'https://gentleduck.org/www/changelog',
                    'https://gentleduck.org/www/faqs',
                  ],
                },
              ],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var raw=localStorage.getItem('fontItalic');var italic=raw?JSON.parse(raw)===true:false;document.documentElement.setAttribute('data-font-italic',italic?'true':'false');document.documentElement.style.setProperty('--duck-font-style',italic?'italic':'normal');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={cn('duck min-h-svh bg-background antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableColorScheme enableSystem>
          <AppClientProviders>
            <DirectionProvider dir="ltr">
              <DocsAppProvider docsConfig={docsConfig} siteConfig={siteConfig}>
                <ThemeWrapper>
                  <div vaul-drawer-wrapper="">
                    <div className="relative flex min-h-svh flex-col bg-background">{children}</div>
                  </div>

                  {process.env.NODE_ENV === 'development' && <TailwindIndicator />}
                </ThemeWrapper>
              </DocsAppProvider>
            </DirectionProvider>
          </AppClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
