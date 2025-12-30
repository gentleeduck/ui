'use client'

import { cn } from '@gentleduck/libs/cn'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDocsConfig, useSiteConfig } from '../context/docs-context'

export function MainNav() {
  const pathname = usePathname()
  const { mainNav } = useDocsConfig()
  const siteConfig = useSiteConfig()
  const logoDark = siteConfig.branding?.logoDark ?? '/icons/dark.png'
  const logoLight = siteConfig.branding?.logoLight ?? '/icons/light.png'

  return (
    <div className="mr-4 hidden md:flex">
      <Link className="mr-4 flex items-center gap-2 lg:mr-6" href="/">
        <Image alt="Logo" className="hidden h-6 w-6 dark:block" height={512} src={logoDark} width={512} />
        <Image alt="Logo" className="block h-6 w-6 dark:hidden" height={512} src={logoLight} width={512} />
        <span className="hidden font-bold lg:inline-block">{siteConfig.name}</span>
      </Link>
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
