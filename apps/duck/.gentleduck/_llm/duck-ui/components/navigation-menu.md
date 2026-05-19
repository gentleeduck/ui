```tsx title="components/navigation-menu-1.tsx"
// import from your project: import Demo from '@/components/navigation-menu-1'
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
} from '@gentleduck/registry-ui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

const components: { title: string; href: string; description: string }[] = [
  {
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    href: '/docs/components/alert-dialog',
    title: 'Alert Dialog',
  },
  {
    description: 'For sighted users to preview content available behind a link.',
    href: '/docs/components/hover-card',
    title: 'Hover Card',
  },
  {
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    href: '/docs/components/progress',
    title: 'Progress',
  },
  {
    description: 'Visually or semantically separates content.',
    href: '/docs/components/scroll-area',
    title: 'Scroll-area',
  },
  {
    description: 'A set of layered sections of content -- known as tab panels -- that are displayed one at a time.',
    href: '/docs/components/tabs',
    title: 'Tabs',
  },
  {
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    href: '/docs/components/tooltip',
    title: 'Tooltip',
  },
]

export default function Demo() {
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
                <ListItem href="/docs/components/typography" title="Typography">
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

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
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
ListItem.displayName = 'ListItem'
```

## Philosophy

Navigation menus serve a different purpose than dropdown menus  -  they're for wayfinding, not actions. The distinction matters for accessibility: navigation menus use `

## Link

You can use the `asChild` prop to make another component look like a navigation menu trigger. Here's an example of a link that looks like a navigation menu trigger.

```tsx showLineNumbers title="components/example-navigation-menu.tsx"
import Link from "next/link"

export function NavigationMenuDemo() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link href="/www">Documentation</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}
```

## RTL Support

Set `dir="rtl"` on `NavigationMenu` for a local override, or set `DirectionProvider` once at app/root level for global direction.

```tsx title="components/navigation-menu-2.tsx"
// import from your project: import Demo from '@/components/navigation-menu-2'
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
} from '@gentleduck/registry-ui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

const components: { title: string; href: string; description: string }[] = [
  {
    description: 'نافذة حوار تقاطع المستخدم بمحتوى مهم وتتطلب استجابة.',
    href: '/docs/components/alert-dialog',
    title: 'نافذة التنبيه',
  },
  {
    description: 'لمعاينة المحتوى المتاح خلف رابط للمستخدمين المبصرين.',
    href: '/docs/components/hover-card',
    title: 'بطاقة التمرير',
  },
  {
    description: 'يعرض مؤشرا يوضح تقدم اكتمال مهمة، وعادة ما يظهر كشريط تقدم.',
    href: '/docs/components/progress',
    title: 'شريط التقدم',
  },
  {
    description: 'يفصل المحتوى بصريا او دلاليا.',
    href: '/docs/components/scroll-area',
    title: 'منطقة التمرير',
  },
  {
    description: 'مجموعة من اقسام المحتوى المتراكبة -- المعروفة بلوحات التبويب -- تعرض واحدة في كل مرة.',
    href: '/docs/components/tabs',
    title: 'التبويبات',
  },
  {
    description: 'نافذة منبثقة تعرض معلومات متعلقة بعنصر عند تركيز لوحة المفاتيح عليه او تمرير الفأرة فوقه.',
    href: '/docs/components/tooltip',
    title: 'تلميح الادوات',
  },
]

export default function Demo() {
  return (
    <NavigationMenu dir="rtl">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>البدء</NavigationMenuTrigger>
          <NavigationMenuContent className="md:right-auto md:left-0">
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
                    مكونات مصممة بعناية يمكنك نسخها ولصقها في تطبيقاتك. سهلة الوصول. قابلة للتخصيص. مفتوحة المصدر.
                  </p>
                </a>
              </NavigationMenuLink>
              <div className="flex flex-col gap-2">
                <ListItem href="/docs" title="مقدمة">
                  مكونات قابلة لاعادة الاستخدام مبنية باستخدام Radix UI و Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="التثبيت">
                  كيفية تثبيت التبعيات وهيكلة تطبيقك.
                </ListItem>
                <ListItem href="/docs/components/typography" title="الخطوط">
                  انماط العناوين والفقرات والقوائم...الخ
                </ListItem>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>المكونات</NavigationMenuTrigger>
          <NavigationMenuContent className="md:right-auto md:left-0">
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
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>التوثيق</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
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
ListItem.displayName = 'ListItem'
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionNavigationMenu` for a spring-powered entrance animation with blur powered by [motion](https://motion.dev).

```tsx title="components/navigation-menu-3.tsx"
// import from your project: import Demo from '@/components/navigation-menu-3'
'use client'

import { cn } from '@gentleduck/libs/cn'
import {
  MotionNavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@gentleduck/registry-ui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

const components: { title: string; href: string; description: string }[] = [
  {
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    href: '/docs/components/alert-dialog',
    title: 'Alert Dialog',
  },
  {
    description: 'For sighted users to preview content available behind a link.',
    href: '/docs/components/hover-card',
    title: 'Hover Card',
  },
  {
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    href: '/docs/components/progress',
    title: 'Progress',
  },
  {
    description: 'Visually or semantically separates content.',
    href: '/docs/components/scroll-area',
    title: 'Scroll-area',
  },
  {
    description: 'A set of layered sections of content -- known as tab panels -- that are displayed one at a time.',
    href: '/docs/components/tabs',
    title: 'Tabs',
  },
  {
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    href: '/docs/components/tooltip',
    title: 'Tooltip',
  },
]

export default function Demo() {
  return (
    <MotionNavigationMenu>
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
                <ListItem href="/docs/components/typography" title="Typography">
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
    </MotionNavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
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
ListItem.displayName = 'ListItem'
```

}>
  Requires the `motion` package. Use `MotionNavigationMenu` instead of `NavigationMenu`. All other sub-components stay the same.

## API Reference

### NavigationMenu

Root container that wraps the navigation menu and optionally renders the viewport.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled value of the active menu item |
| `defaultValue` | `string` | - | Default active value for uncontrolled usage |
| `onValueChange` | `(value: string) => void` | - | Callback when the active value changes |
| `viewport` | `boolean` | `true` | Whether to render the `NavigationMenuViewport` automatically |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`) and inherited by descendants. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the menu |
| `delayDuration` | `number` | `200` | Duration in ms from when the pointer enters a trigger until the content opens |
| `skipDelayDuration` | `number` | `300` | Duration in ms a user has to enter another trigger without incurring a delay again |
| `className` | `string` | - | Additional CSS classes for the root element |
| `children` | `React.ReactNode` | - | Navigation menu list and other elements |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>` | - | Additional props inherited from `NavigationMenu.Root`. |

### NavigationMenuList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the list element |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>` | - | Additional props inherited from `NavigationMenu.List`. |

### NavigationMenuItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the menu item |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>` | - | Additional props inherited from `NavigationMenu.Item`. |

### NavigationMenuTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the trigger |
| `children` | `React.ReactNode` | `--` | Trigger label content. A chevron icon is appended automatically |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>` | - | Additional props inherited from `NavigationMenu.Trigger`. |

### NavigationMenuContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the content panel |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>` | - | Additional props inherited from `NavigationMenu.Content`. |

### NavigationMenuLink

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the link |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>` | - | Additional props inherited from `NavigationMenu.Link`. |

### NavigationMenuViewport

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the viewport |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>` | - | Additional props inherited from `NavigationMenu.Viewport`. |

### NavigationMenuIndicator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the indicator |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>` | - | Additional props inherited from `NavigationMenu.Indicator`. |

### navigationMenuTriggerStyle

A `cva` variant function that returns the default trigger styling classes. Use it to style non-trigger elements (e.g. plain links) to match the trigger appearance.

```tsx
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

<NavigationMenuLink className={navigationMenuTriggerStyle()}>
  Documentation
</NavigationMenuLink>
```

### MotionNavigationMenu

Same props as `NavigationMenu`. Adds spring scaleIn+blur entrance animation via motion. Requires the `motion` package.