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

```

```tsx showLineNumbers

  <AvatarFallback>WD</AvatarFallback>

```

## RTL Support

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionAvatar` and `MotionAvatarGroup` for animated entrance powered by [motion](https://motion.dev). Avatars spin in with scale, rotate, and blur. The group staggers each avatar 80ms apart.

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