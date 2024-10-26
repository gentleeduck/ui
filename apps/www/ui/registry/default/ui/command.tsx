'use client'

import * as React from 'react'

import { type DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { Dialog, DialogContent } from './ShadcnUI/dialog'
import { ScrollArea } from './scroll-area'

import { Check, Search } from 'lucide-react'
import { cn, groupDataByNumbers } from '@/lib/utils'
import { Checkbox } from './checkbox'
import { Button } from './button'
import { Separator } from './ShadcnUI'

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b px-3"
    cmdk-input-wrapper=""
  >
    <Search className="h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
}
CommandShortcut.displayName = 'CommandShortcut'

interface CommandListGroupDataType<T extends keyof Record<string, unknown> = string> {
  label?: T
  element?: ListItemElementType
  onSelect?: OnSelectType
}

interface OnSelectType {
  key?: <T extends string>(arg?: T) => void
  clear?: <T extends string>(arg?: T) => void
}

interface ListItemElementType
  extends Partial<
    React.ComponentPropsWithoutRef<typeof CommandItem> & React.CustomComponentPropsWithRef<typeof Button>
  > {}

interface CommandListGroupType {
  type?: 'combobox' | 'listbox'
  data: CommandListGroupDataType[]
  group?: number[]
  groupheading?: string[]
  onSelect?: OnSelectType
  selected: string[]
  className?: string
  checkabble?: boolean
}

const CommandListGroup = React.forwardRef(
  (
    { data, onSelect, selected, group, groupheading, className, checkabble = false, type }: CommandListGroupType,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const groupedData = groupDataByNumbers(data, group || [data.length])

    return (
      <>
        <ScrollArea className={cn(className)}>
          <CommandList
            className={cn('overflow-hidden max-h-full', type === 'listbox' && '')}
            ref={ref}
          >
            <CommandEmpty>No framework found.</CommandEmpty>
            {groupedData.map((group, idx) => {
              return (
                <CommandGroup
                  heading={groupheading?.[idx]}
                  key={idx}
                >
                  {group.map((el, idx) => {
                    const { children, className, icon, ...props } = el.element ?? {}
                    const { className: iconClassName, children: Icon, ...iconProps } = icon ?? {}

                    return (
                      <CommandItem
                        key={idx}
                        value={el.label}
                        className={cn(
                          'data-[disabled=true]:opacity-50',
                          selected.includes((el?.label as string) ?? (el?.element?.children as string)) &&
                            type === 'combobox' &&
                            'bg-accent text-accent-foreground',
                          className
                        )}
                        onSelect={onSelect?.key}
                        {...(props as typeof CommandItem)}
                      >
                        {checkabble &&
                          (type === 'combobox' ? (
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selected.includes((el?.label as string) ?? (el?.element?.children as string))
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          ) : (
                            <Checkbox
                              checked={selected.includes((el?.label as string) ?? (el?.element?.children as string))}
                              className={cn('mr-2 h-4 w-4  border-muted-foreground')}
                            />
                          ))}
                        <span className="flex items-center gap-2">
                          {Icon && (
                            <Icon
                              className={cn(iconClassName)}
                              {...iconProps}
                            />
                          )}
                          {children ?? el?.label}
                        </span>
                        <CommandShortcut>{el.element?.label?.children}</CommandShortcut>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )
            })}
          </CommandList>
        </ScrollArea>
        {selected.length > 0 && type === 'listbox' && (
          <>
            <Separator />
            <Button
              variant="ghost"
              size={'sm'}
              className="justify-center m-1 w-auto py-2 text-xs"
              onClick={() => {
                if (onSelect?.clear) {
                  onSelect.clear()
                }
              }}
            >
              Clear Filter
            </Button>
          </>
        )}
      </>
    )
  }
)

CommandListGroup.displayName = 'CommandListGroup'

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandListGroup,
  type CommandDialogProps,
  type CommandListGroupDataType,
  type ListItemElementType,
  type CommandListGroupType,
}
