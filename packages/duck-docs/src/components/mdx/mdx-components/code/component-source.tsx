'use client'

import { Icons } from '@duck-docs/components/icons'
import { cn } from '@gentleduck/libs/cn'
import { Separator } from '@gentleduck/registry-ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'
import * as React from 'react'
import { FigcaptionBlock } from './figcaption-block'

interface IComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  path?: string
}

type PreElement = React.ReactElement<{ children?: React.ReactNode; __dmcRaw__?: string }>
type CodeElement = React.ReactElement<{ children?: React.ReactNode }>

// Walks the MDX-emitted fragment to find the `<pre>` carrying `__dmcRaw__`.
function findPre(node: unknown): PreElement | null {
  if (!React.isValidElement(node)) return null
  const props = (node as React.ReactElement<{ children?: React.ReactNode; __dmcRaw__?: string }>).props
  if (typeof props.__dmcRaw__ === 'string') return node as PreElement
  for (const c of React.Children.toArray(props.children)) {
    const hit = findPre(c)
    if (hit) return hit
  }
  return null
}

// Reads the `// <filename>` marker that the build injects on line 1.
function getChildLabel(child: React.ReactNode): string {
  if (!React.isValidElement(child)) return 'source'
  const pre = findPre(child)
  const first = (pre?.props.__dmcRaw__ ?? '').split('\n')[0] ?? ''
  return first.replace(/^\s*\/\/\s*/, '').trim() || 'source'
}

// Drops the `// <filename>` marker line so it doesn't render in the body —
// the filename has already been hoisted into the tab trigger / figcaption.
function stripLeadingCommentLine(child: React.ReactNode): React.ReactNode {
  if (!React.isValidElement(child)) return child
  const pre = findPre(child)
  if (!pre) return child
  const code = React.Children.toArray(pre.props.children).find(
    (c): c is CodeElement => React.isValidElement(c) && (c as CodeElement).type === 'code',
  )
  if (!code) return child
  const lines = React.Children.toArray(code.props.children)
  if (lines.length === 0) return child
  // Drop the first `<span class="line">` (the `// filename` comment).
  // If it is followed immediately by a newline text node, drop that too
  // so the body starts cleanly with the second source line.
  let dropCount = 1
  if (typeof lines[1] === 'string' && (lines[1] as string) === '\n') dropCount = 2
  const trimmedLines = lines.slice(dropCount)
  const newCode = React.cloneElement(code, { children: trimmedLines } as { children: React.ReactNode })
  const newPreChildren = React.Children.toArray(pre.props.children).map((c) => (c === code ? newCode : c))
  const newPre = React.cloneElement(pre, { children: newPreChildren } as { children: React.ReactNode })
  // Rebuild the tree from `child` down, swapping `pre` -> `newPre`.
  const replace = (n: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(n)) return n
    if (n === pre) return newPre
    const kids = React.Children.toArray((n as React.ReactElement<{ children?: React.ReactNode }>).props.children).map(
      replace,
    )
    return React.cloneElement(n, undefined, ...kids)
  }
  return replace(child)
}

export function ComponentSource({ children, className, ...props }: IComponentSourceProps) {
  const items = React.Children.toArray(children)

  // `<ComponentSource path="…">` ships pre-resolved children from
  // dmc's `preMdxPlugins` pass — one fenced code block per file. The
  // PrettyCode transformer highlights every block before this React
  // component sees it.
  if (items.length === 0) {
    return (
      <output
        aria-live="polite"
        className="flex h-[502px] w-full items-center justify-center gap-2 rounded-md border border-border bg-muted/40 text-muted-foreground text-sm">
        <Icons.spinner aria-hidden="true" className="h-4 w-4 animate-spin" />
        Loading...
      </output>
    )
  }

  if (items.length === 1) {
    const value = getChildLabel(items[0])
    return (
      <div className="relative m-0 mt-2 shrink-0 list-none rounded-lg border bg-muted/40 ring-offset-background focus-visible:shadow-none focus-visible:outline-none focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>div>div>button]:top-2 [&>div>div>button]:right-2 [&>div>div]:m-0 [&>div]:static [&>div]:my-0 [&>div]:border-none [&>div]:bg-transparent">
        <FigcaptionBlock>{value}</FigcaptionBlock>
        {stripLeadingCommentLine(items[0])}
      </div>
    )
  }

  const defaultValue = getChildLabel(items[0])

  return (
    <Tabs
      className={cn('rounded-md border border-border bg-muted/40', className)}
      {...props}
      defaultValue={defaultValue}>
      <TabsList className="w-[622px] justify-start overflow-x-auto bg-transparent px-2 py-2">
        {items.map((item) => {
          const value = getChildLabel(item)
          return (
            <TabsTrigger className="aria-[selected='true']:bg-muted" key={value} value={value}>
              {value}
            </TabsTrigger>
          )
        })}
      </TabsList>
      <Separator />
      {items.map((item) => {
        const value = getChildLabel(item)
        return (
          <TabsContent
            className="relative m-0 bg-transparent focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 [&>div>div>button]:top-2 [&>div>div>button]:right-2 [&>div>div]:m-0"
            key={value}
            value={value}>
            <FigcaptionBlock>{value}</FigcaptionBlock>
            {stripLeadingCommentLine(item)}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
