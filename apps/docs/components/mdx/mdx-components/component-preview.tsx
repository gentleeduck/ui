'use client'

import * as React from 'react'
import { Index } from '~/__ui_registry__'

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
    <div
      className={cn('group relative my-4 flex flex-col space-y-2', className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          {!hideCode && (
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 overflow-x-auto">
              <TabsTrigger
                value="preview"
                className="data-[state=active]:text-primary border-b-transparent data-[state=active]:border-b-primary px-12 py-2 border-b-[3px] rounded-none"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="data-[state=active]:text-primary border-b-transparent data-[state=active]:border-b-primary px-12 py-2 border-b-[3px] rounded-none"
              >
                Code
              </TabsTrigger>
              <TabsTrigger
                value="build"
                className="data-[state=active]:text-primary border-b-transparent data-[state=active]:border-b-primary px-12 py-2 border-b-[3px] rounded-none"
              >
                Build
              </TabsTrigger>
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
    </div>
  )
}
import { Crown, TriangleAlert } from 'lucide-react'
import { Button } from '@duck/registry-ui-duckui/button'

export const BuildTab = () => {
  return (
    <TabsContent value="build" className="relative overflow-hidden">
      <div className="h-[450px]">
        llorem asdlkfajs;dflk asd;lfk jasd;lfk jasd;lkfj as;ldkfjas;dlkfj
        a;sldkfj a;sldkf jasdlkfnjpowadifjpnqwemo ijpqweoc im,qwpoiuhfp,o
        wgfhasodifj maspdlkfj poiqwaesf hmlorem asdlkfajs;dflk asd;lfk jasd;lfk
        jasd;lkfj as;ldkfjas;dlkfj a;sldkfj a;sldkf jasdlkfnjpowadifjpnqwemo
        ijpqweoc im,qwpoiuhfp,o wgfhasodifj maspdlkfj poiqwaesf hmlorem
        asdlkfajs;dflk asd;lfk jasd;lfk jasd;lkfj as;ldkfjas;dlkfj a;sldkfj
        a;sldkf jasdlkfnjpowadifjpnqwemo ijpqweoc im,qwpoiuhfp,o wgfhasodifj
        maspdlkfj poiqwaesf hmorem asdlkfajs;dflk asd;lfk jasd;lfk jasd;lkfj
        as;ldkfjas;dlkfj a;sldkfj a;sldkf jasdlkfnjpowadifjpnqwemo ijpqweoc
        im,qwpoiuhfp,o wgfhasodifj maspdlkfj poiqwaesf hm
      </div>
      <div className="flex flex-col items-center justify-center gap-4 bg-zinc-700/50 rounded-md px-4 py-2 backdrop-blur-sm absolute h-[450px] top-0 left-0 inset-0">
        <div className="flex items-center gap-4">
          <Button
            className="font-bold"
            size={'xs'}
            label={{
              children: (
                <div className="w-[500px] font-mono p-2">
                  design custom components, layouts, or full websites, and
                  export production-ready code. Includes real-time TypeScript,
                  API integration (REST/GraphQL), CI/CD templates, and a
                  customizable design system. Perfect for building dashboards or
                  full-stack apps. Upgrade now!
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
