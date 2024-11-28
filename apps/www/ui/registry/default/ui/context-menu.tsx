'use client'

import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'

import { cn, groupArrays } from '@/lib/utils'
import { Button, ButtonProps, CommandType } from '@/registry/registry-ui-components'

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', inset && 'pl-8', className)}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

type DropdownMenuOptionsDataType<T, Y extends boolean = true> = {
  command?: React.ComponentPropsWithoutRef<typeof ContextMenuShortcut> & CommandType
  nestedData?: Y extends true
    ? Partial<React.ComponentPropsWithoutRef<typeof ContextMenuSubContent> & ContextMenuOptionsType<T>>
    : never
} & Partial<Omit<ButtonProps, 'command'>> &
  Partial<React.ComponentPropsWithoutRef<typeof ContextMenuCheckboxItem>> &
  Partial<React.ComponentPropsWithoutRef<typeof ContextMenuItem>> &
  Partial<React.ComponentPropsWithoutRef<typeof ContextMenuRadioItem>>

interface ContextMenuOptionsType<T> {
  itemType?: 'checkbox' | 'radio' | 'label'
  actionsArgs?: T extends {} ? T : never
  optionsData?: DropdownMenuOptionsDataType<T>[]
  group?: number[]
}

export interface DuckContextMenuProps<T> {
  wrapper?: Partial<React.ComponentPropsWithoutRef<typeof ContextMenu>>
  content?: Partial<
    {
      label?: React.ComponentPropsWithoutRef<typeof ContextMenuLabel>
      options?: ContextMenuOptionsType<T>
    } & React.ComponentPropsWithoutRef<typeof ContextMenuContent>
  >
  trigger?: React.ComponentPropsWithoutRef<typeof ContextMenuTrigger> & ButtonProps
}

export const DuckContextMenu = <T,>({ content, trigger, wrapper }: DuckContextMenuProps<T>) => {
  const { className: triggerClassName, icon: Icon, children: triggerChildren, ...triggerProps } = trigger ?? {}
  const { className: optionsClassName, options, ...contentProps } = content ?? {}
  const groupedOption = groupArrays(options?.group ?? [options?.optionsData?.length || 1], options?.optionsData ?? [])
  const {} = wrapper ?? {}

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {triggerChildren ? (
          triggerChildren
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={cn(triggerClassName)}
            icon={Icon}
            {...triggerProps}
          />
        )}
      </ContextMenuTrigger>
      {options?.optionsData?.length ? (
        <ContextMenuContent
          className={cn('w-[200px]', optionsClassName)}
          {...contentProps}
        >
          {groupedOption.map((group, idx) => {
            return (
              <React.Fragment key={`group-${idx}`}>
                {group.map((item, idx) => {
                  const { children, className, value, nestedData, ...props } = item
                  const { children: Icon, className: iconClassName, ...iconProps } = item.icon ?? {}
                  const {
                    className: commandClassName,
                    label: commandLabel,
                    action: commandAction,
                    ...commandProps
                  } = item.command ?? {}
                  const groupedNestedOption =
                    groupArrays(
                      nestedData?.group ?? [nestedData?.optionsData?.length || 1],
                      nestedData?.optionsData ?? []
                    ) ?? []
                  const {
                    className: nestedClassName,
                    group: nestedGroup,
                    optionsData: nestedOptions,
                    ...nestedProps
                  } = nestedData ?? {}

                  const Component =
                    options?.itemType === 'checkbox'
                      ? ContextMenuCheckboxItem
                      : options?.itemType === 'radio'
                        ? ContextMenuRadioItem
                        : ContextMenuItem

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
                              {...iconProps}
                              className={cn('h-4 w-4', iconClassName)}
                            />
                          )}
                          {children}
                          {item.command && (
                            <>
                              <ContextMenuShortcut
                                children={commandLabel}
                                {...commandProps}
                                key={`command-${idx}`}
                              />
                              <Button
                                command={item.command}
                                className="sr-only hidden"
                              />
                            </>
                          )}
                        </Component>
                      ) : (
                        <ContextMenuSub key={`sub-item-${idx}`}>
                          <ContextMenuSubTrigger className={cn('flex item-center gap-2')}>
                            {Icon && (
                              <Icon
                                {...iconProps}
                                className={cn('h-4 w-4', iconClassName)}
                              />
                            )}
                            {children}
                          </ContextMenuSubTrigger>
                          <ContextMenuPortal>
                            <ContextMenuSubContent
                              className={cn('w-[200px]', nestedClassName)}
                              {...nestedProps}
                            >
                              {groupedNestedOption?.map((nestedItem, idx) => {
                                return (
                                  <React.Fragment key={`nested-${idx}`}>
                                    {nestedItem.map((nestedItemInner, idx) => {
                                      const {
                                        children: nestedChildren,
                                        value,
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
                                          ? ContextMenuCheckboxItem
                                          : nestedData.itemType === 'radio'
                                            ? ContextMenuRadioItem
                                            : ContextMenuItem

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
                                              <ContextMenuShortcut
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
                                      <ContextMenuSeparator key={`separator-${idx}`} />
                                    )}
                                  </React.Fragment>
                                )
                              })}
                            </ContextMenuSubContent>
                          </ContextMenuPortal>
                        </ContextMenuSub>
                      )}
                    </React.Fragment>
                  )
                })}
                {idx !== groupedOption.length - 1 && <ContextMenuSeparator />}
              </React.Fragment>
            )
          })}
        </ContextMenuContent>
      ) : null}
    </ContextMenu>
  )
}

DuckContextMenu.displayName = 'ContextCustomGroup'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  DuckContextMenu as ContextCustomView,
  type ContextMenuOptionsType,
}
