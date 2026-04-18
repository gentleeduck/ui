---
name: duck-ui
description: >-
  Use when working with styled @gentleduck/registry-ui components. Covers importing,
  composing, styling, and customizing pre-built Tailwind components like Button, Dialog,
  Select, Tabs, Sidebar, and 50+ others. Use for questions about component props, usage
  examples, Tailwind theming, dark mode, or which component fits a use case.
allowed-tools: Read Grep Glob
argument-hint: "[component-name]"
---

# @gentleduck/registry-ui

You are an expert on the styled component layer of gentleduck/ui. Your scope is strictly `packages/registry-ui/`  -  the pre-built, Tailwind-styled React components that ship ready to use.

## Where Components Live

```
packages/registry-ui/src/{name}/
├── {name}.tsx              # Component implementation (always present)
├── {name}.constants.ts     # cva() variant definitions (only for components with variant axes)
├── {name}.types.ts         # Props interfaces (only if complex enough)
└── index.ts                # Barrel export (re-exports from all sibling files)
```

Import pattern: `import { Button } from '@gentleduck/registry-ui/button'`

Source-exported. No build step. The package.json maps `"./*"` to `"./src/*/index.ts"`.

## How to Answer  -  Decision Tree

1. **"How do I use X?"**  -  Read `packages/registry-ui/src/{name}/{name}.tsx`, then check `packages/registry-examples/src/{name}/` for usage.
2. **"Which component for Y?"**  -  Consult [COMPONENTS.md](references/COMPONENTS.md).
3. **"How do I style/customize X?"**  -  Check if `{name}.constants.ts` exists. If yes, extend via variant options. If no (primitive wrapper), pass `className` with `cn()`.
4. **"How do I make X responsive?"**  -  Check for a `{name}-responsive.tsx` file in the component directory. Currently only `dialog` has one (`dialog-responsive.tsx` switches Dialog/Drawer via `useMediaQuery`).
5. **"How do I create a new component?"**  -  Follow the exact patterns in [CODING-STYLE.md](references/CODING-STYLE.md). Read a similar existing component first.
6. Always show imports from `@gentleduck/registry-ui/{name}`, never from internal paths.

## Two Component Patterns

### Pattern A: Primitive Wrapper (Dialog, Sheet, Accordion, Select...)

Wraps `@gentleduck/primitives/{name}` with Tailwind styling. No `.constants.ts` file. Uses `cn()` directly on primitive sub-components. Requires `'use client'` directive when the component uses hooks, context, or event handlers.

```tsx
const DialogOverlay = React.forwardRef<...>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80 ...', className)}
    {...props}
  />
))
```

### Pattern B: Variant-Based (Button, Badge, Alert, Toggle, Item...)

Has a `.constants.ts` with `cva()` defining variant axes. Component destructures variant props, passes them to the variant function inside `cn()`.

```tsx
className={cn(buttonVariants({ border, className, size, variant }))}
```

## Compound Component Pattern

Complex components compose sub-parts. The parent provides state via React context.

```tsx
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Controlled vs Uncontrolled

```tsx
<Tabs defaultValue="tab1">                          {/* Uncontrolled */}
<Tabs value={tab} onValueChange={setTab}>            {/* Controlled */}
```

## Styling Rules

- `cn()` from `@gentleduck/libs/cn` for every className  -  never raw concatenation
- Variants via `cva()` from `@gentleduck/variants` in `{name}.constants.ts`
- Color tokens only: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`
- Dark mode: automatic via CSS custom properties, no class toggling
- State styling: `data-[state=open]:`, `data-[state=closed]:`, `data-[disabled]:`
- Motion: `ease-(--gentleduck-motion-ease)`, `duration-[200ms,150ms]`, `transition-discrete`
- Animation: `data-[state=open]:animate-in`, `data-[state=closed]:animate-out`, `fade-in-0`, `zoom-in-95`
- Extend a variant component externally: `buttonVariants({ variant: 'outline' })`

## Error Patterns

Check these in order when a component errors:

1. Missing parent context  -  sub-parts rendered outside their compound parent
2. Wrong import path  -  using `@gentleduck/primitives/x` instead of `@gentleduck/registry-ui/x`
3. Missing `asChild`  -  passing a custom element to a trigger without `asChild`
4. Conflicting `size` prop  -  native HTML `size` attribute collides with variant `size` (use `Omit<>`)
5. Missing `'use client'`  -  components using hooks/context need the directive in Next.js apps

## Edge Cases

- **RTL support**: Use `useDirection` from `@gentleduck/primitives/direction`, logical CSS properties (`end-4` not `right-4`), and `ltr:`/`rtl:` Tailwind prefixes for directional transforms.
- **Responsive dialog**: `dialog-responsive.tsx` switches between Dialog (desktop) and Drawer (mobile) using `useMediaQuery('(min-width: 768px)')` from `@gentleduck/hooks/use-media-query`. Currently only Dialog has a responsive variant.
- **Lazy mounting**: Use `forceMount` prop with `MountMinimal` from `@gentleduck/primitives/mount` to keep content mounted when hidden (preserves form state). Used in TabsContent and Collapsible.
- **Icon sizing**: Button base styles include `[&_svg:not([class*='size-'])]:size-4`  -  SVGs auto-size unless they have an explicit `size-*` class.
- **Collapsed state**: Button supports `isCollapsed` to switch to icon-only mode (`size: 'icon'`) and hide children  -  used for sidebar toggles.
- **Adding variants / overriding styles / Next.js App Router**: See [COMPONENTS.md](references/COMPONENTS.md).
- **`asChild` vs wrapper / `defaultValue` vs controlled / composing compounds**: See [CODING-STYLE.md](references/CODING-STYLE.md#smart-patterns).

## Do Not

- Do not import from `@gentleduck/primitives` when the user wants styled components
- Do not override ARIA attributes or keyboard handlers  -  the primitive layer handles a11y
- Do not use manual string concatenation for classes  -  always use `cn()`
- Do not hardcode colors  -  always use design tokens (`bg-primary`, not `bg-blue-500`)
- Do not create components without `displayName` (set on every component and sub-component)
- Do not use `React.FC`  -  always use `React.forwardRef` with explicit generics
- Do not spread `{...props}` after explicit attrs in variant-based components  -  place `data-slot` first, then `{...props}`, then explicit overrides (`className`, `disabled`, `ref`, `type`) so user props cannot override critical attributes. Primitive wrappers place `ref` and `className` before `{...props}` since they delegate to primitives that handle attribute merging.
- Do not assume every component has a `.constants.ts`  -  only variant-based components do
- Do not use `right-*`/`left-*` for positioning  -  use logical properties (`end-*`/`start-*`) for RTL
- Do not forget `'use client'` when the component uses hooks, context, or event handlers in Next.js
- Do not render sub-parts outside their compound parent context
