```tsx title="components/tabs-1.tsx"
// import from your project: import Demo from '@/components/tabs-1'
import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs className="w-[400px]" defaultValue="account">
        <TabsList>
          <TabsTrigger className="w-full" value="account">
            Account
          </TabsTrigger>
          <TabsTrigger className="w-full" value="password">
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">Name</Label>
                <Input defaultValue="Pedro Duarte" id="tabs-demo-name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Username</Label>
                <Input defaultValue="@peduarte" id="tabs-demo-username" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Current password</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">New password</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## Philosophy

Tabs organize content into parallel views  -  only one is visible at a time, but all are equally important. We keep the component controlled-optional (works with or without state management) because simple use cases shouldn't pay the complexity tax. The TabsList/TabsTrigger/TabsContent split keeps styling separate from behavior.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add tabs
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
```

```tsx
<Tabs
  defaultValue="account"
  className="w-[400px]"
>
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>
```

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/tabs-2.tsx"
// import from your project: import Demo from '@/components/tabs-2'
import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs className="w-full" defaultValue="account" dir="rtl">
        <TabsList>
          <TabsTrigger className="w-full" value="account">
            {'الحساب'}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="password">
            {'كلمة المرور'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{'الحساب'}</CardTitle>
              <CardDescription>{'قم بإجراء تغييرات على حسابك هنا. انقر حفظ عند الانتهاء.'}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">{'الاسم'}</Label>
                <Input defaultValue="أحمد محمد" id="tabs-demo-name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">{'اسم المستخدم'}</Label>
                <Input defaultValue="@ahmad" id="tabs-demo-username" />
              </div>
            </CardContent>
            <CardFooter className="justify-start">
              <Button>{'حفظ التغييرات'}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{'كلمة المرور'}</CardTitle>
              <CardDescription>{'غيّر كلمة مرورك هنا. بعد الحفظ، سيتم تسجيل خروجك.'}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">{'كلمة المرور الحالية'}</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">{'كلمة المرور الجديدة'}</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter className="justify-start">
              <Button>{'حفظ كلمة المرور'}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionTabs`, `MotionTabsList`, `MotionTabsTrigger`, and `MotionTabsContent` for a sliding active indicator and direction-aware content crossfade powered by [motion](https://motion.dev). The indicator slides between tabs via `layoutId` and content panels fade with a directional shift.

```tsx title="components/tabs-3.tsx"
// import from your project: import Demo from '@/components/tabs-3'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import {
  MotionTabs,
  MotionTabsContent,
  MotionTabsContents,
  MotionTabsList,
  MotionTabsTrigger,
} from '@gentleduck/registry-ui/tabs'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <MotionTabs className="w-[400px]" defaultValue="account">
        <MotionTabsList>
          <MotionTabsTrigger className="w-full" value="account">
            Account
          </MotionTabsTrigger>
          <MotionTabsTrigger className="w-full" value="password">
            Password
          </MotionTabsTrigger>
        </MotionTabsList>
        <MotionTabsContents>
          <MotionTabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-motion-name">Name</Label>
                  <Input defaultValue="Pedro Duarte" id="tabs-motion-name" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-motion-username">Username</Label>
                  <Input defaultValue="@peduarte" id="tabs-motion-username" />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </MotionTabsContent>
          <MotionTabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-motion-current">Current password</Label>
                  <Input id="tabs-motion-current" type="password" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-motion-new">New password</Label>
                  <Input id="tabs-motion-new" type="password" />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </MotionTabsContent>
        </MotionTabsContents>
      </MotionTabs>
    </div>
  )
}
```

### Segmented Control

A pill-shaped segmented control with a sliding indicator and disabled tab support.

```tsx title="components/tabs-4.tsx"
// import from your project: import Demo from '@/components/tabs-4'
'use client'

import {
  MotionTabs,
  MotionTabsContent,
  MotionTabsContents,
  MotionTabsList,
  MotionTabsTrigger,
} from '@gentleduck/registry-ui/tabs'

const visitors = [
  { page: '/dashboard', views: 1423, uniques: 892, bounce: '32%' },
  { page: '/pricing', views: 987, uniques: 654, bounce: '45%' },
  { page: '/docs', views: 756, uniques: 523, bounce: '28%' },
]

const activity = [
  { action: 'Deployed v2.4.1', user: 'Sarah', time: '2m ago' },
  { action: 'Merged PR #847', user: 'James', time: '18m ago' },
  { action: 'Upgraded to Team', user: 'Alex', time: '1h ago' },
]

export default function Demo() {
  return (
    <div className="flex h-full w-full max-w-md flex-col items-start gap-8 pt-16">
      <MotionTabs className="w-full" defaultValue="analytics">
        <MotionTabsList className="grid w-full grid-cols-3 rounded-full bg-muted p-1">
          <MotionTabsTrigger className="rounded-full" value="overview">
            Overview
          </MotionTabsTrigger>
          <MotionTabsTrigger className="rounded-full" value="analytics">
            Analytics
          </MotionTabsTrigger>
          <MotionTabsTrigger className="rounded-full" value="history" disabled>
            History
          </MotionTabsTrigger>
        </MotionTabsList>
        <MotionTabsContents>
          <MotionTabsContent value="overview">
            <div className="space-y-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <h3 className="font-semibold text-sm">Project Overview</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border p-2.5">
                  <p className="text-muted-foreground text-xs">Uptime</p>
                  <p className="font-bold text-lg">99.98%</p>
                </div>
                <div className="rounded-md border p-2.5">
                  <p className="text-muted-foreground text-xs">Latency</p>
                  <p className="font-bold text-lg">45ms</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-medium text-muted-foreground text-xs">Recent</h4>
                {activity.map((item) => (
                  <div
                    key={item.time}
                    className="flex items-center justify-between rounded-md bg-muted/50 px-2.5 py-1.5">
                    <div>
                      <p className="text-xs">{item.action}</p>
                      <p className="text-[10px] text-muted-foreground">{item.user}</p>
                    </div>
                    <p className="shrink-0 text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </MotionTabsContent>
          <MotionTabsContent value="analytics">
            <div className="space-y-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <h3 className="font-semibold text-sm">Analytics</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-muted p-2.5 text-center">
                  <p className="font-bold text-lg">24.5k</p>
                  <p className="text-[10px] text-muted-foreground">Visitors</p>
                </div>
                <div className="rounded-md bg-muted p-2.5 text-center">
                  <p className="font-bold text-lg">12.1k</p>
                  <p className="text-[10px] text-muted-foreground">Views</p>
                </div>
                <div className="rounded-md bg-muted p-2.5 text-center">
                  <p className="font-bold text-lg">3.2%</p>
                  <p className="text-[10px] text-muted-foreground">CVR</p>
                </div>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 border-b px-2.5 py-1.5 font-medium text-[10px] text-muted-foreground">
                  <span>Page</span>
                  <span className="text-right">Views</span>
                  <span className="text-right">Uniques</span>
                  <span className="text-right">Bounce</span>
                </div>
                {visitors.map((row) => (
                  <div key={row.page} className="grid grid-cols-4 border-b px-2.5 py-1.5 text-xs last:border-0">
                    <span className="truncate font-mono text-[10px]">{row.page}</span>
                    <span className="text-right">{row.views.toLocaleString()}</span>
                    <span className="text-right">{row.uniques.toLocaleString()}</span>
                    <span className="text-right">{row.bounce}</span>
                  </div>
                ))}
              </div>
            </div>
          </MotionTabsContent>
          <MotionTabsContent value="history">
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <h3 className="font-semibold text-sm">History</h3>
              <p className="mt-1 text-muted-foreground text-xs">Audit log is available on the Team plan.</p>
            </div>
          </MotionTabsContent>
        </MotionTabsContents>
      </MotionTabs>
    </div>
  )
}
```

}>
Requires the `motion` package. Replace `Tabs` with `MotionTabs`, `TabsList` with `MotionTabsList`, `TabsTrigger` with `MotionTabsTrigger`, and `TabsContent` with `MotionTabsContent`. Wrap content panels in `MotionTabsContents` for coordinated directional slide animations.

## API Reference

### Tabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled active tab value. Must be used alongside `onValueChange` |
| `defaultValue` | `string` | - | Uncontrolled initial tab value |
| `onValueChange` | `(value: string) => void` | - | Callback fired when the active tab changes |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `...props` | `Omit<React.HTMLProps<HTMLDivElement>, 'defaultValue'>` | - | Additional props to spread to the content div |

### TabsList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | `TabsTrigger` elements |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the container div (renders with `role="tablist"`) |

### TabsTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | A unique value that identifies this tab trigger |
| `defaultChecked` | `boolean` | - | If true, sets this tab as the default active tab on first render |
| `disabled` | `boolean` | - | Disables the tab trigger from user interaction |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Label or node to render inside the tab |
| `...props` | `React.HTMLProps<HTMLButtonElement>` | - | Additional props to spread to the button element |

### TabsContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | The associated value that matches a `TabsTrigger` |
| `forceMount` | `boolean` | `false` | If true, the content stays mounted in the DOM even when hidden |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Tab panel content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionTabs

Replaces `Tabs`. Tracks tab order for directional content animation. Uses `domMax` for layout animations. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `TabsProps` | - | All props from `Tabs` are supported |

### MotionTabsList

Replaces `TabsList`. Wraps with `LayoutGroup` for shared `layoutId` indicator animation. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `TabsListProps` | - | All props from `TabsList` are supported |

### MotionTabsTrigger

Replaces `TabsTrigger`. Adds sliding `layoutId` indicator and disabled tab shake feedback. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `Omit<TabsTriggerProps, 'onDrag' \| 'onDragStart' \| 'onDragEnd' \| 'onAnimationStart'>` | - | All props from `TabsTrigger` except motion event handlers |

### MotionTabsContents

Wrapper around all `MotionTabsContent` panels. Provides a single `AnimatePresence` with overflow-hidden for directional slide animation. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | `MotionTabsContent` elements |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the container div |

### MotionTabsContent

Individual tab panel inside `MotionTabsContents`. Renders content with proper ARIA attributes. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | The associated value that matches a `MotionTabsTrigger` |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Tab panel content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |