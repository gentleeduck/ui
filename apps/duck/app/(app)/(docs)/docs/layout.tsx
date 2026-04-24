import type { Metadata } from 'next'
import { DuckCalendarConfig } from '~/config/packages/duck-calendar'

export const metadata: Metadata = {
  title: {
    default: 'Gentleduck Calendar',
    template: `%s - Gentleduck Calendar | gentleduck/ui`,
  },
  description:
    'Headless calendar engine with date adapters — zero dependencies, multi-calendar support, and full TypeScript types.',
  keywords: [
    'React calendar component',
    'headless date picker TypeScript',
    'react-day-picker alternative',
    'Persian calendar React',
    'Hijri calendar React',
    'date adapter pattern',
  ],
  openGraph: {
    title: 'Gentleduck Calendar | gentleduck/ui',
    description:
      'Headless calendar engine with date adapters — zero dependencies, multi-calendar support, and full TypeScript types.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gentleduck Calendar | gentleduck/ui',
    description:
      'Headless calendar engine with date adapters — zero dependencies, multi-calendar support, and full TypeScript types.',
  },
}

export default function DuckCalendarLayout({ children }: { children: React.ReactNode }) {
  const _config = DuckCalendarConfig

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/calendar',
            description:
              'Headless calendar engine with date adapters — zero dependencies, multi-calendar support, and full TypeScript types.',
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-calendar',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-calendar',
            license: 'https://opensource.org/licenses/MIT',
            author: { '@type': 'Person', name: 'Ahmed Ayob', url: 'https://github.com/wildduck2' },
          }),
        }}
      />
      <div className="container-wrapper">
        {/* <div className="container flex-1 items-start md:grid md:grid-cols-[270px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10"> */}
        {/*   <aside */}
        {/*     aria-label="Sidebar navigation" */}
        {/*     className="hidden shrink-0 border-grid border-r md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)]"> */}
        {/*     <div className="h-full overflow-y-auto overflow-x-hidden py-8"> */}
        {/*       <DocsSidebarNav config={config} /> */}
        {/*     </div> */}
        {/*   </aside> */}
        {children}
        {/* </div> */}
      </div>
    </>
  )
}
