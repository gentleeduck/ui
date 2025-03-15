import * as React from 'react'

import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
import { Slot } from '@radix-ui/react-slot'
import { Loader } from 'lucide-react'

import { Badge } from '../badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { buttonVariants } from './button.constants'
import { ButtonProps } from './button.types'

import { cn } from '@duck/libs/cn'
import { CommandShortcut } from '../command'
import { TooltipProvider } from '@radix-ui/react-tooltip'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isCollapsed = false,
      size = 'default',
      variant = 'default',
      border = 'default',
      className,
      label,
      children,
      icon,
      secondIcon,
      loading = false,
      animationIcon,
      command,
      ...props
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement> | undefined,
  ) => {
    const { side, delayDuration, open, onOpenChange, ...labelProps } =
      label || {}

    const Component = asChild ? Slot : 'button'

    const {
      className: commandClassName,
      variant: commandVariant,
      size: commandSize,
      label: commandLabel,
      show: commandShow,
      key,
      action,
      ...commandProps
    } = command ?? {}

    if (key && action) {
      useDuckShortcut({ keys: [key], onKeysPressed: action })
    }

    // Handle keyboard shortcut Badge
    const CommandComponent = () => (
      <CommandShortcut className="text-[.8rem]">
        {(commandShow ?? true) && (
          <Badge
            variant={commandVariant ?? 'secondary'}
            size={commandSize ?? 'sm'}
            className={cn(
              'p-0 px-2 text-bold rounded-sm text-secondary-foreground',
              commandClassName,
            )}
            {...commandProps}
          >
            {commandLabel}
          </Badge>
        )}
      </CommandShortcut>
    )

    const ButtonBody = (
      <Component
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            border,
            className,
          }),
        )}
        disabled={loading}
        data-open={isCollapsed}
        data-loading={loading}
        aria-expanded={isCollapsed}
        {...props}
      >
        {animationIcon?.icon && animationIcon.iconPlacement === 'left' && (
          <div className="w-0 translate-x-[-1.3em] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:-translate-x-1 group-hover:pr-2 group-hover:opacity-100">
            {animationIcon?.icon}
          </div>
        )}
        <div className="flex items-center gap-2">
          {!loading ? icon : <Loader className="animate-spin" />}
          {!isCollapsed && size !== 'icon' && children}
          {!isCollapsed && command?.label && !label?.showCommand && (
            <CommandComponent />
          )}

          {!isCollapsed && label && !label.showLabel && (
            <Badge
              variant={label.variant ?? 'secondary'}
              size={label.size ?? 'default'}
              className={cn(
                'text-[.8rem] py-0 rounded-md px-1 font-meduim',
                label.variant === 'nothing' && 'text-accent',
                label.className,
              )}
              {...labelProps}
            />
          )}
          {!isCollapsed && secondIcon && secondIcon}
        </div>
        {animationIcon?.icon && animationIcon.iconPlacement === 'right' && (
          <div className="w-0 translate-x-[1.3em] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
            {animationIcon?.icon}
          </div>
        )}
      </Component>
    )

    if (!label?.showLabel) {
      return ButtonBody
    }

    return (
      <TooltipProvider>
        <Tooltip
          delayDuration={delayDuration}
          open={open}
          onOpenChange={onOpenChange}
        >
          <TooltipTrigger
            asChild
            aria-haspopup="true"
            aria-label="button with tooltip"
          >
            {ButtonBody}
          </TooltipTrigger>
          {(isCollapsed || label.showLabel) && label && (
            <TooltipContent
              {...labelProps}
              className={cn(
                'flex items-center gap-2 z-50 justify-start',
                label.className,
              )}
              side={side || 'right'}
            >
              {command?.label && label.showCommand && <CommandComponent />}
              {label.showLabel && (
                <span
                  className={cn(
                    'ml-auto text-[.9rem]',
                    !label.showLabel && 'text-muted-foreground',
                  )}
                  {...labelProps}
                />
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  },
)

Button.displayName = 'Button'

export { Button }
