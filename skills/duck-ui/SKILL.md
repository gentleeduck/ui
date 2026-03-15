---
name: duck-ui
description: >-
  Use this skill when working with @gentleduck/ui components, primitives, hooks,
  variants, motion, state, vim, or the CLI. Covers component usage, props, styling
  with Tailwind and data attributes, accessibility patterns, variant authoring,
  keyboard bindings, animation tokens, and the full registry. Connects to the
  live MCP documentation server for up-to-date API references and examples.
allowed-tools: Read Grep Glob Bash(bun:*) Bash(npx:*)
argument-hint: "[component-or-topic]"
---

# @gentleduck/ui Skill

You are an expert on the gentleduck/ui component ecosystem. You know every package, every component, every hook, and every pattern in this monorepo. When answering questions, ground your responses in the actual source code and documentation.

## MCP Documentation Server

The docs site exposes an MCP server at `https://ui.gentleduck.org/api/mcp` with these tools:

- **list_docs** — list all documentation pages, optionally filter by category
- **read_doc** — read a full documentation page as clean markdown
- **search_docs** — keyword search with typo tolerance across all docs
- **get_component_api** — get the props table and API reference for a component
- **get_examples** — get only the code examples from a doc page
- **get_changelog** — get changelog entries filtered by version or component
- **get_installation** — get setup guide for a specific framework (Next.js, Vite, TanStack)
- **suggest_components** — describe what you need and get ranked component suggestions
- **semantic_search** — natural language search using TF-IDF cosine similarity

When the user asks about a component, use these tools to fetch the latest docs rather than relying on training data. Prefer `get_component_api` for props questions and `get_examples` for usage questions.

## Package Map

| Package | Import | Purpose |
|---|---|---|
| `@gentleduck/primitives` | `@gentleduck/primitives/{name}` | Unstyled, a11y-first headless primitives (dialog, select, popover, etc.) |
| `@gentleduck/registry-ui` | `@gentleduck/registry-ui/{name}` | Pre-styled Tailwind components built on primitives |
| `@gentleduck/hooks` | `@gentleduck/hooks/{name}` | React hooks (useComposedRefs, useCopyToClipboard, useIsMobile, useStableId) |
| `@gentleduck/libs` | `@gentleduck/libs/{name}` | Utilities (cn, filteredObject, groupArray, parseDate) |
| `@gentleduck/variants` | `@gentleduck/variants` | CVA variant system (`cva`, `VariantProps`, `CvaProps`) |
| `@gentleduck/motion` | `@gentleduck/motion` | Animation tokens, reduced-motion detection, WAAPI helpers |
| `@gentleduck/state` | `@gentleduck/state` | Lightweight atom-based state management |
| `@gentleduck/vim` | `@gentleduck/vim/{module}` | Keyboard command engine with hotkey parsing, sequences, recording |
| `@gentleduck/lazy` | `@gentleduck/lazy/{name}` | Lazy loading components and virtualized image rendering |
| `@gentleduck/cli` | `npx @gentleduck/cli` | CLI to scaffold projects and add components |
| `@gentleduck/docs` | `@gentleduck/docs/client` | Shared docs app kit (SiteHeader, CommandMenu, MDX components) |

## How Components Are Structured

Every registry-ui component follows this pattern:

```
packages/registry-ui/src/{component-name}/
├── {component-name}.tsx          # Main component with Tailwind styling
├── {component-name}.constants.ts # Variant definitions using cva()
├── {component-name}.types.ts     # TypeScript interfaces (optional)
└── index.ts                      # Barrel export
```

Components are source-exported (no build step): `"./*": "./src/*/index.ts"` in package.json.

Primitives follow a similar structure but output to dist via tsdown:

```
packages/duck-primitives/src/{primitive-name}/
├── {primitive-name}.tsx   # Core logic, context, state machine
├── content.tsx            # Content sub-component
├── trigger.tsx            # Trigger sub-component
├── index.ts               # Named exports (no wildcard)
└── ...
```

## Variant System

All component styling uses `cva()` from `@gentleduck/variants`:

```tsx
import { cva, type VariantProps } from '@gentleduck/variants'

const buttonVariants = cva({
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>
```

## Motion System

The motion package provides consistent animation tokens:

```tsx
import { duckDuration, duckEasing, duckMotionCssVar } from '@gentleduck/motion'
import { useDuckReducedMotion, motionTransition } from '@gentleduck/motion'

// CSS custom properties for animations
// --duck-motion-duration-fast: 100ms
// --duck-motion-duration-normal: 200ms
// --duck-motion-duration-slow: 300ms
// --duck-motion-ease: cubic-bezier(0.2, 0, 0, 1)

// Reduced motion detection
const reduced = useDuckReducedMotion()
const transition = motionTransition(reduced, { duration: 200 })
```

Components use CSS transitions with these tokens via `ease-(--duck-motion-ease)` and `duration-[200ms]` Tailwind classes.

## Keyboard System (Vim)

```tsx
import { useKeyBind, useKeySequence, KeyProvider } from '@gentleduck/vim/react'
import { parseKeyBind } from '@gentleduck/vim/parser'
import { detectPlatform } from '@gentleduck/vim/platform'

// Single keybind
useKeyBind('mod+k', () => openCommandMenu())

// Sequences (vim-style)
useKeySequence('g g', () => scrollToTop())

// Platform-aware: mod resolves to Cmd on Mac, Ctrl elsewhere
```

## Accessibility Patterns

Every primitive ships with full ARIA support:
- Dialog: `role="dialog"`, `aria-modal`, focus trap, Escape to close
- Select: `role="combobox"`, `aria-expanded`, `aria-activedescendant`
- Tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`, arrow key navigation
- Accordion: `<details>`/`<summary>` native elements with `group-open:` states

Always use the primitive's built-in a11y. Do not override `role`, `aria-*`, or keyboard handlers unless you know what you are doing.

## CLI Usage

```bash
# Initialize a new project
npx @gentleduck/cli init

# Scaffold from template
npx @gentleduck/cli init --template acme --cwd my-project

# Add components
npx @gentleduck/cli add button dialog tabs

# Add to monorepo workspace
npx @gentleduck/cli add button --workspace packages/ui
```

## Styling Conventions

- All components use Tailwind CSS v4 with CSS custom properties for theming
- Color tokens: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`, etc.
- Dark mode: automatic via CSS `@variant dark { }` — no class toggling needed
- Data attributes for state: `data-state="open"`, `data-disabled`, `data-selected`
- Motion: `ease-(--duck-motion-ease)` and `transition-all duration-[200ms]`
- Use `cn()` from `@gentleduck/libs/cn` to merge class names (wraps clsx + tailwind-merge)

## Common Patterns

### Controlled vs Uncontrolled

All primitives support both patterns via `useControllableState`:

```tsx
// Uncontrolled (internal state)
<Dialog defaultOpen={false}>

// Controlled (you manage state)
const [open, setOpen] = useState(false)
<Dialog open={open} onOpenChange={setOpen}>
```

### Compound Components

Most complex components use the compound pattern:

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Pick one" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```

### asChild Pattern

Primitives support `asChild` to merge behavior onto your own element:

```tsx
<DialogTrigger asChild>
  <Button variant="outline">Open</Button>
</DialogTrigger>
```

## When Answering Questions

1. If asked about a component's props or API, use `get_component_api` from the MCP server
2. If asked for usage examples, use `get_examples` from the MCP server
3. If asked "which component should I use for X", use `suggest_components`
4. If asked about installation or setup, use `get_installation`
5. Always import from the correct package path (e.g., `@gentleduck/registry-ui/button` not `@gentleduck/ui/button`)
6. Always use `cn()` for className merging, never manual string concatenation
7. Always respect the variant system — extend variants via `cva()`, do not hardcode classes
8. Reference the source files when showing implementation details
