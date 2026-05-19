```tsx title="components/avatar-1.tsx"
// import from your project: import Demo from '@/components/avatar-1'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'

export default function Demo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar>
        <AvatarImage
          alt="GD"
          src="https://github.com/gentleeduck/gentleduck/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true"
        />
        <AvatarFallback>GD</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg">
        <AvatarImage alt="WD" src="https://avatars.githubusercontent.com/u/108896341?v=4" />
        <AvatarFallback className="rounded-lg">WD</AvatarFallback>
      </Avatar>
      <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
        <Avatar>
          <AvatarImage
            alt="GD"
            src="https://github.com/gentleeduck/gentleduck/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true"
          />
          <AvatarFallback>GD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage alt="WD" src="https://avatars.githubusercontent.com/u/108896341?v=4" />
          <AvatarFallback>WD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            alt="GD"
            src="https://raw.githubusercontent.com/wildduck2/duck-starter-kit/15fbc61fb02cd21a873108b380ca12fe31f50099/apps/document-client/public/placeholder2.webp"
          />
          <AvatarFallback>GD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
```

## Philosophy

Identity in UI starts with a face. Avatars humanize interfaces by giving users a visual anchor. We support both single avatars and groups because social context  -  seeing who else is involved  -  is a fundamental interaction pattern. The fallback-to-initials behavior ensures graceful degradation when images fail.

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add avatar
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
```

```tsx showLineNumbers
<Avatar>
  <AvatarImage src="https://github.com/wildduck2.png" alt="wildduck" />
  <AvatarFallback>WD</AvatarFallback>
</Avatar>
```

## RTL Support

```tsx title="components/avatar-2.tsx"
// import from your project: import Demo from '@/components/avatar-2'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'

export default function Demo() {
  return (
    <div dir="rtl">
      <div className="flex flex-row flex-wrap items-center gap-12">
        <Avatar>
          <AvatarImage
            alt="GD"
            src="https://github.com/gentleeduck/gentleduck/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true"
          />
          <AvatarFallback>GD</AvatarFallback>
        </Avatar>
        <Avatar className="rounded-lg">
          <AvatarImage alt="WD" src="https://avatars.githubusercontent.com/u/108896341?v=4" />
          <AvatarFallback className="rounded-lg">WD</AvatarFallback>
        </Avatar>
        <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
          <Avatar>
            <AvatarImage
              alt="GD"
              src="https://github.com/gentleeduck/gentleduck/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true"
            />
            <AvatarFallback>GD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage alt="WD" src="https://avatars.githubusercontent.com/u/108896341?v=4" />
            <AvatarFallback>WD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              alt="GD"
              src="https://raw.githubusercontent.com/wildduck2/duck-starter-kit/15fbc61fb02cd21a873108b380ca12fe31f50099/apps/document-client/public/placeholder2.webp"
            />
            <AvatarFallback>GD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionAvatar` and `MotionAvatarGroup` for animated entrance powered by [motion](https://motion.dev). Avatars spin in with scale, rotate, and blur. The group staggers each avatar 80ms apart.

```tsx title="components/avatar-3.tsx"
// import from your project: import Demo from '@/components/avatar-3'
'use client'

import { AvatarFallback, AvatarImage, MotionAvatar, MotionAvatarGroup } from '@gentleduck/registry-ui/avatar'

export default function Demo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <MotionAvatar>
        <AvatarImage
          alt="GD"
          src="https://github.com/gentleeduck/gentleduck/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true"
        />
        <AvatarFallback>GD</AvatarFallback>
      </MotionAvatar>
      <MotionAvatar className="rounded-lg">
        <AvatarImage alt="WD" src="https://avatars.githubusercontent.com/u/108896341?v=4" />
        <AvatarFallback className="rounded-lg">WD</AvatarFallback>
      </MotionAvatar>
      <MotionAvatarGroup
        imgs={[
          {
            id: '1',
            src: 'https://github.com/gentleeduck/gentleduck/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true',
            alt: 'GD',
            fallback: 'GD',
          },
          { id: '2', src: 'https://avatars.githubusercontent.com/u/108896341?v=4', alt: 'WD', fallback: 'WD' },
          {
            id: '3',
            src: 'https://raw.githubusercontent.com/wildduck2/duck-starter-kit/15fbc61fb02cd21a873108b380ca12fe31f50099/apps/document-client/public/placeholder2.webp',
            alt: 'GD',
            fallback: 'GD',
          },
          { id: '4', alt: 'JD', fallback: 'JD' },
          { id: '5', alt: 'MK', fallback: 'MK' },
        ]}
        maxVisible={3}
      />
    </div>
  )
}
```

}>
  Requires the `motion` package. Use `MotionAvatar` instead of `Avatar` and `MotionAvatarGroup` instead of `AvatarGroup`. `AvatarImage` and `AvatarFallback` stay the same.

## API Reference

### Avatar

The root container rendered as a `span`. Provides context for `AvatarImage` and `AvatarFallback`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for styling the avatar container |
| `...props` | `React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>` | - | Additional props inherited from the avatar primitive root (span element) |

### AvatarImage

The `img` element inside the avatar. Automatically tracks loading status and hides when the image fails.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Alternate text for the image |
| `onLoadingStatusChange` | `(status: 'idle' \| 'loading' \| 'loaded' \| 'error') => void` | - | Callback when the image loading status changes |
| `className` | `string` | - | Additional class names for styling the image |
| `...props` | `React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>` | - | Additional props inherited from the avatar image primitive |

### AvatarFallback

Content displayed when the image has not loaded. Typically initials or an icon.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `delayMs` | `number` | - | Optional delay in milliseconds before showing the fallback (avoids flicker for fast-loading images) |
| `className` | `string` | - | Additional class names for styling the fallback |
| `children` | `React.ReactNode` | - | Fallback content (e.g. initials) |
| `...props` | `React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>` | - | Additional props inherited from the avatar fallback primitive |

### AvatarGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `imgs` | `{ src?: string; alt?: string; fallback?: string; id?: string }[]` | (required) | Array of avatar data objects. Fallback text is truncated to 2 characters. |
| `maxVisible` | `number` | `3` | Maximum number of avatars to display before showing a `+N` overflow counter |
| `className` | `string` | - | Additional class names for styling the avatar group container |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the container div |

### MotionAvatar

Content spins in on mount with rotate, scale, and blur using the `spinIn` preset. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AvatarProps` | - | All props from `Avatar` are supported |

### MotionAvatarGroup

Each avatar staggers in 80ms apart with `spinIn` animation. The overflow counter staggers last. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AvatarGroupProps` | - | All props from `AvatarGroup` are supported |