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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as_child: asChild,
      is_collapsed: isCollapsed = false,
      size = 'default',
      variant = 'default',
      title,
      className,
      label,
      children,
      icon,
      second_icon: secondIcon,
      delayDuration = 0,
      loading = false,
      command,
      ...props
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement> | undefined
  ) => {
    const {
      className: labelClassName,
      type = 'default',
      children: labelChildren,
      side,
      showLabel,
      showCommand,
      ...labelProps
    } = label || {}
    const Component = asChild ? Slot : 'button'
    const { children: Icon, className: iconClassName, ...iconProps } = icon ?? {}
    const { children: SecondIcon, className: secondIconClassName, ...secondIconProps } = secondIcon ?? {}

    const fn = () => console.log('NOTE: handling command shortcut without action')
    //NOTE: handling command shortcut
    useDuckShortcut({ keys: [command?.key ?? 'k'], onKeysPressed: command?.action ?? fn }, [command?.state])

    // Handle keyboard shortcut Badge
    const CommandComponent = () => (
      <CommandShortcut className="text-[.8rem]">
        <Badge
          variant={'secondary'}
          size={'sm'}
          className="p-0 px-2"
        >
          {command?.label}
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
                className: cn(!isCollapsed && 'flex items-center gap-2', 'relative justify-center', className),
              })
            )}
            disabled={loading}
            {...props}
          >
            <div className="flex items-center gap-2">
              {!loading ? (
                Icon && (
                  <span className="[&_svg]:size-[1.18rem]">
                    {!!icon && !loading && (
                      <Icon
                        className={iconClassName}
                        {...iconProps}
                      />
                    )}
                  </span>
                )
              ) : (
                <Loader className="size-[1.18rem] animate-spin" />
              )}
              {!isCollapsed && (children || title)}
            </div>
            {!isCollapsed && command?.label && !showCommand && <CommandComponent />}

            {!isCollapsed &&
              label &&
              !showLabel &&
              (type == 'default' ? (
                <span
                  className={cn('ml-2 text-[.9rem]', labelClassName)}
                  {...labelProps}
                >
                  {labelChildren}
                </span>
              ) : (
                <Badge
                  variant={'outline'}
                  size={'icon'}
                  className={cn('size-5 text-[.6rem] absolute top-0 right-0', labelClassName)}
                  {...labelProps}
                >
                  {labelChildren}
                </Badge>
              ))}
            {!isCollapsed && !loading && SecondIcon && (
              <SecondIcon
                className={secondIconClassName}
                {...secondIconProps}
              />
            )}
          </Component>
        </TooltipTrigger>
        {(isCollapsed || showLabel) && (title || label) && (
          <TooltipContent
            {...labelProps}
            className={cn('flex items-center gap-2 z-50 justify-start', labelClassName)}
            side={side || 'right'}
          >
            {title && title}
            {command?.label && showCommand && <CommandComponent />}
            {showLabel && (
              <span className={cn('ml-auto text-[.9rem]', !showLabel && 'text-muted-foreground')}>{labelChildren}</span>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    )
  }
)

Button.displayName = 'Button'

export { Button }
