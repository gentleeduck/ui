import { DocsSidebarNav } from '@gentleduck/docs/client'
import type { Metadata } from 'next'
import { DuckMotionConfig } from '~/config/packages/duck-motion'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Motion',
    template: `%s - Gentleduck Motion | gentleduck/ui`,
  },
  description: 'Animation tokens and reduced-motion primitives for accessible, performant React animations.',
  keywords: ['React animation library', 'motion tokens', 'reduced motion React', 'accessible animations'],
  openGraph: {
    title: 'Gentleduck Motion | gentleduck/ui',
    description: 'Animation tokens and reduced-motion primitives for accessible, performant React animations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Motion | gentleduck/ui',
    description: 'Animation tokens and reduced-motion primitives for accessible, performant React animations.',
  },
}

export default function DuckMotionLayout({ children }: { children: React.ReactNode }) {
  const config = DuckMotionConfig

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/motion',
            description: 'Animation tokens and reduced-motion primitives for accessible, performant React animations.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-motion',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-motion',
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
