/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: This layout bootstraps the stored font preset before hydration. */
import type { Metadata } from 'next'
import '~/public/r/themes.css'
import './globals.css'
import { ThemeProvider } from '@gentleduck/docs/client'
import { cn } from '@gentleduck/libs/cn'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import localFont from 'next/font/local'
import { AppClientProviders } from '~/components/app-client-providers'
import { DocsAppProvider } from '~/components/docs-provider'
import { TailwindIndicator } from '~/components/layouts/tailwind-indicator'
import { ThemeWrapper } from '~/components/themes'
import { docsConfig } from '~/config/docs'
import { METADATA } from '~/config/metadata'
import { siteConfig } from '~/config/site'

// Inter and Inria Serif used to load eagerly via next/font/local. Both
// are now lazy-registered on-demand by ~/lib/dynamic-fonts when the
// user picks a sans- or serif- preset in the FontStyle menu. Initial
// page only ships JetBrains Mono Nerd.
const JetBrainsMonoNerd = localFont({
  src: [
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Regular.ttf',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Bold.ttf',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Medium.ttf',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Italic.ttf',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-MediumItalic.ttf',
      style: 'italic',
      weight: '500',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-BoldItalic.ttf',
      style: 'italic',
      weight: '700',
    },
  ],
  variable: '--font-mono-font',
  display: 'swap',
  preload: true,
  fallback: [
    'JetBrains Mono Nerd Font Mono',
    'JetBrains Mono Nerd Font',
    'JetBrains Mono',
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
})

export const metadata: Metadata = {
  ...METADATA,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={JetBrainsMonoNerd.variable}
      dir="ltr"
      lang="en"
      style={{ overflowY: 'scroll', scrollbarGutter: 'stable' }}
      suppressHydrationWarning>
      <head>
        {/* Single @graph entity bundle so Google can read Organization,
            WebSite (with SearchAction → sitelinks search box),
            SoftwareApplication, and SiteNavigationElement in one parse.
            Sitelinks themselves are still earned, not declared, but
            this gives Google the structure it needs to surface them. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://ui.gentleduck.org/#organization',
                  name: 'gentleduck',
                  alternateName: ['gentleduck/ui', 'gentleduck.org'],
                  url: 'https://ui.gentleduck.org',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://ui.gentleduck.org/og/root.png',
                    width: 1400,
                    height: 628,
                  },
                  sameAs: [
                    'https://github.com/gentleeduck/duck-ui',
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
                  '@id': 'https://ui.gentleduck.org/#website',
                  url: 'https://ui.gentleduck.org',
                  name: 'gentleduck',
                  description:
                    'The gentleduck ecosystem — UI components, headless primitives, a CLI, calendar engine, file uploads, structured logging, identity & access management, and project templates.',
                  publisher: { '@id': 'https://ui.gentleduck.org/#organization' },
                  inLanguage: 'en',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://ui.gentleduck.org/search?q={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://ui.gentleduck.org/#app',
                  name: 'gentleduck/ui',
                  description: 'Headless primitives, styled components, a CLI, and pre-built blocks for React.',
                  applicationCategory: 'DeveloperApplication',
                  operatingSystem: 'Any',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                  url: 'https://ui.gentleduck.org',
                  author: { '@id': 'https://ui.gentleduck.org/#organization' },
                  license: 'https://opensource.org/licenses/MIT',
                  programmingLanguage: ['TypeScript', 'React'],
                },
                {
                  '@type': 'SiteNavigationElement',
                  '@id': 'https://ui.gentleduck.org/#nav',
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
                    'https://ui.gentleduck.org/www/introduction',
                    'https://ui.gentleduck.org/www/installation',
                    'https://ui.gentleduck.org/www/packages',
                    'https://ui.gentleduck.org/duck-ui',
                    'https://ui.gentleduck.org/duck-primitives',
                    'https://ui.gentleduck.org/duck-cli',
                    'https://ui.gentleduck.org/duck-calendar',
                    'https://ui.gentleduck.org/duck-vim',
                    'https://ui.gentleduck.org/skills',
                    'https://ui.gentleduck.org/mcp',
                    'https://ui.gentleduck.org/www/changelog',
                    'https://ui.gentleduck.org/www/faqs',
                  ],
                },
              ],
            }),
          }}
        />
        {process.env.NODE_ENV === 'development' && (
          <>
            <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
            <script crossOrigin="anonymous" src="//unpkg.com/react-grab/dist/index.global.js" />
          </>
        )}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var presetKey = 'fontPresetV6';
                  var defaultPreset = 'mono-normal';
                  var allowed = {
                    'mono-italic': true,
                    'mono-normal': true,
                    'sans-normal': true,
                    'sans-italic': true,
                    'serif-normal': true,
                    'serif-italic': true
                  };
                  var rawPreset = localStorage.getItem(presetKey);
                  var preset = rawPreset ? JSON.parse(rawPreset) : null;
                  if (!preset) {
                    var rawV5Preset = localStorage.getItem('fontPresetV5');
                    var v5Preset = rawV5Preset ? JSON.parse(rawV5Preset) : null;
                    if (allowed[v5Preset]) {
                      preset = String(v5Preset).replace('-italic', '-normal');
                    } else {
                    var rawV2Preset = localStorage.getItem('fontPresetV2');
                    var v2Preset = rawV2Preset ? JSON.parse(rawV2Preset) : null;
                    if (allowed[v2Preset] && v2Preset.indexOf('mono-') === 0) {
                      preset = v2Preset;
                    } else {
                      var rawOldPreset = localStorage.getItem('fontPreset');
                      var oldPreset = rawOldPreset ? JSON.parse(rawOldPreset) : null;
                      if (allowed[oldPreset] && oldPreset.indexOf('mono-') === 0) {
                        preset = oldPreset;
                      } else {
                        var rawLegacy = localStorage.getItem('fontType');
                        var legacyType = rawLegacy ? JSON.parse(rawLegacy) : null;
                        preset = legacyType === 'mono' ? 'mono-normal' : defaultPreset;
                      }
                    }
                    }
                  }

                  if (!allowed[preset]) {
                    preset = defaultPreset;
                  }

                  if (!rawPreset) {
                    localStorage.setItem(presetKey, JSON.stringify(preset));
                  }

                  document.documentElement.setAttribute('data-font-preset', preset);

                  var family = '';
                  var familyVar = '--font-mono-font';
                  if (preset.indexOf('sans-') === 0) {
                    family = 'var(--font-sans-font, "Inter"), ui-sans-serif, system-ui, sans-serif';
                    familyVar = '--font-sans-font';
                  } else if (preset.indexOf('serif-') === 0) {
                    family = 'var(--font-serif-font, "Inria Serif"), Georgia, "Times New Roman", serif';
                    familyVar = '--font-serif-font';
                  } else {
                    family = 'var(--font-mono-font, "JetBrains Mono Nerd Font Mono"), "JetBrains Mono Nerd Font", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
                  }
                  var style = preset.indexOf('-italic') > -1 ? 'italic' : 'normal';
                  var warmUpFont = function () {
                    if (!document.fonts || !document.fonts.load) return;
                    try {
                      var computed = getComputedStyle(document.documentElement);
                      var familyToken = computed.getPropertyValue(familyVar).trim();
                      if (!familyToken) return;
                      var stylePrefix = style === 'italic' ? 'italic ' : '';
                      document.fonts.load(stylePrefix + '400 1em ' + familyToken).catch(function(){});
                      document.fonts.load(stylePrefix + '500 1em ' + familyToken).catch(function(){});
                      document.fonts.load(stylePrefix + '700 1em ' + familyToken).catch(function(){});
                    } catch (e) {}
                  };
                  var applyPresetStyles = function () {
                    document.documentElement.setAttribute('data-font-preset', preset);
                    document.documentElement.style.setProperty('--duck-font-family', family);
                    document.documentElement.style.setProperty('--font-sans', family);
                    document.documentElement.style.setProperty('--font-mono', family);
                    document.documentElement.style.setProperty('font-family', family, 'important');
                    document.documentElement.style.setProperty('font-style', style, 'important');
                    if (document.body) {
                      document.body.style.setProperty('font-family', family, 'important');
                      document.body.style.setProperty('font-style', style, 'important');
                    }
                    warmUpFont();
                  };
                  applyPresetStyles();
                  if (!document.body) {
                    document.addEventListener('DOMContentLoaded', applyPresetStyles, { once: true });
                  }
                  document.documentElement.style.setProperty('--duck-font-style', style);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={cn('duck min-h-svh bg-background antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableColorScheme enableSystem>
          <AppClientProviders>
            <DirectionProvider dir="ltr">
              <DocsAppProvider docsConfig={docsConfig} siteConfig={siteConfig}>
                <ThemeWrapper>
                  <div className="relative flex min-h-svh flex-col bg-background">{children}</div>

                  {/* <SpeedInsights /> */}
                  {/* <VercelAnalytics /> */}
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
