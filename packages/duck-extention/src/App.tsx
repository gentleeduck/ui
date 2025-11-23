import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card } from '@gentleduck/registry-ui-duckui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui-duckui/command'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@gentleduck/registry-ui-duckui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { ScrollArea } from '@gentleduck/registry-ui-duckui/scroll-area'
import { Ban, Check, ChevronsUpDown, Github, Power, Trash2 } from 'lucide-react'
import React from 'react'
import fontsMetadata from './assets/fonts.json'

// If you don't have @types/chrome, this keeps TS happy:
declare const chrome: any

// ---------- Types ----------

type Font = {
  id: string
  family: string
  variants: string[]
  subsets: string[]
  category: string
  version: string
  lastModified: string
  popularity: number
  defSubset: string
  defVariant: string
}

type FontContextType = {
  currentDomain: string | null
  domainFonts: Record<string, Font>
  disabledDomains: string[]
  setFontForDomain: (domain: string, font: Font | null) => void
  toggleDomain: (domain: string) => void
  removeDomainFont: (domain: string) => void
}

const FontContext = React.createContext<FontContextType | null>(null)

// ---------- Helper Functions ----------

function getDomain(input: string): string | null {
  if (!input || typeof input !== 'string') return null

  // Ignore browser-internal pages
  const forbidden = ['chrome://', 'edge://', 'about:', 'moz-extension://', 'chrome-extension://']
  if (forbidden.some((p) => input.startsWith(p))) {
    return null
  }

  let url = input.trim()

  // If no protocol, prepend https://
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return null // invalid URL
  }
}

// ---------- Provider / Store ----------

// Cache for storage operations
let storageCache: {
  domainFonts?: Record<string, Font>
  disabledDomains?: string[]
  timestamp?: number
} = {}

const CACHE_TTL = 1000 // 1 second cache

function FontProvider({ children }: { children: React.ReactNode }) {
  const [currentDomain, setCurrentDomain] = React.useState<string | null>(null)
  const [domainFonts, setDomainFonts] = React.useState<Record<string, Font>>({})
  const [disabledDomains, setDisabledDomains] = React.useState<string[]>([])

  // Load from storage on mount with cache
  React.useEffect(() => {
    const now = Date.now()
    const useCache = storageCache.timestamp && now - storageCache.timestamp < CACHE_TTL

    if (useCache && storageCache.domainFonts && storageCache.disabledDomains) {
      setDomainFonts(storageCache.domainFonts)
      setDisabledDomains(storageCache.disabledDomains)
    }

    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      // Get current tab domain
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        const rawUrl = tabs[0]?.url
        const domain = getDomain(rawUrl)
        setCurrentDomain(domain)

        // Load domain fonts and disabled domains
        chrome.storage.sync.get(['gentleduck_domainFonts', 'gentleduck_disabledDomains'], (data: any) => {
          const fonts = data.gentleduck_domainFonts || {}
          const disabled = data.gentleduck_disabledDomains || []
          
          // Update cache
          storageCache = {
            domainFonts: fonts,
            disabledDomains: disabled,
            timestamp: Date.now(),
          }
          
          setDomainFonts(fonts)
          setDisabledDomains(disabled)
        })
      })
    } else {
      // Fallback to localStorage for development
      const saved = localStorage.getItem('gentleduck_domainFonts')
      if (saved) {
        const fonts = JSON.parse(saved)
        setDomainFonts(fonts)
        storageCache.domainFonts = fonts
      }
      const savedDisabled = localStorage.getItem('gentleduck_disabledDomains')
      if (savedDisabled) {
        const disabled = JSON.parse(savedDisabled)
        setDisabledDomains(disabled)
        storageCache.disabledDomains = disabled
      }
      storageCache.timestamp = Date.now()
    }
  }, [])

  const setFontForDomain = React.useCallback((domain: string, font: Font | null) => {
    if (!domain) return

    setDomainFonts((prev) => {
      const newDomainFonts = { ...prev }
      if (font) {
        newDomainFonts[domain] = font
      } else {
        delete newDomainFonts[domain]
      }

      // Update cache
      storageCache.domainFonts = newDomainFonts
      storageCache.timestamp = Date.now()

      // Save to storage (async, don't block)
      if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
        chrome.storage.sync.set({ gentleduck_domainFonts: newDomainFonts }, () => {
          // Update all tabs
          chrome.tabs.query({}, (tabs: any[]) => {
            tabs.forEach((tab) => {
              if (tab.url) {
                chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_FONT' }).catch(() => {})
              }
            })
          })
        })
      } else {
        localStorage.setItem('gentleduck_domainFonts', JSON.stringify(newDomainFonts))
      }

      return newDomainFonts
    })
  }, [])

  const toggleDomain = React.useCallback((domain: string) => {
    if (!domain) return

    setDisabledDomains((prev) => {
      const newDisabledDomains = prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]

      // Update cache
      storageCache.disabledDomains = newDisabledDomains
      storageCache.timestamp = Date.now()

      // Save to storage (async, don't block)
      if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
        chrome.storage.sync.set({ gentleduck_disabledDomains: newDisabledDomains }, () => {
          // Update all tabs
          chrome.tabs.query({}, (tabs: any[]) => {
            tabs.forEach((tab) => {
              if (tab.url) {
                chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_FONT' }).catch(() => {})
              }
            })
          })
        })
      } else {
        localStorage.setItem('gentleduck_disabledDomains', JSON.stringify(newDisabledDomains))
      }

      return newDisabledDomains
    })
  }, [])

  const removeDomainFont = React.useCallback((domain: string) => {
    if (!domain) return

    setDomainFonts((prev) => {
      const newDomainFonts = { ...prev }
      delete newDomainFonts[domain]

      // Update cache
      storageCache.domainFonts = newDomainFonts
      storageCache.timestamp = Date.now()

      // Save to storage (async, don't block)
      if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
        chrome.storage.sync.set({ gentleduck_domainFonts: newDomainFonts }, () => {
          // Update all tabs
          chrome.tabs.query({}, (tabs: any[]) => {
            tabs.forEach((tab) => {
              if (tab.url) {
                chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_FONT' }).catch(() => {})
              }
            })
          })
        })
      } else {
        localStorage.setItem('gentleduck_domainFonts', JSON.stringify(newDomainFonts))
      }

      return newDomainFonts
    })
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      currentDomain,
      disabledDomains,
      domainFonts,
      removeDomainFont,
      setFontForDomain,
      toggleDomain,
    }),
    [currentDomain, disabledDomains, domainFonts, removeDomainFont, setFontForDomain, toggleDomain],
  )

  return <FontContext.Provider value={contextValue}>{children}</FontContext.Provider>
}

function useFontStore() {
  const ctx = React.useContext(FontContext)
  if (!ctx) throw new Error('useFontStore must be inside FontProvider')
  return ctx
}

// ---------- UI Types ----------

type Extension = {
  name: string
  description: string
}

const extension: Extension = {
  description: 'Custom fonts per website',
  name: 'gentleduck/extention',
}

// ---------- Root App ----------

export function App() {
  return (
    <FontProvider>
      <AppShell />
    </FontProvider>
  )
}

const AppShell = React.memo(function AppShell() {
  const { currentDomain, domainFonts, disabledDomains } = useFontStore()

  // Memoize description to avoid re-computation
  const description = React.useMemo(
    () => (currentDomain ? `Select a font for ${currentDomain}` : 'Select a font for the current website'),
    [currentDomain],
  )

  // Memoize domain count
  const domainCount = React.useMemo(() => Object.keys(domainFonts).length, [domainFonts])

  return (
    <main className="flex h-screen select-none items-center justify-center font-mono">
      <Card className="relative w-[500px] justify-self-center rounded-none py-6">
        <a
          className="absolute top-2 right-2 z-10"
          href="https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-extention"
          rel="noreferrer"
          target="_blank">
          <Button icon={<Github />} size="icon" variant="outline" />
        </a>
        <ScrollArea className="px-6">
          <form>
            <FieldSet>
              <FieldLegend>{extension.name}</FieldLegend>
              <FieldDescription>{description}</FieldDescription>
              <FieldSeparator />

              <FieldGroup className="gap-4">
                {/* CURRENT DOMAIN FONT PICKER */}
                {currentDomain && (
                  <>
                    <Field className="flex flex-col! @md/field-group:*:w-full">
                      <FieldContent>
                        <FieldLabel>Font for {currentDomain}</FieldLabel>
                        <FieldDescription>
                          {disabledDomains.includes(currentDomain)
                            ? 'Extension is disabled for this domain'
                            : domainFonts[currentDomain]
                              ? `Current: ${domainFonts[currentDomain].family}`
                              : 'No font selected'}
                        </FieldDescription>
                      </FieldContent>
                      <FontSelector domain={currentDomain} />
                    </Field>

                    <FieldSeparator />
                  </>
                )}

                {/* ALL DOMAINS LIST */}
                <Field className="flex flex-col! @md/field-group:*:w-full">
                  <FieldContent>
                    <FieldLabel>All Websites ({domainCount})</FieldLabel>
                    <FieldDescription>Manage fonts for all websites</FieldDescription>
                  </FieldContent>
                  <DomainFontsList />
                </Field>

                <FieldSeparator />

                <Field className="justify-center">
                  <Button
                    onClick={() => {
                      if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
                        chrome.storage.sync.clear(() => {
                          localStorage.clear()
                          window.location.reload()
                        })
                      } else {
                        localStorage.clear()
                        window.location.reload()
                      }
                    }}
                    type="button"
                    variant="outline">
                    Reset All
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </ScrollArea>
      </Card>
    </main>
  )
})

// ---------- Components ----------

const FontSelector = React.memo(function FontSelector({ domain }: { domain: string }) {
  const { domainFonts, setFontForDomain, disabledDomains } = useFontStore()
  
  // Memoize derived values
  const currentFont = React.useMemo(() => domainFonts[domain] || null, [domainFonts, domain])
  const isDisabled = React.useMemo(() => disabledDomains.includes(domain), [disabledDomains, domain])
  
  const handleSelect = React.useCallback(
    (font: Font) => {
      setFontForDomain(domain, font)
    },
    [domain, setFontForDomain],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full justify-between" disabled={isDisabled} variant="outline">
          {currentFont ? currentFont.family : 'Select font...'}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search fonts..." />

          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No fonts found.</CommandEmpty>

            <CommandGroup heading="Fonts">
              {fontsMetadata.map((f: Font) => (
                <CommandItem key={f.id} onSelect={() => handleSelect(f)}>
                  <div className="flex items-center gap-2">
                    <Check className={`h-4 w-4 ${currentFont?.id === f.id ? 'opacity-100' : 'opacity-0'}`} />
                    <span className="text-sm">{f.family}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

const DomainFontsList = React.memo(function DomainFontsList() {
  const { domainFonts, disabledDomains, removeDomainFont, toggleDomain, currentDomain } = useFontStore()

  // Memoize sorted domains: current domain first, then alphabetically
  const domains = React.useMemo(
    () =>
      Object.keys(domainFonts).sort((a, b) => {
        if (a === currentDomain) return -1
        if (b === currentDomain) return 1
        return a.localeCompare(b)
      }),
    [domainFonts, currentDomain],
  )

  if (domains.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center text-muted-foreground text-sm">
        No fonts configured yet. Select a font for the current website to get started.
      </div>
    )
  }

  return (
    <div className="max-h-[186px] space-y-2 overflow-y-auto">
      {domains.map((domain) => {
        const font = domainFonts[domain]
        const isDisabled = disabledDomains.includes(domain)
        const isCurrent = domain === currentDomain

        return (
          <div
            className={cn(
              'relative flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm',
              isDisabled && 'opacity-50',
              isCurrent && 'border-border',
            )}
            key={domain}>
            {/* Corner border for current domain */}
            {isCurrent && (
              <div className="pointer-events-none absolute inset-0 rounded-md">
                <div className="absolute top-0 left-0 h-2 w-2 rounded-tl-md border-primary border-t-2 border-l-2" />
                <div className="absolute top-0 right-0 h-2 w-2 rounded-tr-md border-primary border-t-2 border-r-2" />
                <div className="absolute bottom-0 left-0 h-2 w-2 rounded-bl-md border-primary border-b-2 border-l-2" />
                <div className="absolute right-0 bottom-0 h-2 w-2 rounded-br-md border-primary border-r-2 border-b-2" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{domain}</span>
                {isCurrent && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary text-xs">Current</span>}
                {isDisabled && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">Disabled</span>
                )}
              </div>
              <div className="truncate text-muted-foreground text-xs">{font?.family}</div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                className="h-8 w-8 shrink-0"
                icon={isDisabled ? <Power /> : <Ban />}
                onClick={() => toggleDomain(domain)}
                size="icon"
                variant="ghost"
                title={isDisabled ? 'Enable extension' : 'Disable extension'}
              />
              <Button
                className="h-8 w-8 shrink-0"
                icon={<Trash2 />}
                onClick={() => removeDomainFont(domain)}
                size="icon"
                variant="ghost"
                title="Remove font"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
})
