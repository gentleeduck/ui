import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import { MainNav } from '~/components/main-nav'
import { MobileNav } from '~/components/mobile-nav'
import { ModeSwitcher } from '~/components/mode-toggle'
import { siteConfig } from '~/config/site'
import { CommandMenu } from '../command-menu'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-16 items-center gap-2 md:gap-4">
          <MainNav />
          <MobileNav />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu />
            </div>
            <nav className="flex items-center">
              <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <div
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'icon',
                    }),
                  )}>
                  <Github />
                </div>
              </Link>
              <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                <div
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'icon',
                    }),
                  )}>
                  <Twitter />
                </div>
              </Link>
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
