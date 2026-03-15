---
name: duck-primitives
description: >-
  Use when building or modifying headless, unstyled @gentleduck/primitives components.
  Covers the accessibility-first primitive layer: ARIA roles, keyboard navigation,
  focus management, state machines, scoped context, Slot/asChild, Presence animations,
  and the compound component architecture. Not for styled components — use duck-ui for that.
allowed-tools: Read Grep Glob
argument-hint: "[primitive-name]"
---

# @gentleduck/primitives

You are an expert on the headless primitive layer. Your scope is strictly `packages/duck-primitives/`. These are unstyled, accessibility-first React components that handle ARIA, keyboard nav, focus trapping, and state internally. The styled registry-ui components are built on top of these.

## Where Primitives Live

```
packages/duck-primitives/src/{name}/
├── {name}.tsx           # Root component, context provider, state machine
├── trigger.tsx          # Trigger sub-component
├── content.tsx          # Content sub-component
├── {sub-part}.tsx       # Other sub-parts (overlay, portal, arrow, etc.)
├── {name}.libs.ts       # Internal helpers (not exported)
└── index.ts             # Named exports (NEVER wildcard)
```

Import: `import * as DialogPrimitive from '@gentleduck/primitives/dialog'`

Built with tsdown. Exports: `"./*": { "types": "./dist/*/index.d.ts", "default": "./dist/*/index.js" }`

## Architecture Patterns

### Scoped Context

Every primitive creates isolated context so multiple instances never conflict:

```tsx
import { createContext } from '../libs/create-context'

const [DialogProvider, useDialogContext] = createContext<DialogContextValue>('Dialog')
```

The factory returns a typed Provider and a hook that throws a clear error if used outside the Provider.

### State Machine via useControllableState

All open/close state uses the controllable pattern from `src/hooks/useControllableState.ts`:

```tsx
const [open, setOpen] = useControllableState({
  prop: openProp,           // controlled value (or undefined)
  defaultProp: defaultOpen, // uncontrolled default
  onChange: onOpenChange,   // callback when value changes
})
```

### Slot and asChild

`Primitive.button` renders a native `<button>` by default. When `asChild` is true, it renders a `Slot` that merges all behavior (props, ref, event handlers) onto the consumer's child element.

```tsx
const Component = (asChild ? Slot : 'button') as React.ElementType
```

The Slot component:
- Merges event handlers (child handler runs first, then slot handler)
- Merges style objects
- Concatenates className strings
- Composes refs

### Presence for Animations

The Presence primitive delays unmounting until exit animations complete:

```tsx
import { Presence } from '../presence'

<Presence present={open}>
  <Content />
</Presence>
```

### DismissableLayer

Handles click-outside and Escape key dismissal with nested layer awareness:

```tsx
<DismissableLayer onDismiss={onClose} onEscapeKeyDown={onEscapeKeyDown}>
  {children}
</DismissableLayer>
```

### FocusScope

Traps focus within a boundary (used by Dialog, AlertDialog):

```tsx
<FocusScope trapped={open} onMountAutoFocus={...} onUnmountAutoFocus={...}>
  {children}
</FocusScope>
```

## Internal Hooks

- `useCallbackRef` — stable ref that updates every render without causing re-renders
- `useControllableState` — controlled/uncontrolled state pattern
- `useEscapeKeydown` — global Escape key listener with event propagation control
- `useFocusGuard` — sentinel elements that catch focus leaving a boundary
- `useId` — SSR-safe unique ID (uses React.useId internally)
- `useLayoutEffect` — isomorphic (no SSR warning)
- `usePrevious` — track previous render's value
- `useSize` — ResizeObserver-based dimension tracking
- `useStateMachine` — finite state machine with typed transitions

## Coding Style for Primitives

- Always `React.forwardRef` with explicit generic types
- Named exports only in index.ts: `export { DialogContent } from './content'`
- Prefix internal types with the primitive name: `SelectTriggerProps`, `DialogContentElement`
- `ScopedProps<P>` wrapper for props that include `__scope{Name}` context prop
- `data-slot="{primitive}-{part}"` on every element (e.g., `data-slot="dialog-content"`)
- `data-state="open" | "closed"` for stateful elements
- `data-disabled=""` when disabled (empty string, not "true")
- Use `composeEventHandlers` to chain handlers without losing the original
- Use `Primitive.{tag}` as the base element (from `../primitive-elements`)
- Never import from registry-ui or other primitives at the same level — use libs/hooks only

## Available Primitives

alert-dialog, arrow, avatar, checkers, command, context-menu, dialog, direction,
dismissable-layer, dropdown-menu, focus-scope, hover-card, input-otp, menu, menubar,
mount, navigation-menu, pagination, popover, popper, portal, presence, primitive-elements,
progress, radio-group, roving-focus, select, sheet, slider, slot, toggle, toggle-group,
tooltip, visibility-hidden
