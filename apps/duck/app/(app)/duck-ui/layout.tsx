import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckUiConfig } from '~/config/packages/duck-ui'
import { docs } from '../../../.velite'

export const metadata: Metadata = {
  title: {
    default: 'Duck UI',
    template: `%s - Duck UI | gentleduck/ui`,
  },
  description:
    'Accessible, composable UI components built on gentleduck primitives — drop-in styled components for React.',
  keywords: [
    'React UI components',
    'headless UI React',
    'accessible components TypeScript',
    'shadcn alternative',
    'duck-ui',
  ],
  openGraph: {
    title: 'Duck UI | gentleduck/ui',
    description:
      'Accessible, composable UI components built on gentleduck primitives — drop-in styled components for React.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duck UI | gentleduck/ui',
    description:
      'Accessible, composable UI components built on gentleduck primitives — drop-in styled components for React.',
  },
}

export default function DuckUiLayout({ children }: { children: React.ReactNode }) {
  const indexDoc = docs.find((d) => d.permalink === 'duck-ui' || d.permalink === 'duck-ui/index')
  const config = {
    ...DuckUiConfig,
    sidebarNav: DuckUiConfig.sidebarNav.map((section, i) =>
      i === 0 && indexDoc?.title ? { ...section, title: indexDoc.title } : section,
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/registry-ui',
            description: 'Accessible, composable UI components built on gentleduck primitives.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-ui',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/registry-ui',
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
