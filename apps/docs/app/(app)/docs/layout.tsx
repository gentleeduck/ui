import { docsConfig } from '~/config/docs'
import { ScrollArea } from '../../../../../packages/_oldstuff_refactor/ui/scroll-area'
import { DocsSidebarNav } from '~/components/docs-side-bar'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  // return (
  //   <div className="">
  //     <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
  //       UNDER MAINTENANCE
  //     </div>
  //   </div>
  // )
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 max-w-screen-2xl">
      <aside className="fixed show-scroll-hover border-r top-14 z-30 -ml-2 hidden w-full h-[calc(100vh-3.5rem)] px-8 pb-8 shrink-0 md:sticky md:block">
        <DocsSidebarNav config={docsConfig} />
        <DocsSidebarNav config={docsConfig} />
      </aside>
      {children}
    </div>
  )
}
