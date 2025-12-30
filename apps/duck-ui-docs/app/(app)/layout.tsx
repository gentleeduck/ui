'use client'
import { SiteFooter, SiteHeader } from '@gentleduck/duck-docs'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col place-content-center items-center" data-wrapper="">
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}
