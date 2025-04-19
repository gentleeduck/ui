import React from 'react'
import { Button } from '../button'
import { DrawerContextType, DrawerProps } from './drawer.types'
import { cn } from '@gentelduck/libs/cn'
import { X } from 'lucide-react'
import './src/style.css'
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../dialog'
import { useScaleBackground } from './drawer.hooks'
import { usePreventScroll } from './src/use-prevent-scroll'

/**
 * Context for managing the open state of the Drawer.
 *
 */
export const DrawerContext = React.createContext<DrawerContextType | null>(null)

/**
 * Hook to access the DrawerContext. It holds the open state of the Drawer
 * and a function to update it.
 *
 * @returns {DrawerContextType} The Drawer context object.
 * @throws {Error} If the hook is used outside of a Drawer.
 */
export function useDrawerContext(name: string = 'Drawer'): DrawerContextType {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error(`useDrawerContext must be used within a ${name}`)
  }
  return context
}

/**
 * Drawer component that provides a context for managing its open state and
 * behavior. It uses a ref to handle the underlying HTMLDrawerElement.
 *
 * @param {DrawerProps} props - The properties for the Drawer component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the Drawer.
 * @param {boolean} [props.open] - Initial open state of the Drawer.
 * @param {(state:boolean)=>void} [props.onOpenChange] - Callback function to handle state changes of the Drawer.
 *
 * @returns {React.JSX.Element} A context provider that manages the Drawer state and renders its children.
 */
export function DrawerRoot({
  children,
  open: openProp,
  onOpenChange,
  direction = 'bottom',
  noBodyStyles = false,
  shouldScaleBackground = true,
  setBackgroundColorOnScale = true,
  disablePreventScroll,
}: DrawerProps): React.JSX.Element {
  const DrawerRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  const _onOpenChange = (state: boolean) => {
    try {
      const Drawer = DrawerRef.current

      if (!state) {
        const Drawer = DrawerRef.current

        setOpen(false)
        //FIX: the animation is not working on exit, so i mocked this behaviour.
        setTimeout(() => {
          Drawer?.close()
        }, 300)
        // document.body.style.overflow = 'auto'
        return onOpenChange?.(false)
      }
      Drawer?.showModal()
      // document.body.style.overflow = 'hidden'
      setOpen(true)
      onOpenChange?.(true)
    } catch (e) {
      console.warn('Drawer failed to toggle', e)
    }
  }

  React.useEffect(() => {
    open && DrawerRef.current?.showModal()
  }, [])

  React.useEffect(() => {
    const Drawer = DrawerRef.current

    Drawer?.addEventListener('close', () => _onOpenChange(false))
    return () =>
      Drawer?.removeEventListener('close', () => _onOpenChange(false))
  }, [])

  useScaleBackground({
    open,
    noBodyStyles,
    setBackgroundColorOnScale,
    shouldScaleBackground,
    direction,
  })

  return (
    <DrawerContext.Provider
      value={{
        open: open ?? false,
        onOpenChange: _onOpenChange,
        ref: DrawerRef,
        direction,
        shouldScaleBackground,
        setBackgroundColorOnScale,
        noBodyStyles,
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}

/**
 * A component that serves as a trigger for the Drawer.
 *
 * It takes all the props of the Button component and an additional
 * `onClick` property that is called when the Drawer is opened.
 *
 * @param {React.ComponentPropsWithoutRef<typeof Button>} props - The properties for the Button component.
 * @param {Function} [props.onClick] - Callback function to handle click events on the button.
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the button.
 * @param {React.ComponentPropsWithoutRef<typeof Button>} [...props] - The properties for the Button component.
 *
 * @returns {React.JSX.Element} A button that toggles the Drawer on click.
 */
export function DrawerTrigger({
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>): React.JSX.Element {
  const { onOpenChange } = useDrawerContext()

  return (
    <Button
      onClick={(e) => {
        onOpenChange(true)
        onClick?.(e)
      }}
      {...props}
    />
  )
}

/**
 * DrawerContent component to be used inside a Drawer.
 *
 * It takes all the props of the HTMLDrawerElement and an additional
 * `className` property to apply additional CSS classes.
 *
 * @param {React.HTMLProps<HTMLDrawerElement>} props - The properties for the Drawer content.
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the Drawer.
 * @param {string} [props.className] - Additional CSS classes to apply to the Drawer content.
 * @param {boolean} [props.renderOnce] - Whether to render the content only once.
 * @param {React.HTMLProps<HTMLDrawerElement>} [...props] - The properties for the Drawer content.
 *
 * @returns {React.JSX.Element} The Drawer content component with applied props and classes.
 */
export function DrawerContent({
  children,
  className,
  renderOnce,
  ...props
}: React.HTMLProps<HTMLDialogElement> & {
  renderOnce?: boolean
}): React.JSX.Element {
  const { open, ref, onOpenChange } = useDrawerContext()
  const [isClosing, setIsClosing] = React.useState<boolean>(false)
  const [shouldRender, setShouldRender] = React.useState<boolean>(false)
  const _shouldRender = renderOnce ? shouldRender : ref.current?.open

  React.useEffect(() => {
    if (open) return setShouldRender(true)
  }, [open])

  const handleCloseWithAnimation = () => {
    if (!ref.current) return
    setIsClosing(true)

    setTimeout(() => {
      setIsClosing(false)
      onOpenChange(false)
    }, 200)
  }

  return (
    <dialog
      ref={ref}
      className='bg-transparent w-0 h-0 backdrop:z-[51]'
      {...props}
      onClick={(e) => {
        if (e.currentTarget === e.target) handleCloseWithAnimation()
      }}
    >
      <div
        data-state='open'
        data-vaul-overlay=''
        data-vaul-snap-points='false'
        data-vaul-snap-points-overlay='true'
        data-vaul-animate='true'
        className='fixed inset-0 z-50 bg-black/80 pointer-events-none'
        data-aria-hidden='true'
        aria-hidden='true'
      ></div>
      <div
        data-state={open ? 'open' : 'closed'}
        data-vaul-drawer-direction='bottom'
        data-vaul-drawer=''
        data-vaul-delayed-snap-points='false'
        data-vaul-snap-points='false'
        data-vaul-custom-container='false'
        data-vaul-animate='true'
        style={{
          pointerEvents: 'auto',
          transition: 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
          transform: 'translate3d(0px, 0px, 0px)',
        }}
        className={cn(
          'fixed bottom-0 z-50 h-[40vh] flex flex-col rounded-t-[10px] border bg-background w-full max-w-full',
          // isClosing && 'scale-90 opacity-0 backdrop:bg-transparent',
          className,
        )}
      >
        <div className='mx-auto my-4 h-2 w-[100px] rounded-full bg-muted' />
        {children}
      </div>
    </dialog>
  )
}

/**
 * DrawerHeader component renders a header section for a Drawer.
 * It supports additional class names and props to customize the
 * appearance and behavior of the header. The component uses a
 * flexbox layout to arrange its children in a vertical column
 * and applies responsive text alignment.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {React.RefObject<HTMLDivElement>} props.ref - The ref to be forwarded to the component.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional properties for the component.
 *
 * @returns {JSX.Element} The rendered DrawerHeader component.
 */
export const DrawerHeader = DialogHeader

/**
 * DrawerFooter component renders a footer section for a Drawer.
 * It supports additional class names and props to customize the
 * appearance and behavior of the footer. The component uses a
 * flexbox layout to arrange its children in a column on small
 * screens and in a row with space between items on larger screens.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @param {React.RefObject<HTMLDivElement>} props.ref - The ref to be forwarded to the component.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional properties for the component.
 *
 * @returns {React.JSX.Element} The rendered DrawerFooter component.
 */
export const DrawerFooter = DialogFooter

/**
 * `DrawerTitle` is a React component that forwards its ref to the `DrawerTitle` component.
 * It accepts all props that `DrawerTitle` accepts, along with an optional `className` prop
 * to customize its styling.
 *
 * @param {React.HTMLProps<HTMLHeadingElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Optional additional class names to apply to the component.
 * @param {React.RefObject<HTMLHeadingElement>} [props.ref] - A ref that will be forwarded to the `DrawerTitle` component.
 * @param {React.HTMLProps<HTMLHeadingElement>} [...props] - Additional props to be passed to the `DrawerTitle` component.
 *
 * @returns {React.JSX.Element} The rendered `DrawerTitle` component with forwarded ref and applied props.
 */
export const DrawerTitle = DialogTitle

/**
 * `DrawerDescription` is a React component that forwards its ref to the `DrawerDescription` component.
 * It applies additional class names to style the description text.
 *
 * @praam {React.HTMLProps<HTMLParagraphElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the description text.
 * @param {React.RefObject<HTMLParagraphElement>} [props.ref] - The ref to be forwarded to the `DrawerDescription` component.
 * @param {React.HTMLProps<HTMLParagraphElement>} [..props] - Additional props to be passed to the `DrawerDescription` component.
 *
 * @returns {React.JSX.Element} The rendered `DrawerDescription` component with forwarded ref and applied class names.
 */
export const DrawerDescription = DialogDescription

/**
 * DrawerClose component renders a close button for a Drawer.
 * It supports additional class names and props to customize the
 * appearance and behavior of the close button. The component uses
 * the `useDrawerContext` hook to access the `onOpenChange` function
 * to close the Drawer.
 *
 * @param {React.ComponentPropsWithRef<typeof Button>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {React.RefObject<HTMLButtonElement>} props.ref - The ref to be forwarded to the component.
 * @param {React.ComponentPropsWithRef<typeof Button>} [...props] - Additional properties for the component.
 *
 * @returns {React.JSX.Element} The rendered DrawerClose component.
 */
export function DrawerClose({
  onClick,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof Button>): React.JSX.Element {
  const { onOpenChange } = useDrawerContext()
  return (
    <Button
      onClick={(e) => {
        onOpenChange(false)
        onClick?.(e)
      }}
      ref={ref}
      {...props}
    />
  )
}

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Close: DrawerClose,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
}
