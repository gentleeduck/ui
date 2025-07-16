import * as React from 'react'

import { buttonVariants } from './button.constants'
import { AnimationIconProps, ButtonProps } from './button.types'
import { Slot } from '@gentleduck/aria-feather/slot'

import { cn } from '@gentleduck/libs/cn'
import { Loader } from 'lucide-react'

// TODO: make button customizable to the max (icon, width, sizes, etc...)

/**
 * Renders a customizable button component, supporting various styles and behaviors.
 *
 * @param {ButtonProps} props - The props for the button component.
 * @returns {React.JSX.Element} A button element with the specified configurations.
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
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }): React.JSX.Element {
  const Component = (asChild ? Slot : 'button') as React.ElementType

  const Button = (
    <Component
      {...props}
      ref={ref}
      className={cn(
        buttonVariants({
          variant,
          size: isCollapsed ? 'icon' : size,
          border,
          className,
        }),
      )}
      type={type}
      asChild={asChild}
      disabled={loading ?? disabled}>
      {loading ? <Loader className="animate-spin" /> : icon}
      {!isCollapsed && children}
      {!isCollapsed && secondIcon && secondIcon}
    </Component>
  )

  return Button
}

/**
 * Renders an animation icon component.
 *
 * @param {AnimationIconProps} props - The props for the animation icon component.
 * @returns {React.JSX.Element} An animation icon component with the specified configurations.
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
