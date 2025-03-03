import * as React from 'react'

import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
import { Slot } from '@radix-ui/react-slot'
import { Loader } from 'lucide-react'

import { Badge } from '../badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { buttonVariants } from './button.constants'
import { ButtonProps } from './button.types'

import { cn } from '@duck/libs/cn'
import { CommandShortcut } from '../../_oldstuff_refactor/ui/command'

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
      icon: Icon,
      secondIcon: Icon2,
      loading = false,
      animationIcon,
      command,
      ...props
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement> | undefined,
  ) => {
    const {
      className: labelClassName,
      variant: labelVariant,
      size: labelSize,
      side,
      showLabel,
      showCommand,
      delayDuration = 0,
      open,
      onOpenChange,
      ...labelProps
    } = label || {}
    const Component = asChild ? Slot : 'button'
    const { icon: AniIcon, iconPlacement = 'right' } = animationIcon ?? {}
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

    return (
      <Tooltip
        delayDuration={delayDuration}
        open={open}
        onOpenChange={onOpenChange}
      >
        <TooltipTrigger asChild>
          <Component
            ref={ref}
            className={cn(
              buttonVariants({
                variant,
                size: size
                  ? isCollapsed
                    ? 'icon'
                    : size
                  : isCollapsed
                    ? 'icon'
                    : 'default',
                border,
                className,
              }),
            )}
            disabled={loading}
            data-state={isCollapsed ? 'close' : 'open'}
            {...props}
          >
            {AniIcon && iconPlacement === 'left' && (
              <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
                {AniIcon}
              </div>
            )}
            <div className="flex items-center gap-2">
              {!loading ? Icon : <Loader className="animate-spin" />}
              {!isCollapsed && children}
              {!isCollapsed && command?.label && !showCommand && (
                <CommandComponent />
              )}

              {!isCollapsed && label && !showLabel && (
                <Badge
                  variant={labelVariant ?? 'secondary'}
                  size={labelSize ?? 'default'}
                  className={cn(
                    'text-[.8rem] py-0 rounded-md px-1 font-meduim',
                    labelVariant === 'nothing' && 'text-accent',
                    labelClassName,
                  )}
                  {...labelProps}
                />
              )}
              {!isCollapsed && Icon2 && Icon2}
            </div>
            {AniIcon && iconPlacement === 'right' && (
              <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
                {AniIcon}
              </div>
            )}
          </Component>
        </TooltipTrigger>
        {(isCollapsed || showLabel) && label && (
          <TooltipContent
            {...labelProps}
            className={cn(
              'flex items-center gap-2 z-50 justify-start',
              labelClassName,
            )}
            side={side || 'right'}
          >
            {command?.label && showCommand && <CommandComponent />}
            {showLabel && (
              <span
                className={cn(
                  'ml-auto text-[.9rem]',
                  !showLabel && 'text-muted-foreground',
                )}
                {...labelProps}
              />
            )}
          </TooltipContent>
        )}
      </Tooltip>
    )
  },
)

Button.displayName = 'Button'

export { Button }
