import React from 'react'
import { DrawerContextType } from './drawer.types'
import { Button } from '../../button'
import { cn } from '@gentelduck/libs/cn'

export const DrawerContext = React.createContext<DrawerContextType | null>(null)

const useDrawerContext = () => {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawerContext must be used within a Drawer')
  }
  return context
}

export interface DrawerProps {
  children: React.ReactNode
}

function Drawer({ children }: DrawerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

export interface DrawerTriggerProps
  extends React.ComponentPropsWithRef<typeof Button> { }

function DrawerTrigger({
  variant = 'outline',
  onClick,
  ref,
  ...props
}: DrawerTriggerProps) {
  const { setOpen } = useDrawerContext()
  return (
    <Button
      variant={'outline'}
      ref={ref}
      onClick={(e) => {
        setOpen(true)
        onClick?.(e)
      }}
      {...props}
    />
  )
}

export interface DrawerContentProps extends React.HTMLProps<HTMLDivElement> { }

function DrawerContent({
  className,
  children,
  ref,
  ...props
}: DrawerContentProps) {
  const { open, setOpen } = useDrawerContext()

  const [shouldrender, setShouldRender] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (open) {
      setShouldRender(true)
      // document.body.style.scale = '0.9'
      // document.body.style.overflow = 'hidden'
    } else {
      // document.body.style.overflow = 'auto'
    }
  }, [open])

  return (
    <>
      <DrawerOverlay
        onClick={() => setOpen(false)}
        data-state={open ? 'open' : 'closed'}
      />
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-[51] mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
          className,
        )}
        ref={ref}
        {...props}
      >
        <div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted'></div>
        {children}
      </div>
    </>
  )
}

export interface DrawerOverlayProps extends React.HTMLProps<HTMLDivElement> { }
function DrawerOverlay({
  className,
  children,
  ref,
  ...props
}: DrawerOverlayProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-[51] bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=closed]:pointer-events-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DrawerHeaderProps extends React.HTMLProps<HTMLDivElement> { }

function DrawerHeader({
  className,
  ref,
  ...props
}: DrawerHeaderProps): JSX.Element {
  return (
    <div
      className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
      ref={ref}
      {...props}
    />
  )
}

export interface DrawerTitleProps extends React.HTMLProps<HTMLHeadingElement> { }

function DrawerTitle({ className, children, ref, ...props }: DrawerTitleProps) {
  return (
    <h2
      className={cn('text-lg font-semibold leading-none tracking-tight')}
      ref={ref}
      {...props}
    >
      {children}
    </h2>
  )
}

export interface DrawerDescriptionProps
  extends React.HTMLProps<HTMLParagraphElement> { }

function DrawerDescription({
  className,
  children,
  ref,
  ...props
}: DrawerDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground')} ref={ref} {...props}>
      {children}
    </p>
  )
}

export interface DrawerFooterProps extends React.HTMLProps<HTMLDivElement> { }
function DrawerFooter({
  className,
  ref,
  ...props
}: DrawerFooterProps): JSX.Element {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      ref={ref}
      {...props}
    />
  )
}

export interface DrawerCloseProps
  extends React.ComponentPropsWithRef<typeof Button> { }

function DrawerClose({
  variant = 'outline',
  onClick,
  ref,
  ...props
}: DrawerCloseProps) {
  const { setOpen } = useDrawerContext()
  return (
    <Button
      variant={'outline'}
      ref={ref}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  useDrawerContext,
}
