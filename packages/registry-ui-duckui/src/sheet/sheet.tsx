'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { cn } from '@gentelduck/libs/cn'
import { sheetVariants } from './sheet.constants'
import { SheetContentProps, SheetWrapperProps } from './sheet.types'
import { Button } from '../button'

export interface SheetContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const SheetContext = React.createContext<SheetContextType | null>(null)

export function useSheetContext() {
  const context = React.useContext(SheetContext)

  if (!context) {
    throw new Error('useSheetContext must be used within a SheetProvider')
  }
  return context
}

function Sheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

export interface SheetTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Button> { }

function SheetTrigger({ onClick, ...props }: SheetTriggerProps) {
  const { setOpen } = useSheetContext()
  return (
    <Button
      onClick={(e) => {
        setOpen(true)
        onClick?.(e)
      }}
      {...props}
    />
  )
}

/**
 * A component that provides a close button for the Sheet component.
 * This is a wrapper around the `SheetPrimitive.Close` component.
 */
export interface SheetCloseProps
  extends React.ComponentPropsWithoutRef<typeof Button> { }
function SheetClose({ onClick, ...props }: SheetCloseProps) {
  const { setOpen } = useSheetContext()
  return (
    <Button
      onClick={(e) => {
        setOpen(false)
        onClick?.(e)
      }}
      {...props}
    />
  )
}

/**
 * A portal component for rendering the Sheet component outside of its parent hierarchy.
 * This is useful for rendering the Sheet in a different part of the DOM tree, such as at the root level.
 */
// TODO:
// const SheetPortal = SheetPrimitive.Portal

/**
 * `SheetOverlay` is a React component that renders an overlay for a sheet component.
 *
 * @param {string} className - Additional class names to apply to the overlay.
 * @param {React.Ref} ref - A ref to be forwarded to the `SheetPrimitive.Overlay` component.
 * @param {object} props - Additional props to be passed to the `SheetPrimitive.Overlay` component.
 *
 * @returns {JSX.Element} The rendered overlay component.
 */
export interface SheetOverlayProps extends React.HTMLProps<HTMLDivElement> { }
const SheetOverlay = ({ className, ref, ...props }: SheetOverlayProps) => (
  <div
    ref={ref}
    className={cn(
      'fixed inset-0 z-[51] bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=closed]:pointer-events-none',
      className,
    )}
    {...props}
  />
)

/**
 * `SheetContent` is a React component that renders the content of a sheet.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.side='right'] - The side of the sheet where the content will appear. Defaults to 'right'.
 * @param {string} [props.className] - Additional class names to apply to the content.
 * @param {React.Ref} [props.ref] - The ref to be forwarded to the `SheetContent` component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the sheet.
 *
 * @returns {React.JSX.Element} The rendered sheet content.
 */

const SheetContent = ({
  className,
  children,
  side = 'right',
  ref,
  ...props
}: SheetContentProps): React.JSX.Element => {
  const { open, setOpen } = useSheetContext()
  const [shouldrender, setShouldRender] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (open) {
      setShouldRender(true)
      // document.body.style.overflow = 'hidden'
    } else {
      // document.body.style.overflow = 'auto'
    }
  }, [open])

  return (
    <>
      <SheetOverlay
        onClick={() => setOpen(false)}
        data-state={open ? 'open' : 'closed'}
      />
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn(sheetVariants({ side: 'right' }), className)}
        {...props}
      >
        {shouldrender && children}
        <button
          aria-label='close'
          className='absolute right-4 top-4 size-4 cursor-pointer opacity-70 hover:opacity-100 transition'
        >
          <X aria-hidden onClick={() => setOpen(false)} className='size-4' />
        </button>
      </div>
    </>
  )
}

/**
 * SheetHeader component renders a header section for a sheet.
 * It supports additional class names and props to customize the
 * appearance and behavior of the header. The component uses a
 * flexbox layout to arrange its children in a vertical column
 * and applies responsive text alignment.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - A ref to be forwarded to the component.
 * @param {string} props.className - Additional class names for styling.
 *
 * @returns {React.JSX.Element} The rendered SheetHeader component.
 */
function SheetHeader({
  className,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-2 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  )
}

/**
 * SheetFooter component renders a footer section for a sheet.
 * It supports additional class names and props to customize the
 * appearance and behavior of the footer. The component uses a
 * flexbox layout to arrange its children in a column on small
 * screens and in a row with space between items on larger screens.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - Additional class names for styling.
 *
 * @returns {React.JSX.Element} The rendered SheetFooter component.
 */
function SheetFooter({
  className,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  )
}

/**
 * `SheetTitle` is a React component that forwards its ref to the `SheetTitle` component.
 * It applies additional class names for styling and accepts all props that `SheetTitle` accepts.
 *
 * @param {React.HTMLProps<HTMLHeadingElement>} props - The properties passed to the component.
 * @param {string} [props.className ] - Additional class names to apply to the component.
 * @param {React.Ref<HTMLHeadingElement>} [props.ref] - A ref to be forwarded to the `SheetTitle` component.
 * @param {React.HTMLProps<HTMLHeadingElement>} [...props] - All other props to be passed to the `SheetTitle` component.
 *
 * @returns {React.JSX.Element} The rendered `SheetTitle` component with forwarded ref and applied class names.
 */
const SheetTitle = ({
  className,
  ref,
  ...props
}: React.HTMLProps<HTMLHeadingElement>): React.JSX.Element => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
)

/**
 * `SheetDescription` is a React forwardRef component that wraps around `SheetDescription`.
 * It allows you to pass a `ref` and additional props to the `SheetDescription` component.
 *
 * @param {React.HTMLProps<HTMLParagraphElement>} props - The properties passed to the component.
 * @param {string} [props.className] - A className to apply to the component.
 * @param {React.Ref} [props.ref] - A ref to be forwarded to the `SheetPrimitive.Description` component.
 * @param {React.HTMLProps<HTMLParagraphElement>} [..props] - Additional props to be passed to the component.
 *
 * @returns {React.JSX.Element} A `SheetDescription` component with forwarded ref and additional props.
 */
const SheetDescription = ({
  className,
  ref,
  ...props
}: React.HTMLProps<HTMLParagraphElement>): React.JSX.Element => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)

/**
 * `SheetWrapper` is a React component that wraps a `Sheet` component and renders children elements
 * conditionally based on the screen size. If the screen width is 768px or greater, a `Drawer` is rendered; otherwise,
 * a `Sheet` is rendered.
 * @param {SheetWrapperProps} props - The properties passed to the component.
 * @returns {React.JSX.Element} The rendered `Drawer` or `Sheet` component.
 */
function SheetWrapper({
  trigger,
  content,
  duckHook,
  ...props
}: SheetWrapperProps): React.JSX.Element {
  const {
    className: subContentClassName,
    children: subcontentChildren,
    _header,
    _footer,
    ...subContentProps
  } = content
  const {
    className: subHeaderClassName,
    _description: subDescription,
    _title: subTitle,
    ...subHeaderProps
  } = _header ?? {}
  const {
    className: subFooterClassName,
    _submit: _subSubmit,
    _cancel: _subCancel,
    ...subFooterProps
  } = _footer ?? {}

  return (
    <Sheet
      open={duckHook?.state.shape}
      onOpenChange={duckHook?.handleOpenChange}
      {...props}
    >
      <SheetTrigger {...trigger} />
      <SheetContent
        className={cn('flex flex-col w-full h-full', subContentClassName)}
        {...subContentProps}
      >
        <div data-role-wrapper className='flex flex-col gap-4 w-full h-full'>
          {_header && (
            <SheetHeader {...subHeaderProps}>
              {subHeaderProps.children ? (
                subHeaderProps.children
              ) : (
                <>
                  <SheetTitle {...subTitle} />
                  <SheetDescription {...subDescription} />
                </>
              )}
            </SheetHeader>
          )}
          {subcontentChildren}
          <SheetFooter
            className={cn('gap-2', subFooterClassName)}
            {...subFooterProps}
          >
            <SheetClose asChild {..._subCancel} />
            <div
              {..._subSubmit}
              className={cn('ml-0', _subSubmit?.className)}
              onClick={(e) => {
                duckHook?.setState({ shape: false, alert: false })
                _subSubmit?.onClick?.(e)
              }}
            />
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
SheetWrapper.displayName = 'SheetWrapper'

export {
  Sheet,
  // SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetWrapper,
}
