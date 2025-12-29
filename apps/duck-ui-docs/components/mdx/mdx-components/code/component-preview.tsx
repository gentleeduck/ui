'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { Crown } from 'lucide-react'
import * as React from 'react'
import { Index } from '~/__ui_registry__'
import { CopyButton } from '~/components/copy-button'
import { Icons } from '~/components/icons'

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  extractClassname?: boolean
  extractedClassNames?: string
  align?: 'center' | 'start' | 'end'
  description?: string
  hideCode?: boolean
  showSettings?: boolean
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
}: ComponentPreviewProps) {
  const Codes = React.Children.toArray(children) as React.ReactElement[]
  const Code = Codes[0]

  const Preview = React.useMemo(() => {
    const Component = Index[name]?.component

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{name}</code>{' '}
          not found in registry.
        </p>
      )
    }

    return <Component />
  }, [name])

  const codeString = React.useMemo(() => {
    if (
      // ! FIX:
      //  @ts-expect-error 'Code.props' is of type 'unknown'.ts(18046)
      typeof Code?.props['data-rehype-pretty-code-fragment'] !== 'undefined'
    ) {
      const Button = React.Children.toArray(
        // ! FIX:
        //  @ts-expect-error Property 'children' does not exist on type '{}'.ts(2339)
        Code.props.children,
      ) as React.ReactElement[]
      // ! FIX:
      //  @ts-expect-error Property '__rawString__' does not exist on type '{}'.ts(2339)
      return Button[1]?.props?.value || Button[1]?.props?.__rawString__ || null
    }
  }, [Code])

  return (
    <div
      className={cn('group relative my-4 flex flex-col [&_div[data-slot="placeholder"]]:h-[512px]', className)}
      {...props}>
      <Tabs className="relative mr-auto w-full" defaultValue="preview">
        <div className="flex items-center justify-between">
          {!hideCode && (
            <TabsList className="w-full justify-start border-b bg-transparent p-0 rounded-none overflow-x-auto [&_button]:shadow-none">
              {TABS.map((tab, idx) => (
                <TabsTrigger
                  className="border-b-transparent rounded-none [&[aria-selected='true']]:border-b-primary px-12 py-2 border-b-[2px] cursor-pointer [&[aria-selected='true']]:shadow-none [&_input]:focus-visible:ring-transparent [&_input]:focus-visible:shadow-none [&_input]:focus-visible:ring-offset-0"
                  key={idx}
                  value={tab.value}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>
        <TabsContent className="relative rounded-md border min-w-2/5" value="preview">
          <div className="flex items-center justify-between p-4 absolute w-full">
            <span className="text-sm text-muted-foreground">{}</span>
            <div className="flex items-center gap-2">
              <CopyButton value={codeString} variant="outline" />
            </div>
          </div>
          <div
            className={cn('preview flex h-[500px] w-full justify-center overflow-auto p-10', {
              'items-center': align === 'center',
              'items-end': align === 'end',
              'items-start': align === 'start',
            })}
            duck-preview="">
            <React.Suspense
              fallback={
                <div className="flex w-full items-center justify-center text-sm text-muted-foreground">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              }>
              {Preview}
            </React.Suspense>
          </div>
        </TabsContent>
        <TabsContent
          className="mt-2 [&_[data-rehype-pretty-code-fragment]]:!m-0 [&>div>div]:mb-0 [&_pre]:h-[502px] relative [&>div>div>button]:top-3 [&>div>div>button]:right-3 [&>div]:bg-muted/40 [&>div]:rounded-lg [&>div]:border"
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
      <div className="h-[500px] overflow-hidden rounded-lg">
        <img alt="build" className="object-cover" src="/builder.png" />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 bg-zinc-700/10 dark:bg-zinc-700/50 rounded-md px-4 py-2 backdrop-blur-sm absolute h-[500px] top-0 left-0 inset-0">
        <div className="flex items-center gap-4">
          <Button className="font-bold rounded-sm" size={'sm'}>
            <Crown />
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
