import * as React from 'react'

import { buttonVariants } from './button.constants'
import { ButtonProps } from './button.types'

import { cn } from '@gentleduck/libs/cn'
import { Loader } from 'lucide-react'

/**
 * Renders a customizable button component, supporting various styles and behaviors.
 *
 * @param {ButtonProps} props - The props for the button component.
 * @param {React.ReactNode} [props.children] - The content to be displayed inside the button.
 * @param {string} [props.variant] - The visual style variant of the button.
 * @param {string} [props.size] - The size of the button, can be overridden to 'icon' if collapsed.
 * @param {string} [props.border] - The border style of the button.
 * @param {boolean} [props.asChild] - If true, renders the button as a child component.
 * @param {string} [props.className] - Additional custom class names for styling.
 * @param {object} [props.label] - Configuration for the button's label, including display options.
 * @param {boolean} [props.loading] - Indicates if the button should show a loading spinner.
 * @param {boolean} [props.isCollapsed] - If true, the button is rendered in a collapsed state.
 * @param {React.ReactNode} [props.icon] - An icon to be displayed inside the button.
 * @param {React.ReactNode} [props.secondIcon] - An optional second icon inside the button.
 * @param {object} [props.animationIcon] - Configuration for an animated icon, including placement.
 * @param {React.Ref<HTMLButtonElement>} [props.ref] - A ref to the button element.
 * @param {object} [...props] - Additional props pdocsassed to the button component.
 *
 * @returns {React.JSX.Element} A button element with the specified configurations.
 */
function Button({
  children,
  variant,
  size,
  border,
  asChild,
  className,
  loading,
  isCollapsed,
  icon,
  secondIcon,
  animationIcon,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }): React.JSX.Element {
  const Component = (asChild ? Slot : 'button') as React.ElementType

  //TODO: make the icons as plugin
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

/**
 * A simple utility component that allows passing a JSX element as a prop
 * and renders it with the passed props. If the passed element is not a JSX
 * element, it wraps it in a `div` component.
 *
 * @param {React.HTMLProps<HTMLDivElement>} [props] - The props to be passed to the rendered element.
 * @param {React.ReactNode} [props.children] - The JSX element or node to be rendered.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional props to be passed to the rendered element.
 *
 * @returns {React.JSX.Element} The rendered element with the passed props.
 */
function Slot({
  children,
  ...props
}: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  if (!React.isValidElement(children)) {
    return <div {...props}>{children}</div>
  }

  return React.cloneElement(children, {
    ...props,
    ...(children as React.JSX.Element).props,
  })
}

export { Button, Slot }
