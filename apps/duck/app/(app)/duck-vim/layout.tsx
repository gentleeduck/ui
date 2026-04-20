import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckVimConfig } from '~/config/packages/duck-vim'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Vim',
    template: `%s - Gentleduck Vim | gentleduck/ui`,
  },
  description: 'Keyboard command engine for React — vim-style keybindings, sequences, recorder, and formatting.',
  keywords: ['vim keybindings React', 'keyboard shortcuts TypeScript', 'keyboard command engine', 'vim-style React'],
  openGraph: {
    title: 'Gentleduck Vim | gentleduck/ui',
    description: 'Keyboard command engine for React — vim-style keybindings, sequences, recorder, and formatting.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Vim | gentleduck/ui',
    description: 'Keyboard command engine for React — vim-style keybindings, sequences, recorder, and formatting.',
  },
}

export default function DuckVimLayout({ children }: { children: React.ReactNode }) {
  const config = DuckVimConfig

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/vim',
            description:
              'Keyboard command engine for React — vim-style keybindings, sequences, recorder, and formatting.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-vim',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-vim',
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
