import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckCliConfig } from '~/config/packages/duck-cli'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck CLI',
    template: `%s - Gentleduck CLI | gentleduck/ui`,
  },
  description: 'CLI for scaffolding gentleduck/ui components into your project with one command.',
  keywords: ['React component CLI scaffold', 'gentleduck CLI', 'add UI components command line'],
  openGraph: {
    title: 'Gentleduck CLI | gentleduck/ui',
    description: 'CLI for scaffolding gentleduck/ui components into your project with one command.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck CLI | gentleduck/ui',
    description: 'CLI for scaffolding gentleduck/ui components into your project with one command.',
  },
}

export default function DuckCliLayout({ children }: { children: React.ReactNode }) {
  const config = DuckCliConfig

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/cli',
            description: 'CLI for scaffolding gentleduck/ui components into your project with one command.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-cli',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-cli',
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
