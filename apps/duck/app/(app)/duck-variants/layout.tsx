import type { Metadata } from 'next'
import { DocsSidebarNav } from '@gentleduck/docs/client'
import { getPackageDocsConfig } from '~/config/docs'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Variants',
    template: `%s - Gentleduck Variants | gentleduck/ui`,
  },
  description: 'CVA-compatible variant system for React components — type-safe class variance authority.',
  keywords: [
    'cva React variants',
    'class variance authority',
    'type-safe component variants Tailwind',
  ],
  openGraph: {
    title: 'Gentleduck Variants | gentleduck/ui',
    description: 'CVA-compatible variant system for React components — type-safe class variance authority.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Variants | gentleduck/ui',
    description: 'CVA-compatible variant system for React components — type-safe class variance authority.',
  },
}

export default function DuckVariantsLayout({ children }: { children: React.ReactNode }) {
  const config = getPackageDocsConfig('duck-variants')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/variants',
            description: 'CVA-compatible variant system for React components — type-safe class variance authority.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-variants',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-variants',
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
