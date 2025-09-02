import { cn } from '@gentleduck/duck-libs/cn'
import { Slot } from '@gentleduck/primitives/slot'
import { Loader } from 'lucide-react'
import type * as React from 'react'
import { buttonVariants } from './button.constants'
import type { AnimationIconProps, ButtonProps } from './button.types'

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
}: ButtonProps): React.JSX.Element {
  const Component = (asChild ? Slot : 'button') as React.ElementType

  return (
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
      disabled={loading ?? disabled}>
      <>
        {loading ? <Loader className="animate-spin" /> : icon}
        {!isCollapsed && children}
        {!isCollapsed && secondIcon && secondIcon}
      </>
    </Component>
  )
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
