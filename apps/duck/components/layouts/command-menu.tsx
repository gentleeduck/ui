'use client'

import type { IDocsEntry, ITocEntry } from '@gentleduck/docs'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  useCommandListContext,
} from '@gentleduck/registry-ui/command'
import { Separator } from '@gentleduck/registry-ui/separator'
import { useKeyCommands } from '@gentleduck/vim/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Circle, Command, CornerDownLeft, FileIcon, Moon, Search, Sparkles, Sun } from 'lucide-react'
import lunr from 'lunr'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { docsConfig, docsEntries } from '~/config/docs'
import type { ISidebarNavItem } from '~/types/nav'
import { AIChatPanel } from './ai-chat-panel'

// const AIChatPanel = React.lazy(() =>
//   import('@duck-docs/components/layouts/ai-chat-panel').then((m) => ({ default: m.AIChatPanel })),
// )

// -- Types -------------------------------------------------------------------

type FlattenedSidebarItem = {
  href: string
  title: string
}

type VirtualRow =
  | { type: 'heading'; title: string }
  | { type: 'item'; name: string; href: string; icon: React.ReactNode; action: () => void }

type ItemRow = VirtualRow & { type: 'item' }

type SearchableItem = {
  groupTitle: string
  id: string
  leafTitle: string
  name: string
  segments: string
  tocHeadings: string
}

// -- Constants ---------------------------------------------------------------

const HEADING_HEIGHT = 32
const ITEM_HEIGHT = 36

// -- Helpers -----------------------------------------------------------------

function flattenSidebarItems(items: ISidebarNavItem[], parentTitle = ''): FlattenedSidebarItem[] {
  const flattened: FlattenedSidebarItem[] = []

  for (const item of items) {
    const title = parentTitle ? `${parentTitle} / ${item.title}` : item.title

    if (item.href && !item.disabled) {
      flattened.push({
        href: item.href,
        title,
      })
    }

    if (item.items?.length) {
      flattened.push(...flattenSidebarItems(item.items, title))
    }
  }

  return flattened
}

function flattenTocTitles(entries?: ITocEntry[]): string {
  if (!entries || entries.length === 0) return ''
  const titles: string[] = []
  for (const entry of entries) {
    titles.push(entry.title)
    if (entry.items?.length) {
      titles.push(flattenTocTitles(entry.items))
    }
  }
  return titles.join(' ')
}

function findTocHeadings(docs: IDocsEntry[] | undefined, href: string): string {
  if (!docs || !href) return ''
  const doc = docs.find((d) => d.permalink === href || d.slug === href)
  return doc?.toc ? flattenTocTitles(doc.toc) : ''
}

function buildSearchIndex(items: SearchableItem[]): lunr.Index {
  return lunr(function () {
    this.ref('id')
    this.field('leafTitle', { boost: 10 })
    this.field('name', { boost: 5 })
    this.field('segments', { boost: 3 })
    this.field('tocHeadings', { boost: 2 })
    this.field('groupTitle', { boost: 1 })

    this.pipeline.remove(lunr.stemmer)
    this.searchPipeline.remove(lunr.stemmer)

    for (const item of items) {
      this.add(item)
    }
  })
}

// -- CommandMenu -------------------------------------------------------------

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()
  // const docsEntries = useDocsEntries()
  const [selectedLabel, setSelectedLabel] = React.useState('')
  const [aiMode, setAiMode] = React.useState(true)
  const [initialAiQuery, setInitialAiQuery] = React.useState('')

  // Build-time check  -  no runtime API call
  const aiAvailable = process.env['NEXT_PUBLIC_AI_CHAT_ENABLED'] === 'true'

  // Reset AI mode when dialog closes
  React.useEffect(() => {
    if (!open) {
      setAiMode(false)
      setInitialAiQuery('')
    }
  }, [open])

  const items = React.useMemo(
    () => [
      ...docsConfig.sidebarNav.map((group) => ({
        items: flattenSidebarItems(group.items ?? []).map((navItem) => ({
          action: () => router.push(navItem.href),
          href: navItem.href,
          icon: <Circle aria-hidden="true" className="mr-2 h-3 w-3" />,
          name: navItem.title,
        })),
        title: group.title,
      })),
      {
        items: [
          {
            action: () => setTheme('light'),
            href: '',
            icon: <Sun aria-hidden="true" className="mr-2 h-4 w-4" />,
            name: 'Light',
          },
          {
            action: () => setTheme('dark'),
            href: '',
            icon: <Moon aria-hidden="true" className="mr-2 h-4 w-4" />,
            name: 'Dark',
          },
          {
            action: () => setTheme('system'),
            href: '',
            icon: <FileIcon aria-hidden="true" className="mr-2 h-4 w-4" />,
            name: 'System',
          },
        ],
        title: 'Theme',
      },
    ],
    [router, setTheme],
  )

  const flatRows = React.useMemo<VirtualRow[]>(() => {
    const rows: VirtualRow[] = []
    for (const group of items) {
      rows.push({ type: 'heading', title: group.title })
      for (const item of group.items) {
        rows.push({ type: 'item', name: item.name, href: item.href, icon: item.icon, action: item.action })
      }
    }
    return rows
  }, [items])

  const searchIndex = React.useMemo(() => {
    const searchable: SearchableItem[] = []

    for (const group of items) {
      if (group.title === 'Theme') continue
      for (const item of group.items) {
        const segments = item.name.split(' / ')
        const leafTitle = segments[segments.length - 1] ?? item.name
        searchable.push({
          groupTitle: group.title,
          id: item.name,
          leafTitle,
          name: item.name,
          segments: segments.join(' '),
          tocHeadings: findTocHeadings(docsEntries, item.href),
        })
      }
    }

    return searchable.length > 0 ? buildSearchIndex(searchable) : null
  }, [items])

  return (
    <>
      <Button
        className={cn(
          'relative size-8 bg-muted/50 p-0 text-muted-foreground text-sm shadow-none md:w-40 md:px-3 lg:w-64 ltr:md:pr-2 rtl:md:pl-2 md:[&>div]:w-full md:[&>div]:justify-between',
        )}
        onClick={() => setOpen(true)}
        size={'icon'}
        variant="outline">
        <Search aria-hidden="true" className="size-4 md:hidden" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="hidden md:inline-flex lg:hidden">Search...</span>
        <CommandShortcut
          className="hidden bg-secondary md:flex"
          keys={'ctrl+k'}
          onKeysPressed={() => {
            setOpen((prev) => !prev)
          }}>
          <Command aria-hidden="true" className="size-3!" />
          <span className="text-md">K</span>
        </CommandShortcut>
      </Button>
      <CommandDialog
        onOpenChange={(v) => {
          if (!v && aiMode) return
          setOpen(v)
        }}
        open={open}
        shouldFilter={false}
        contentClassName={aiMode ? 'lg:w-[800px] h-[550px]' : ''}>
        {aiMode ? (
          <React.Suspense
            fallback={
              <div className="flex h-105 items-center justify-center text-muted-foreground text-sm">
                Loading AI chat...
              </div>
            }>
            <AIChatPanel
              initialQuery={initialAiQuery}
              onBack={() => setAiMode(false)}
              onClose={() => {
                setAiMode(false)
                setOpen(false)
              }}
            />
          </React.Suspense>
        ) : (
          <>
            <CommandInput autoFocus placeholder="Search...">
              {aiAvailable && (
                <button
                  type="button"
                  onClick={() => setAiMode(true)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  title="Ask AI">
                  <Sparkles aria-hidden="true" className="size-4" />
                </button>
              )}
            </CommandInput>
            <VirtualCommandList
              aiAvailable={aiAvailable}
              flatRows={flatRows}
              onAskAI={(query) => {
                setInitialAiQuery(query)
                setAiMode(true)
              }}
              onClose={() => setOpen(false)}
              onSelectedLabelChange={setSelectedLabel}
              searchIndex={searchIndex}
            />
            <CommandFooter selectedLabel={selectedLabel} />
          </>
        )}
      </CommandDialog>
    </>
  )
}

// -- VirtualCommandList ------------------------------------------------------

function VirtualCommandList({
  aiAvailable,
  flatRows,
  onAskAI,
  onClose,
  onSelectedLabelChange,
  searchIndex,
}: {
  aiAvailable: boolean
  flatRows: VirtualRow[]
  onAskAI: (query: string) => void
  onClose: () => void
  onSelectedLabelChange: (label: string) => void
  searchIndex: lunr.Index | null
}) {
  const { search } = useCommandListContext({})
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const filteredRows = React.useMemo<VirtualRow[]>(() => {
    if (!search) return flatRows

    // Build score map from lunr results for doc items
    let scoreMap: Map<string, number>

    try {
      if (!searchIndex) throw new Error('no index')
      const sanitized = search.replace(/[:*~+\-^]/g, '\\$&')
      const terms = sanitized.trim().split(/\s+/).filter(Boolean)
      if (terms.length === 0) return flatRows

      // Try wildcard prefix matching first (natural for incremental typing)
      let results = searchIndex.search(terms.map((t) => `${t}*`).join(' '))

      // Fuzzy fallback for typos
      if (results.length === 0) {
        results = searchIndex.search(terms.map((t) => `${t}~1`).join(' '))
      }

      scoreMap = new Map(results.map((r) => [r.ref, r.score]))
    } catch {
      // lunr threw on invalid syntax -- fall back to substring
      const q = search.toLowerCase()
      scoreMap = new Map(
        flatRows
          .filter((r): r is ItemRow => r.type === 'item' && r.name.toLowerCase().includes(q))
          .map((r) => [r.name, 1]),
      )
    }

    const query = search.toLowerCase()
    const filtered: VirtualRow[] = []
    let currentHeading: (VirtualRow & { type: 'heading' }) | null = null
    let pendingItems: ItemRow[] = []
    let isThemeGroup = false

    const flushGroup = () => {
      if (pendingItems.length > 0 && currentHeading) {
        // Sort items within group by lunr score (highest first)
        pendingItems.sort((a, b) => (scoreMap.get(b.name) ?? 0) - (scoreMap.get(a.name) ?? 0))
        filtered.push(currentHeading)
        filtered.push(...pendingItems)
      }
      pendingItems = []
    }

    for (const row of flatRows) {
      if (row.type === 'heading') {
        flushGroup()
        currentHeading = row
        isThemeGroup = row.title === 'Theme'
      } else if (row.type === 'item') {
        // Theme items use substring, doc items use lunr
        const isMatch = isThemeGroup ? row.name.toLowerCase().includes(query) : scoreMap.has(row.name)
        if (isMatch) {
          pendingItems.push(row)
        }
      }
    }
    flushGroup()

    return filtered
  }, [flatRows, search, searchIndex])

  // Extract only item rows for index-based navigation
  const itemRows = React.useMemo<ItemRow[]>(
    () => filteredRows.filter((r): r is ItemRow => r.type === 'item'),
    [filteredRows],
  )

  // Reset selection when search/filter changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [])

  // Clamp selectedIndex to valid range
  const clampedIndex = itemRows.length > 0 ? Math.min(selectedIndex, itemRows.length - 1) : -1
  const selectedRow = clampedIndex >= 0 ? itemRows[clampedIndex] : null

  // Sync selected label to parent for footer
  React.useEffect(() => {
    onSelectedLabelChange(selectedRow?.name ?? '')
  }, [selectedRow?.name, onSelectedLabelChange])

  // Find the index in filteredRows (including headings) for virtualizer scrolling
  const selectedFilteredIndex = selectedRow ? filteredRows.indexOf(selectedRow) : -1

  const virtualizer = useVirtualizer({
    count: filteredRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => (filteredRows[index]?.type === 'heading' ? HEADING_HEIGHT : ITEM_HEIGHT),
    overscan: 5,
  })

  // Scroll virtualizer to selected item when it changes
  React.useEffect(() => {
    if (selectedFilteredIndex >= 0) {
      virtualizer.scrollToIndex(selectedFilteredIndex, { align: 'auto' })
    }
  }, [selectedFilteredIndex, virtualizer])

  // Keyboard navigation via capture-phase listener.
  const stableRef = React.useRef({ itemRows, selectedRow, clampedIndex, onClose, search, aiAvailable, onAskAI })
  stableRef.current = { itemRows, selectedRow, clampedIndex, onClose, search, aiAvailable, onAskAI }

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const {
        itemRows: rows,
        selectedRow: selected,
        onClose: close,
        search: q,
        aiAvailable: ai,
        onAskAI: askAI,
      } = stableRef.current

      switch (e.key) {
        case 'ArrowDown':
          if (rows.length === 0) return
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, rows.length - 1))
          break
        case 'ArrowUp':
          if (rows.length === 0) return
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Home':
          if (rows.length === 0) return
          e.preventDefault()
          setSelectedIndex(0)
          break
        case 'End':
          if (rows.length === 0) return
          e.preventDefault()
          setSelectedIndex(rows.length - 1)
          break
        case 'Enter':
          e.preventDefault()
          if (selected) {
            close()
            selected.action()
          } else if (rows.length === 0 && ai && q) {
            askAI(q)
          }
          break
      }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [])

  const isEmpty = itemRows.length === 0

  // The primitive's CommandList has a built-in substring filter that sets el.hidden = true.
  // Since we handle filtering ourselves via lunr, unhide all items after the primitive's effect runs.
  const listContainerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const container = listContainerRef.current
    if (!container) return
    const hiddenItems = container.querySelectorAll('[data-slot="command-item"][hidden]')
    hiddenItems.forEach((el) => {
      el.removeAttribute('hidden')
    })
  })

  return (
    <>
      {isEmpty && (
        <CommandEmpty>
          <span>No results found.</span>
          {aiAvailable && search && (
            <button
              type="button"
              onClick={() => onAskAI(search)}
              className="mt-2 flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground">
              <Sparkles aria-hidden="true" className="size-3" />
              Press Enter to ask AI instead
            </button>
          )}
        </CommandEmpty>
      )}
      <CommandList className="h-97.5 max-h-full w-full md:w-full" scrollRef={scrollRef}>
        <div ref={listContainerRef} style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = filteredRows[virtualRow.index]
            const isSelected = row === selectedRow
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}>
                {row?.type === 'heading' ? (
                  <div
                    data-slot="command-group-heading"
                    className="px-2 py-1.5 font-medium text-muted-foreground text-sm">
                    {row.title}
                  </div>
                ) : (
                  <CommandItem
                    value={row?.name}
                    data-highlighted={isSelected ? '' : undefined}
                    aria-selected={isSelected}
                    onSelect={() => {
                      onClose()
                      row?.action()
                    }}
                    onPointerMove={() => {
                      const idx = itemRows.indexOf(row as ItemRow)
                      if (idx >= 0) setSelectedIndex(idx)
                    }}>
                    {row?.icon}
                    <span>{row?.name}</span>
                  </CommandItem>
                )}
              </div>
            )
          })}
        </div>
      </CommandList>
    </>
  )
}

// -- CommandFooter -----------------------------------------------------------

function CommandFooter({ selectedLabel }: { selectedLabel: string }) {
  const sidebarItems = docsConfig.sidebarNav.flatMap((group) => flattenSidebarItems(group.items ?? []))
  const selectedNavItem = sidebarItems.find((item) => item.title === selectedLabel)
  useKeyCommands(
    {
      'ctrl+shift+c': {
        description: 'Copy command',
        execute: () => {
          if (!selectedLabel) return
          navigator.clipboard.writeText(`bunx @gentleduck/cli add ${selectedLabel.toLowerCase().replace(/ /g, '-')}`)
        },
        name: 'ctrl+shift+c',
      },
    },
    { preventDefault: true },
  )
  return (
    <div className="hidden h-10 w-full items-center justify-between gap-4 border-t px-2 pt-2 lg:flex">
      <div className="flex h-full w-full items-center justify-between gap-4">
        {selectedLabel && (
          <Button className={cn('px-2')} size={'sm'} variant={'outline'}>
            <CornerDownLeft aria-hidden="true" />
            <Separator className="m-0 h-4 p-0" orientation="vertical" />
            {selectedLabel.split(' ')?.[0]}
          </Button>
        )}
        {selectedLabel && selectedNavItem?.title ? (
          <Button className={cn('px-2')} size={'sm'} variant={'outline'}>
            <div className="flex items-center gap-1">
              <Command aria-hidden="true" className="size-3!" />
              <p className="text-md">C</p>
            </div>
            <Separator className="m-0 h-4 p-0" orientation="vertical" />
            <div className="flex items-center gap-1">
              <span>bunx @gentleduck/cli add</span>
              <span className="text-blue-400">{selectedNavItem.title.split(' ')?.[0]?.toLowerCase()}</span>
            </div>
          </Button>
        ) : (
          <p className="flex h-full w-full items-center justify-center whitespace-nowrap text-right text-muted-foreground text-sm">
            <span className="whitespace-nowrap font-medium text-sm">Command palette</span> for the documentation
            content.
          </p>
        )}
      </div>
    </div>
  )
}
