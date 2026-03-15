# Primitive Coding Style Guide

Follow this exact pattern when creating or modifying a primitive.

## File Structure

```
packages/duck-primitives/src/{name}/
├── {name}.tsx           # Root: context, state, provider
├── trigger.tsx          # Trigger part
├── content.tsx          # Content part
├── {part}.tsx           # Additional parts (overlay, portal, arrow, etc.)
├── {name}.libs.ts       # Internal helpers (NOT exported from index)
└── index.ts             # Named exports only
```

## index.ts — Named Exports Only

```ts
export type { DialogContentProps } from './content'
export { DialogContent, DialogContent as Content } from './content'
export type { DialogTriggerProps } from './trigger'
export { DialogTrigger, DialogTrigger as Trigger } from './trigger'
export { DialogRoot, DialogRoot as Root } from './dialog'
```

Always export both the full name (`DialogContent`) and the short alias (`Content`).

## Root Component Pattern

```tsx
import * as React from 'react'
import { createContext } from '../libs/create-context'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'

const COMPONENT_NAME = 'Dialog'

// 1. Scoped context
interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentId: string
  triggerId: string
}

const [DialogProvider, useDialogContext] = createContext<DialogContextValue>(COMPONENT_NAME)

// 2. ScopedProps type for __scope prop
type ScopedProps<P> = P & { __scopeDialog?: Scope }

// 3. Root component manages state, provides context
interface DialogRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function DialogRoot(props: ScopedProps<DialogRootProps>) {
  const { __scopeDialog, open: openProp, defaultOpen = false, onOpenChange, children } = props
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })
  const contentId = useId()
  const triggerId = useId()

  return (
    <DialogProvider
      contentId={contentId}
      onOpenChange={setOpen}
      open={open}
      scope={__scopeDialog}
      triggerId={triggerId}>
      {children}
    </DialogProvider>
  )
}

DialogRoot.displayName = COMPONENT_NAME
```

## Sub-Component Pattern

```tsx
import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useDialogContext, type ScopedProps } from './dialog'

const TRIGGER_NAME = 'DialogTrigger'

type DialogTriggerElement = React.ComponentRef<typeof Primitive.button>

export interface DialogTriggerProps extends React.ComponentPropsWithRef<typeof Primitive.button> {}

export const DialogTrigger = React.forwardRef<DialogTriggerElement, DialogTriggerProps>(
  (props: ScopedProps<DialogTriggerProps>, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog)

    return (
      <Primitive.button
        data-slot="dialog-trigger"
        data-state={context.open ? 'open' : 'closed'}
        aria-expanded={context.open}
        aria-controls={context.contentId}
        {...triggerProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(triggerProps.onClick, () => {
          context.onOpenChange(!context.open)
        })}
      />
    )
  },
)

DialogTrigger.displayName = TRIGGER_NAME
```

## Conventions

- COMPONENT_NAME constant at top of every file
- Always use `Primitive.{tag}` as the base element
- Always use `composeEventHandlers` to chain handlers (never replace)
- Always add `data-slot` and `data-state` attributes
- Always use `ScopedProps<P>` for the destructured props type
- Always destructure `__scope{Name}` first, then spread rest
- Props on JSX in alphabetical order, `data-slot` first, `ref` last
- Type the forwardRef element explicitly: `React.ComponentRef<typeof Primitive.button>`
- Interface for public props, type alias for internal/element types
- displayName on every component
