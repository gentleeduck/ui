import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckHooksConfig } from '~/config/packages/duck-hooks'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Hooks',
    template: `%s - Gentleduck Hooks | gentleduck/ui`,
  },
  description: 'Collection of React utility hooks for common patterns — fully typed and tree-shakeable.',
  keywords: ['React utility hooks TypeScript', 'custom React hooks library', 'useCallbackRef', 'useControllableState'],
  openGraph: {
    title: 'Gentleduck Hooks | gentleduck/ui',
    description: 'Collection of React utility hooks for common patterns — fully typed and tree-shakeable.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Hooks | gentleduck/ui',
    description: 'Collection of React utility hooks for common patterns — fully typed and tree-shakeable.',
  },
}

export default function DuckHooksLayout({ children }: { children: React.ReactNode }) {
  const config = DuckHooksConfig

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/hooks',
            description: 'Collection of React utility hooks for common patterns — fully typed and tree-shakeable.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-hooks',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-hooks',
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
