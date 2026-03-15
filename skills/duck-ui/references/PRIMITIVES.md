# Primitives Reference

## Package: @gentleduck/primitives

Unstyled, accessibility-first React primitives. Each primitive handles ARIA roles, keyboard navigation, focus management, and state machines internally.

## Available Primitives

alert-dialog, arrow, avatar, checkers, command, context-menu, dialog, direction, dismissable-layer, dropdown-menu, focus-scope, hover-card, input-otp, menu, menubar, mount, navigation-menu, pagination, popover, popper, portal, presence, primitive-elements, progress, radio-group, roving-focus, select, sheet, slider, slot, toggle, toggle-group, tooltip, visibility-hidden

## Internal Hooks (packages/duck-primitives/src/hooks/)

- **useCallbackRef** — stable callback ref that updates on every render
- **useControllableState** — controlled/uncontrolled state pattern
- **useEscapeKeydown** — listen for Escape key globally
- **useFocusGuard** — prevent focus from leaving a boundary
- **useId** — SSR-safe unique ID generation
- **useLayoutEffect** — isomorphic useLayoutEffect
- **usePrevious** — track previous value of a variable
- **useSize** — observe element dimensions via ResizeObserver
- **useStateMachine** — finite state machine hook

## Internal Libs (packages/duck-primitives/src/libs/)

- **clamp** — clamp a number between min and max
- **composeEventHandler** — chain event handlers (original runs first)
- **composeRef** — merge multiple refs into one
- **createCollection** — collection pattern for roving focus items
- **createContext** — scoped context factory with displayName
- **getState** — convert boolean to "open"/"closed" data-state string
- **listNavigation** — arrow key navigation logic for lists
- **observeElementRect** — observe element position and size changes
- **sharedUtils** — common utilities (dispatchDiscreteCustomEvent)

## Key Patterns

### Scoped Context

Every primitive creates its own scoped context so multiple instances do not conflict:

```tsx
const [DialogProvider, useDialogContext] = createContext<DialogContextValue>('Dialog')
```

### Presence Animation

The Presence primitive handles mount/unmount animations:

```tsx
<Presence present={open}>
  <DialogContent />
</Presence>
```

### Slot / asChild

The Slot primitive merges props and ref onto a child element:

```tsx
<Primitive.button asChild>
  <MyCustomButton />  {/* Gets all button behavior */}
</Primitive.button>
```

### Primitive Elements

Base elements with asChild support for all HTML tags:

```tsx
import { Primitive } from '@gentleduck/primitives/primitive-elements'
// Primitive.button, Primitive.div, Primitive.span, Primitive.a, etc.
```
