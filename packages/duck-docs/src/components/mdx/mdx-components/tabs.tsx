import { cn } from '@gentleduck/libs/cn'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'

export function Tab({ className, ...props }: React.ComponentProps<typeof Tabs>) {
  return <Tabs className={cn('relative mt-6 w-full', className)} {...props} />
}

export function TabList({ className, ...props }: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList className={cn('w-full justify-start rounded-none border-b bg-transparent p-0', className)} {...props} />
  )
}
export function TabTrigger({ className, ...props }: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        'cursor-pointer rounded-none border-b-2 border-b-transparent px-12 py-2 font-semibold aria-selected:border-b-primary aria-selected:shadow-none',
        className,
      )}
      {...props}
    />
  )
}

export function TabContent({ className, ...props }: React.ComponentProps<typeof TabsContent>) {
  return (
    <TabsContent
      className={cn(
        'relative [&>div[data-dmc-fragment]]:relative [&>div[data-dmc-fragment]]:my-3 [&>div[data-dmc-fragment]]:rounded-lg [&>div[data-dmc-fragment]]:bg-muted/40 [&_h3.font-heading]:font-semibold [&_h3.font-heading]:text-base',
        className,
      )}
      {...props}
    />
  )
}
