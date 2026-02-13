import { DocsSidebarNav } from '@gentleduck/docs/client'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="container-wrapper">
      <div className="container flex-1 items-start md:grid md:grid-cols-[270px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 border-grid border-r md:sticky md:block">
          <div className="h-full overflow-auto py-8">
            <DocsSidebarNav />
          </div>
        </aside>
        {children}
      </div>
    </div>
  )
}
