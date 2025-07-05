import { cn } from '@gentleduck/libs/cn'
import { cva } from '@gentleduck/variants'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { Button } from '../button'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

export type NavigationMenuContextType = {
  viewport: boolean
}

const NavigationMenuContext = React.createContext({
  viewport: true,
})

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuContext.Provider value={{ viewport }}>
      <div
        duck-navigation-menu=""
        data-viewport={viewport}
        {...props}
        className={cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', className)}>
        {children}
      </div>
    </NavigationMenuContext.Provider>
  )
  // {viewport && <NavigationMenuViewport />}
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <ul
      duck-navigation-menu-list=""
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  )
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <Popover mouseEnter={true} mouseExist={true}>
      <li duck-navigation-menu-item="" className={cn('relative', className)} {...props} />
    </Popover>
  )
}

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-sm outline-none transition-[color,box-shadow] hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[open=true]:bg-accent/50 data-[open=true]:text-accent-foreground data-[open=true]:focus:bg-accent data-[open=true]:hover:bg-accent',
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <PopoverTrigger
      duck-navigation-menu-trigger=""
      className={cn('group', className)}
      {...props}
      secondIcon={
        <ChevronDownIcon
          aria-hidden="true"
          className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[open=true]:rotate-180"
        />
      }>
      {children}
    </PopoverTrigger>
  )
}

function NavigationMenuContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof PopoverContent>) {
  return (
    <PopoverContent
      side={'bottom'}
      align={'center'}
      duck-navigation-menu-content=""
      className={cn(
        'max-w-[30rem] border-none bg-none p-0',
        // 'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto',
        // 'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[open=true]:animate-in group-data-[viewport=false]/navigation-menu:data-[open=falsed]:animate-out group-data-[viewport=false]/navigation-menu:data-[open=falsed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[open=true]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[open=true]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[open=falsed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className={cn('absolute top-full left-0 isolate z-50 flex justify-center')}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top-center overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=closed]:animate-out data-[state=open]:animate-in md:w-[var(--radix-navigation-menu-viewport-width)]',
          className,
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({ className, ...props }: React.HtmlHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      duck-navigation-menu-link=""
      className={cn(
        "data-[active=true]:hover:bg-accent'size-'])]:size-4 flex flex-col gap-1 rounded-sm p-2 text-sm outline-none transition-all [&_svg:not([class*= hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:focus:bg-accent [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        'data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=visible]:animate-in',
        className,
      )}
      {...props}>
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
