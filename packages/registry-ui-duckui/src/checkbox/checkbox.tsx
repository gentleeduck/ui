import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as React from 'react'

import { Check } from 'lucide-react'
import { Label } from '../label'

import { cn } from '@gentelduck/libs/cn'

// Checkbox
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-xs border border-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-solid',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className='h-4 w-4' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// CheckboxWithLabel
export interface CheckboxWithLabelProps
  extends React.HTMLProps<HTMLDivElement> {
  _checkbox: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
  _label: React.ComponentPropsWithoutRef<typeof Label>
}

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<'div'>,
  CheckboxWithLabelProps
>(({ id, _checkbox, _label, className, ...props }, ref) => {
  const { className: labelClassName, ...labelProps } = _label
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-start gap-2', className)}
      {...props}
    >
      <Checkbox id={id} {..._checkbox} />
      <Label
        htmlFor={id}
        className={cn('curosor-pointer', labelClassName)}
        {...labelProps}
      />
    </div>
  )
})

// CheckboxGroup
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  id: string
  title: string
}

export interface CheckboxGroupProps extends React.HTMLProps<HTMLDivElement> {
  subtasks: CheckboxProps[]
  subtasks_default_values?: CheckboxWithLabelProps
}

const CheckboxGroup = React.forwardRef<
  React.ElementRef<'div'>,
  CheckboxGroupProps
>(({ subtasks, subtasks_default_values, ...props }, ref) => {
  const { _checkbox, _label } = subtasks_default_values || {}
  return (
    <>
      <div
        className={cn('flex flex-col w-full gap-2 mb-3')}
        {...props}
        ref={ref}
      >
        {subtasks.map((subtask) => {
          const { id, title, className } = subtask
          return (
            <div
              key={id}
              className={cn('flex items-center justify-start gap-2', className)}
            >
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
})

export { Checkbox, CheckboxGroup, CheckboxWithLabel }
