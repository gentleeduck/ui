import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckLibsConfig } from '~/config/packages/duck-libs'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Libs',
    template: `%s - Gentleduck Libs | gentleduck/ui`,
  },
  description: 'Core utilities used across gentleduck/ui — cn(), clsx wrapper, and shared helpers.',
  keywords: ['cn utility React', 'clsx TypeScript', 'class merge utility', 'tailwind-merge wrapper'],
  openGraph: {
    title: 'Gentleduck Libs | gentleduck/ui',
    description: 'Core utilities used across gentleduck/ui — cn(), clsx wrapper, and shared helpers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Libs | gentleduck/ui',
    description: 'Core utilities used across gentleduck/ui — cn(), clsx wrapper, and shared helpers.',
  },
}

export default function DuckLibsLayout({ children }: { children: React.ReactNode }) {
  const config = DuckLibsConfig

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/libs',
            description: 'Core utilities used across gentleduck/ui — cn(), clsx wrapper, and shared helpers.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-libs',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-libs',
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
