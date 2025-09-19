import { docsConfig } from '~/config/docs'
import '../../mdx.css'
import { DocsSidebarNav } from '~/components/docs'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="container-wrapper">
      <div className="container flex-1 items-start md:grid md:grid-cols-[270px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
        {
          // @ts-ignore
          <aside
            aria-hidden="undefined"
            className="border-grid fixed top-[4rem] z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 border-r md:sticky md:block">
            <div className="h-full overflow-auto py-8">
              <DocsSidebarNav config={docsConfig} />
            </div>
          </aside>
        }
        {children}
      </div>
    </div>
  )
}
