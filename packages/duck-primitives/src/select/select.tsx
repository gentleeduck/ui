'use client'

import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { usePrevious } from '../hooks/use-previous'
import { useComposedRefs } from '../libs/compose-ref'
import { createCollection } from '../libs/create-collection'
import { createContextScope, type Scope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'
import { VisuallyHidden } from '../visibility-hidden'

type Direction = 'ltr' | 'rtl'

export const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown']
export const SELECTION_KEYS = [' ', 'Enter']
export const CONTENT_MARGIN = 10

const SELECT_NAME = 'Select'

type ItemData = { value: string; disabled: boolean; textValue: string }
export const [Collection, useCollection, createCollectionScope] = createCollection<HTMLDivElement, ItemData>(
  SELECT_NAME,
)

export type ScopedProps<P> = P & { __scopeSelect?: Scope }
const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
  createCollectionScope,
  createPopperScope,
])
export const usePopperScope = createPopperScope()

export { createSelectScope }

type SelectContextValue = {
  trigger: HTMLButtonElement | null
  onTriggerChange(node: HTMLButtonElement | null): void
  valueNode: HTMLSpanElement | null
  onValueNodeChange(node: HTMLSpanElement | null): void
  valueNodeHasChildren: boolean
  onValueNodeHasChildrenChange(hasChildren: boolean): void
  contentId: string
  value: string | undefined
  onValueChange(value: string): void
  open: boolean
  required?: boolean
  onOpenChange(open: boolean): void
  dir: SelectProps['dir']
  triggerPointerDownPosRef: React.RefObject<{ x: number; y: number } | null>
  disabled?: boolean
}

export const [SelectProvider, useSelectContext] = createSelectContext<SelectContextValue>(SELECT_NAME)

type NativeOption = React.ReactElement<React.ComponentProps<'option'>>

type SelectNativeOptionsContextValue = {
  onNativeOptionAdd(option: NativeOption): void
  onNativeOptionRemove(option: NativeOption): void
}
export const [SelectNativeOptionsProvider, useSelectNativeOptionsContext] =
  createSelectContext<SelectNativeOptionsContextValue>(SELECT_NAME)

export type SelectContentContextValue = {
  content?: HTMLDivElement | null
  viewport?: HTMLDivElement | null
  onViewportChange?: (node: HTMLDivElement | null) => void
  itemRefCallback?: (node: HTMLDivElement | null, value: string, disabled: boolean) => void
  selectedItem?: HTMLDivElement | null
  onItemLeave?: () => void
  itemTextRefCallback?: (node: HTMLSpanElement | null, value: string, disabled: boolean) => void
  focusSelectedItem?: () => void
  selectedItemText?: HTMLSpanElement | null
  position?: 'item-aligned' | 'popper'
  isPositioned?: boolean
  searchRef?: React.RefObject<string>
  allowTextPortal?: boolean
}

const CONTENT_NAME = 'SelectContent'
export const [SelectContentProvider, useSelectContentContext] =
  createSelectContext<SelectContentContextValue>(CONTENT_NAME)

export type SelectViewportContextValue = {
  contentWrapper?: HTMLDivElement | null
  shouldExpandOnScrollRef?: React.RefObject<boolean>
  onScrollButtonChange?: (node: HTMLDivElement | null) => void
}

export const [SelectViewportProvider, useSelectViewportContext] = createSelectContext<SelectViewportContextValue>(
  CONTENT_NAME,
  {},
)

export type SelectItemContextValue = {
  value: string
  disabled: boolean
  textId: string
  isSelected: boolean
  onItemTextChange(node: HTMLSpanElement | null): void
}

const ITEM_NAME = 'SelectItem'
export const [SelectItemContextProvider, useSelectItemContext] = createSelectContext<SelectItemContextValue>(ITEM_NAME)

type SelectGroupContextValue = { id: string }
const GROUP_NAME = 'SelectGroup'
export const [SelectGroupContextProvider, useSelectGroupContext] =
  createSelectContext<SelectGroupContextValue>(GROUP_NAME)

interface ISelectSharedProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  dir?: Direction
  name?: string
  autoComplete?: string
  disabled?: boolean
  required?: boolean
  form?: string
}

export type SelectProps = ISelectSharedProps & {
  value?: string
  defaultValue?: string
  onValueChange?(value: string): void
}

export const Select: React.FC<SelectProps> = (props: ScopedProps<SelectProps>) => {
  const {
    __scopeSelect,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    dir,
    name,
    autoComplete,
    disabled,
    required,
    form,
  } = props
  const popperScope = usePopperScope(__scopeSelect)
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null)
  const [valueNode, setValueNode] = React.useState<HTMLSpanElement | null>(null)
  const [valueNodeHasChildren, setValueNodeHasChildren] = React.useState(false)
  const direction = useDirection(dir)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SELECT_NAME,
  })
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
    caller: SELECT_NAME,
  })
  const triggerPointerDownPosRef = React.useRef<{ x: number; y: number } | null>(null)

  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = trigger ? form || !!trigger.closest('form') : true
  const [nativeOptionsSet, setNativeOptionsSet] = React.useState(new Set<NativeOption>())

  // The native `select` only associates the correct default value if the corresponding
  // `option` is rendered as a child **at the same time** as itself.
  // Because it might take a few renders for our items to gather the information to build
  // the native `option`(s), we generate a key on the `select` to make sure React re-builds it
  // each time the options change.
  const nativeSelectKey = Array.from(nativeOptionsSet)
    .map((option) => option.props.value)
    .join(';')

  return (
    <PopperPrimitive.Root {...popperScope}>
      <SelectProvider
        required={required}
        scope={__scopeSelect}
        trigger={trigger}
        onTriggerChange={setTrigger}
        valueNode={valueNode}
        onValueNodeChange={setValueNode}
        valueNodeHasChildren={valueNodeHasChildren}
        onValueNodeHasChildrenChange={setValueNodeHasChildren}
        contentId={useId()}
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
        dir={direction}
        triggerPointerDownPosRef={triggerPointerDownPosRef}
        disabled={disabled}>
        <Collection.Provider scope={__scopeSelect}>
          <SelectNativeOptionsProvider
            scope={props.__scopeSelect}
            onNativeOptionAdd={React.useCallback((option) => {
              setNativeOptionsSet((prev) => new Set(prev).add(option))
            }, [])}
            onNativeOptionRemove={React.useCallback((option) => {
              setNativeOptionsSet((prev) => {
                const optionsSet = new Set(prev)
                optionsSet.delete(option)
                return optionsSet
              })
            }, [])}>
            {children}
          </SelectNativeOptionsProvider>
        </Collection.Provider>

        {isFormControl ? (
          <BubbleSelect
            key={nativeSelectKey}
            aria-hidden
            required={required}
            tabIndex={-1}
            name={name}
            autoComplete={autoComplete}
            value={value}
            // enable form autofill
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
            form={form}>
            {value === undefined ? <option value="" /> : null}
            {Array.from(nativeOptionsSet)}
          </BubbleSelect>
        ) : null}
      </SelectProvider>
    </PopperPrimitive.Root>
  )
}

Select.displayName = SELECT_NAME

const BubbleSelect = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<'select'>>(
  (props, forwardedRef) => {
    const { value, ...selectProps } = props
    const ref = React.useRef<HTMLSelectElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const prevValue = usePrevious(value)

    // Bubble value change to parents (e.g form change event)
    React.useEffect(() => {
      // biome-ignore lint/style/noNonNullAssertion: ref is always mounted when this effect runs (component renders the select element)
      const select = ref.current!
      const selectProto = window.HTMLSelectElement.prototype
      const descriptor = Object.getOwnPropertyDescriptor(selectProto, 'value') as PropertyDescriptor
      const setValue = descriptor.set
      if (prevValue !== value && setValue) {
        const event = new Event('change', { bubbles: true })
        setValue.call(select, value)
        select.dispatchEvent(event)
      }
    }, [prevValue, value])

    return (
      <VisuallyHidden asChild>
        <select {...selectProps} ref={composedRefs} defaultValue={value} />
      </VisuallyHidden>
    )
  },
)

BubbleSelect.displayName = 'BubbleSelect'
