import { cn } from '@gentleduck/libs/cn'
import { Slot } from '@gentleduck/primitives/slot'
import { Loader } from 'lucide-react'
import type * as React from 'react'
import { buttonVariants } from './button.constants'
import type { AnimationIconProps, ButtonProps } from './button.types'

/**
 * Renders a customizable button component, supporting various styles and behaviors.
 */
function Button({
  children,
  variant = 'default',
  size = 'default',
  border = 'default',
  asChild,
  className,
  loading,
  isCollapsed,
  icon,
  secondIcon,
  type = 'button',
  disabled,
  ref,
  ...props
}: ButtonProps): React.JSX.Element {
  const Component = (asChild ? Slot : 'button') as React.ElementType

  return (
    <Component
      data-slot="button"
      {...props}
      className={cn(
        buttonVariants({
          border,
          className,
          size: isCollapsed ? 'icon' : size,
          variant,
        }),
      )}
      disabled={loading ?? disabled}
      ref={ref}
      type={type}>
      {loading ? <Loader className="animate-spin" /> : icon}
      {!isCollapsed && children}
      {!isCollapsed && secondIcon && secondIcon}
    </Component>
  )
}

/**
 * Renders an animation icon component.
 */
function AnimationIcon({ children, animationIcon }: AnimationIconProps): React.JSX.Element {
  return (
    <>
      {animationIcon?.icon && animationIcon.iconPlacement === 'left' && (
        <div className="group-hover:-translate-x-1 w-0 translate-x-[-1.3em] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100">
          {animationIcon?.icon}
        </div>
      )}
      {children}
      {animationIcon?.icon && animationIcon.iconPlacement === 'right' && (
        <div className="w-0 translate-x-[1.3em] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
          {animationIcon?.icon}
        </div>
      )}
    </>
  )
}

export { Button, AnimationIcon }
