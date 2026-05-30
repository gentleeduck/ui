'use client'

import { Icons } from '@duck-docs/components/icons'
import { useLiftMode } from '@duck-docs/hooks/use-lift-mode'
import { cn } from '@gentleduck/libs/cn'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gentleduck/registry-ui/resizable'
import { Tabs, TabsContent } from '@gentleduck/registry-ui/tabs'
import React from 'react'
import type { PanelImperativeHandle } from 'react-resizable-panels'

type Block = {
  name: string
  container?: {
    height?: number
  }
  highlightedCode: string
}

// SECURITY: allowlist of tag names PrettyCode emits inside a `<pre>` body. Any
// tag outside this list is dropped — its text children are still recursed
// over so unexpected wrappers don't blank the highlight tree.
const ALLOWED_TAGS = new Set(['span', 'code', 'pre', 'mark', 'br', 'div'])
// SECURITY: allowlist of attributes that may be spread onto a React element
// from parsed highlighter HTML. `on*` handlers, `href`, `src`, `srcset`,
// `xlink:href`, and `formaction` are explicitly NOT here — they're the
// classic vectors for attribute-based XSS when the HTML is attacker-shaped.
const ALLOWED_ATTRS = new Set([
  'class',
  'style',
  'tabindex',
  'data-line',
  'data-highlighted-line',
  'data-highlighted-line-id',
  'data-highlighted-chars',
  'data-chars-id',
  'data-language',
  'data-theme',
  'data-rehype-pretty-code-figure',
  'data-rehype-pretty-code-title',
  'data-line-numbers',
  'data-line-numbers-max-digits',
  'data-line-number-start',
  'data-token',
  'aria-hidden',
  'aria-label',
  'role',
  'id',
])

function toCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function parseInlineStyle(styleText: string): React.CSSProperties {
  const result: React.CSSProperties = {}
  for (const declaration of styleText.split(';')) {
    const trimmed = declaration.trim()
    if (!trimmed) continue
    const separatorIndex = trimmed.indexOf(':')
    if (separatorIndex === -1) continue
    const property = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()
    if (!property || !value) continue
    // Forbid `expression(...)` / `javascript:` payloads sneaking through CSS.
    if (/expression\s*\(|javascript\s*:/i.test(value)) continue
    // CSS custom properties (`--foo`) are valid CSSProperties keys; named
    // props get camelCased. Cast through `Record<string, string>` because
    // `CSSProperties`'s indexed signature only accepts custom props.
    ;(result as Record<string, string>)[property.startsWith('--') ? property : toCamelCase(property)] = value
  }
  return result
}

function getElementProps(element: HTMLElement): Record<string, unknown> {
  const props: Record<string, unknown> = {}

  for (const attribute of element.getAttributeNames()) {
    const lower = attribute.toLowerCase()

    // SECURITY: block every `on*` event-handler attribute. PrettyCode never
    // emits these; if one shows up the input is attacker-shaped.
    if (lower.startsWith('on')) continue
    // SECURITY: block URL-bearing attributes outright. The highlight tree
    // has no business with links — anything here is suspect.
    if (lower === 'href' || lower === 'src' || lower === 'srcset' || lower === 'xlink:href' || lower === 'formaction') {
      continue
    }
    if (!ALLOWED_ATTRS.has(lower)) continue

    const value = element.getAttribute(attribute)
    if (value === null) continue

    if (lower === 'class') {
      props.className = value
      continue
    }

    if (lower === 'style') {
      props.style = parseInlineStyle(value)
      continue
    }

    if (lower === 'tabindex') {
      const n = Number(value)
      if (Number.isFinite(n)) props.tabIndex = n
      continue
    }

    props[attribute] = value === '' ? true : value
  }

  return props
}

function renderHtmlNode(node: ChildNode, key: string): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (!(node instanceof HTMLElement)) {
    return null
  }

  const tagName = node.tagName.toLowerCase()
  const children = Array.from(node.childNodes).map((child, index) => renderHtmlNode(child, `${key}-${index}`))

  // SECURITY: tag allowlist. Unknown tags collapse to a fragment so their
  // text descendants still render but the tag itself disappears.
  if (!ALLOWED_TAGS.has(tagName)) {
    return <React.Fragment key={key}>{children}</React.Fragment>
  }

  return React.createElement(tagName, { key, ...getElementProps(node) }, ...children)
}

function renderHighlightedCode(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html')
  return Array.from(document.body.childNodes).map((node, index) => renderHtmlNode(node, `highlighted-${index}`))
}

export function CodePreview({ block }: { block: Block & { hasLiftMode: boolean } }) {
  const { isLiftMode } = useLiftMode(block.name)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isMounted, setIsMounted] = React.useState(false)
  const ref = React.useRef<PanelImperativeHandle>(null)
  const renderedCode = React.useMemo(
    () => (isMounted ? renderHighlightedCode(block.highlightedCode) : null),
    [block.highlightedCode, isMounted],
  )

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Tabs
      className="relative grid w-full scroll-m-20 gap-4"
      defaultValue="preview"
      id={block.name}
      style={
        {
          '--container-height': block.container?.height,
        } as React.CSSProperties
      }>
      <TabsContent
        className="relative after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg after:bg-muted"
        value="preview">
        <ResizablePanelGroup className="relative z-10" orientation="horizontal">
          <ResizablePanel
            className={cn(
              'relative rounded-lg border bg-background',
              isLiftMode ? 'border-border/50' : 'border-border',
            )}
            defaultSize={100}
            minSize={30}
            panelRef={ref}>
            {isLoading ? (
              <output
                aria-live="polite"
                className="absolute inset-0 z-10 flex h-[--container-height] w-full items-center justify-center gap-2 bg-background text-muted-foreground text-sm">
                <Icons.spinner aria-hidden="true" className="h-4 w-4 animate-spin" />
                Loading...
              </output>
            ) : null}
            <iframe
              allowTransparency
              className="chunk-mode relative z-20 w-full bg-background"
              height={block.container?.height ?? 450}
              onLoad={() => {
                setIsLoading(false)
              }}
              src={`/blocks/${block.name}`}
              title={`Preview of ${block.name}`}
            />
          </ResizablePanel>
          <ResizableHandle
            className={cn(
              'relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all after:hover:h-10 sm:block',
              isLiftMode && 'invisible',
            )}
          />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </TabsContent>
      <TabsContent value="code">
        <div
          className="w-full overflow-hidden rounded-md [&_pre]:my-0 [&_pre]:h-[--container-height] [&_pre]:overflow-auto [&_pre]:whitespace-break-spaces [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
          data-dmc-fragment>
          {renderedCode}
        </div>
      </TabsContent>
    </Tabs>
  )
}
