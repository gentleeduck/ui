import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import { MainNav } from '~/components/main-nav'
import { MobileNav } from '~/components/mobile-nav'
import { ModeSwitcher } from '~/components/mode-toggle'
import { siteConfig } from '~/config/site'
import { CommandMenu } from '../command-menu'
import React from 'react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[45] w-full bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-16 items-center gap-2 md:gap-4">
          <MainNav />
          <MobileNav />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu />
            </div>
            <nav className="flex items-center">
              <GitHubStarsButton />
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

export function GitHubStarsButton() {
  const [stars, setStars] = React.useState<number | null>(null)

  React.useEffect(() => {
    async function fetchStars() {
      try {
        const res = await fetch('https://api.github.com/repos/gentleeduck/ui')
        const data = await res.json()
        setStars(data.stargazers_count)
      } catch (err) {
        console.error('Failed to fetch stars:', err)
      }
    }
    fetchStars()
  }, [])

  return (
    <Link href={siteConfig.links.github} target="_blank" aria-label="GitHub" rel="noopener noreferrer">
      <div
        className={cn(
          buttonVariants({
            variant: 'ghost',
            size: 'icon',
            className: 'size-auto w-16 h-8 text-sm font-medium',
          }),
        )}>
        <Github />
        {stars !== null ? stars.toLocaleString() : '...'}
      </div>
    </Link>
  )
}
