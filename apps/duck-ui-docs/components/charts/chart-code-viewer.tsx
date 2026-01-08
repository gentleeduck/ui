'use client'
import { useMediaQuery } from '@gentleduck/hooks/use-media-query'
import { cn } from '@gentleduck/libs/cn'
import type { Block } from '@gentleduck/registers'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@gentleduck/registry-ui-duckui/drawer'
import { Sheet, SheetContent, SheetTrigger } from '@gentleduck/registry-ui-duckui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { type ComponentProps, useMemo, useState } from 'react'
import { useThemesConfig } from '@gentleduck/docs'
import { BlockCopyButton } from '../blocks'

export function ChartCodeViewer({ chart, className, children }: { chart: Block } & ComponentProps<'div'>) {
  const [tab, setTab] = useState('code')
  const { themesConfig } = useThemesConfig()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const themeCode = useMemo(() => {
    return `\
@layer base {
  :root {
${Object.entries(themesConfig?.activeTheme.cssVars.light || {})
  .map(([key, value]) => `    ${key}: ${value};`)
  .join('\n')}
  }

  .dark {
${Object.entries(themesConfig?.activeTheme.cssVars.dark || {})
  .map(([key, value]) => `    ${key}: ${value};`)
  .join('\n')}
    }
}
`
  }, [themesConfig])

  const button = (
    <Button
      className="h-6 rounded-[6px] border bg-transparent px-2 text-foreground text-xs shadow-none hover:bg-muted dark:text-foreground"
      size="sm"
      variant="outline">
      View Code
    </Button>
  )

  const content = (
    <>
      <div className="chart-wrapper hidden sm:block [&>div]:rounded-none [&>div]:border-0 [&>div]:border-b [&>div]:shadow-none [&_[data-chart]]:mx-auto [&_[data-chart]]:max-h-[35vh]">
        {children}
      </div>
      <Tabs
        className="relative flex h-full flex-1 flex-col overflow-hidden p-4"
        defaultValue="code"
        onValueChange={setTab}
        value={tab}>
        <div className="flex w-full items-center">
          <TabsList className="h-7 w-auto rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)]">
            <TabsTrigger className="h-[1.45rem] rounded-sm px-2 text-xs" value="code">
              Code
            </TabsTrigger>
            <TabsTrigger className="h-[1.45rem] rounded-sm px-2 text-xs" value="theme">
              Theme
            </TabsTrigger>
          </TabsList>
          {tab === 'code' && (
            <div className="ml-auto flex items-center justify-center gap-2">
              <BlockCopyButton code={chart.code} event="copy_chart_code" name={chart.name} />
              {
                // <V0Button
                //   block={{
                //     code: chart.code,
                //     description: chart.description || 'Edit in v0',
                //     name: chart.name,
                //   }}
                //   className="h-7"
                //   id={`v0-button-${chart.name}`}
                // />
              }
            </div>
          )}
          {tab === 'theme' && (
            <BlockCopyButton className="ml-auto" code={themeCode} event="copy_chart_theme" name={chart.name} />
          )}
        </div>
        <TabsContent className="h-full flex-1 flex-col overflow-hidden data-[state=active]:flex" value="code">
          <div className="relative max-h-[44.5vh] overflow-auto rounded-lg bg-zinc-900">
            <div
              className="[&_pre]:!bg-transparent !my-0 w-full overflow-hidden rounded-lg border-none bg-transparent px-2 [&_pre]:overflow-auto [&_pre]:text-sm [&_pre]:leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: chart.highlightedCode,
              }}
              data-rehype-pretty-code-fragment
            />
          </div>
        </TabsContent>
        <TabsContent
          className="h-full flex-1 flex-col overflow-hidden data-[state=active]:flex [&_[data-rehype-pretty-code-fragment]]:my-0"
          value="theme">
          <div className="" data-rehype-pretty-code-fragment="">
            <pre className="relative max-h-[44.5vh] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <code className="relative flex flex-col rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                <span className="line text-zinc-700">{`/* ${themesConfig?.activeTheme.name} */`}</span>
                {themeCode.split('\n').map((line, index) => (
                  <span className="line" key={index}>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )

  if (!isDesktop) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{button}</DrawerTrigger>
        <DrawerContent
          className={cn('flex max-h-[80vh] flex-col sm:max-h-[90vh] [&>div.bg-muted]:shrink-0', className)}>
          <div className="flex h-full flex-col overflow-auto">{content}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{button}</SheetTrigger>
      <SheetContent
        className={cn(
          'flex flex-col gap-0 border-l-0 p-0 sm:max-w-sm md:w-[700px] md:max-w-[700px] dark:border-l',
          className,
        )}
        side="right">
        {content}
      </SheetContent>
    </Sheet>
  )
}
