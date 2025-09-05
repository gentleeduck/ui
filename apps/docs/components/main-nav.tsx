'use client'

import { cn } from '@gentleduck/libs/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '~/components/icons'
import { siteConfig } from '~/config/site'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/docs/installation"
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname === '/docs/installation' ? 'text-foreground' : 'text-foreground/80',
          )}>
          Docs
        </Link>
        <Link
          href="/docs/components"
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/docs/components') && !pathname?.startsWith('/docs/component/chart')
              ? 'text-foreground'
              : 'text-foreground/80',
          )}>
          Components
        </Link>
        <Link
          href="/blocks"
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/blocks') ? 'text-foreground' : 'text-foreground/80',
          )}>
          Blocks
        </Link>
        <Link
          href="/charts"
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/docs/component/chart') || pathname?.startsWith('/charts')
              ? 'text-foreground'
              : 'text-foreground/80',
          )}>
          Charts
        </Link>
        <Link
          href="/themes"
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/themes') ? 'text-foreground' : 'text-foreground/80',
          )}>
          Themes
        </Link>
        <Link
          href="/colors"
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/colors') ? 'text-foreground' : 'text-foreground/80',
          )}>
          Colors
        </Link>
      </nav>
    </div>
  )
}
