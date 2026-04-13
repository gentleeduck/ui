'use client'

import { CopyButton } from '@duck-docs/components/copy-button'
import { Icons } from '@duck-docs/components/icons'
import { useRegistryIndex } from '@duck-docs/context'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'
import { Crown } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'

interface IComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  extractClassname?: boolean
  extractedClassNames?: string
  align?: 'center' | 'start' | 'end'
  description?: string
  hideCode?: boolean
  showSettings?: boolean
}

type CodeFragmentProps = {
  'data-rehype-pretty-code-fragment'?: unknown
  children?: React.ReactNode
}

type CopyValueProps = {
  __rawString__?: string
  value?: string
}

function getCodeStringFromFragment(codeNode: React.ReactElement | undefined): string | null {
  if (!codeNode || !React.isValidElement<CodeFragmentProps>(codeNode)) {
    return null
  }

  if (typeof codeNode.props['data-rehype-pretty-code-fragment'] === 'undefined') {
    return null
  }

  const fragmentChildren = React.Children.toArray(codeNode.props.children)
  const copyNode = fragmentChildren[1]

  if (!copyNode || !React.isValidElement<CopyValueProps>(copyNode)) {
    return null
  }

  return copyNode.props.value ?? copyNode.props.__rawString__ ?? null
}

export function ComponentPreview({
  name,
  children,
  className,
  extractClassname,
  extractedClassNames,
  align = 'center',
  description,
  hideCode = false,
  showSettings = false,
  ...props
}: IComponentPreviewProps) {
  const Codes = React.Children.toArray(children) as React.ReactElement[]
  const Code = Codes[0]
  const registryIndex = useRegistryIndex()

  const Preview = React.useMemo(() => {
    if (!registryIndex) {
      return (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
          Registry index is not configured for this docs app.
        </div>
      )
    }

    const Component = registryIndex[name]?.component

    if (!Component) {
      return (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
          Component{' '}
          <code className="relative mx-1 rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{name}</code> not
          found in registry.
        </div>
      )
    }

    return <Component />
  }, [name, registryIndex])

  const codeString = React.useMemo(() => {
    return getCodeStringFromFragment(Code)
  }, [Code])

  return (
    <div
      className={cn('group relative my-4 flex flex-col [&_div[data-slot="placeholder"]]:h-[512px]', className)}
      {...props}>
      <Tabs className="relative mr-auto w-full" defaultValue="preview">
        <div className="flex items-center justify-between">
          {!hideCode && (
            <TabsList className="w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0 [&_button]:shadow-none">
              {TABS.map((tab) => (
                <TabsTrigger
                  className="cursor-pointer rounded-none border-b-[2px] border-b-transparent px-12 py-2 [&[aria-selected='true']]:border-b-primary [&[aria-selected='true']]:shadow-none"
                  key={tab.value}
                  value={tab.value}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>
        <TabsContent className="relative min-w-2/5 rounded-md border" value="preview">
          <div className="absolute flex w-full items-center justify-between p-3">
            <span className="text-muted-foreground text-sm">{}</span>
            <div className="flex items-center gap-2">
              <CopyButton value={codeString ?? ''} variant="outline" />
            </div>
          </div>
          <div
            className={cn('preview flex h-[502px] w-full justify-center overflow-auto p-10', {
              'items-center': align === 'center',
              'items-end': align === 'end',
              'items-start': align === 'start',
            })}
            duck-preview="">
            <React.Suspense
              fallback={
                <output
                  aria-live="polite"
                  className="flex h-full w-full items-center justify-center gap-2 text-muted-foreground text-sm">
                  <Icons.spinner aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Loading...
                </output>
              }>
              {Preview}
            </React.Suspense>
          </div>
        </TabsContent>
        <TabsContent
          className="[&_[data-rehype-pretty-code-fragment]]:!m-0 relative mt-2 [&>div>div>button]:top-3 [&>div>div>button]:right-3 [&>div>div]:mb-0 [&>div]:rounded-lg [&>div]:border [&>div]:bg-muted/40 [&_pre]:h-[502px]"
          value="code">
          {Code}
        </TabsContent>
        <BuildTab />
      </Tabs>
    </div>
  )
}

export const BuildTab = () => {
  return (
    <TabsContent className="relative overflow-hidden" value="build">
      <div className="relative h-[500px] overflow-hidden rounded-lg">
        <Image alt="build" className="object-cover" fill sizes="100vw" src="/builder.png" />
      </div>

      <div className="absolute inset-0 top-0 left-0 flex h-[500px] flex-col items-center justify-center gap-4 rounded-md bg-zinc-700/10 px-4 py-2 backdrop-blur-sm dark:bg-zinc-700/50">
        <div className="flex items-center gap-4">
          <Button className="rounded-sm font-bold" size={'sm'}>
            <Crown aria-hidden="true" />
            <span>Coming soon</span>
          </Button>
        </div>
      </div>
    </TabsContent>
  )
}

export const TABS = [
  {
    name: 'Preview',
    value: 'preview',
  },
  {
    name: 'Code',
    value: 'code',
  },
  // {
  //   name: 'Benchmark',
  //   value: 'benchmark',
  // },
]
