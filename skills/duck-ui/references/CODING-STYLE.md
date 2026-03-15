# Component Coding Style Guide

Follow this exact pattern when creating or modifying registry-ui components.

## File Structure

Every component gets its own directory under `packages/registry-ui/src/{name}/`:

```
{name}/
├── {name}.tsx              # Component implementation
├── {name}.constants.ts     # cva() variants and exported variant types
├── {name}.types.ts         # Props interfaces (only if complex enough to warrant a separate file)
└── index.ts                # Barrel: export * from './{name}'
```

## {name}.constants.ts — Variants

```ts
import { cva } from '@gentleduck/variants'

// 1. Define explicit union types for each variant axis
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

// 2. Define the options interface matching the variant axes
export interface ButtonVariantOptions {
  variant?: ButtonVariant | ButtonVariant[]
  size?: ButtonSize | ButtonSize[]
  class?: string
  className?: string
}

// 3. Export the variant function with explicit return type annotation
export const buttonVariants: (props?: ButtonVariantOptions) => string = cva(
  // Base classes as a single string (no array)
  'inline-flex items-center justify-center rounded-md font-medium text-sm transition-all',
  {
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/70',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6',
        icon: 'size-9',
      },
    },
  },
)
```

## {name}.types.ts — Props

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
  /** Shows loading spinner */
  loading?: boolean
  /** Primary icon */
  icon?: React.ReactNode
}
```

## {name}.tsx — Component

```tsx
import { cn } from '@gentleduck/libs/cn'
import { Slot, Slottable } from '@gentleduck/primitives/slot'
import * as React from 'react'
import { buttonVariants } from './button.constants'
import type { ButtonProps } from './button.types'

// 1. Always use React.forwardRef
// 2. Destructure ALL props in the parameter list — never use props.xxx
// 3. Provide sensible defaults inline
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      asChild,
      className,
      loading,
      icon,
      type = 'button',
      disabled,
      ...props
    },
    ref,
  ) => {
    // 4. Resolve Slot vs native element for asChild support
    const Component = (asChild ? Slot : 'button') as React.ElementType

    return (
      <Component
        data-slot="button"                          // 5. Always add data-slot
        {...props}                                   // 6. Spread remaining props BEFORE explicit ones
        aria-busy={loading ? true : undefined}       // 7. Conditional ARIA (undefined removes the attr)
        className={cn(buttonVariants({ className, size, variant }))}  // 8. cn() wraps variant call
        disabled={Boolean(loading) || disabled}
        ref={ref}
        type={type}>
        {loading ? <Loader aria-hidden="true" className="animate-spin" /> : icon}
        <Slottable>{children}</Slottable>            // 9. Wrap children in Slottable for asChild
      </Component>
    )
  },
)
Button.displayName = 'Button'                        // 10. Always set displayName

export { Button, buttonVariants }
```

## index.ts — Barrel

```ts
export * from './{name}'
```

## Coding Conventions

- Import order: node builtins, external libs, @gentleduck packages, relative imports
- Always `import * as React from 'react'` (not named imports)
- Always `import type { X }` for type-only imports
- Always `React.forwardRef` with explicit generic types
- JSX: self-closing tags for empty elements, multi-line for 2+ props
- Props on JSX: alphabetical order except `data-slot` first and `ref` last
- Single quotes for strings, no semicolons (biome enforced)
- Use `cn()` for every className — never raw string concatenation
- Design tokens only — never hardcode hex colors or pixel values
- `data-slot` attribute on every component root for debugging and CSS targeting
- `aria-hidden="true"` on decorative icons
- `type="button"` default on all buttons (prevent form submission)
