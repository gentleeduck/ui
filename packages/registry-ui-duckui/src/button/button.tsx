import * as React from 'react'

import { useDuckShortcut } from '@ahmedayob/duck-shortcut'
// import { Slot } from '@radix-ui/react-slot'
// import { Loader } from 'lucide-react'

import { Badge } from '../badge'
// import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { buttonVariants } from './button.constants'
import { ButtonProps } from './button.types'

import { cn } from '@gentelduck/libs/cn'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import {
  cloneElement,
  createContext,
  isValidElement,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react'

// this is the slot component we removed the slot from radix-ui
function Slot({ children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  if (!React.isValidElement(children)) {
    return <div {...props}>{children}</div>
  }

  return React.cloneElement(children, {
    ...props,
    ...(children as React.JSX.Element).props,
  })
}

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
      {children}
    </Component>
  )

  // if (label?.length) {
  //   const [Tooltip, _, __] = label
  //   return <Tooltip content={_} tooltip={__} children={Button} />
  // }

  return Button
}

export type ButtonTooltipProps = {
  children?: React.ReactNode
  tooltip?: React.ComponentPropsWithoutRef<typeof Tooltip>
  content?: React.ComponentPropsWithoutRef<typeof TooltipContent>
}

export function ButtonTooltip({
  children,
  tooltip,
  content,
}: ButtonTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip {...tooltip}>
        <TooltipTrigger
          asChild
          aria-haspopup='true'
          aria-label='button with tooltip'
          children={children}
        />
        <TooltipContent
          {...content}
          className={cn(
            'flex items-center gap-2 z-50 justify-start px-2',
            content?.className,
          )}
        >
          {content?.children}
          {
            // command?.children && showCommand && <CommandComponent />
          }
          {
            // showLabel && label.children && (
            <span
              className={cn(
                'ml-auto text-[.9rem]',
                // !showLabel && 'text-muted-foreground',
              )}
            // {...labelProps}
            />
            // )
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Button, Slot }

// {!loading ? icon : <Loader className='animate-spin' />}
// {!isCollapsed && command?.children && !showCommand && (
//   <CommandComponent />
// )}
//
// {!isCollapsed && label && !showLabel && (
//   <Badge
//     variant={label.variant ?? 'secondary'}
//     size={label.size ?? 'default'}
//     className={cn(
//       'text-[.8rem] py-0 rounded-md px-1 font-medium',
//       label.variant === 'nothing' && 'text-accent',
//       label.className,
//     )}
//     {...labelProps}
//   />
// )}
// {!isCollapsed && secondIcon && secondIcon}

// {animationIcon?.icon && animationIcon.iconPlacement === 'left' && (
//   <div className='w-0 translate-x-[-1.3em] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:-translate-x-1 group-hover:pr-2 group-hover:opacity-100'>
//     {animationIcon?.icon}
//   </div>
// )}
// {animationIcon?.icon && animationIcon.iconPlacement === 'right' && (
//   <div className='w-0 translate-x-[1.3em] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100'>
//     {animationIcon?.icon}
//   </div>
// )}
// {!isCollapsed && props.size !== 'icon' && children}
//

// const {
//   className: commandClassName,
//   show: commandShow,
//   key,
//   action,
//   ...commandProps
// } = command ?? {}
//
// if (key && action) {
//   useDuckShortcut({ keys: [key], onKeysPressed: action })
// }
//
// // Handle keyboard shortcut Badge
// const CommandComponent = () =>
//   (commandShow ?? true) && (
//     <kbd
//       className={cn(
//         'inline-flex items-center font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:offset-2 bg-secondary text-[.7rem] py-[.12rem] px-2 rounded-xs text-secondary-foreground !font-sans',
//         commandClassName,
//       )}
//       {...commandProps}
//     />
//   )
//
// const {
//   side,
//   delayDuration,
//   open,
//   onOpenChange,
//   showLabel,
//   showCommand,
//   ...labelProps
// } = label || {}

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * -----------------------------------------------------------------------------------------------*/

// Context for managing tooltip state
interface TooltipContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLButtonElement>
  contentRef: React.RefObject<HTMLDivElement>
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined)

// Custom hook to use tooltip context
const useTooltipContext = () => {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('useTooltipContext must be used within a Tooltip')
  }
  return context
}

// Main Tooltip component
interface TooltipProps {
  children: ReactNode
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
}

export function Tooltip({
  children,
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const openTimerRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (disableHoverableContent) return

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
    }

    openTimerRef.current = setTimeout(() => {
      setOpen(true)
    }, delayDuration)
  }

  const handleMouseLeave = () => {
    if (disableHoverableContent) return

    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }

    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
    }, skipDelayDuration)
  }

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        contentRef,
      }}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role='tooltip'
      >
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

// Tooltip Trigger component
interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  children: ReactNode
}

export function TooltipTrigger({ children, ...props }: TooltipTriggerProps) {
  const { open, setOpen, triggerRef } = useTooltipContext()

  // Clone the child element to add additional props
  const trigger = isValidElement(children)
    ? cloneElement(children, {
      ref: triggerRef,
      'aria-describedby': 'tooltip-content',
      'aria-expanded': open,
      onFocus: () => setOpen(true),
      onBlur: () => setOpen(false),
      ...children.props,
      ...props,
    })
    : children

  return <>{trigger}</>
}

// Tooltip Content component
interface TooltipContentProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
}

export function TooltipContent({
  children,
  className,
  side = 'top',
  align = 'center',
  ...props
}: TooltipContentProps) {
  const { open, contentRef } = useTooltipContext()

  if (!open) return null

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const alignClasses = {
    start: {
      top: 'left-0 -translate-x-0',
      bottom: 'left-0 -translate-x-0',
      left: 'top-0 -translate-y-0',
      right: 'top-0 -translate-y-0',
    },
    center: {
      top: 'left-1/2 -translate-x-1/2',
      bottom: 'left-1/2 -translate-x-1/2',
      left: 'top-1/2 -translate-y-1/2',
      right: 'top-1/2 -translate-y-1/2',
    },
    end: {
      top: 'right-0 translate-x-0',
      bottom: 'right-0 translate-x-0',
      left: 'bottom-0 translate-y-0',
      right: 'bottom-0 translate-y-0',
    },
  }

  return (
    <div
      ref={contentRef}
      id='tooltip-content'
      role='tooltip'
      className={cn(
        'absolute z-50 px-3 py-1.5 text-sm bg-black text-white rounded-md shadow-lg',
        'animate-in fade-in-0 zoom-in-95',
        positionClasses[side],
        alignClasses[align][side],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
