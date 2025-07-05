'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import { Command, CommandEmpty, CommandGroup, CommandList } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

export type ComboboxContextType<T extends unknown[] = unknown[]> = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
}

export const ComboboxContext = React.createContext<ComboboxContextType | null>(null)

export const useComboboxContext = <T extends unknown[]>() => {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error('useComboboxContext must be used within a ComboboxProvider')
  }
  return context as unknown as ComboboxContextType<T>
}

export interface ComboboxType<T extends unknown[]>
  extends Omit<React.ComponentPropsWithoutRef<typeof Command>, 'children'>,
    React.ComponentPropsWithoutRef<typeof Popover> {
  data: T
}

export const Combobox = <T extends unknown[]>({
  children,
  modal,
  defaultOpen,
  data: _data,
  className,
  ...props
}: ComboboxType<T>) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const [data, setData] = React.useState<T>(_data)

  const Context = ComboboxContext

  return (
    <Context.Provider
      value={{
        open,
        setOpen,
        value,
        setValue,
        loading,
        setLoading,
        data,
        setData: setData as React.Dispatch<React.SetStateAction<unknown[]>>,
      }}>
      <Popover open={open} onOpenChange={setOpen} modal={modal} defaultOpen={defaultOpen}>
        <Command className={cn('border-none bg-transparent', className)} {...props}>
          {children}
        </Command>
      </Popover>
    </Context.Provider>
  )
}

export interface ComboboxTriggerProps extends React.HTMLProps<HTMLDivElement> {
  type?: 'default' | 'custom'
}

export const ComboboxTrigger = React.forwardRef<HTMLDivElement, ComboboxTriggerProps>(
  ({ className, children, type = 'default', ...props }, ref) => {
    const { setOpen, data, value } = useComboboxContext() ?? {}

    return (
      <>
        {type === 'default' ? (
          <PopoverTrigger>{children}</PopoverTrigger>
        ) : (
          <>
            {children}
            <PopoverTrigger></PopoverTrigger>
          </>
        )}
      </>
    )
  },
)

export interface ComboboxItemProps
  extends React.HTMLProps<HTMLDivElement>,
    React.ComponentPropsWithoutRef<typeof Popover> {
  notFound?: string
}

export const ComboboxContent = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ children, notFound = 'No data found.', ...props }, ref) => {
    return (
      <PopoverContent className="!w-[618px] p-0" {...props} ref={ref}>
        <CommandList>
          <CommandEmpty>{notFound}</CommandEmpty>
          <CommandGroup>{children}</CommandGroup>
        </CommandList>
      </PopoverContent>
    )
  },
)
