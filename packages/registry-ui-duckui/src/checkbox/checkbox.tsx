'use client'

import { useSvgIndicator } from '@gentleduck/aria-feather/checkers'
import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import * as React from 'react'
import { Label } from '../label'
import { CheckboxGroupProps, CheckboxProps, CheckboxWithLabelProps, CheckedState } from './checkbox.types'

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
    indicator,
    checkedIndicator,
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
    changeCheckedState(checked, inputRef.current!)
  }, [checked, ref])

  function changeCheckedState(state: CheckedState, input: HTMLInputElement) {
    input.setAttribute('aria-checked', `${state}`)
    input.setAttribute('data-checked', `${state}`)
    input.checked = state as boolean
  }

  return (
    <>
      <input
        ref={ref ?? inputRef}
        type="checkbox"
        style={{ ...style, ...inputStyle }}
        onChange={(e) => {
          const nextChecked = e.target.checked ? true : e.target.indeterminate ? 'indeterminate' : false
          e.target.indeterminate = false
          changeCheckedState(nextChecked, e.target)
          handleChange(nextChecked)
        }}
        className={cn(
          checkersStylePattern({
            type: 'checkbox',
            indicatorState:
              indicatorReady && checkedIndicatorReady
                ? 'both'
                : indicatorReady
                  ? 'indicatorReady'
                  : checkedIndicatorReady
                    ? 'checkedIndicatorReady'
                    : 'default',
          }),
          AnimVariants({ overlay: 'nothing', pseudo: 'animate' }),
          (indicatorReady && checkedIndicatorReady) || indicatorReady
            ? ''
            : 'after:mb-0.5 after:h-[9px] after:w-[4px] after:rotate-45 after:border-[1.5px] after:border-t-0 after:border-l-0 after:bg-transparent',
          'data-[checked="indeterminate"]:border-border data-[checked="indeterminate"]:bg-transparent data-[checked="indeterminate"]:text-foreground',
          'bg-transparent',
          className,
        )}
        {...props}
      />
      <SvgIndicator className="sr-only" />
    </>
  )
}

const CheckboxWithLabel = ({ id, _checkbox, _label, className, ref, ...props }: CheckboxWithLabelProps) => {
  const { className: labelClassName, ...labelProps } = _label
  return (
    <div ref={ref} className={cn('flex items-center justify-start gap-2', className)} {...props}>
      <Checkbox id={id} {..._checkbox} />
      <Label htmlFor={id} className={cn('cursor-pointer', labelClassName)} {...labelProps} />
    </div>
  )
}

const CheckboxGroup = ({ subtasks, subtasks_default_values, ref, ...props }: CheckboxGroupProps) => {
  const { _checkbox, _label } = subtasks_default_values || {}
  return (
    <div className={cn('mb-3 flex flex-col gap-2')} {...props} ref={ref}>
      {subtasks.map(({ id, title, checked }) => (
        <CheckboxWithLabel
          key={id}
          id={id}
          _checkbox={{
            ..._checkbox,
            checked,
            className: 'w-4 h-4 rounded-full border-muted-foreground/80',
          }}
          _label={{ ..._label, children: title }}
        />
      ))}
    </div>
  )
}

export { Checkbox, CheckboxGroup, CheckboxWithLabel }
