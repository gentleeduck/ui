'use client'

import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui/button'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Italic, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import { siteConfig } from '~/config/site'
import { HeaderContainer, HeaderRoot } from '../header-shell'
import { ModeSwitcher } from '../mode-toggle'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'

// CommandMenu transitively pulls every velite collection via ~/config/docs;
// eager load inflates the shared (app)/layout chunk to ~57MB.
const CommandMenu = dynamic(() => import('../command-menu').then((m) => ({ default: m.CommandMenu })), {
  ssr: false,
})

function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function Twitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const FONT_ITALIC_STORAGE_KEY = 'fontItalic'

function applyFontItalic(italic: boolean) {
  const root = document.documentElement
  root.setAttribute('data-font-italic', italic ? 'true' : 'false')
  root.style.setProperty('--duck-font-style', italic ? 'italic' : 'normal')
}

export function SiteHeader() {
  return (
    <HeaderRoot>
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
                    buttonVariants({ size: 'icon', variant: 'outline' }),
                    'relative size-8 bg-muted/50 p-0 text-muted-foreground text-sm shadow-none md:w-40 md:px-3 lg:w-64',
                  )}>
                  <Search aria-hidden="true" className="size-4 md:hidden" />
                  <span className="hidden lg:inline-flex">Search documentation...</span>
                  <span className="hidden md:inline-flex lg:hidden">Search...</span>
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
  const repoFromUrl = siteConfig.links?.github?.replace('https://github.com/', '').replace(/\/$/, '')

  React.useEffect(() => {
    async function fetchStars() {
      try {
        if (!repoFromUrl) {
          return
        }
        const res = await fetch(`https://api.github.com/repos/${repoFromUrl}`)
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
  }, [repoFromUrl])

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
const fontItalicAtom = atomWithStorage<boolean>(FONT_ITALIC_STORAGE_KEY, false)

export function FontStyleButton() {
  const [italic, setItalic] = useAtom(fontItalicAtom)

  React.useEffect(() => {
    applyFontItalic(italic)
  }, [italic])

  return (
    <button
      aria-label={italic ? 'Switch to JetBrains Mono regular' : 'Switch to JetBrains Mono italic'}
      aria-pressed={italic}
      className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }), 'size-8')}
      onClick={() => setItalic((v) => !v)}
      type="button">
      <Italic aria-hidden="true" className={cn('size-4', italic ? 'text-foreground' : 'text-muted-foreground')} />
    </button>
  )
}
