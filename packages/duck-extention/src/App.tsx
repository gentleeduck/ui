import { cn } from '@gentleduck/libs/cn'
import { Button, buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
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
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'
import { Check, ChevronsUpDown, Rabbit } from 'lucide-react'
import React from 'react'
import fontsMetadata from './assets/fonts.json'

declare interface String {
  replaceAll(searchValue: string | RegExp, replaceValue: string): string
}

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
  font: Font | null
  setFont: (font: Font) => void
  cssCode: string
}

const FontContext = React.createContext<FontContextType | null>(null)

function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = React.useState<Font | null>(() => {
    const saved = localStorage.getItem('selectedFont')
    return saved ? JSON.parse(saved) : null
  })

  const [cssCode, setCssCode] = React.useState('')

  const setFont = (font: Font) => {
    setFontState(font)
    localStorage.setItem('selectedFont', JSON.stringify(font))
  }

  React.useEffect(() => {
    if (!font) return

    const importUrl = `https://fonts.googleapis.com/css2?family=${(font.family as never as String).replaceAll(
      ' ',
      '+',
    )}:wght@${font.variants.join(';')}&display=swap`

    const css = `
@import url('${importUrl}');

body {
  font-family: '${font.family}', sans-serif;
}
`.trim()

    setCssCode(css)

    // Inject into DOM
    let styleTag = document.getElementById('dynamic-font-style') as HTMLStyleElement
    console.log(styleTag)
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = 'dynamic-font-style'
      document.head.appendChild(styleTag)
    }

    styleTag.innerHTML = css
  }, [font])

  return <FontContext.Provider value={{ cssCode, font, setFont }}>{children}</FontContext.Provider>
}

function useFontStore() {
  const ctx = React.useContext(FontContext)
  if (!ctx) throw new Error('useFontStore must be inside FontProvider')
  return ctx
}

type Extension = {
  name: string
  description: string
}

const extensions: Extension[] = [
  {
    description: 'A set of fonts for gentleduck',
    name: 'gentleduck/fonts',
  },
]

export function App() {
  return (
    <FontProvider>
      <main className="flex h-screen select-none items-center justify-center font-mono">
        <Card className="size-100 justify-self-center">
          <CardHeader>
            <CardTitle>gentleduck/extensions</CardTitle>
          </CardHeader>

          <ScrollArea className="px-8">
            <ul className="flex h-full flex-col gap-4">
              {extensions.map((item, idx) => (
                <Popover key={idx} open>
                  <PopoverTrigger asChild>
                    <li
                      className={cn(
                        buttonVariants({
                          className: 'flex h-full items-center gap-2 text-xl',
                          variant: 'ghost',
                        }),
                      )}>
                      <div className="flex size-12 items-center justify-center rounded-lg bg-secondary">
                        <Rabbit className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-accent-foreground/80 text-sm">{item.description}</span>
                      </div>
                    </li>
                  </PopoverTrigger>

                  <PopoverContent className="w-full max-w-md">
                    <FontExtensionMenu extension={item} />
                  </PopoverContent>
                </Popover>
              ))}
            </ul>
          </ScrollArea>

          <CardFooter></CardFooter>
        </Card>
      </main>
    </FontProvider>
  )
}

function FontExtensionMenu({ extension }: { extension: Extension }) {
  const { cssCode } = useFontStore()

  return (
    <form>
      <FieldSet>
        <FieldLegend>{extension.name}</FieldLegend>
        <FieldDescription>Select and preview Google Web Fonts.</FieldDescription>
        <FieldSeparator />

        <FieldGroup>
          {/* FONT PICKER */}
          <Field className="flex flex-col! @md/field-group:*:w-full">
            <FieldContent>
              <FieldLabel>Font Name</FieldLabel>
              <FieldDescription>Select a font from the list</FieldDescription>
            </FieldContent>
            <FontSelector />
          </Field>

          <FieldSeparator />

          {/* CSS RESULT */}
          <Field className="flex flex-col! @md/field-group:*:w-full">
            <FieldContent>
              <FieldLabel>Result</FieldLabel>
              <FieldDescription>Copy this CSS into your root stylesheet.</FieldDescription>
            </FieldContent>

            <Textarea className="min-h-[120px] w-full resize-none" readOnly value={cssCode} />
          </Field>

          <FieldSeparator />

          <Field orientation="responsive">
            <Button
              onClick={() => {
                localStorage.removeItem('selectedFont')
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
  )
}

function FontSelector() {
  const [open, setOpen] = React.useState(false)
  const { font, setFont } = useFontStore()

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button className="w-[200px] justify-between" variant="outline">
          {font ? font.family : 'Select font...'}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[25.8rem] p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search fonts..." />

          <CommandList>
            <CommandEmpty>No fonts found.</CommandEmpty>

            <CommandGroup heading="Fonts">
              {fontsMetadata.map((f: Font) => (
                <CommandItem
                  key={f.id}
                  onSelect={() => {
                    setFont(f)
                    setOpen(false)
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
