import * as React from 'react'

import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
import { Slot } from '@radix-ui/react-slot'
import { Loader } from 'lucide-react'

import { Badge } from '../badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { buttonVariants } from './button.constants'
import { ButtonProps } from './button.types'

import { cn } from '@gentleduck/duck-libs/cn'
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
    const { side, delayDuration, open, onOpenChange, showLabel, showCommand, ...labelProps } = label || {}

    const Component = asChild ? Slot : 'button'

    const { className: commandClassName, show: commandShow, key, action, ...commandProps } = command ?? {}

    if (key && action) {
      useDuckShortcut({ keys: [key], onKeysPressed: action })
    }

    // Handle keyboard shortcut Badge
    const CommandComponent = () =>
      (commandShow ?? true) && (
        <kbd
          className={cn(
            'inline-flex items-center font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:offset-2 bg-secondary text-[.7rem] py-[.12rem] px-2 rounded-xs text-secondary-foreground !font-sans',
            commandClassName,
          )}
          {...commandProps}
        />
      )

    const ButtonBody = (
      <Component
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size: isCollapsed ? 'icon' : size,
            border,
            className,
          }),
        )}
        disabled={loading}
        data-open={!isCollapsed}
        data-loading={loading}
        aria-expanded={!isCollapsed}
        {...props}>
        {animationIcon?.icon && animationIcon.iconPlacement === 'left' && (
          <div className="w-0 translate-x-[-1.3em] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:-translate-x-1 group-hover:pr-2 group-hover:opacity-100">
            {animationIcon?.icon}
          </div>
        )}
        {/* ! NOTE: this returns a div even children is just a text */}
        <div className="flex items-center gap-2">
          {loading ? <Loader className="animate-spin" /> : icon}
          {!isCollapsed && size !== 'icon' && children}
          {!isCollapsed && command?.children && !showCommand && <CommandComponent />}

          {!isCollapsed && label && !showLabel && (
            <Badge
              variant={label.variant ?? 'secondary'}
              size={label.size ?? 'default'}
              className={cn(
                'text-[.8rem] py-0 rounded-md px-1 font-medium',
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

    if (!showLabel) {
      return ButtonBody
    }

    return (
      <TooltipProvider>
        <Tooltip delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
          <TooltipTrigger asChild aria-haspopup="true" aria-label="button with tooltip">
            {ButtonBody}
          </TooltipTrigger>
          {(isCollapsed || showLabel) && label && (
            <TooltipContent
              {...labelProps}
              className={cn('flex items-center gap-2 z-50 justify-start px-2', label.className)}
              side={side || 'right'}>
              {command?.children && showCommand && <CommandComponent />}
              {showLabel && label.children && (
                <span className={cn('ml-auto text-[.9rem]', !showLabel && 'text-muted-foreground')} {...labelProps} />
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
