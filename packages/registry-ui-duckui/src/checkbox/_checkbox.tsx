import { cn } from '@gentleduck/libs/cn'
import { AnimVariants, checkersStylePattern } from '@gentleduck/motion/anim'
import * as React from 'react'
import { Label } from '../label'

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {}
const Checkbox = ({ className, ref, ...props }: CheckboxProps) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      checkersStylePattern(),
      AnimVariants({ overlay: 'nothing', pseudo: 'animate' }),
      'justify-center rounded checked:text-primary-foreground ',
      'after:border-[1.5px] after:border-t-0 after:border-l-0 after:bg-transparent after:rounded-none after:w-[5px] after:h-[9px]  after:mb-0.5 checked:after:translate-y-0  after:translate-y-1/3  after:opacity-0 after:rotate-45 checked:after:opacity-100',
      className,
    )}
    {...props}
  />
)

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
