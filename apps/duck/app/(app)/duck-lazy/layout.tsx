import type { Metadata } from 'next'
import { DocsSidebarNav } from '@gentleduck/docs/client'
import { getPackageDocsConfig } from '~/config/docs'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Lazy',
    template: `%s - Gentleduck Lazy | gentleduck/ui`,
  },
  description: 'Lazy-loading utilities for React — dynamic imports with suspense boundaries and loading states.',
  keywords: [
    'React lazy loading components',
    'dynamic import React',
    'Suspense boundary wrapper',
  ],
  openGraph: {
    title: 'Gentleduck Lazy | gentleduck/ui',
    description: 'Lazy-loading utilities for React — dynamic imports with suspense boundaries and loading states.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Lazy | gentleduck/ui',
    description: 'Lazy-loading utilities for React — dynamic imports with suspense boundaries and loading states.',
  },
}

export default function DuckLazyLayout({ children }: { children: React.ReactNode }) {
  const config = getPackageDocsConfig('duck-lazy')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/lazy',
            description: 'Lazy-loading utilities for React — dynamic imports with suspense boundaries and loading states.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-lazy',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-lazy',
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
              <DocsSidebarNav config={config ?? undefined} />
            </div>
          </aside>
          {children}
        </div>
      </div>
    </>
  )
}
