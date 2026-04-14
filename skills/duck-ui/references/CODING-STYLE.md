# Component Coding Style Guide

Follow this exact pattern when creating or modifying registry-ui components.

## File Structure

Every component gets its own directory under `packages/registry-ui/src/{name}/`:

```
{name}/
├── {name}.tsx              # Component implementation (always present)
├── {name}.constants.ts     # cva() variants (only if component has variant axes)
├── {name}.types.ts         # Props interfaces (only if complex enough to warrant a file)
└── index.ts                # Barrel: re-exports from all sibling files
```

Not every component has all files. Primitive wrappers (Dialog, Sheet) have only `{name}.tsx` and `index.ts`. Variant-based components (Button, Badge) have all four files.

## Pattern A: Variant-Based Component (e.g., Button)

### {name}.constants.ts  -  Variants

From `packages/registry-ui/src/button/button.constants.ts`:

```ts
import { cva } from '@gentleduck/variants'

// 1. Define explicit union types for each variant axis
export type ButtonBorder = 'default' | 'destructive' | 'primary' | 'secondary' | 'warning'
export type ButtonSize = 'default' | 'icon' | 'icon-lg' | 'icon-sm' | 'lg' | 'sm'
export type ButtonVariant =
  | 'dashed'
  | 'default'
  | 'destructive'
  | 'expand_icon'
  | 'ghost'
  | 'link'
  | 'nothing'
  | 'outline'
  | 'secondary'
  | 'warning'

// 2. Define the options interface matching the variant axes
export interface ButtonVariantOptions {
  border?: ButtonBorder | ButtonBorder[]
  class?: ButtonClassValue
  className?: ButtonClassValue
  size?: ButtonSize | ButtonSize[]
  variant?: ButtonVariant | ButtonVariant[]
}

// 3. Export the variant function with explicit return type annotation
export const buttonVariants: (props?: ButtonVariantOptions) => string = cva(
  // Base classes as a single string
  'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 ...',
  {
    defaultVariants: {
      border: 'default',
      size: 'default',
      variant: 'default',
    },
    variants: {
      border: { default: '', primary: 'border border-border/40 ...' },
      size: { default: 'h-9 px-4 py-2 has-[>svg]:px-3', icon: 'size-9', sm: '...' },
      variant: { default: 'bg-primary text-primary-foreground ...', ghost: '...' },
    },
  },
)
```

### {name}.types.ts  -  Props

From `packages/registry-ui/src/button/button.types.ts`:

```ts
import type { VariantProps } from '@gentleduck/variants'
import type { buttonVariants } from './button.constants'

// 1. Extend native HTML element props + variant props
// 2. Omit conflicting keys (commonly 'size' for buttons)
// 3. Add custom props with JSDoc comments
export interface ButtonProps
  extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'>,
    VariantProps<typeof buttonVariants> {
  /** Render as child component using Slot */
  asChild?: boolean
  /** Controls collapsed state for sidebar toggles */
  isCollapsed?: boolean
  /** Shows loading spinner */
  loading?: boolean
  /** Primary icon */
  icon?: React.ReactNode
  /** Secondary icon (e.g., for split actions) */
  secondIcon?: React.ReactNode
}
```

### {name}.tsx  -  Component

From `packages/registry-ui/src/button/button.tsx`:

```tsx
import { cn } from '@gentleduck/libs/cn'
import { Slot, Slottable } from '@gentleduck/primitives/slot'
import { Loader } from 'lucide-react'
import * as React from 'react'
import { buttonVariants } from './button.constants'
import type { AnimationIconProps, ButtonProps } from './button.types'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      border = 'default',
      asChild,
      className,
      loading,
      isCollapsed,
      icon,
      secondIcon,
      type = 'button',
      disabled,
      ...props
    },
    ref,
  ) => {
    const Component = (asChild ? Slot : 'button') as React.ElementType

    return (
      <Component
        data-slot="button"
        {...props}
        aria-busy={loading ? true : undefined}
        className={cn(buttonVariants({ border, className, size: isCollapsed ? 'icon' : size, variant }))}
        disabled={Boolean(loading) || disabled}
        ref={ref}
        type={type}>
        {loading ? <Loader aria-hidden="true" className="animate-spin" /> : icon}
        <Slottable>{!isCollapsed && children}</Slottable>
        {!isCollapsed && secondIcon && secondIcon}
      </Component>
    )
  },
)
Button.displayName = 'Button'

export { Button, AnimationIcon }
```

### index.ts  -  Barrel (variant-based)

When a component has multiple files, the barrel re-exports all of them:

```ts
export * from './button'
export * from './button.constants'
export * from './button.types'
```

## Pattern B: Primitive Wrapper (e.g., Dialog)

From `packages/registry-ui/src/dialog/dialog.tsx`:

```tsx
'use client'

import { cn } from '@gentleduck/libs/cn'
import * as DialogPrimitive from '@gentleduck/primitives/dialog'
import { X } from 'lucide-react'
import * as React from 'react'

// Simple re-exports for stateless sub-parts
const Dialog = DialogPrimitive.Root
Dialog.displayName = 'Dialog'

const DialogTrigger = DialogPrimitive.Trigger
DialogTrigger.displayName = 'DialogTrigger'

// forwardRef wrapper for styled sub-parts
const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in',
      'transition-all transition-discrete duration-[200ms,150ms] ease-(--gentleduck-motion-ease)',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
```

### index.ts  -  Barrel (primitive wrapper)

Re-exports from all sibling files. If the component has a responsive variant, include it:

```ts
export * from './dialog'
export * from './dialog-responsive'
```

## Coding Conventions

- `'use client'` directive at top when component uses hooks, context, or event handlers
- Import order: external libs, @gentleduck packages, relative imports
- Always `import * as React from 'react'` (not named imports)
- Always `import type { X }` for type-only imports
- Always `React.forwardRef` with explicit generic types (never `React.FC`)
- Destructure ALL props in the parameter list  -  never use `props.xxx`
- JSX: self-closing tags for empty elements, multi-line for 2+ props
- Props on JSX (variant-based): `data-slot` first, then `{...props}`, then explicit overrides (`className`, `disabled`, `ref`, `type`)  -  prevents user props from overriding critical attributes. Primitive wrappers place `ref` and `className` before `{...props}` since primitives handle attribute merging internally.
- Single quotes for strings, no semicolons (biome enforced)
- Use `cn()` for every className  -  never raw string concatenation
- Design tokens only  -  never hardcode hex colors or pixel values
- `data-slot` attribute on component roots for debugging and CSS targeting
- `aria-hidden="true"` on decorative icons
- `type="button"` default on all buttons (prevent form submission)
- `displayName` on every component and sub-component

## RTL and Directionality

- Use `useDirection` from `@gentleduck/primitives/direction` for reading direction context
- Use logical CSS properties: `end-4` not `right-4`, `start-4` not `left-4`, `ps-*`/`pe-*` not `pl-*`/`pr-*`
- Use `ltr:` / `rtl:` Tailwind prefixes for directional transforms:
  ```tsx
  className="ltr:translate-x-[-1.3em] ltr:group-hover:-translate-x-1 rtl:translate-x-[1.3em] rtl:group-hover:translate-x-1"
  ```
- Pass `dir={direction}` to root elements that need it

## Responsive Components

Some components have a `{name}-responsive.tsx` that adapts to screen size:

```tsx
'use client'
import { useMediaQuery } from '@gentleduck/hooks/use-media-query'

function DialogResponsive({ children, ...props }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (isDesktop) return <Dialog {...props}>{children}</Dialog>
  return <Drawer {...props}>{children}</Drawer>
}
```

This pattern creates matching `{Name}Responsive` wrappers for each sub-component (Trigger, Content, Header, Footer, Title, Description, Close).

## Lazy Mounting

Use `MountMinimal` from `@gentleduck/primitives/mount` to defer rendering:

```tsx
import { MountMinimal } from '@gentleduck/primitives/mount'

<MountMinimal forceMount={forceMount} open={activeItem === value} ref={null}>
  {children}
</MountMinimal>
```

The `forceMount` prop keeps content mounted even when hidden  -  useful for preserving form state in tabs.

## Smart Patterns

### `asChild` vs Wrapper Div

Use `asChild` when the trigger must be a specific element (e.g., a `<Button>` that opens a Dialog). This merges props onto the child instead of wrapping it in an extra element. Without `asChild`, the component renders its default element (usually `<button>`), which causes nested `<button>` elements or broken semantics.

```tsx
{/* Correct: Button becomes the trigger element */}
<DialogTrigger asChild><Button>Open</Button></DialogTrigger>

{/* Wrong: Renders <button><button>Open</button></button> */}
<DialogTrigger><Button>Open</Button></DialogTrigger>
```

Do NOT use `asChild` when passing plain text or inline content  -  only use it when the child is a single React element.

### `defaultValue` vs Controlled State

Use `defaultValue` for components where the parent does not need to react to value changes (static tabs, accordions for progressive disclosure). Use controlled `value` + `onValueChange` only when the parent must read or set the value (e.g., URL-synced tabs, form-driven selects).

### Composing Multiple Compound Components

When nesting compound components (e.g., a Dialog containing Tabs containing a Select), each compound component manages its own context. No special wiring is needed. Place each parent wrapper at the correct nesting level:

```tsx
<Dialog>
  <DialogContent>
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">General</TabsTrigger>
        <TabsTrigger value="tab2">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Select>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>...</SelectContent>
        </Select>
      </TabsContent>
    </Tabs>
  </DialogContent>
</Dialog>
```
