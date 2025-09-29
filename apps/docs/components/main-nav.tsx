'use client'

import Image from 'next/image'
import { cn } from '@gentleduck/libs/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '~/components/icons'
import { siteConfig } from '~/config/site'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link className="mr-4 flex items-center gap-2 lg:mr-6" href="/">
        <Image alt="Logo" className="h-6 w-6 hidden dark:block" height={512} src={'/icons/dark.png'} width={512} />
        <Image alt="Logo" className="h-6 w-6 dark:hidden block" height={512} src={'/icons/light.png'} width={512} />
        <span className="hidden font-bold lg:inline-block">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname === '/docs/installation' ? 'text-foreground' : 'text-foreground/80',
          )}
          href="/docs/installation">
          Docs
        </Link>
        <Link
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/docs/components') && !pathname?.startsWith('/docs/component/chart')
              ? 'text-foreground'
              : 'text-foreground/80',
          )}
          href="/docs/components">
          Components
        </Link>
        <Link
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/blocks') ? 'text-foreground' : 'text-foreground/80',
          )}
          href="/blocks">
          Blocks
        </Link>
        <Link
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/docs/component/chart') || pathname?.startsWith('/charts')
              ? 'text-foreground'
              : 'text-foreground/80',
          )}
          href="/charts/area">
          Charts
        </Link>
        <Link
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/themes') ? 'text-foreground' : 'text-foreground/80',
          )}
          href="/themes">
          Themes
        </Link>
        <Link
          className={cn(
            'transition-colors hover:text-foreground/80 font-medium',
            pathname?.startsWith('/colors') ? 'text-foreground' : 'text-foreground/80',
          )}
          href="/colors">
          Colors
        </Link>
      </nav>
    </div>
  )
}
