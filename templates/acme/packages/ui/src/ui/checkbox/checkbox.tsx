'use client'

import { cn } from '@gentleduck/libs/cn'
import { checkersStylePattern } from '@gentleduck/motion/anim'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'
import { Label } from '../label'
import type { CheckboxGroupProps, CheckboxProps, CheckboxWithLabelProps, CheckedState } from './checkbox.types'

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      indicator,
      checkedIndicator,
      style,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      dir,
      ...props
    },
    ref,
  ) => {
    const direction = useDirection(dir as Direction)
    const { indicatorReady, checkedIndicatorReady, inputStyle, SvgIndicator } = useSvgIndicator({
      checkedIndicator,
      indicator,
    })
    const inputRef = React.useRef<HTMLInputElement>(null)

    const isControlled = controlledChecked !== undefined
    const checked = isControlled ? controlledChecked : defaultChecked

    const handleChange = (next: CheckedState) => {
      onCheckedChange?.(next)
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: changeCheckedState is stable and defined in render scope
    React.useEffect(() => {
      if (ref && typeof ref !== 'function' && checked === 'indeterminate' && ref.current) {
        ref.current.indeterminate = true
        changeCheckedState(checked, ref.current)
      }
      changeCheckedState(checked, inputRef.current as HTMLInputElement)
    }, [checked, ref])

    function changeCheckedState(state: CheckedState, input: HTMLInputElement) {
      if (state === 'indeterminate') {
        input.indeterminate = true
        input.checked = false
      } else {
        input.indeterminate = false
        input.checked = state as boolean
      }
      input.setAttribute('data-checked', `${state}`)
    }

    return (
      <>
        <input
          className={cn(
            checkersStylePattern({
              indicatorState:
                indicatorReady && checkedIndicatorReady
                  ? 'both'
                  : indicatorReady
                    ? 'indicatorReady'
                    : checkedIndicatorReady
                      ? 'checkedIndicatorReady'
                      : 'default',
              type: 'checkbox',
            }),
            'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
            '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-[inherit] [&:before,&:after]:ease-[inherit] [&:before,&:after]:will-change-[inherit]',
            (indicatorReady && checkedIndicatorReady) || indicatorReady
              ? ''
              : 'after:mb-0.5 after:h-2.25 after:w-1 after:rotate-45 after:border-[1.5px] after:border-t-0 after:border-l-0 after:bg-transparent',
            'data-[checked="indeterminate"]:border-border data-[checked="indeterminate"]:bg-transparent data-[checked="indeterminate"]:text-foreground',
            'rounded-sm bg-transparent',
            className,
          )}
          data-slot="checkbox"
          onChange={(e) => {
            const nextChecked = e.target.checked ? true : e.target.indeterminate ? 'indeterminate' : false
            e.target.indeterminate = false
            changeCheckedState(nextChecked, e.target)
            handleChange(nextChecked)
          }}
          ref={ref ?? inputRef}
          dir={direction}
          style={{ ...style, ...inputStyle }}
          type="checkbox"
          {...props}
        />
        <SvgIndicator className="sr-only" />
      </>
    )
  },
)
Checkbox.displayName = 'Checkbox'

const CheckboxWithLabel = React.forwardRef<HTMLDivElement, Omit<CheckboxWithLabelProps, 'ref'>>(
  ({ id, _checkbox, _label, className, ...props }, ref) => {
    const { className: labelClassName, ...labelProps } = _label
    return (
      <div
        className={cn('flex items-center justify-start gap-2', className)}
        ref={ref}
        {...props}
        data-slot="checkbox-with-label">
        <Checkbox id={id} {..._checkbox} />
        <Label className={cn('cursor-pointer', labelClassName)} htmlFor={id} {...labelProps} />
      </div>
    )
  },
)
CheckboxWithLabel.displayName = 'CheckboxWithLabel'

const CheckboxGroup = React.forwardRef<HTMLDivElement, Omit<CheckboxGroupProps, 'ref'>>(
  ({ subtasks, subtasks_default_values, ...props }, ref) => {
    const { _checkbox, _label } = subtasks_default_values || {}
    return (
      <div className={cn('mb-3 flex flex-col gap-2')} {...props} data-slot="checkbox-group" ref={ref}>
        {subtasks.map(({ id, title, checked }) => (
          <CheckboxWithLabel
            _checkbox={{
              ..._checkbox,
              checked,
              className: 'w-4 h-4 rounded-full border-muted-foreground/80',
            }}
            _label={{ ..._label, children: title }}
            data-slot="checkbox-with-label"
            id={id}
            key={id}
          />
        ))}
      </div>
    )
  },
)
CheckboxGroup.displayName = 'CheckboxGroup'

export { Checkbox, CheckboxGroup, CheckboxWithLabel }
