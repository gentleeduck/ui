'use client'
import { SiteFooter } from '@gentleduck/docs/client'
import { SiteHeader } from '~/components/site-header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col place-content-center items-center" data-wrapper="">
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}
