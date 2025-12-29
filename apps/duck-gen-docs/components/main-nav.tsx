'use client'

import { cn } from '@gentleduck/libs/cn'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '~/config/site'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link className="mr-4 flex items-center gap-2 lg:mr-6" href="/">
        <Image alt="Logo" className="hidden h-6 w-6 dark:block" height={512} src={'/icons/dark.png'} width={512} />
        <Image alt="Logo" className="block h-6 w-6 dark:hidden" height={512} src={'/icons/light.png'} width={512} />
        <span className="hidden font-bold lg:inline-block">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          className={cn(
            'font-medium transition-colors hover:text-foreground/80',
            pathname === '/docs/installation' ? 'text-foreground' : 'text-foreground/80',
          )}
          href="/docs/installation">
          Docs
        </Link>
      </nav>
    </div>
  )
}
