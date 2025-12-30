'use client'

import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { CaseUpper, Github, Twitter, Type } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useSiteConfig } from '../../../context/docs-context'
import { MainNav } from '../../main-nav'
import { MobileNav } from '../../mobile-nav'
import { ModeSwitcher } from '../../mode-toggle'
import { CommandMenu } from '../command-menu'

export function SiteHeader() {
  const siteConfig = useSiteConfig()

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
              {siteConfig.links?.twitter ? (
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
              ) : null}
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
        const data = await res.json()
        setStars(data.stargazers_count)
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
