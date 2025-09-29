'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import * as React from 'react'
import { Label } from '../label'
import type { CheckboxGroupProps, CheckboxProps, CheckboxWithLabelProps, CheckedState } from './checkbox.types'

const Checkbox = ({
  className,
  indicator,
  checkedIndicator,
  style,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  ref,
  ...props
}: CheckboxProps) => {
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

  React.useEffect(() => {
    if (ref && typeof ref !== 'function' && checked === 'indeterminate' && ref.current) {
      ref.current.indeterminate = true
      changeCheckedState(checked, ref.current)
    }
    changeCheckedState(checked, inputRef.current as HTMLInputElement)
  }, [checked, ref])

  function changeCheckedState(state: CheckedState, input: HTMLInputElement) {
    input.setAttribute('aria-checked', `${state}`)
    input.setAttribute('data-checked', `${state}`)
    input.checked = state as boolean
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
          AnimVariants({ pseudo: 'animate' }),
          (indicatorReady && checkedIndicatorReady) || indicatorReady
            ? ''
            : 'after:mb-0.5 after:h-[9px] after:w-[4px] after:rotate-45 after:border-[1.5px] after:border-t-0 after:border-l-0 after:bg-transparent',
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
        style={{ ...style, ...inputStyle }}
        type="checkbox"
        {...props}
      />
      <SvgIndicator className="sr-only" />
    </>
  )
}

const CheckboxWithLabel = ({ id, _checkbox, _label, className, ref, ...props }: CheckboxWithLabelProps) => {
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
}

const CheckboxGroup = ({ subtasks, subtasks_default_values, ref, ...props }: CheckboxGroupProps) => {
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
}

export { Checkbox, CheckboxGroup, CheckboxWithLabel }
