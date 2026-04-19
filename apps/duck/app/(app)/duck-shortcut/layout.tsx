import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckShortcutConfig } from '~/config/packages/duck-shortcut'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Shortcut',
    template: `%s - Gentleduck Shortcut | gentleduck/ui`,
  },
  description: 'Deprecated React keyboard shortcut hook — superseded by duck-vim.',
  keywords: ['React keyboard shortcut deprecated', 'duck-vim replacement'],
  openGraph: {
    title: 'Gentleduck Shortcut | gentleduck/ui',
    description: 'Deprecated React keyboard shortcut hook — superseded by duck-vim.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Shortcut | gentleduck/ui',
    description: 'Deprecated React keyboard shortcut hook — superseded by duck-vim.',
  },
}

export default function DuckShortcutLayout({ children }: { children: React.ReactNode }) {
  const config = DuckShortcutConfig

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/shortcut',
            description: 'Deprecated React keyboard shortcut hook — superseded by duck-vim.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-shortcut',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-shortcut',
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
