import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib'
import { ButtonProps } from './button.types'
import { buttonVariants } from './button.constants'
import { Badge } from '@/registry/default/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip'
import { CommandShortcut } from '@/registry/default/ui/command'

import { Loader } from 'lucide-react'
import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
import { toast } from 'sonner'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isCollapsed = false,
      size = 'default',
      variant = 'default',
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
    ref: React.ForwardedRef<HTMLButtonElement> | undefined
  ) => {
    const {
      className: labelClassName,
      variant: labelVariant,
      size: labelSize,
      side,
      showLabel,
      showCommand,
      delayDuration = 0,
      ...labelProps
    } = label || {}
    const Component = asChild ? Slot : 'button'
    const { children: Icon, ...iconProps } = icon ?? {}
    const { children: SecondIcon, ...secondIconProps } = secondIcon ?? {}
    const { icon: animationIconChildren, iconPlacement = 'right' } = animationIcon ?? {}
    const { children: AnimationIcon, ...animationIconProps } = animationIconChildren ?? {}
    const {
      className: commandClassName,
      variant: commandVariant,
      size: commandSize,
      label: commandLabel,
      key,
      action,
      state,
      ...commandProps
    } = command ?? {}

    const fn = () => toast.info('NOTE: handling command shortcut without action')
    //NOTE: handling command shortcut
    useDuckShortcut({ keys: [key ?? 'k'], onKeysPressed: action ?? fn }, [state])

    // Handle keyboard shortcut Badge
    const CommandComponent = () => (
      <CommandShortcut className="text-[.8rem]">
        <Badge
          variant={commandVariant || 'secondary'}
          size={commandSize || 'sm'}
          className={cn('p-0 px-2 text-bold rounded-sm', commandClassName)}
          {...commandProps}
        >
          {commandLabel}
        </Badge>
      </CommandShortcut>
    )

    return (
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <Component
            ref={ref}
            className={cn(
              buttonVariants({
                variant: variant || 'ghost',
                size: size ? (isCollapsed ? 'icon' : size) : isCollapsed ? 'icon' : 'default',
                className: cn('relative justify-center', className),
              })
            )}
            disabled={loading}
            {...props}
          >
            {AnimationIcon && iconPlacement === 'left' && (
              <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
                <AnimationIcon {...animationIconProps} />
              </div>
            )}
            <div className="flex items-center gap-2">
              {!loading ? Icon && !!icon && !loading && <Icon {...iconProps} /> : <Loader className="animate-spin" />}
              {!isCollapsed && children}
              {!isCollapsed && command?.label && !showCommand && <CommandComponent />}

              {!isCollapsed && label && !showLabel && (
                <Badge
                  variant={labelVariant || 'outline'}
                  size={labelSize || 'default'}
                  className={cn('text-[.8rem] rounded-md px-2', labelClassName)}
                  {...labelProps}
                />
              )}
              {!isCollapsed && !loading && SecondIcon && <SecondIcon {...secondIconProps} />}
            </div>
            {AnimationIcon && iconPlacement === 'right' && (
              <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
                <AnimationIcon {...animationIconProps} />
              </div>
            )}
          </Component>
        </TooltipTrigger>
        {(isCollapsed || showLabel) && label && (
          <TooltipContent
            {...labelProps}
            className={cn('flex items-center gap-2 z-50 justify-start', labelClassName)}
            side={side || 'right'}
          >
            {command?.label && showCommand && <CommandComponent />}
            {showLabel && (
              <span
                className={cn('ml-auto text-[.9rem]', !showLabel && 'text-muted-foreground')}
                {...labelProps}
              />
            )}
          </TooltipContent>
        )}
      </Tooltip>
    )
  }
)

Button.displayName = 'Button'

export { Button }
