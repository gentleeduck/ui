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

function toCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function parseInlineStyle(styleText: string): React.CSSProperties {
  return styleText
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((styles, declaration) => {
      const separatorIndex = declaration.indexOf(':')
      if (separatorIndex === -1) {
        return styles
      }

      const property = declaration.slice(0, separatorIndex).trim()
      const value = declaration.slice(separatorIndex + 1).trim()
      if (!property || !value) {
        return styles
      }

      styles[toCamelCase(property)] = value
      return styles
    }, {}) as React.CSSProperties
}

function getElementProps(element: HTMLElement) {
  const props: Record<string, unknown> = {}

  for (const attribute of element.getAttributeNames()) {
    const value = element.getAttribute(attribute)
    if (value === null) {
      continue
    }

    if (attribute === 'class') {
      props['className'] = value
      continue
    }

    if (attribute === 'style') {
      props['style'] = parseInlineStyle(value)
      continue
    }

    if (attribute === 'tabindex') {
      props['tabIndex'] = Number(value)
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
          data-rehype-pretty-code-fragment>
          {renderedCode}
        </div>
      </TabsContent>
    </Tabs>
  )
}
