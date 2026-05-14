import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { createRovingFocusGroupScope } from '../roving-focus'
import type { IToggleGroup } from './toggle-group.types'

const TOGGLE_GROUP_NAME = 'ToggleGroup'

const [createToggleGroupContext, createToggleGroupScope] = createContextScope(TOGGLE_GROUP_NAME, [
  createRovingFocusGroupScope,
])
const useRovingFocusGroupScope = createRovingFocusGroupScope()

const [ToggleGroupProvider, useToggleGroupContext] = createToggleGroupContext<IToggleGroup.IContext>(TOGGLE_GROUP_NAME)

const ToggleGroup = React.forwardRef<React.ComponentRef<typeof Primitive.div>, IToggleGroup.IProps>(
  (props: IToggleGroup.IScoped<IToggleGroup.IProps>, forwardedRef) => {
    if (props.type === 'single') {
      return <ToggleGroupSingle {...(props as IToggleGroup.IScoped<IToggleGroup.ISingle>)} ref={forwardedRef} />
    }
    if (props.type === 'multiple') {
      return <ToggleGroupMultiple {...(props as IToggleGroup.IScoped<IToggleGroup.IMultiple>)} ref={forwardedRef} />
    }
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

export {
  createToggleGroupScope,
  TOGGLE_GROUP_NAME,
  ToggleGroup,
  ToggleGroupProvider,
  useRovingFocusGroupScope,
  useToggleGroupContext,
}
