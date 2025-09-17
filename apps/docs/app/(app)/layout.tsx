'use client'
import { SiteFooter } from '~/components/layouts/site-footer'
import { SiteHeader } from '~/components/layouts/site-header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center place-content-center flex-col min-h-screen" data-wrapper="">
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full">{children}</main>
      <SiteFooter />
    </div>
  )
}
