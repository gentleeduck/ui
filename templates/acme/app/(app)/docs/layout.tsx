import { DocsSidebarNav } from '@gentleduck/docs/client'
import { DocsRouteScrollReset } from './route-scroll-reset'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="container-wrapper">
      <DocsRouteScrollReset />
      <div className="container flex-1 items-start md:grid md:grid-cols-[270px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
        <aside
          aria-label="Sidebar navigation"
          className="hidden shrink-0 border-grid border-r md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)]">
          <div className="h-full overflow-y-auto overflow-x-hidden py-8">
            <DocsSidebarNav />
          </div>
        </aside>
        {children}
      </div>
    </div>
  )
}
