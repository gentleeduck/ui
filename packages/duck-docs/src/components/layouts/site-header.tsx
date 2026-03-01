'use client'

import { MainNav } from '@duck-docs/components/main-nav'
import { ModeSwitcher } from '@duck-docs/components/mode-toggle'
import { useSiteConfig } from '@duck-docs/context'
import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui/button'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { CaseUpper, Github, Twitter, Type } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { HeaderContainer, HeaderRoot } from './header-shell'

const CommandMenu = React.lazy(() =>
  import('@duck-docs/components/layouts/command-menu').then((m) => ({ default: m.CommandMenu })),
)
const MobileNav = React.lazy(() => import('@duck-docs/components/mobile-nav').then((m) => ({ default: m.MobileNav })))

export function SiteHeader() {
  const siteConfig = useSiteConfig()

  return (
    <HeaderRoot className="border-border/50 border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/70">
      <HeaderContainer>
        <MainNav />
        <React.Suspense fallback={null}>
          <MobileNav />
        </React.Suspense>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <React.Suspense
              fallback={
                <div
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'outline' }),
                    'relative h-8 w-full bg-muted/50 text-muted-foreground text-sm shadow-none md:w-40 lg:w-64',
                  )}>
                  <span className="hidden lg:inline-flex">Search documentation...</span>
                  <span className="inline-flex lg:hidden">Search...</span>
                </div>
              }>
              <CommandMenu />
            </React.Suspense>
          </div>
          <nav aria-label="Social and settings" className="flex items-center">
            <GitHubStarsButton />
            <FontStyleButton />
            {siteConfig.links?.discord ? (
              <Link
                aria-label="Discord (opens in a new tab)"
                href={siteConfig.links.discord}
                rel="noreferrer"
                target="_blank">
                <div
                  className={cn(
                    buttonVariants({
                      size: 'icon',
                      variant: 'ghost',
                    }),
                  )}>
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
              </Link>
            ) : null}
            {siteConfig.links?.twitter ? (
              <Link
                aria-label="Twitter (opens in a new tab)"
                href={siteConfig.links.twitter}
                rel="noreferrer"
                target="_blank">
                <div
                  className={cn(
                    buttonVariants({
                      size: 'icon',
                      variant: 'ghost',
                    }),
                  )}>
                  <Twitter aria-hidden="true" />
                </div>
              </Link>
            ) : null}
            <ModeSwitcher />
          </nav>
        </div>
      </HeaderContainer>
    </HeaderRoot>
  )
}

function GitHubStarsButton() {
  const [stars, setStars] = React.useState<number | null>(null)
  const siteConfig = useSiteConfig()
  const repoFromUrl = siteConfig.links?.github?.replace('https://github.com/', '').replace(/\/$/, '')
  const repo = siteConfig.githubRepo ?? repoFromUrl

  React.useEffect(() => {
    async function fetchStars() {
      try {
        if (!repo) {
          return
        }
        const res = await fetch(`https://api.github.com/repos/${repo}`)
        if (!res.ok) return
        const data = await res.json()
        if (typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count)
        }
      } catch (err) {
        console.error('Failed to fetch stars:', err)
      }
    }
    fetchStars()
  }, [])

  if (!siteConfig.links?.github) {
    return null
  }

  return (
    <Link
      aria-label="GitHub (opens in a new tab)"
      href={siteConfig.links.github}
      rel="noopener noreferrer"
      target="_blank">
      <div
        className={cn(
          buttonVariants({
            className: 'size-auto h-8 w-16 font-medium text-sm',
            size: 'icon',
            variant: 'ghost',
          }),
        )}>
        <Github aria-hidden="true" />
        {stars !== null ? stars.toLocaleString() : '...'}
      </div>
    </Link>
  )
}
const fontAtom = atomWithStorage('fontType', 'mono')

export function FontStyleButton() {
  const [fontType, setFontType] = useAtom(fontAtom)
  const firstRender = React.useRef(true)

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const family =
      fontType === 'sans'
        ? 'var(--font-geist-sans, "Montserrat"), sans-serif'
        : 'var(--font-geist-mono, "Geist Mono"), monospace'

    document.documentElement.style.setProperty('font-family', family, 'important')
  }, [fontType])

  return (
    <button
      aria-label={fontType === 'mono' ? 'Switch to sans-serif font' : 'Switch to monospace font'}
      className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}
      onClick={() => setFontType(fontType === 'mono' ? 'sans' : 'mono')}
      type="button">
      {fontType === 'mono' ? <Type aria-hidden="true" /> : <CaseUpper aria-hidden="true" />}
    </button>
  )
}

export { HeaderBrand, HeaderContainer, HeaderRoot, HeaderSection } from './header-shell'
