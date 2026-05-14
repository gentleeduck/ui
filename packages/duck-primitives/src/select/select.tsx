'use client'

import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { usePrevious } from '../hooks/use-previous'
import { useComposedRefs } from '../libs/compose-ref'
import { createCollection } from '../libs/create-collection'
import { createContextScope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'
import { VisuallyHidden } from '../visibility-hidden'
import type { ISelect } from './select.types'

export const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown']
export const SELECTION_KEYS = [' ', 'Enter']
export const CONTENT_MARGIN = 10

const SELECT_NAME = 'Select'

export const [Collection, useCollection, createCollectionScope] = createCollection<HTMLDivElement, ISelect.IItemData>(
  SELECT_NAME,
)

const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
  createCollectionScope,
  createPopperScope,
])
export const usePopperScope = createPopperScope()

export { createSelectScope }

export const [SelectProvider, useSelectContext] = createSelectContext<ISelect.IContext>(SELECT_NAME)

export const [SelectNativeOptionsProvider, useSelectNativeOptionsContext] =
  createSelectContext<ISelect.INativeOptionsContext>(SELECT_NAME)

const CONTENT_NAME = 'SelectContent'
export const [SelectContentProvider, useSelectContentContext] =
  createSelectContext<ISelect.IContentContext>(CONTENT_NAME)

export const [SelectViewportProvider, useSelectViewportContext] = createSelectContext<ISelect.IViewportContext>(
  CONTENT_NAME,
  {},
)

const ITEM_NAME = 'SelectItem'
export const [SelectItemContextProvider, useSelectItemContext] = createSelectContext<ISelect.IItemContext>(ITEM_NAME)

const GROUP_NAME = 'SelectGroup'
export const [SelectGroupContextProvider, useSelectGroupContext] =
  createSelectContext<ISelect.IGroupContext>(GROUP_NAME)

export const Select: React.FC<ISelect.IProps> = (props: ISelect.IScoped<ISelect.IProps>) => {
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

  // default true so SSR forms still bubble events without JS
  const isFormControl = trigger ? form || !!trigger.closest('form') : true
  const [nativeOptionsSet, setNativeOptionsSet] = React.useState(new Set<ISelect.INativeOption>())

  // Native <select> binds defaultValue only when the matching <option> is mounted at the SAME
  // commit. Items take a few renders to surface their values; key the <select> so React rebuilds
  // it whenever the option set changes.
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

    // bubble value change to parents (e.g. form change event)
    React.useEffect(() => {
      const select = ref.current
      if (!select) return
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
