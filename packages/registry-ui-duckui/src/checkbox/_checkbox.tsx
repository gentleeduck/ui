'use client'

import { useSvgIndicator } from '@gentleduck/aria-feather/checkers'
import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import * as React from 'react'
import { Label } from '../label'

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {}

function Checkbox({
  className,
  indicator,
  checkedIndicator,
  ref,
  style,
  ...props
}: React.HTMLProps<HTMLInputElement> & { indicator?: React.ReactElement; checkedIndicator?: React.ReactElement }) {
  const { indicatorReady, checkedIndicatorReady, inputStyle, SvgIndicator } = useSvgIndicator({
    indicator,
    checkedIndicator,
  })

  return (
    <>
      <input
        ref={ref}
        type="checkbox"
        style={{ ...style, ...inputStyle }}
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
          (checkedIndicatorReady || indicatorReady) &&
            'after:border-[1.5px] after:border-t-0 after:border-l-0 after:rotate-45 after:mb-0.5 after:w-[4px] after:h-[9px] after:bg-transparent',
          className,
        )}
        {...props}
      />
      <SvgIndicator className="sr-only" />
    </>
  )
}
export interface CheckboxWithLabelProps extends React.HTMLProps<HTMLDivElement> {
  _checkbox: React.ComponentPropsWithoutRef<typeof Checkbox>
  _label: React.ComponentPropsWithoutRef<typeof Label>
}

const CheckboxWithLabel = React.forwardRef<React.ElementRef<'div'>, CheckboxWithLabelProps>(
  ({ id, _checkbox, _label, className, ...props }, ref) => {
    const { className: labelClassName, ...labelProps } = _label
    return (
      <div ref={ref} className={cn('flex items-center justify-start gap-2', className)} {...props}>
        <Checkbox id={id} {..._checkbox} />
        <Label htmlFor={id} className={cn('curosor-pointer', labelClassName)} {...labelProps} />
      </div>
    )
  },
)

export interface CheckboxGroupProps extends React.HTMLProps<HTMLDivElement> {
  subtasks: CheckboxProps[]
  subtasks_default_values?: CheckboxWithLabelProps
}

const CheckboxGroup = ({ subtasks, subtasks_default_values, ref, ...props }: CheckboxGroupProps) => {
  const { _checkbox, _label } = subtasks_default_values || {}
  return (
    <>
      <div className={cn('flex flex-col w-full gap-2 mb-3')} {...props} ref={ref}>
        {subtasks.map((subtask) => {
          const { id, title, className } = subtask
          return (
            <div key={id} className={cn('flex items-center justify-start gap-2', className)}>
              <CheckboxWithLabel
                id={id}
                _checkbox={{
                  ..._checkbox,
                  className: 'w-4 h-4 rounded-full border-muted-foreground/80',
                }}
                _label={{ ..._label, children: title }}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

export { Checkbox, CheckboxGroup, CheckboxWithLabel }
