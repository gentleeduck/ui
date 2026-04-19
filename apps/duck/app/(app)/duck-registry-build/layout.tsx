import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckRegistryBuildConfig } from '~/config/packages/duck-registry-build'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Registry Build',
    template: `%s - Gentleduck Registry Build | gentleduck/ui`,
  },
  description: 'Build tooling for creating and publishing component registries — architecture, configuration, and CLI.',
  keywords: ['React component registry build', 'publish component library', 'registry tooling TypeScript'],
  openGraph: {
    title: 'Gentleduck Registry Build | gentleduck/ui',
    description:
      'Build tooling for creating and publishing component registries — architecture, configuration, and CLI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Registry Build | gentleduck/ui',
    description:
      'Build tooling for creating and publishing component registries — architecture, configuration, and CLI.',
  },
}

export default function DuckRegistryBuildLayout({ children }: { children: React.ReactNode }) {
  const config = DuckRegistryBuildConfig

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/registry-build',
            description:
              'Build tooling for creating and publishing component registries — architecture, configuration, and CLI.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-registry-build',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-registry-build',
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
