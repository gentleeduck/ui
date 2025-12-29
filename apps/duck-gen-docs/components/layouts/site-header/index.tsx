import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { CaseUpper, Github, Twitter, Type } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { MainNav } from '~/components/main-nav'
import { MobileNav } from '~/components/mobile-nav'
import { ModeSwitcher } from '~/components/mode-toggle'
import { siteConfig } from '~/config/site'
import { CommandMenu } from '../command-menu'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[47] w-full bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
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
              <FontStyleButton />
              <Link aria-label="Twitter" href={siteConfig.links.twitter} rel="noreferrer" target="_blank">
                <div
                  className={cn(
                    buttonVariants({
                      size: 'icon',
                      variant: 'ghost',
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

function GitHubStarsButton() {
  const [stars, setStars] = React.useState<number | null>(null)

  React.useEffect(() => {
    async function fetchStars() {
      try {
        const res = await fetch('https://api.github.com/repos/gentleeduck/duck-ui')
        const data = await res.json()
        setStars(data.stargazers_count)
      } catch (err) {
        console.error('Failed to fetch stars:', err)
      }
    }
    fetchStars()
  }, [])

  return (
    <Link aria-label="GitHub" href={siteConfig.links.github} rel="noopener noreferrer" target="_blank">
      <div
        className={cn(
          buttonVariants({
            className: 'size-auto h-8 w-16 font-medium text-sm',
            size: 'icon',
            variant: 'ghost',
          }),
        )}>
        <Github />
        {stars !== null ? stars.toLocaleString() : '...'}
      </div>
    </Link>
  )
}
const fontAtom = atomWithStorage('fontType', 'mono')

function FontStyleButton() {
  const [fontType, setFontType] = useAtom(fontAtom)
  const firstRender = React.useRef(true)

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const family = fontType === 'sans' ? 'var(--font-sans-geist)' : 'var(--font-mono-geist)'

    document.documentElement.style.setProperty('font-family', family, 'important')
  }, [fontType])

  return (
    <div
      className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}
      onClick={() => setFontType(fontType === 'mono' ? 'sans' : 'mono')}>
      {fontType === 'mono' ? <Type /> : <CaseUpper />}
    </div>
  )
}
