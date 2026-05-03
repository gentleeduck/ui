'use client'

import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Search, Type } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import { loadDynamicFont } from '~/lib/dynamic-fonts'
import { siteConfig } from '~/config/site'
import { HeaderContainer, HeaderRoot } from '../header-shell'
import { ModeSwitcher } from '../mode-toggle'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'

// CommandMenu indirectly pulls every velite collection (docsEntries +
// packageSidebarNavs in ~/config/docs). Loading it eagerly inflates the
// shared (app)/layout chunk to ~57 MB. Defer the load so the docs
// payload only hits the wire when the user opens the menu.
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

// const CommandMenu = React.lazy(() =>
//   import('').then((m) => ({ default: m.CommandMenu })),
// )
// const MobileNav = React.lazy(() => import('@duck-docs/components/mobile-nav').then((m) => ({ default: m.MobileNav })))

type FontPreset = 'mono-italic' | 'mono-normal' | 'sans-normal' | 'sans-italic' | 'serif-normal' | 'serif-italic'
const FONT_PRESET_STORAGE_KEY = 'fontPresetV6'

const DEFAULT_FONT_PRESET: FontPreset = 'mono-normal'

const FONT_PRESET_OPTIONS: Array<{ label: string; value: FontPreset }> = [
  { label: 'JetBrains Mono Nerd Italic', value: 'mono-italic' },
  { label: 'JetBrains Mono Nerd Regular', value: 'mono-normal' },
  { label: 'Inter Regular', value: 'sans-normal' },
  { label: 'Inter Italic', value: 'sans-italic' },
  { label: 'Inria Serif Regular', value: 'serif-normal' },
  { label: 'Inria Serif Italic', value: 'serif-italic' },
]

const VALID_FONT_PRESETS = new Set<FontPreset>(FONT_PRESET_OPTIONS.map((option) => option.value))

function isFontPreset(value: unknown): value is FontPreset {
  return typeof value === 'string' && VALID_FONT_PRESETS.has(value as FontPreset)
}

function applyFontPreset(preset: FontPreset) {
  // Lazy-register the @font-face rules for the picked family. Mono is
  // already loaded via next/font in the root layout.
  if (preset.startsWith('sans')) {
    loadDynamicFont('sans')
  } else if (preset.startsWith('serif')) {
    loadDynamicFont('serif')
  }

  const family = preset.startsWith('sans')
    ? '"Inter", ui-sans-serif, system-ui, sans-serif'
    : preset.startsWith('serif')
      ? '"Inria Serif", Georgia, "Times New Roman", serif'
      : 'var(--font-mono-font, "JetBrains Mono Nerd Font Mono"), "JetBrains Mono Nerd Font", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  const familyVar = preset.startsWith('sans')
    ? '--font-sans-font'
    : preset.startsWith('serif')
      ? '--font-serif-font'
      : '--font-mono-font'
  const style = preset.endsWith('italic') ? 'italic' : 'normal'

  document.documentElement.setAttribute('data-font-preset', preset)
  const warmUpFont = () => {
    if (!document.fonts?.load) {
      return
    }
    try {
      const familyToken = getComputedStyle(document.documentElement).getPropertyValue(familyVar).trim()
      if (!familyToken) {
        return
      }
      const stylePrefix = style === 'italic' ? 'italic ' : ''
      void document.fonts.load(`${stylePrefix}400 1em ${familyToken}`)
      void document.fonts.load(`${stylePrefix}500 1em ${familyToken}`)
      void document.fonts.load(`${stylePrefix}700 1em ${familyToken}`)
    } catch {
      // Ignore font prewarm failures and let normal rendering fallback.
    }
  }

  document.documentElement.style.setProperty('--duck-font-family', family)
  document.documentElement.style.setProperty('--font-sans', family)
  document.documentElement.style.setProperty('--font-mono', family)
  document.documentElement.style.setProperty('font-family', family, 'important')
  document.documentElement.style.setProperty('font-style', style, 'important')
  document.documentElement.style.setProperty('--duck-font-style', style)
  if (document.body) {
    document.body.style.setProperty('font-family', family, 'important')
    document.body.style.setProperty('font-style', style, 'important')
  }
  warmUpFont()
}

export function SiteHeader() {
  return (
    <HeaderRoot>
      {/* <div className="relative h-10 w-full"> */}
      {/*   <Image */}
      {/*     src="/banner-light.png" */}
      {/*     alt="logo" */}
      {/*     width={2000} */}
      {/*     height={1028} */}
      {/*     className="block h-10 w-full object-cover object-center dark:hidden" */}
      {/*   /> */}
      {/*   <Image */}
      {/*     src="/banner-dark2.png" */}
      {/*     alt="logo" */}
      {/*     width={2000} */}
      {/*     height={1028} */}
      {/*     className="hidden h-10 w-full object-cover object-center dark:block" */}
      {/*   /> */}
      {/*   <div className="container absolute inset-0 mx-auto flex w-full items-center justify-between gap-2 px-4"> */}
      {/*     <div className="pointer-events-none flex items-center gap-2 pl-1"> */}
      {/*       <img */}
      {/*         src="/icons/grouped-dark.svg" */}
      {/*         alt="Gentleduck logo" */}
      {/*         width={512} */}
      {/*         height={512} */}
      {/*         className="h-5 w-5 shrink-0 object-contain drop-shadow-md/70 sm:block dark:hidden" */}
      {/*       /> */}
      {/*  */}
      {/*       <img */}
      {/*         src="/icons/grouped-light.svg" */}
      {/*         alt="Gentleduck logo" */}
      {/*         width={512} */}
      {/*         height={512} */}
      {/*         className="hidden h-5 w-5 shrink-0 object-contain drop-shadow-md/70 dark:block dark:sm:block" */}
      {/*       /> */}
      {/*       <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono font-semibold text-shadow-md/20 text-xs uppercase leading-snug tracking-wide dark:text-shadow-md/50"> */}
      {/*         Announcing Gentleduck Iam and the Gentleduck Calendar and Gentleduck Upload */}
      {/*       </span> */}
      {/*     </div> */}
      {/*     <div className="pr-2"> */}
      {/*       <X className="size-4" /> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
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
const fontPresetAtom = atomWithStorage<FontPreset>(FONT_PRESET_STORAGE_KEY, DEFAULT_FONT_PRESET)

export function FontStyleButton() {
  const [fontPreset, setFontPreset] = useAtom(fontPresetAtom)

  React.useEffect(() => {
    try {
      const hasNewPreset = localStorage.getItem(FONT_PRESET_STORAGE_KEY) !== null
      if (hasNewPreset) {
        return
      }

      const rawV5Preset = localStorage.getItem('fontPresetV5')
      if (rawV5Preset) {
        const v5Preset = JSON.parse(rawV5Preset)
        const migratedPreset: FontPreset = isFontPreset(v5Preset)
          ? (String(v5Preset).replace('-italic', '-normal') as FontPreset)
          : DEFAULT_FONT_PRESET
        setFontPreset(migratedPreset)
        return
      }

      const rawV2Preset = localStorage.getItem('fontPresetV2')
      if (rawV2Preset) {
        const v2Preset = JSON.parse(rawV2Preset)
        const migratedPreset: FontPreset =
          isFontPreset(v2Preset) && v2Preset.startsWith('mono') ? v2Preset : DEFAULT_FONT_PRESET
        setFontPreset(migratedPreset)
        return
      }

      const rawOldPreset = localStorage.getItem('fontPreset')
      if (rawOldPreset) {
        const oldPreset = JSON.parse(rawOldPreset)
        const migratedPreset: FontPreset =
          isFontPreset(oldPreset) && oldPreset.startsWith('mono') ? oldPreset : DEFAULT_FONT_PRESET
        setFontPreset(migratedPreset)
        return
      }

      const rawLegacyType = localStorage.getItem('fontType')
      if (rawLegacyType) {
        const legacyType = JSON.parse(rawLegacyType)
        const migratedPreset: FontPreset = legacyType === 'mono' ? 'mono-normal' : DEFAULT_FONT_PRESET
        setFontPreset(migratedPreset)
      }
    } catch {
      // Ignore legacy migration issues and keep defaults.
    }
  }, [setFontPreset])

  React.useEffect(() => {
    if (!isFontPreset(fontPreset)) {
      setFontPreset(DEFAULT_FONT_PRESET)
      return
    }
    applyFontPreset(fontPreset)
  }, [fontPreset, setFontPreset])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Font and style"
          className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }), 'size-8')}
          type="button">
          <Type aria-hidden="true" className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuRadioGroup
          onValueChange={(value) => {
            if (!isFontPreset(value)) {
              return
            }
            setFontPreset(value)
            applyFontPreset(value)
          }}
          value={fontPreset}>
          {FONT_PRESET_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              onSelect={() => {
                setFontPreset(option.value)
                applyFontPreset(option.value)
              }}
              value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
