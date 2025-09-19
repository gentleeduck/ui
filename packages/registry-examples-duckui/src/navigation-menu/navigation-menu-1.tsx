'use client'

import { cn } from '@gentleduck/libs/cn'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@gentleduck/registry-ui-duckui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

const components: { title: string; href: string; description: string }[] = [
  {
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    href: '/docs/primitives/alert-dialog',
    title: 'Alert Dialog',
  },
  {
    description: 'For sighted users to preview content available behind a link.',
    href: '/docs/primitives/hover-card',
    title: 'Hover Card',
  },
  {
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    href: '/docs/primitives/progress',
    title: 'Progress',
  },
  {
    description: 'Visually or semantically separates content.',
    href: '/docs/primitives/scroll-area',
    title: 'Scroll-area',
  },
  {
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    href: '/docs/primitives/tabs',
    title: 'Tabs',
  },
  {
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    href: '/docs/primitives/tooltip',
    title: 'Tooltip',
  },
]

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex gap-3 p-6">
              <NavigationMenuLink asChild className="w-[350px] rounded-md bg-muted">
                <a
                  className="flex h-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/">
                  <Image
                    alt="Logo"
                    className="object-contain"
                    height={100}
                    src="https://zpgqhogoevbgpxustvmo.supabase.co/storage/v1/object/public/produc_imgs/duckui%20(1).png"
                    width={100}
                  />
                  <div className="mt-4 mb-2 font-medium text-lg">duck/ui</div>
                  <p className="text-muted-foreground text-sm leading-tight">
                    Beautifully designed components that you can copy and paste into your apps. Accessible.
                    Customizable. Open Source.
                  </p>
                </a>
              </NavigationMenuLink>
              <div className="flex flex-col gap-2">
                <ListItem href="/docs" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[500px]">
              {components.map((component) => (
                <ListItem href={component.href} key={component.title} title={component.title}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            ref={ref}
            {...props}>
            <div className="font-medium text-sm leading-none">{title}</div>
            <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
