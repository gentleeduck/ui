```tsx title="components/empty-1.tsx"
// import from your project: import Demo from '@/components/empty-1'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconInbox } from '@tabler/icons-react'
import { ArrowUpRightIcon } from 'lucide-react'

export default function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconInbox />
        </EmptyMedia>
        <EmptyTitle>Your Inbox is Empty</EmptyTitle>
        <EmptyDescription>
          No messages waiting for you. New conversations will show up here when someone reaches out.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Compose Message</Button>
          <Button variant="outline">View Archived</Button>
        </div>
      </EmptyContent>
      <Button asChild className="text-muted-foreground" size="sm" variant="link">
        {/* biome-ignore lint/a11y/useValidAnchor: placeholder href in demo component */}
        <a href="#">
          Manage Preferences <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  )
}
```

## Philosophy

Empty states are opportunities, not dead ends. When there's no data to show, the Empty component turns a blank screen into a call to action. We structure it as header + content because every empty state needs two things: an explanation of why it's empty, and a path forward. The media slot (icon, avatar, illustration) adds emotional tone.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add empty
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/variants
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
```

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon />
    </EmptyMedia>
  </EmptyHeader>
  <EmptyTitle>No data</EmptyTitle>
  <EmptyDescription>No data found</EmptyDescription>
  <EmptyContent>
    <Button>Add data</Button>
  </EmptyContent>
</Empty>
```

## Examples

### Outline

Use the `border` utility class to create a outline empty state.

```tsx title="components/empty-2.tsx"
// import from your project: import Demo from '@/components/empty-2'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconBookmark } from '@tabler/icons-react'

export default function Demo() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBookmark />
        </EmptyMedia>
        <EmptyTitle>No Saved Items</EmptyTitle>
        <EmptyDescription>Bookmark articles, pages, or resources to find them quickly later.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Browse Content
        </Button>
      </EmptyContent>
    </Empty>
  )
}
```

### Background

Use the `bg-*` and `bg-gradient-*` utilities to add a background to the empty state.

```tsx title="components/empty-3.tsx"
// import from your project: import Demo from '@/components/empty-3'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconChartBar } from '@tabler/icons-react'
import { RefreshCcwIcon } from 'lucide-react'

export default function Demo() {
  return (
    <Empty className="h-full bg-gradient-to-b from-30% from-muted/50 to-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconChartBar />
        </EmptyMedia>
        <EmptyTitle>No Analytics Data</EmptyTitle>
        <EmptyDescription>Once your site receives traffic, usage metrics and trends will appear here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          <RefreshCcwIcon />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  )
}
```

### Avatar

Use the `EmptyMedia` component to display an avatar in the empty state.

```tsx title="components/empty-4.tsx"
// import from your project: import Demo from '@/components/empty-4'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'

export default function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Avatar className="size-12">
            <AvatarImage alt="a profile picture for wildduck2" src="https://github.com/wildduck2.png" />
            <AvatarFallback>WD</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>No Activity Yet</EmptyTitle>
        <EmptyDescription>
          This account has no recent activity. Start a conversation or share an update to get things going.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Share Update</Button>
      </EmptyContent>
    </Empty>
  )
}
```

### Avatar Group

Use the `EmptyMedia` component to display an avatar group in the empty state.

```tsx title="components/empty-5.tsx"
// import from your project: import Demo from '@/components/empty-5'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { PlusIcon } from 'lucide-react'

export default function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <div className="flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            <Avatar>
              <AvatarImage alt="collaborator 1" src="https://github.com/wildduck2.png" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage alt="collaborator 2" src="https://github.com/wildduck2.png" />
              <AvatarFallback>JR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage alt="collaborator 3" src="https://github.com/wildduck2.png" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
          </div>
        </EmptyMedia>
        <EmptyTitle>No Collaborators</EmptyTitle>
        <EmptyDescription>Add collaborators to work together on shared documents and tasks.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon />
          Add Collaborator
        </Button>
      </EmptyContent>
    </Empty>
  )
}
```

### InputGroup

You can add an `InputGroup` component to the `EmptyContent` component.

```tsx title="components/empty-6.tsx"
// import from your project: import Demo from '@/components/empty-6'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@gentleduck/registry-ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { Kbd } from '@gentleduck/registry-ui/kbd'
import { SearchIcon } from 'lucide-react'

export default function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No Results Found</EmptyTitle>
        <EmptyDescription>
          We could not find anything matching your query. Try a different search term below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup className="sm:w-3/4">
          <InputGroupInput placeholder="Search for something else..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder href in demo component */}
          Still stuck? <a href="#">Browse all categories</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
```

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/empty-7.tsx"
// import from your project: import Demo from '@/components/empty-7'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconInbox } from '@tabler/icons-react'
import { ArrowUpRightIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div dir="rtl">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconInbox />
          </EmptyMedia>
          <EmptyTitle>صندوق الوارد فارغ</EmptyTitle>
          <EmptyDescription>
            لا توجد رسائل في انتظارك. ستظهر المحادثات الجديدة هنا عندما يتواصل معك شخص ما.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>كتابة رسالة</Button>
            <Button variant="outline">عرض المؤرشف</Button>
          </div>
        </EmptyContent>
        <Button asChild className="text-muted-foreground" size="sm" variant="link">
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder href in demo component */}
          <a href="#">
            ادارة التفضيلات <ArrowUpRightIcon />
          </a>
        </Button>
      </Empty>
    </div>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionEmpty`, `MotionEmptyMedia`, `MotionEmptyTitle`, `MotionEmptyDescription`, and `MotionEmptyContent` for staggered entrance animations powered by [motion](https://motion.dev). The media scales in while text elements fade up with increasing delays.

```tsx title="components/empty-8.tsx"
// import from your project: import Demo from '@/components/empty-8'
'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  EmptyHeader,
  MotionEmpty,
  MotionEmptyContent,
  MotionEmptyDescription,
  MotionEmptyMedia,
  MotionEmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconInbox } from '@tabler/icons-react'

export default function Demo() {
  return (
    <MotionEmpty>
      <EmptyHeader>
        <MotionEmptyMedia variant="icon">
          <IconInbox />
        </MotionEmptyMedia>
        <MotionEmptyTitle>Your Inbox is Empty</MotionEmptyTitle>
        <MotionEmptyDescription>
          No messages waiting for you. New conversations will show up here when someone reaches out.
        </MotionEmptyDescription>
      </EmptyHeader>
      <MotionEmptyContent>
        <div className="flex gap-2">
          <MotionButton>Compose Message</MotionButton>
          <MotionButton variant="outline">View Archived</MotionButton>
        </div>
      </MotionEmptyContent>
    </MotionEmpty>
  )
}
```

}>
Requires the `motion` package. Replace each sub-component with its Motion variant. `EmptyHeader` stays the same — it's a layout wrapper with no visual animation.

## API Reference

### Empty

The main component of the empty state. Wraps the `EmptyHeader` and `EmptyContent` components.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Empty state content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### EmptyHeader

The `EmptyHeader` component wraps the empty media, title, and description.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Header content (media, title, description) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### EmptyMedia

Use the `EmptyMedia` component to display the media of the empty state such as an icon or an image. You can also use it to display other components such as an avatar.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'icon'` | `'default'` | Visual variant of the media container |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Media content (icon, avatar, image) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### EmptyTitle

Use the `EmptyTitle` component to display the title of the empty state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Title text |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### EmptyDescription

Use the `EmptyDescription` component to display the description of the empty state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Description text |
| `...props` | `React.ComponentProps<'p'>` | - | Additional props to spread to the description element (renders as a `div`) |

### EmptyContent

Use the `EmptyContent` component to display the content of the empty state such as a button, input or a link.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Action content (buttons, links, inputs) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionEmpty

Same props as `Empty`. Adds fadeUp entrance animation. Requires the `motion` package.

### MotionEmptyMedia

Same props as `EmptyMedia`. Adds scaleBlur entrance with 50ms delay. Requires the `motion` package.

### MotionEmptyTitle

Same props as `EmptyTitle`. Adds fadeUp entrance with 100ms delay. Requires the `motion` package.

### MotionEmptyDescription

Same props as `EmptyDescription`. Adds fadeUp entrance with 150ms delay. Requires the `motion` package.

### MotionEmptyContent

Same props as `EmptyContent`. Adds fadeUp entrance with 200ms delay. Requires the `motion` package.