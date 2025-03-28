import * as React from 'react'

import { buttonVariants } from './button.constants'
import { ButtonProps } from './button.types'

import { cn } from '@gentelduck/libs/cn'
import { Loader } from 'lucide-react'

function Button({
  children,
  variant,
  size,
  border,
  asChild,
  className,
  label,
  loading,
  isCollapsed,
  icon,
  secondIcon,
  animationIcon,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
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
      disabled={loading}
    >
      <div className='flex items-center gap-2'>
        {animationIcon?.icon && animationIcon.iconPlacement === 'left' && (
          <div className='w-0 translate-x-[-1.3em] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:-translate-x-1 group-hover:pr-2 group-hover:opacity-100'>
            {animationIcon?.icon}
          </div>
        )}
        {!loading ? icon : <Loader className='animate-spin' />}
        {!isCollapsed && size !== 'icon' && children}
        {!isCollapsed && secondIcon && secondIcon}
        {animationIcon?.icon && animationIcon.iconPlacement === 'right' && (
          <div className='w-0 translate-x-[1.3em] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100'>
            {animationIcon?.icon}
          </div>
        )}
      </div>
    </Component>
  )

  return Button
}

function Slot({ children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  if (!React.isValidElement(children)) {
    return <div {...props}>{children}</div>
  }

  return React.cloneElement(children, {
    ...props,
    ...(children as React.JSX.Element).props,
  })
}

export { Button, Slot }
