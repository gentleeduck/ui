import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckPrimitivesConfig } from '~/config/packages/duck-primitives'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Primitives',
    template: `%s - Gentleduck Primitives | gentleduck/ui`,
  },
  description: 'Headless, accessible React primitives — the a11y-first foundation for all gentleduck/ui components.',
  keywords: ['headless UI React', 'accessible React primitives', 'Radix alternative', 'headless components TypeScript'],
  openGraph: {
    title: 'Gentleduck Primitives | gentleduck/ui',
    description: 'Headless, accessible React primitives — the a11y-first foundation for all gentleduck/ui components.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Primitives | gentleduck/ui',
    description: 'Headless, accessible React primitives — the a11y-first foundation for all gentleduck/ui components.',
  },
}

export default function DuckPrimitivesLayout({ children }: { children: React.ReactNode }) {
  const config = DuckPrimitivesConfig

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/primitives',
            description:
              'Headless, accessible React primitives — the a11y-first foundation for all gentleduck/ui components.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-primitives',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-primitives',
            license: 'https://opensource.org/licenses/MIT',
            author: { '@type': 'Person', name: 'Ahmed Ayob', url: 'https://github.com/wildduck2' },
          }),
        }}
      />
      <div className="container-wrapper">
        <div className="container flex-1 items-start md:grid md:grid-cols-[270px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
          <aside
            aria-label="Sidebar navigation"
            className="hidden shrink-0 border-grid border-r md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)]">
            <div className="h-full overflow-y-auto overflow-x-hidden py-8">
              <DocsSidebarNav config={config} />
            </div>
          </aside>
          {children}
        </div>
      </div>
    </>
  )
}
