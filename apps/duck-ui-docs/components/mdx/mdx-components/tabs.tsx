import { cn } from '@gentleduck/libs/cn'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'

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
        "border-b-transparent rounded-none [&[aria-selected='true']]:border-b-primary px-12 py-2 border-b-[2px] cursor-pointer [&[aria-selected='true']]:shadow-none font-semibold",
        className,
      )}
      {...props}
    />
  )
}

export function TabContent({ className, ...props }: React.ComponentProps<typeof TabsContent>) {
  return (
    <TabsContent
      className={cn('relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold', className)}
      {...props}
    />
  )
}
