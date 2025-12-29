'use client'

import { cn } from '@gentleduck/libs/cn'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import * as React from 'react'
import { CopyButton, CopyWithClassNames } from '~/components/copy-button'

interface ComponentExampleProps extends React.HTMLAttributes<HTMLDivElement> {
  extractClassname?: boolean
  extractedClassNames?: string
  align?: 'center' | 'start' | 'end'
  src?: string
}

export function ComponentExample({
  children,
  className,
  extractClassname,
  extractedClassNames,
  align = 'center',
  src: _,
  ...props
}: ComponentExampleProps) {
  const [Example, Code, ...Children] = React.Children.toArray(
    children,
    // ! FIX: remove type any
  ) as React.ReactElement<any>[]
  const codeString = React.useMemo(() => {
    if (typeof Code?.props['data-rehype-pretty-code-fragment'] !== 'undefined') {
      const [, Button] = React.Children.toArray(Code.props.children) as React.ReactElement[]
      // ! FIX: remove type any
      return (Button?.props as any)?.value || (Button?.props as any)?.__rawString__ || null
    }
  }, [Code])

  return (
    <div className={cn('group relative my-4 flex flex-col space-y-2', className)} {...props}>
      <Tabs className="relative mr-auto w-full" defaultValue="preview">
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-2">
            <TabsTrigger
              className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pt-2 pb-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="preview">
              Preview
            </TabsTrigger>
            <TabsTrigger
              className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pt-2 pb-3 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="code">
              Code
            </TabsTrigger>
          </TabsList>
          {extractedClassNames ? (
            // @ts-ignore
            <CopyWithClassNames
              className="absolute top-20 right-4"
              classNames={extractedClassNames}
              value={codeString}
            />
          ) : (
            codeString && <CopyButton className="absolute top-20 right-4" value={codeString} />
          )}
        </div>
        <TabsContent className="rounded-md border" value="preview">
          <div
            className={cn('flex min-h-[350px] justify-center p-10', {
              'items-center': align === 'center',
              'items-end': align === 'end',
              'items-start': align === 'start',
            })}>
            {Example}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_button]:hidden [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              {Code}
            </div>
            {Children?.length ? (
              <div className="rounded-md [&_button]:hidden [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
                {Children}
              </div>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
