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

const [createToggleGroupContext, createToggleGroupScope] = createContextScope(TOGGLE_GROUP_NAME, [
  createRovingFocusGroupScope,
])
const useRovingFocusGroupScope = createRovingFocusGroupScope()

type IToggleGroupProps = IToggleGroup.ISingle | IToggleGroup.IMultiple

export namespace IToggleGroup {
  export type IScoped<TProps> = TProps & { __scopeToggleGroup?: Scope }

  export interface IContext {
    type: 'single' | 'multiple'
    value: string[]
    onItemActivate(value: string): void
    onItemDeactivate(value: string): void
    rovingFocus: boolean
    disabled: boolean
    dir: Direction
  }

  export interface IImpl extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
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
    orientation?: React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>['orientation']
    /**
     * The reading direction.
     */
    dir?: React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>['dir']
    /**
     * Whether keyboard navigation should loop.
     * @defaultValue true
     */
    loop?: React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>['loop']
  }

  export interface ISingle extends IImpl {
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

  export interface IMultiple extends IImpl {
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

  export interface IImplPrivate extends IImpl {
    value: string[]
    onItemActivate(value: string): void
    onItemDeactivate(value: string): void
  }
}

const [ToggleGroupProvider, useToggleGroupContext] = createToggleGroupContext<IToggleGroup.IContext>(TOGGLE_GROUP_NAME)

const ToggleGroup = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IToggleGroupProps>(
  (props: IToggleGroup.IScoped<IToggleGroupProps>, forwardedRef) => {
    if (props.type === 'single') {
      return <ToggleGroupSingle {...(props as IToggleGroup.IScoped<IToggleGroup.ISingle>)} ref={forwardedRef} />
    }
    if (props.type === 'multiple') {
      return <ToggleGroupMultiple {...(props as IToggleGroup.IScoped<IToggleGroup.IMultiple>)} ref={forwardedRef} />
    }
    // Fallback to single
    return <ToggleGroupSingle {...(props as IToggleGroup.IScoped<IToggleGroup.ISingle>)} ref={forwardedRef} />
  },
)

ToggleGroup.displayName = TOGGLE_GROUP_NAME

const ToggleGroupSingle = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IToggleGroup.ISingle>(
  (props: IToggleGroup.IScoped<IToggleGroup.ISingle>, forwardedRef) => {
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

const ToggleGroupMultiple = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IToggleGroup.IMultiple>(
  (props: IToggleGroup.IScoped<IToggleGroup.IMultiple>, forwardedRef) => {
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

const ToggleGroupImpl = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IToggleGroup.IImplPrivate>(
  (props: IToggleGroup.IScoped<IToggleGroup.IImplPrivate>, forwardedRef) => {
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

export type { IToggleGroupProps }
export {
  createToggleGroupScope,
  TOGGLE_GROUP_NAME,
  ToggleGroup,
  ToggleGroupProvider,
  useRovingFocusGroupScope,
  useToggleGroupContext,
}
