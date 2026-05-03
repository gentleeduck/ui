import { BreadcrumbJsonLd } from '~/components/breadcrumb-json-ld'
import { SiteFooter } from '~/components/layouts/site-footer'
import { SiteHeader } from '~/components/layouts/site-header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" data-wrapper="">
      <BreadcrumbJsonLd />
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:m-3 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:shadow-md focus:ring-2 focus:ring-ring"
        href="#main-content">
        Skip to main content
      </a>

      <div className="relative min-h-screen w-full">
        {/* Violet Abyss */}
        {/* <div */}
        {/*   className="absolute inset-0 z-0" */}
        {/*   style={{ */}
        {/*     background: 'radial-gradient(125% 125% at 50% 90%, rgb(0, 0, 0) 40%, rgb(49 40 92) 100%)', */}
        {/*   }} */}
        {/* /> */}
        <SiteHeader />
        <main className="relative z-1 flex w-full flex-1 flex-col" id="main-content">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
