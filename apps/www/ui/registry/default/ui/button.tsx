import React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Slot } from '@radix-ui/react-slot'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { Badge } from './badge'
import { CommandShortcut } from './command'

import { cn } from '@/lib'
import { cva } from 'class-variance-authority'
import { VariantProps } from 'class-variance-authority'
import { Loader, LucideIcon } from 'lucide-react'
import { IconProps } from '@radix-ui/react-icons/dist/types'
// import { useDuckShortcut } from '@ahmedayob/duck-shortcut'

export type IconType = { children: LucideIcon } & Omit<IconProps, 'children'> &
  Omit<React.RefAttributes<SVGSVGElement>, 'children'>
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isCollapsed?: boolean
  icon?: IconType
  title?: string
  secondIcon?: IconType
  label?: LabelType
  route?: string
  command?: CommandType
  delayDuration?: number
  loading?: boolean
}

export interface LabelType extends Partial<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>> {
  showCommand?: boolean
  showLabel?: boolean
  type?: 'notification' | 'default'
}

export type CommandType = {
  label?: string
  key: string
  state?: unknown
  action?: <T>(arg?: T) => void
}

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        nothing: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isCollapsed = false,
      size = 'default',
      variant = 'default',
      title,
      className,
      label,
      children,
      icon,
      secondIcon,
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
    // useDuckShortcut(
    //   {
    //     keys: [command?.key ?? 'k'],
    //     onKeysPressed: command?.action ?? fn,
    //   },
    //   [command?.state]
    // )

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

export { Button, buttonVariants }
