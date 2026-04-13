import * as React from 'react'
import type { Direction } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { createRovingFocusGroupScope } from '../roving-focus'

const TOGGLE_GROUP_NAME = 'ToggleGroup'

type ScopedProps<P> = P & { __scopeToggleGroup?: Scope }
const [createToggleGroupContext, createToggleGroupScope] = createContextScope(TOGGLE_GROUP_NAME, [
  createRovingFocusGroupScope,
])
const useRovingFocusGroupScope = createRovingFocusGroupScope()

type ToggleGroupContextValue = {
  type: 'single' | 'multiple'
  value: string[]
  onItemActivate(value: string): void
  onItemDeactivate(value: string): void
  rovingFocus: boolean
  disabled: boolean
  dir: Direction
}

const [ToggleGroupProvider, useToggleGroupContext] =
  createToggleGroupContext<ToggleGroupContextValue>(TOGGLE_GROUP_NAME)

type ToggleGroupElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>

type ToggleGroupSingleProps = IToggleGroupImplProps & {
  /**
   * Allow only one button to be pressed at a time.
   */
  type: 'single'
  /**
   * The controlled value of the pressed item.
   */
  value?: string
  /**
   * The value of the item that is pressed when initially rendered.
   */
  defaultValue?: string
  /**
   * Event handler called when the value changes.
   */
  onValueChange?(value: string): void
}

type ToggleGroupMultipleProps = IToggleGroupImplProps & {
  /**
   * Allow multiple buttons to be pressed at the same time.
   */
  type: 'multiple'
  /**
   * The controlled value of the pressed items.
   */
  value?: string[]
  /**
   * The value of the items that are pressed when initially rendered.
   */
  defaultValue?: string[]
  /**
   * Event handler called when the value changes.
   */
  onValueChange?(value: string[]): void
}

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

const ToggleGroup = React.forwardRef<ToggleGroupElement, ToggleGroupProps>(
  (props: ScopedProps<ToggleGroupProps>, forwardedRef) => {
    if (props.type === 'single') {
      return <ToggleGroupSingle {...(props as ScopedProps<ToggleGroupSingleProps>)} ref={forwardedRef} />
    }
    if (props.type === 'multiple') {
      return <ToggleGroupMultiple {...(props as ScopedProps<ToggleGroupMultipleProps>)} ref={forwardedRef} />
    }
    // Fallback to single
    return <ToggleGroupSingle {...(props as ScopedProps<ToggleGroupSingleProps>)} ref={forwardedRef} />
  },
)

ToggleGroup.displayName = TOGGLE_GROUP_NAME

const ToggleGroupSingle = React.forwardRef<ToggleGroupElement, ToggleGroupSingleProps>(
  (props: ScopedProps<ToggleGroupSingleProps>, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, ...toggleGroupProps } = props

    const [value = '', setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? '',
      onChange: onValueChange,
      caller: TOGGLE_GROUP_NAME,
    })

    return (
      <ToggleGroupImpl
        {...toggleGroupProps}
        ref={forwardedRef}
        value={value ? [value] : []}
        onItemActivate={setValue}
        onItemDeactivate={React.useCallback(() => setValue(''), [setValue])}
      />
    )
  },
)

ToggleGroupSingle.displayName = `${TOGGLE_GROUP_NAME}Single`

const ToggleGroupMultiple = React.forwardRef<ToggleGroupElement, ToggleGroupMultipleProps>(
  (props: ScopedProps<ToggleGroupMultipleProps>, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, ...toggleGroupProps } = props

    const [value = [], setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? [],
      onChange: onValueChange,
      caller: TOGGLE_GROUP_NAME,
    })

    const handleItemActivate = React.useCallback(
      (itemValue: string) => setValue((prevValue = []) => [...prevValue, itemValue]),
      [setValue],
    )

    const handleItemDeactivate = React.useCallback(
      (itemValue: string) => setValue((prevValue = []) => prevValue.filter((v) => v !== itemValue)),
      [setValue],
    )

    return (
      <ToggleGroupImpl
        {...toggleGroupProps}
        ref={forwardedRef}
        value={value}
        onItemActivate={handleItemActivate}
        onItemDeactivate={handleItemDeactivate}
      />
    )
  },
)

ToggleGroupMultiple.displayName = `${TOGGLE_GROUP_NAME}Multiple`

type ToggleGroupImplElement = React.ComponentRef<typeof Primitive.div>

interface IToggleGroupImplProps extends PrimitiveDivProps {
  type: 'single' | 'multiple'
  /**
   * Whether roving focus should be used for keyboard navigation.
   * @defaultValue true
   */
  rovingFocus?: boolean
  /**
   * Whether the group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * The orientation of the group for arrow key navigation.
   */
  orientation?: RovingFocusGroupProps['orientation']
  /**
   * The reading direction.
   */
  dir?: RovingFocusGroupProps['dir']
  /**
   * Whether keyboard navigation should loop.
   * @defaultValue true
   */
  loop?: RovingFocusGroupProps['loop']
}

interface IToggleGroupImplPrivateProps extends IToggleGroupImplProps {
  value: string[]
  onItemActivate(value: string): void
  onItemDeactivate(value: string): void
}

const ToggleGroupImpl = React.forwardRef<ToggleGroupImplElement, IToggleGroupImplPrivateProps>(
  (props: ScopedProps<IToggleGroupImplPrivateProps>, forwardedRef) => {
    const {
      __scopeToggleGroup,
      type,
      value,
      onItemActivate,
      onItemDeactivate,
      rovingFocus = true,
      disabled = false,
      orientation,
      dir,
      loop = true,
      ...groupProps
    } = props
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToggleGroup)
    const direction = useDirection(dir)

    const commonProps = {
      role: 'group' as const,
      'data-slot': 'toggle-group',
      dir: direction,
      ...groupProps,
      ref: forwardedRef,
    }

    return (
      <ToggleGroupProvider
        scope={__scopeToggleGroup}
        type={type}
        value={value}
        onItemActivate={onItemActivate}
        onItemDeactivate={onItemDeactivate}
        rovingFocus={rovingFocus}
        disabled={disabled}
        dir={direction}>
        {rovingFocus ? (
          <RovingFocusGroup.Root
            asChild
            {...rovingFocusGroupScope}
            orientation={orientation}
            dir={direction}
            loop={loop}>
            <Primitive.div {...commonProps} />
          </RovingFocusGroup.Root>
        ) : (
          <Primitive.div {...commonProps} />
        )}
      </ToggleGroupProvider>
    )
  },
)

ToggleGroupImpl.displayName = `${TOGGLE_GROUP_NAME}Impl`

export type { ScopedProps, IToggleGroupImplProps, ToggleGroupMultipleProps, ToggleGroupProps, ToggleGroupSingleProps }
export {
  createToggleGroupScope,
  TOGGLE_GROUP_NAME,
  ToggleGroup,
  ToggleGroupProvider,
  useRovingFocusGroupScope,
  useToggleGroupContext,
}
