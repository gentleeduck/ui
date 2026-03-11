import { SiteFooter, SiteHeader } from '@gentleduck/docs/client'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" data-wrapper="">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:m-3 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:shadow-md focus:ring-2 focus:ring-ring"
        href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col pt-16" id="main-content">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
