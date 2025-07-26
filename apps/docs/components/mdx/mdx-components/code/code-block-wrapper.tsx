import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui-duckui/collapsible'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string
}

export function CodeBlockWrapper({ expandButtonTitle = 'View Code', className, children, ...props }: CodeBlockProps) {
  const [isOpened, setIsOpened] = React.useState(false)
  console.log(children)

  return (
    <Tabs defaultValue="account" listValues={['account', 'password']}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">asdfasdf</TabsContent>
      <TabsContent value="password">asfasdf</TabsContent>
    </Tabs>
  )

  // return children
  // <Collapsible open={isOpened} onOpenChange={setIsOpened} className="overflow-hidden">
  //   <div className={cn('relative overflow-hidden rounded-md border', className)} {...props}>
  //     <CollapsibleContent forceMount className={cn('overflow-hidden will-change-auto', !isOpened && 'max-h-32')}>
  //       <div
  //         className={cn(
  //           '[&_pre]:my-0 [&_pre]:max-h-[650px] [&_div:last-child_pre]:pb-[50px] transition-all',
  //           isOpened
  //             ? '[&_pre]:overflow-auto m-4 [&>div]:border'
  //             : '[&_pre]:overflow-hidden [&_[data-rehype-pretty-code-fragment]]:border-none',
  //         )}>
  //         {children}
  //       </div>
  //     </CollapsibleContent>
  //     <div
  //       className={cn(
  //         'absolute flex items-center justify-center bg-gradient-to-b p-2 rounded-md',
  //         isOpened
  //           ? 'inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-700/50 to-transparent'
  //           : 'inset-0 bg-gradient-to-t from-zinc-800/10 dark:from-zinc-800/40 to-transparent backdrop-blur-[4px]',
  //       )}>
  //       <CollapsibleTrigger asChild>
  //         <Button variant="secondary" className="h-8 text-xs">
  //           {isOpened ? 'Collapse' : expandButtonTitle}
  //         </Button>
  //       </CollapsibleTrigger>
  //     </div>
  //   </div>
  // </Collapsible>
}
