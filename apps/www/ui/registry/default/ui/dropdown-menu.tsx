'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'

import { cn, groupArrays } from '@/lib/utils'
import { Button, CommandType } from './button'
import { ButtonProps } from './button'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

interface DropdownMenuOptionsDataType<T, Y extends boolean = true>
  extends Partial<
    Omit<ButtonProps, 'command'> &
      React.ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItem> &
      React.ComponentPropsWithoutRef<typeof DropdownMenuItem> &
      React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem>
  > {
  action?: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>, args: T) => void
  command?: React.ComponentPropsWithoutRef<typeof DropdownMenuShortcut> & CommandType
  nestedData?: Y extends true
    ? Partial<React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent> & DropdownMenuOptionsType<T, Y>>
    : never
}

interface DropdownMenuOptionsType<T, Y extends boolean = true> {
  itemType?: 'checkbox' | 'radio' | 'label'
  optionsData?: DropdownMenuOptionsDataType<T, Y>[]
  group?: number[]
}

interface DropdownMenuViewProps<T, Y extends boolean = true> {
  content?: Partial<
    {
      label?: React.ComponentPropsWithoutRef<typeof DropdownMenuLabel>
      options?: DropdownMenuOptionsType<T, Y>
    } & React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
  >
  trigger?: React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger> & ButtonProps
}

function DropdownMenuView<T, Y extends boolean = true>({ content, trigger }: DropdownMenuViewProps<T, Y>) {
  const { className: triggerClassName, command: triggerCommand, icon: Icon, ...triggerProps } = trigger ?? {}
  const { className: optionsClassName, options, label, align = 'end', ...contentProps } = content ?? {}
  const { className: labelClassName, ...labelProps } = label ?? {}

  const groupedOption = groupArrays(options?.group ?? [options?.optionsData?.length || 1], options?.optionsData ?? [])
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('w-[fit-content]', triggerClassName)}
          command={
            {
              ...triggerCommand,
              state: open,
              action: () => {
                setOpen(!open)
                return false
              },
            } as CommandType
          }
          icon={Icon}
          {...triggerProps}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn('w-[200px]', optionsClassName)}
        {...contentProps}
      >
        {label && (
          <>
            <DropdownMenuLabel
              className={cn('text-sm', labelClassName)}
              {...labelProps}
            />
            <DropdownMenuSeparator />
          </>
        )}
        {groupedOption.map((group, idx) => {
          return (
            <React.Fragment key={`group-${idx}`}>
              {group.map((item, idx) => {
                const { children, className, itemType = 'label', value, action, nestedData, key: _key, ...props } = item

                const { children: Icon, className: iconClassName, ...iconProps } = item.icon ?? {}
                const {
                  className: commandClassName,
                  label: commandLabel,
                  action: commandAction,
                  ...commandProps
                } = item.command ?? {}
                const {
                  className: nestedClassName,
                  group: nestedGroup,
                  optionsData: nestedOptions,
                  ...nestedProps
                } = nestedData ?? {}
                const groupedNestedOption =
                  groupArrays(
                    nestedData?.group ?? [nestedData?.optionsData?.length || 1],
                    nestedData?.optionsData ?? []
                  ) ?? []

                const Component =
                  options?.itemType === 'checkbox'
                    ? DropdownMenuCheckboxItem
                    : options?.itemType === 'radio'
                      ? DropdownMenuRadioItem
                      : DropdownMenuItem

                return (
                  <React.Fragment key={`item-${idx}`}>
                    {!nestedData?.optionsData?.length ? (
                      <Component
                        value={value as string}
                        className={cn('flex gap-2 items-center', className)}
                        {...props}
                      >
                        {Icon && (
                          <Icon
                            className={cn('h-4 w-4', iconClassName)}
                            {...iconProps}
                          />
                        )}
                        {children}
                        {item.command && (
                          <>
                            {commandLabel && (
                              <DropdownMenuShortcut
                                children={commandLabel}
                                {...commandProps}
                                key={`command-${idx}`}
                              />
                            )}
                            <Button
                              command={item.command}
                              className="sr-only hidden"
                            />
                          </>
                        )}
                      </Component>
                    ) : (
                      <DropdownMenuSub key={`sub-item-${idx}`}>
                        <DropdownMenuSubTrigger className={cn('flex item-center gap-2')}>
                          {Icon && (
                            <Icon
                              className={cn('h-4 w-4', iconClassName)}
                              {...iconProps}
                            />
                          )}
                          {children}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent
                            className={cn('w-[200px]', nestedClassName)}
                            {...nestedProps}
                          >
                            {groupedNestedOption?.map((nestedItem, idx) => {
                              return (
                                <React.Fragment key={`nested-${idx}`}>
                                  {nestedItem.map((nestedItemInner, idx) => {
                                    const {
                                      children: nestedChildren,
                                      itemType: nestedItemType = 'label',
                                      value: nestedValue,
                                      className: nestedClassName,
                                      ...nestedProps
                                    } = nestedItemInner
                                    const {
                                      children: NestedIcon,
                                      className: nestedIconClassName,
                                      ...nestedIconProps
                                    } = nestedItemInner.icon ?? {}
                                    const {
                                      className: nestedCommandClassName,
                                      label: enstedCommandLabel,
                                      action: nestedCommandAction,
                                      ...nestedCommandProps
                                    } = nestedItemInner.command ?? {}

                                    const NestedComponent =
                                      nestedData.itemType === 'checkbox'
                                        ? DropdownMenuCheckboxItem
                                        : nestedData.itemType === 'radio'
                                          ? DropdownMenuRadioItem
                                          : DropdownMenuItem

                                    return (
                                      <NestedComponent
                                        value={value as string}
                                        key={`nested-item-${idx}`}
                                        className={cn('flex gap-2 items-center', nestedClassName)}
                                        {...nestedProps}
                                      >
                                        {NestedIcon && (
                                          <NestedIcon
                                            {...nestedIconProps}
                                            className={cn('h-4 w-4', nestedIconClassName)}
                                          />
                                        )}
                                        {nestedChildren}
                                        {nestedItemInner.command && (
                                          <>
                                            <DropdownMenuShortcut
                                              children={enstedCommandLabel}
                                              {...nestedCommandProps}
                                              key={`nested-item-shortcut-${idx}`}
                                            />
                                            <Button
                                              command={nestedItemInner.command}
                                              className="sr-only hidden"
                                            />
                                          </>
                                        )}
                                      </NestedComponent>
                                    )
                                  })}
                                  {idx !== groupedNestedOption?.length - 1 && (
                                    <DropdownMenuSeparator key={`separator-${idx}`} />
                                  )}
                                </React.Fragment>
                              )
                            })}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    )}
                  </React.Fragment>
                )
              })}
              {idx !== groupedOption.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuView,
  type DropdownMenuOptionsDataType,
  type DropdownMenuOptionsType,
}
