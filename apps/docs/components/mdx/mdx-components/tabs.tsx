import { cn } from '@gentelduck/libs/cn'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@gentelduck/registry-ui-duckui/tabs'

export function Tab({
  className,
  ...props
}: React.ComponentProps<typeof Tabs>) {
  return (
    <Tabs
      className={cn('relative mt-6 w-full', className)}
      {...props}
    />
  )
}

export function TabList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      className={cn(
        'w-full justify-start rounded-none border-b bg-transparent p-0',
        className
      )}
      {...props}
    />
  )
}
export function TabTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        'relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none',
        className
      )}
      {...props}
    />
  )
}

export function TabContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsContent>) {
  return (
    <TabsContent
      className={cn(
        'relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold',
        className
      )}
      {...props}
    />
  )
}
