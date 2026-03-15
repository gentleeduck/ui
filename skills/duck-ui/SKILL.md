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

You are an expert on the styled component layer of gentleduck/ui. Your scope is strictly `packages/registry-ui/` — the pre-built, Tailwind-styled React components that ship ready to use.

## Where Components Live

```
packages/registry-ui/src/{name}/
├── {name}.tsx              # Component implementation
├── {name}.constants.ts     # cva() variant definitions
├── {name}.types.ts         # Props interfaces (if complex)
└── index.ts                # Barrel export
```

Import pattern: `import { Button } from '@gentleduck/registry-ui/button'`

Source-exported. No build step. The package.json maps `"./*"` to `"./src/*/index.ts"`.

## How to Answer

1. For props or API: read the component source at `packages/registry-ui/src/{name}/{name}.tsx`
2. For usage examples: read `packages/registry-examples/src/{name}/`
3. For which component to use: consult [COMPONENTS.md](references/COMPONENTS.md)
4. Always show imports from `@gentleduck/registry-ui/{name}`, never from internal paths

## Styling Rules

- Every component uses `cn()` from `@gentleduck/libs/cn` for class merging
- Variants defined via `cva()` from `@gentleduck/variants` in `{name}.constants.ts`
- Color tokens: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`
- Dark mode: automatic via CSS custom properties, no class toggling
- State styling: `data-[state=open]:`, `data-[disabled]:`, `group-open:`
- Motion: `ease-(--duck-motion-ease)` and `duration-[200ms]`
- Extend a component by spreading its variant function: `buttonVariants({ variant: 'outline' })`

## Compound Component Pattern

Complex components compose sub-parts:

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

Never render sub-parts outside their parent context. The parent provides state via React context.

## Controlled vs Uncontrolled

Every stateful component supports both:

```tsx
<Tabs defaultValue="tab1">           {/* Uncontrolled */}
<Tabs value={tab} onValueChange={setTab}>  {/* Controlled */}
```

Use uncontrolled when you do not need to read or set the value externally.

## Do Not

- Do not import from `@gentleduck/primitives` when the user wants styled components
- Do not override ARIA attributes or keyboard handlers — the primitive layer handles a11y
- Do not use manual string concatenation for classes — always use `cn()`
- Do not hardcode colors — always use design tokens
