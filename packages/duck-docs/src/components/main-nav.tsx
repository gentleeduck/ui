'use client'

import { useDocsConfig } from '@duck-docs/context'
import { cn } from '@gentleduck/libs/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeaderBrand } from './layouts/site-header/header-shell'

export function MainNav() {
  const pathname = usePathname()
  const { mainNav } = useDocsConfig()

  return (
    <div className="mr-4 hidden md:flex">
      <HeaderBrand className="mr-4 lg:mr-6" />
      {mainNav?.length ? (
        <nav className="flex items-center gap-4 text-sm xl:gap-6">
          {mainNav.map((item) => (
            <Link
              className={cn(
                'font-medium transition-colors hover:text-foreground/80',
                pathname === item.href ? 'text-foreground' : 'text-foreground/80',
              )}
              href={item.href ?? '#'}
              key={item.href ?? item.title}>
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  )
}
