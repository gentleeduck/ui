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

You are an expert on the headless primitive layer. Your scope is strictly `packages/duck-primitives/src/`. These are unstyled, accessibility-first React components that handle ARIA, keyboard nav, focus trapping, and state internally. The styled registry-ui components are built on top of these.

## Where Primitives Live

```
packages/duck-primitives/src/{name}/
├── {name}.tsx           # Root component (React.FC), context provider, state
├── trigger.tsx          # Trigger sub-component (React.forwardRef)
├── content.tsx          # Content sub-component (React.forwardRef)
├── {sub-part}.tsx       # Other sub-parts (overlay, portal, arrow, close, etc.)
├── {name}.libs.ts       # Internal helpers (NOT exported from index), may have 'use client'
└── index.ts             # Named exports only (NEVER wildcard)
```

Import: `import * as DialogPrimitive from '@gentleduck/primitives/dialog'`

Built with tsdown. Exports: `"./*": { "types": "./dist/*/index.d.ts", "default": "./dist/*/index.js" }`

## Architecture Patterns

### Scoped Context (createContextScope)

Every primitive uses `createContextScope` for isolated, composable context:

```tsx
import { createContextScope, type Scope } from '../libs/create-context'

const DIALOG_NAME = 'Dialog'
export type ScopedProps<P> = P & { __scopeDialog?: Scope }
export const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME)
export const [DialogProvider, useDialogContext] = createDialogContext<DialogContextValue>(DIALOG_NAME)
```

The scoped hook always takes two args: `useDialogContext(COMPONENT_NAME, __scopeDialog)`.

For cross-primitive composition (e.g., Select depends on Popper):
```tsx
const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
  createCollectionScope, createPopperScope,
])
export const usePopperScope = createPopperScope()
// In root: const popperScope = usePopperScope(__scopeSelect)
// Then:    <PopperPrimitive.Root {...popperScope}>
```

### State via useControllableState

All open/close state uses this pattern. The `caller` param is required:

```tsx
const [open, setOpen] = useControllableState({
  prop: openProp, defaultProp: defaultOpen ?? false,
  onChange: onOpenChange, caller: DIALOG_NAME,
})
```

### Root = React.FC, Sub-parts = React.forwardRef

Root components are provider-only (no DOM), so they use `React.FC`. Sub-components that render DOM use `React.forwardRef`. See [CODING-STYLE.md](references/CODING-STYLE.md) for full code examples of both patterns.

### Slot and asChild

`Primitive.button` renders a native `<button>` by default. When `asChild` is true, it renders a `Slot` that merges all behavior (props, ref, event handlers) onto the consumer's child element.

## Decision Guide: Choosing the Right Primitive Building Block

### DismissableLayer vs useEscapeKeydown
- Use `DismissableLayer` when you need: Escape to close, click-outside to close, focus-outside to close, and correct stacking with nested layers (e.g., Dialog, Popover, DropdownMenu).
- Use `useEscapeKeydown` alone only for lightweight components that never stack and only need Escape (rare — Tooltip uses its own timer-based close instead).

### Presence vs conditional rendering (`{open && <Content />}`)
- Use `<Presence present={...}>` when the component needs exit animations. Presence keeps the element in the DOM during the leave animation and removes it after.
- Use conditional rendering only for components that never animate (e.g., internal helper wrappers).
- `forceMount` on Portal/Content keeps the element in DOM permanently; Presence then controls visibility for animation. Content reads `forceMount` from its parent Portal via `usePortalContext`.

### Portal: when and how
- Use a Portal sub-component (like `DialogPortal`) when content must escape parent overflow/stacking contexts (modals, dropdowns, popovers, tooltips).
- Portal wraps each child in `<Presence>` + `<PortalPrimitive>` and provides `forceMount` to children via its own context.
- The base `Portal` primitive (`src/portal/`) uses `ReactDOM.createPortal` to `document.body` by default, accepts a `container` prop for custom targets.

### Overlay: when to include one
- Include an Overlay sub-component for modal primitives (Dialog, Sheet, AlertDialog) that need a backdrop.
- Overlay only renders when `context.modal` is true. It wraps content in `RemoveScroll` for scroll locking.
- Non-modal primitives (Popover, Tooltip, HoverCard) never use Overlay.

### Focus restoration
- Modal content: always restore focus to trigger on close via `context.triggerRef.current?.focus()` in `onCloseAutoFocus`.
- Non-modal content: only restore focus if the user did NOT interact outside. Track this with `hasInteractedOutsideRef`.

## Internal Hooks & Libs

Hooks (`src/hooks/`): `useCallbackRef`, `useControllableState` (requires `caller`), `useEscapeKeydown`, `useFocusGuards`, `useId`, `useLayoutEffect` (isomorphic), `usePrevious`, `useSize`, `useStateMachine`

Libs (`src/libs/`): `createContext`/`createContextScope`, `createCollection`, `composeEventHandlers`, `useComposedRefs`/`composeRefs`

## Creating a New Primitive

1. Create `packages/duck-primitives/src/{name}/` directory.
2. **Read `dialog/` first** as the canonical reference primitive.
3. Create `{name}.tsx` — define `COMPONENT_NAME` const, `ScopedProps<P>`, `createContextScope`, context value type, `useControllableState` for state, `useDirection(dir)`, `useId()` for IDs. Export `getState` helper. Set `displayName`.
4. Create sub-part files (trigger, content, etc.) — each defines its own `COMPONENT_NAME`, uses `useComposedRefs`, `composeEventHandlers`, `Primitive.{tag}`. Required attrs: `data-slot`, `data-state`, `dir`, `type="button"` on buttons. Props spread after data/aria attrs, `ref` last.
5. If the primitive needs a popup layer: create `portal.tsx` (FC, not forwardRef) with its own context providing `forceMount`; create `content.tsx` wrapping children in `<Presence>` > `<FocusScope>` > `<DismissableLayer>`.
6. If modal: add `overlay.tsx` with `RemoveScroll`, `hideOthers` in content, `disableOutsidePointerEvents`.
7. If item-based (menu, select): use `createCollection` for keyboard nav and typeahead.
8. Create `index.ts` — named exports with full name + short alias. Export `create{Name}Scope` for composition.
9. Follow the [Conventions Checklist](references/CODING-STYLE.md#conventions-checklist) before finishing.

## Common Errors

1. **Context error** — sub-component outside its Provider (check `__scope` threading)
2. **Event swallowing** — not using `composeEventHandlers` (replaces consumer's handler)
3. **State desync** — mixing controlled/uncontrolled; forgetting `caller` in `useControllableState`
4. **SSR hydration** — using `useLayoutEffect` instead of the isomorphic version from `../hooks/use-layout-effect`

## Do Not

- Use wildcard exports in index.ts — always named exports with full + short alias
- Import from registry-ui or from sibling primitives — only from `../libs/`, `../hooks/`, and shared primitives like `../portal`, `../presence`, `../primitive-elements`
- Use `React.forwardRef` for root/provider components — use `React.FC` (no DOM)
- Use `React.FC` for sub-components that render DOM — use `React.forwardRef`
- Omit the `caller` param from `useControllableState`
- Call the scoped context hook with only one arg — always `(COMPONENT_NAME, __scope)`
- Use `data-disabled="true"` — use `data-disabled=""` (empty string) to match `[data-disabled]`
- Skip `data-slot`, `data-state`, `dir`, or `type="button"` attributes
- Create a primitive without `COMPONENT_NAME` constant at top of each file
- Forget `displayName` on every component (including internal impl components)
- Skip `useComposedRefs` when both `forwardedRef` and a context ref are needed

## Edge Cases

See [CODING-STYLE.md](references/CODING-STYLE.md) for detailed edge cases with code. Key ones:
- **Nested layers**: Escape only closes the topmost DismissableLayer; right-click outside prevents dismiss
- **Modal vs non-modal**: Dialog delegates to separate impl components; modal traps focus + uses `aria-hidden` via `hideOthers`
- **Scope composition**: Dependent primitives must compose scopes and thread `usePopperScope(__scope)`
- **Collection pattern**: Item-based primitives use `createCollection` for keyboard nav and typeahead
- **Scroll locking**: Modal overlay uses `RemoveScroll` (from `react-remove-scroll`); `dialog.libs.ts` has ref-counted `lockScrollbar` for additional scroll lock needs
- **RTL**: Root uses `useDirection(dir)`; sub-components pass `dir={context.dir}`

## Available Primitives

alert-dialog, arrow, avatar, checkers, command, context-menu, dialog, direction,
dismissable-layer, dropdown-menu, focus-scope, hover-card, input-otp, menu, menubar,
mount, navigation-menu, pagination, popover, popper, portal, presence, primitive-elements,
progress, radio-group, roving-focus, select, sheet, slider, slot, toggle, toggle-group,
tooltip, visibility-hidden
