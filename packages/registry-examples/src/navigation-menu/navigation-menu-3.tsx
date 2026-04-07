'use client'

import { cn } from '@gentleduck/libs/cn'
import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@gentleduck/registry-ui/navigation-menu'
import Link from 'next/link'

const components: { title: string; href: string; description: string }[] = [
  { title: 'Alert Dialog', href: '/docs/components/alert-dialog', description: 'A modal dialog for important content.' },
  { title: 'Hover Card', href: '/docs/components/hover-card', description: 'Preview content behind a link.' },
  { title: 'Progress', href: '/docs/components/progress', description: 'Shows task completion progress.' },
  { title: 'Tabs', href: '/docs/components/tabs', description: 'Layered sections displayed one at a time.' },
  { title: 'Tooltip', href: '/docs/components/tooltip', description: 'Info popup on hover or focus.' },
  { title: 'Scroll Area', href: '/docs/components/scroll-area', description: 'Custom scrollable container.' },
]

export default function Demo() {
  return (
    <MotionNavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <MotionNavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              {/* biome-ignore lint/a11y/useValidAnchor: demo link */}
              <MotionNavigationMenuLink asChild index={0}>
                <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                  <div className="font-medium text-sm leading-none">Introduction</div>
                  <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                    Getting started with the component library.
                  </p>
                </a>
              </MotionNavigationMenuLink>
              {/* biome-ignore lint/a11y/useValidAnchor: demo link */}
              <MotionNavigationMenuLink asChild index={1}>
                <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                  <div className="font-medium text-sm leading-none">Installation</div>
                  <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                    How to install and set up your project.
                  </p>
                </a>
              </MotionNavigationMenuLink>
            </ul>
          </MotionNavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <MotionNavigationMenuContent>
            <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
              {components.map((comp, i) => (
                <li key={comp.title}>
                  <MotionNavigationMenuLink asChild index={i}>
                    <a
                      className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                      )}
                      href={comp.href}>
                      <div className="font-medium text-sm leading-none">{comp.title}</div>
                      <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">{comp.description}</p>
                    </a>
                  </MotionNavigationMenuLink>
                </li>
              ))}
            </ul>
          </MotionNavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </MotionNavigationMenu>
  )
}
