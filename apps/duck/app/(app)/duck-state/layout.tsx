import type { Metadata } from 'next'
import { DocsSidebarNav } from '@gentleduck/docs/client'
import { getPackageDocsConfig } from '~/config/docs'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck State',
    template: `%s - Gentleduck State | gentleduck/ui`,
  },
  description: 'Atom-based state management for React — lightweight, TypeScript-first, no boilerplate.',
  keywords: [
    'React state management atom',
    'lightweight state TypeScript',
    'React atom state',
  ],
  openGraph: {
    title: 'Gentleduck State | gentleduck/ui',
    description: 'Atom-based state management for React — lightweight, TypeScript-first, no boilerplate.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck State | gentleduck/ui',
    description: 'Atom-based state management for React — lightweight, TypeScript-first, no boilerplate.',
  },
}

export default function DuckStateLayout({ children }: { children: React.ReactNode }) {
  const config = getPackageDocsConfig('duck-state')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/state',
            description: 'Atom-based state management for React — lightweight, TypeScript-first, no boilerplate.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-state',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-state',
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
