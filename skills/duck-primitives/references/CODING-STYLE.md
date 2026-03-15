# Primitive Coding Style Guide

Follow this exact pattern when creating or modifying a primitive. All snippets below are from real code in the codebase.

## index.ts — Named Exports Only

Real example from `dialog/index.ts`:

```ts
export type { DialogCloseProps } from './close'
export { DialogClose, DialogClose as Close } from './close'
export type { DialogContentProps } from './content'
export { DialogContent, DialogContent as Content } from './content'
export type { DialogDescriptionProps } from './description'
export { DialogDescription, DialogDescription as Description } from './description'
export type { DialogProps } from './dialog'
export { createDialogScope, Dialog, Dialog as Root, getState, WarningProvider } from './dialog'
export type { DialogOverlayProps } from './overlay'
export { DialogOverlay, DialogOverlay as Overlay } from './overlay'
export type { DialogPortalProps } from './portal'
export { DialogPortal, DialogPortal as Portal } from './portal'
export type { DialogTitleProps } from './title'
export { DialogTitle, DialogTitle as Title } from './title'
export type { DialogTriggerProps } from './trigger'
export { DialogTrigger, DialogTrigger as Trigger } from './trigger'
```

Rules:
- Export both the full name (`DialogContent`) and the short alias (`Content`)
- Root component is named `Dialog` (not `DialogRoot`), aliased as `Root`
- Export `createDialogScope` for scope composition by dependent primitives
- Export type-only props interfaces separately with `export type`

## Root Component Pattern (React.FC)

Root components are providers — they render no DOM element and do not forward refs. They use `React.FC`.

Real code from `dialog/dialog.tsx`:

```tsx
import * as React from 'react'
import type { Direction } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import type { Scope } from '../libs/create-context'
import { createContext, createContextScope } from '../libs/create-context'

const DIALOG_NAME = 'Dialog'

export type ScopedProps<P> = P & { __scopeDialog?: Scope }
export const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME)

export type DialogContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentRef: React.RefObject<DialogContentElement | null>
  contentId: string
  titleId: string
  descriptionId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  modal: boolean
  dir: Direction
}

export const [DialogProvider, useDialogContext] = createDialogContext<DialogContextValue>(DIALOG_NAME)

export interface DialogProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean
  dir?: Direction
}

const Dialog: React.FC<DialogProps> = (props: ScopedProps<DialogProps>) => {
  const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, dir, modal = true } = props
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<DialogContentElement>(null)
  const direction = useDirection(dir)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME,
  })

  return (
    <DialogProvider
      scope={__scopeDialog}
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={useId()}
      titleId={useId()}
      descriptionId={useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
      modal={modal}
      dir={direction}>
      {children}
    </DialogProvider>
  )
}

Dialog.displayName = DIALOG_NAME
```

Key details:
- `createContextScope` returns `[createDialogContext, createDialogScope]` — a factory + a scope hook
- `createDialogContext<T>(NAME)` returns `[Provider, useHook]`
- Provider receives `scope={__scopeDialog}` prop
- `useControllableState` requires `caller` param
- `useId()` for all IDs (SSR-safe)
- `useDirection(dir)` resolves RTL direction
- `getState` helper exported for `data-state`:
  ```tsx
  export function getState(open: boolean) {
    return open ? 'open' : 'closed'
  }
  ```

## Sub-Component Pattern (React.forwardRef)

Real code from `dialog/trigger.tsx`:

```tsx
import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { getState, type ScopedProps, useDialogContext } from './dialog'

const TRIGGER_NAME = 'DialogTrigger'

type DialogTriggerElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
export interface DialogTriggerProps extends PrimitiveButtonProps {}

export const DialogTrigger = React.forwardRef<DialogTriggerElement, DialogTriggerProps>(
  (props: ScopedProps<DialogTriggerProps>, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog)
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)
    return (
      <Primitive.button
        data-slot="dialog-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        dir={context.dir}
        {...triggerProps}
        ref={composedTriggerRef}
        onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
      />
    )
  },
)

DialogTrigger.displayName = TRIGGER_NAME
```

## Portal Pattern (React.FC)

Portals are providers (no DOM of their own), so they use `React.FC`. They provide `forceMount` to children via their own context. Real code from `dialog/portal.tsx`:

```tsx
const PORTAL_NAME = 'DialogPortal'

type PortalContextValue = { forceMount?: true }
export const [PortalProvider, usePortalContext] = createDialogContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
})

export interface DialogPortalProps {
  children?: React.ReactNode
  container?: PortalProps['container']
  forceMount?: true
}

const DialogPortal: React.FC<DialogPortalProps> = (props: ScopedProps<DialogPortalProps>) => {
  const { __scopeDialog, forceMount, children, container } = props
  const context = useDialogContext(PORTAL_NAME, __scopeDialog)
  return (
    <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
      {React.Children.map(children, (child) => (
        <Presence present={forceMount || context.open}>
          <PortalPrimitive asChild container={container}>
            {child}
          </PortalPrimitive>
        </Presence>
      ))}
    </PortalProvider>
  )
}
```

Key: each child is individually wrapped in `<Presence>` then `<PortalPrimitive asChild>`. The base `Portal` primitive uses `ReactDOM.createPortal` to `document.body` by default; it delays mounting via `useLayoutEffect` to avoid SSR mismatches.

## Overlay Pattern (React.forwardRef, modal only)

Overlay renders a backdrop behind content. Only renders when `context.modal` is true. Real code from `dialog/overlay.tsx`:

```tsx
const OVERLAY_NAME = 'DialogOverlay'

export const DialogOverlay = React.forwardRef<DialogOverlayElement, DialogOverlayProps>(
  (props: ScopedProps<DialogOverlayProps>, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog)
    const { forceMount = portalContext.forceMount, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog)
    return context.modal ? (
      <Presence present={forceMount || context.open}>
        <DialogOverlayImpl {...overlayProps} ref={forwardedRef} />
      </Presence>
    ) : null
  },
)
```

The impl wraps content in `RemoveScroll` (from `react-remove-scroll`) for scroll locking:

```tsx
const DialogOverlayImpl = React.forwardRef<DialogOverlayImplElement, DialogOverlayImplProps>(
  (props: ScopedProps<DialogOverlayImplProps>, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog)
    return (
      <RemoveScroll as={Slot} allowPinchZoom shards={[context.contentRef]}>
        <Primitive.div
          data-slot="dialog-overlay"
          data-state={getState(context.open)}
          dir={context.dir}
          {...overlayProps}
          ref={forwardedRef}
          style={{ pointerEvents: 'auto', ...overlayProps.style }}
        />
      </RemoveScroll>
    )
  },
)
```

Key: `shards={[context.contentRef]}` tells `RemoveScroll` to allow scrolling inside the dialog content itself. `pointerEvents: 'auto'` is required because `DismissableLayer` may set body pointer-events to `none`.

## Content Pattern (Presence + FocusScope + DismissableLayer)

Real code from `dialog/content.tsx` — shows the layered composition:

```tsx
export const DialogContent = React.forwardRef<DialogContentElement, DialogContentProps>(
  (props: ScopedProps<DialogContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog)
    const { forceMount = portalContext.forceMount, ...contentProps } = props
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
    return (
      <Presence present={forceMount || context.open}>
        {context.modal ? (
          <DialogContentModal {...contentProps} ref={forwardedRef} />
        ) : (
          <DialogContentNonModal {...contentProps} ref={forwardedRef} />
        )}
      </Presence>
    )
  },
)
```

The impl layer composes FocusScope and DismissableLayer:

```tsx
<FocusScope asChild loop trapped={trapFocus}
  onMountAutoFocus={onOpenAutoFocus} onUnmountAutoFocus={onCloseAutoFocus}>
  <DismissableLayer
    data-slot="dialog-content"
    role="dialog"
    id={context.contentId}
    aria-describedby={context.descriptionId}
    aria-labelledby={context.titleId}
    data-state={getState(context.open)}
    dir={context.dir}
    {...contentProps}
    ref={composedRefs}
    onDismiss={() => context.onOpenChange(false)}
  />
</FocusScope>
```

### Modal Content Specifics

The modal variant (`DialogContentModal`) does five extra things:
1. **Traps focus**: `trapFocus={context.open}` on `FocusScope`
2. **Hides siblings from screen readers**: `hideOthers(content)` from `aria-hidden` package
3. **Disables outside pointer events**: `disableOutsidePointerEvents` on `DismissableLayer`
4. **Restores focus to trigger**: prevents default `onCloseAutoFocus` and calls `context.triggerRef.current?.focus()`
5. **Blocks right-click dismiss**: prevents dismiss on right-click / ctrl+click outside

### Non-Modal Content Specifics

The non-modal variant (`DialogContentNonModal`):
1. Does NOT trap focus (`trapped={false}`)
2. Tracks `hasInteractedOutsideRef` to decide focus restoration — only restores to trigger if user did NOT interact outside
3. Prevents dismiss when clicking the trigger itself (avoids close-then-reopen flicker)

## Scope Composition Pattern

When a primitive depends on another (Select on Popper):

```tsx
// select/select.tsx
const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
  createCollectionScope,
  createPopperScope,
])
export const usePopperScope = createPopperScope()

// In the root component:
const popperScope = usePopperScope(__scopeSelect)
return (
  <PopperPrimitive.Root {...popperScope}>
    <SelectProvider scope={__scopeSelect}>
      {children}
    </SelectProvider>
  </PopperPrimitive.Root>
)
```

## Collection Pattern

Item-based primitives (Select, Menu) use `createCollection`:

```tsx
type ItemData = { value: string; disabled: boolean; textValue: string }
export const [Collection, useCollection, createCollectionScope] =
  createCollection<HTMLDivElement, ItemData>(SELECT_NAME)

// In root: <Collection.Provider scope={__scopeSelect}>
// In content: <Collection.Slot scope={__scopeSelect}>
// In each item: <Collection.ItemSlot scope={__scopeSelect} value={...} disabled={...} textValue={...}>
// To query items: const getItems = useCollection(__scopeSelect)
//                 const items = getItems()  // returns array of { ref, value, disabled, textValue }
```

## data-disabled Pattern

```tsx
data-disabled={isDisabled ? '' : undefined}
```

Always empty string (not `"true"`), so CSS `[data-disabled]` selector works. Use `undefined` to omit the attribute entirely when not disabled.

## Conventions Checklist

- [ ] `COMPONENT_NAME` constant at top of every file
- [ ] Root: `React.FC`, sub-parts: `React.forwardRef`
- [ ] `ScopedProps<P>` on all component props; destructure `__scope{Name}` first
- [ ] Context hook called with two args: `useDialogContext(COMPONENT_NAME, __scopeDialog)`
- [ ] `Primitive.{tag}` as the base element
- [ ] `composeEventHandlers` to chain handlers (never replace)
- [ ] `useComposedRefs` to merge forwarded ref with context refs
- [ ] `data-slot="{primitive}-{part}"` on every DOM element
- [ ] `data-state={getState(context.open)}` on stateful elements
- [ ] `data-disabled={isDisabled ? '' : undefined}` when applicable
- [ ] `type="button"` on button triggers (except Tooltip)
- [ ] `dir={context.dir}` on all sub-components
- [ ] `displayName` on every component (including internal ones like `DialogContentImpl`)
- [ ] `caller: COMPONENT_NAME` in `useControllableState`
- [ ] Props spread after data/aria attrs, `ref` last on JSX

## Edge Cases

### Modal vs Non-Modal Content
Dialog delegates to `DialogContentModal` or `DialogContentNonModal`. Modal version:
- Traps focus via `<FocusScope trapped={context.open}>`
- Hides other DOM from screen readers via `hideOthers` (aria-hidden)
- Disables outside pointer events
- Returns focus to trigger on close (`context.triggerRef.current?.focus()`)

Non-modal version:
- Does not trap focus (`trapped={false}`)
- Tracks `hasInteractedOutsideRef` to decide whether to return focus to trigger
- Prevents dismiss when clicking the trigger itself

### Nested Layers (DismissableLayer)
- Escape only closes the topmost DismissableLayer (checks `index === context.layers.size - 1`)
- Right-click outside does not dismiss (ctrl+click on Mac counts as right-click)
- `DismissableLayer` manages body `pointer-events: none` with reference counting across nested layers

### Portals and forceMount
- Content reads `forceMount` from parent Portal via `usePortalContext`
- `forceMount` keeps the element in the DOM permanently; Presence then controls visibility for CSS/animation
- Portal's default context provides `forceMount: undefined`, so content falls back to `context.open`

### Scroll Locking
- Modal overlay uses `RemoveScroll` from `react-remove-scroll` with `allowPinchZoom` and `shards` to allow scrolling inside the content
- `dialog.libs.ts` provides ref-counted `lockScrollbar`/`cleanLockScrollbar` for additional programmatic scroll lock needs
- Multiple nested modals are safe because `RemoveScroll` handles nesting internally

### RTL Support
- Root resolves direction: `const direction = useDirection(dir)`
- All sub-components pass `dir={context.dir}` to their base element

### Tooltip State Attribute
Tooltip uses a three-value `data-state`: `'closed' | 'delayed-open' | 'instant-open'` instead of the typical binary `'open' | 'closed'`.

### Cross-Primitive Composition
When a primitive wraps another (e.g., AlertDialog wraps Dialog, DropdownMenu wraps Menu):
- Compose scopes: `createContextScope(NAME, [createDialogScope])`
- Thread scope through: `const dialogScope = useDialogScope(__scopeAlertDialog)`
