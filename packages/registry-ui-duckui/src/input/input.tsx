import * as React from 'react'

import { cn } from '@gentelduck/libs/cn'
import { Badge } from '../badge'
import { LabelType } from '../button'
import { CommandShortcut } from '../command'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export interface InputCustomViewProps {
  trigger: React.ComponentPropsWithoutRef<typeof Input>
  label?: LabelType
  badge?: React.ComponentPropsWithoutRef<typeof CommandShortcut>
}

const InputCustomView = React.forwardRef<
  React.ElementRef<typeof Input>,
  InputCustomViewProps
>(({ trigger, label, badge }, ref) => {
  const {
    children: badgeChildren,
    className: badgeClassName,
    ...badgeProps
  } = badge ?? {}
  const {
    children: labelChildren,
    className: labelClassName,
    ...labelProps
  } = label ?? {}
  const { className: triggerClassName, ...triggerProps } = trigger ?? {}
  return (
    <div className='flex flex-col'>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>
          <Input
            ref={ref}
            className={cn('h-8 w-[150px] lg:w-[200px]', triggerClassName)}
            {...triggerProps}
          />
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            'flex items-center gap-2 z-50 justify-start',
            labelClassName,
          )}
          {...labelProps}
        >
          <CommandShortcut className='text-[.8rem]' {...badgeProps}>
            <Badge variant='secondary' size='sm' className='p-0 px-2'>
              {badgeChildren}
            </Badge>
          </CommandShortcut>
          <p className='text-sm'>{labelChildren}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
})

InputCustomView.displayName = 'InputWithLabel'

export { Input, InputCustomView }
