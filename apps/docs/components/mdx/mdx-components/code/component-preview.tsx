'use client'

import * as React from 'react'
import { DuckLazy } from '@duck/lazy/lazy-component'
import { Index } from '~/__ui_registry__'
import { Crown, TriangleAlert } from 'lucide-react'
import { Button } from '@duck/registry-ui-duckui/button'

import { cn } from '@duck/libs/cn'
import { CopyButton } from '~/components/copy-button'
import { Icons } from '~/components/icons'
import { ThemeWrapper } from '~/components/theme-wrapper'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@duck/registry-ui-duckui/tabs'
import Image from 'next/image'

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
    //@ts-ignore
    const Component = Index[name]?.component

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component{' '}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{' '}
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
    <DuckLazy
      className={cn(
        'group relative my-4 flex flex-col space-y-2 [&_div[data-slot="placeholder"]]:h-[512px]',
        className,
      )}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          {!hideCode && (
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 overflow-x-auto [&_button]:shadow-none">
              {TABS.map((tab) => (
                <TabsTrigger
                  value={tab.value}
                  className="data-[state=active]:bg-secondary data-[state=active]:text-primary border-b-transparent data-[state=active]:border-b-primary px-12 py-2 border-b-[2px] rounded-none cursor-pointer"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>
        <TabsContent value="preview" className="relative rounded-md border">
          <div className="flex items-center justify-between p-4 absolute w-full">
            <span className="text-sm text-muted-foreground">{}</span>
            <div className="flex items-center gap-2">
              <CopyButton value={codeString} variant="outline" />
            </div>
          </div>
          <ThemeWrapper defaultTheme="zinc">
            <div
              className={cn(
                'preview flex min-h-[450px] w-full justify-center p-10',
                {
                  'items-center': align === 'center',
                  'items-start': align === 'start',
                  'items-end': align === 'end',
                },
              )}
            >
              <React.Suspense
                fallback={
                  <div className="flex w-full items-center justify-center text-sm text-muted-foreground">
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                }
              >
                {Preview}
              </React.Suspense>
            </div>
          </ThemeWrapper>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[450px] [&_pre]:overflow-auto">
              {Code}
            </div>
          </div>
        </TabsContent>
        <BuildTab />
      </Tabs>
    </DuckLazy>
  )
}

export const BuildTab = () => {
  return (
    <TabsContent value="build" className="relative overflow-hidden">
      <div className="h-[450px] overflow-hidden rounded-lg">
        <img src="/builder.png" alt="build" className="object-cover" />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 bg-zinc-700/30 dark:bg-zinc-700/50 rounded-md px-4 py-2 backdrop-blur-sm absolute h-[450px] top-0 left-0 inset-0">
        <div className="flex items-center gap-4">
          <Button
            className="font-bold"
            size={'xs'}
            label={{
              children: (
                <div className="text-center">
                  Know more about me click me! <br /> BTW i am coming soon...
                </div>
              ),
              showLabel: true,
              side: 'top',
            }}
          >
            <Crown />
            <span>Upgrade</span>
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
  {
    name: 'Build',
    value: 'build',
  },
]
