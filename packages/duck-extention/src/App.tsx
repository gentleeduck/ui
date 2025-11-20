import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card } from '@gentleduck/registry-ui-duckui/card'
import { Input } from '@gentleduck/registry-ui-duckui/input'
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
import { Ban, Check, ChevronsUpDown, Plus, X } from 'lucide-react'
import React from 'react'
import fontsMetadata from './assets/fonts.json'
import themesJson from './assets/themes.json'

const cssStyles = `
/* --------------------------------------------------
   UNIVERSAL THEME APPLICATOR
   Applies theme variables to all visual elements
-------------------------------------------------- */

/* Base */
*,
*::before,
*::after {
  color: var(--foreground));
  border-color: var(--border));
  background-color: var(--background));
}

/* BASIC STRUCTURE */
html,
body {
  background-color: var(--background) !important;
  color: var(--foreground) !important;
  border-color: var(--border) !important;
}

/* BLOCK ELEMENTS */
div:not(button *),
section,
article,
main,
aside,
nav,
header,
footer {
  background-color: var(--background) !important;
  color: var(--foreground) !important;
  border-color: var(--border) !important;
}

.artdeco-card {
  background-color: transparent !important;
}

/* HEADINGS */
h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--foreground) !important;
}

svg,
*>svg {
  color: var(--foreground) !important;
  stroke-color: var(--foreground) !important;
}

p,
span,
strong,
em,
small,
label,
li,
dt,
dd,
figcaption {
  color: var(--accent-foreground) !important;
  background: var(--background) !important;
}

/* LINKS */
a {
  color: var(--primary) !important;
  background-color: var(--background) !important;
  border-color: var(--border) !important;
  box-shadow: none !important;
}

a:hover,
a:hover * {
  color: var(--primary) !important;
}

a * {
  background: transparent !important;
}

/* BUTTONS */
button,
[role="button"],
input[type="button"],
input[type="submit"],
input[type="reset"]

{
  background-color: transparent !important;
  color: var(--primary) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius) !important;
}

button * {
  background-color: transparent !important;
}

button:hover {
  background-color: var(--muted) !important;
}

/* INPUTS */
input,
select,
textarea {
  background-color: transparent !important;
  color: var(--primary) !important;
  border: 1px solid var(--input) !important;
}

/* TABLES */
table {
  background-color: var(--background) !important;
  border: 1px solid var(--border) !important;
}

th {
  background-color: var(--muted) !important;
  color: var(--foreground) !important;
}

td {
  border: 1px solid var(--border) !important;
}

/* LISTS */
ul,
ol {
  color: var(--foreground) !important;
}

/* CODE BLOCKS */
code,
pre {
  background-color: var(--surface, var(--background)) !important;
  color: var(--surface-foreground, var(--foreground)) !important;
  border: 1px solid var(--border) !important;
}

/* IMAGES + MEDIA WRAPPERS */
figure,
picture {
  background-color: var(--background) !important;
  border: 1px solid var(--border) !important;
}

/* ACCENTS */
mark {
  background-color: var(--warning) !important;
  color: var(--warning-foreground) !important;
}

/* DESTRUCTIVE ELEMENTS */
[data-destructive],
.destructive {
  background-color: var(--destructive) !important;
  color: var(--destructive-foreground) !important;
  border: 1px solid var(--destructive-border) !important;
}
`

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

// Theme is just "CSS variable name -> value"
export interface CSSVars {
  accent: string
  'accent-foreground': string
  background: string
  border: string
  card: string
  'card-foreground': string
  'chart-1': string
  'chart-2': string
  'chart-3': string
  'chart-4': string
  'chart-5': string
  destructive: string
  'destructive-foreground': string
  foreground: string
  input: string
  muted: string
  'muted-foreground': string
  popover: string
  'popover-foreground': string
  primary: string
  'primary-foreground': string
  radius: string
  ring: string
  secondary: string
  'secondary-foreground': string
  warning: string
  'warning-foreground': string

  // catch-all from .catchall(z.string())
  [key: string]: string
}

export interface CSSVarsWithoutRadius extends Omit<CSSVars, 'radius'> {}

export interface Theme {
  name: string
  label?: string

  activeColor?: {
    dark: string
    light: string
  }

  css?: {
    '@layer base': Record<string, never>
  }

  cssVars: {
    dark: CSSVarsWithoutRadius
    light: CSSVars
    theme?: Record<string, unknown>
  }
}

// Assuming themes.json is { [key: string]: Theme }
const themes = themesJson as unknown as Record<string, Theme>

type FontContextType = {
  font: Font | null
  setFont: (font: Font) => void
  cssCode: string
  themeKey: string | null
  setThemeKey: (themeKey: string | null) => void
  whiteList: WhiteListItem[]
  setWhiteList: (whiteList: WhiteListItem[]) => void
}

const FontContext = React.createContext<FontContextType | null>(null)

// ---------- Provider / Store ----------

function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = React.useState<Font | null>(() => {
    const saved = localStorage.getItem('selectedFont')
    return saved ? JSON.parse(saved) : null
  })

  const [themeKey, setThemeKeyState] = React.useState<string | null>(() => {
    return localStorage.getItem('selectedTheme') ?? null
  })

  const [cssCode, setCssCode] = React.useState('')

  const [whiteList, setWhiteList] = React.useState<WhiteListItem[]>(
    () => JSON.parse(localStorage.getItem('selectedWhiteList') ?? '[]') as WhiteListItem[],
  )

  const setFont = (font: Font) => {
    setFontState(font)
    localStorage.setItem('selectedFont', JSON.stringify(font))
  }

  const setThemeKey = (key: string | null) => {
    setThemeKeyState(key)
    if (key) {
      localStorage.setItem('selectedTheme', key)
    } else {
      localStorage.removeItem('selectedTheme')
    }
  }

  React.useEffect(() => {
    const parts: string[] = []
    let importUrl: string | null = null
    let theme: Theme | null = null

    // 1) Font import + global font
    if (font) {
      importUrl = `https://fonts.googleapis.com/css2?family=${font.family.replaceAll(
        ' ',
        '+',
      )}:wght@${font.variants.join(';')}&display=swap`

      parts.push(
        [
          `@import url('${importUrl}');`,
          `*, *::before, *::after {`,
          `  font-family: '${font.family}', sans-serif !important;`,
          `}`,
        ].join('\n'),
      )
    }

    // 2) Theme -> CSS vars & @layer base
    if (themeKey && themes[themeKey]) {
      const themeObj = themes[themeKey]

      const darkVars = themeObj.cssVars?.dark ?? {}
      // const lightVars = themeObj.cssVars?.light ?? {}
      const extraVars = themeObj.cssVars?.theme ?? {}
      // const baseLayer = themeObj.css?.['@layer base'] ?? {}

      /** Convert a dictionary of CSS vars into CSS text */
      const buildVars = (vars: Record<string, string>) =>
        Object.entries(vars)
          .map(([key, value]) => `  --${key}: ${value};`)
          .join('\n')

      // DARK THEME CLASS
      parts.push(
        [
          `:root {`,
          buildVars(darkVars),
          ...Object.entries(extraVars).map(([key, val]) => `  --${key}: ${val};`),
          `}`,
        ].join('\n'),
      )

      // LIGHT THEME CLASS
      // parts.push(
      //   [
      //     `:root {`,
      //     buildVars(lightVars),
      //     ...Object.entries(extraVars).map(([key, val]) => `  --${key}: ${val};`),
      //     `}`,
      //   ].join('\n'),
      // )
      // INFO: the baseCss is missing
      parts.push(cssStyles)
    }

    const css = parts.join('\n\n')
    setCssCode(css)

    // 3) Send structured data + css to current tab via chrome.storage
    if (typeof chrome !== 'undefined' && chrome.storage?.sync && font && importUrl) {
      chrome.storage.sync.set({
        gentleduck_font: {
          css,
          font,
          theme,
          themeKey,
          url: importUrl,
          whiteList,
        },
      })
    }
  }, [font, themeKey, whiteList])

  return (
    <FontContext.Provider
      value={{
        cssCode,
        font,
        setFont,
        setThemeKey,
        setWhiteList,
        themeKey,
        whiteList,
      }}>
      {children}
    </FontContext.Provider>
  )
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
  description: 'A set of fonts & themes for gentleduck',
  name: 'gentleduck/fonts',
}

// ---------- Root App ----------

export function App() {
  return (
    <FontProvider>
      <AppShell />
    </FontProvider>
  )
}

function AppShell() {
  const { cssCode } = useFontStore()

  return (
    <main className="flex h-screen select-none items-center justify-center font-mono">
      <Card className="w-[500px] justify-self-center py-6">
        <ScrollArea className="px-6">
          <form>
            <FieldSet>
              <FieldLegend>{extension.name}</FieldLegend>
              <FieldDescription>Select a font and theme, then copy the generated CSS.</FieldDescription>
              <FieldSeparator />

              <FieldGroup className="gap-4">
                {/* FONT PICKER */}
                <Field className="flex flex-col! @md/field-group:*:w-full">
                  <FieldContent>
                    <FieldLabel>Font Name</FieldLabel>
                    <FieldDescription>Select a font from the list</FieldDescription>
                  </FieldContent>
                  <FontSelector />
                </Field>

                <FieldSeparator />

                {/* THEME PICKER */}
                <Field className="flex flex-col! @md/field-group:*:w-full">
                  <FieldContent>
                    <FieldLabel>Theme</FieldLabel>
                    <FieldDescription>Select a theme from the list</FieldDescription>
                  </FieldContent>
                  <ThemeSelector />
                </Field>

                <FieldSeparator />

                {/* WHITE LIST */}
                <Field className="flex flex-col! @md/field-group:*:w-full">
                  <FieldContent>
                    <FieldLabel>White List</FieldLabel>
                    <FieldDescription>Enter a list of domains to whitelist</FieldDescription>
                  </FieldContent>

                  <WhiteListInput />
                </Field>

                <FieldSeparator />

                <Field className="justify-between gap-2" orientation="responsive">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(cssCode).catch(() => {})
                      }
                    }}
                    type="button"
                    variant="default">
                    Copy CSS
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      localStorage.removeItem('selectedFont')
                      localStorage.removeItem('selectedTheme')
                      window.location.reload()
                    }}
                    type="button"
                    variant="outline">
                    Reset
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </ScrollArea>
      </Card>
    </main>
  )
}

// ---------- Components ----------

type WhiteListItem = {
  id: string
  url: string
  disabled: boolean
}

export function WhiteListInput() {
  const { whiteList, setWhiteList } = useFontStore()
  const [inputValue, setInputValue] = React.useState('')

  React.useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        const url = tabs[0]?.url
        if (url) {
          let doesExist = whiteList.find((item) => url.includes(item.url))
          if (doesExist) return

          setInputValue(url)
        }
      })
    }
  }, [])

  const addToWhiteList = () => {
    if (!inputValue.trim()) return

    try {
      new URL(inputValue) // Validate URL
    } catch {
      return alert('Invalid URL')
    }

    let value = [
      ...whiteList,
      {
        disabled: false,
        id: crypto.randomUUID(),
        url: inputValue.trim(),
      },
    ]
    localStorage.setItem('selectedWhiteList', JSON.stringify(value))

    setWhiteList(value)

    setInputValue('')
  }

  const toggleDisable = (id: string) => {
    let value = whiteList.map((item) => (item.id === id ? { ...item, disabled: !item.disabled } : item))
    localStorage.setItem('selectedWhiteList', JSON.stringify(value))
    setWhiteList(value)
  }

  const removeItem = (id: string) => {
    let value = whiteList.filter((item) => item.id !== id)
    localStorage.setItem('selectedWhiteList', JSON.stringify(value))
    setWhiteList(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full justify-between" variant="outline">
          {whiteList.length} white-list items
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="size-80 overflow-auto p-3">
        {/* Input */}
        <div className="flex gap-2">
          <Input
            className="felx-2 rounded-md border px-3 py-2 text-sm"
            onChange={(e) => setInputValue(e.currentTarget.value)}
            placeholder="Enter URL & press Enter"
            value={inputValue}
          />
          <Button className="flex-1 px-2.25" icon={<Plus />} onClick={addToWhiteList} size="icon"></Button>
        </div>

        {/* Inline Preview */}
        <div className="mt-3 flex flex-wrap gap-2">
          {whiteList.map((item) => (
            <div
              className={cn(
                'inline-flex w-full items-center justify-between gap-2 rounded-md border px-2 py-1 text-sm',
                item.disabled && 'line-through opacity-50',
              )}
              key={item.id}>
              <span className="duck-truncate duck-truncate">{item.url}</span>

              <div className="flex items-center gap-2">
                {/* disable */}
                <button className="text-muted-foreground hover:text-foreground" onClick={() => toggleDisable(item.id)}>
                  <Ban className="h-4 w-4" />
                </button>

                {/* remove */}
                <button className="text-muted-foreground hover:text-foreground" onClick={() => removeItem(item.id)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function FontSelector() {
  const { font, setFont } = useFontStore()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full justify-between" variant="outline">
          {font ? font.family : 'Select font...'}
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
                <CommandItem
                  key={f.id}
                  onSelect={() => {
                    setFont(f)
                  }}>
                  <div className="flex items-center gap-2">
                    <Check className={`h-4 w-4 ${font?.id === f.id ? 'opacity-100' : 'opacity-0'}`} />
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
}

function ThemeSelector() {
  const { themeKey, setThemeKey } = useFontStore()

  const entries = React.useMemo(() => Object.entries(themes) as [string, Theme][], [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full justify-between" variant="outline">
          {themes[themeKey!]?.name ?? 'Select theme...'}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search themes..." />

          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No themes found.</CommandEmpty>

            <CommandGroup heading="Themes">
              {entries.map(([key]) => (
                <CommandItem
                  key={key}
                  onSelect={() => {
                    setThemeKey(key)
                  }}>
                  <div className="flex items-center gap-2">
                    <Check className={`h-4 w-4 ${themeKey === key ? 'opacity-100' : 'opacity-0'}`} />
                    <span className="text-sm">{themes[key]?.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
