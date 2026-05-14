import { BreadcrumbJsonLd } from '~/components/breadcrumb-json-ld'
import { SiteFooter } from '~/components/layouts/site-footer'
import { SiteHeader } from '~/components/layouts/site-header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col" data-wrapper="">
      <BreadcrumbJsonLd />
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:m-3 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:shadow-md focus:ring-2 focus:ring-ring"
        href="#main-content">
        Skip to main content
      </a>

      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col" id="main-content">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
