import * as React from 'react'
import { cn, groupArrays } from '@/lib/utils'
import {
  Button,
  ButtonProps,
  CommandType,
} from '@/registry/registry-ui-components'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  opdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu'

interface DropdownMenuOptionsDataType
  extends Partial<
    Omit<ButtonProps, 'command'> &
    React.ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItem> &
    React.ComponentPropsWithoutRef<typeof DropdownMenuItem> &
    React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem>
  {
  action?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLDivElement>,
    args: never,
  ) => void
  command?: React.ComponentPropsWithoutRef<typeof DropdownMenuShortcut> &
    CommandType
  nestedData?: React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent> &
    DropdownMenuOptionsType
}

interface DropdownMenuOptionsType {
  itemType?: 'checkbox' | 'radio' | 'label'
  optionsData?: DropdownMenuOptionsDataType[]
  group?: number[]
}

interface DropdownMenuViewProps {
  wrapper?: React.ComponentPropsWithoutRef<typeof DropdownMenu>
  content: {
    label?: React.ComponentPropsWithoutRef<typeof DropdownMenuLabel>
    options: DropdownMenuOptionsType
  } & React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
  trigger: React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger> &
    ButtonProps
}

export function DropdownMenuView({
  wrapper,
  content,
  trigger,
}: DropdownMenuViewProps) {
  const {
    className: optionsClassName,
    options,
    label,
    align = 'end',
    ...contentProps
  } = content ?? {}

  const groupedOption = groupArrays(
    options?.group ?? [options?.optionsData?.length || 1],
    options?.optionsData ?? [],
  )
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu
      modal={wrapper?.modal ?? false}
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownWrapperTrigger trigger={trigger} setOpen={setOpen} />

      <DropdownMenuContent
        align={align}
        className={cn('w-[200px]', optionsClassName)}
        {...contentProps}
      >
        <DropdownWrapperLabel label={label} />

        {groupedOption.map((group, idx) => {
          return (
            <React.Fragment key={`group-${idx}`}>
              {group.map((item, idx) => {
                const {
                  children,
                  className,
                  itemType = 'label',
                  value,
                  action,
                  nestedData,
                  key: _key,
                  ...props
                } = item

                const {
                  children: Icon,
                  className: iconClassName,
                  ...iconProps
                } = item.icon ?? {}
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
                    nestedData?.optionsData ?? [],
                  ) ?? []

                return (
                  <React.Fragment key={`item-${idx}`}>
                    {!nestedData?.optionsData?.length ? (
                      <DropdownWrapperItem item={item} idx={idx} />
                    ) : (
                      <DropdownMenuSub key={`sub-item-${idx}`}>
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
                                        className={cn(
                                          'flex gap-2 items-center',
                                          nestedClassName,
                                        )}
                                        {...nestedProps}
                                      >
                                        {NestedIcon && (
                                          <NestedIcon
                                            {...nestedIconProps}
                                            className={cn(
                                              'h-4 w-4',
                                              nestedIconClassName,
                                            )}
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
                                    <DropdownMenuSeparator
                                      key={`separator-${idx}`}
                                    />
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

export function DropdownWrapperTrigger({
  trigger,
  setOpen,
}: {
  trigger: React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger> &
    ButtonProps
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { className, command, ...props } = trigger
  return (
    <DropdownMenuTrigger asChild>
      <Button
        className={cn('w-[fit-content]', className)}
        command={{
          ...command!,
          action: () => setOpen(!open),
        }}
        {...props}
      />
    </DropdownMenuTrigger>
  )
}

export function DropdownWrapperLabel({
  label,
}: { label?: React.ComponentProps<typeof DropdownMenuLabel> }) {
  const { className, ...props } = label ?? {}
  return (
    label && (
      <>
        <DropdownMenuLabel className={cn('text-sm', className)} {...props} />
        <DropdownMenuSeparator />
      </>
    )
  )
}

export function DropdownWrapperItem({
  item,
  idx,
}: { item: DropdownMenuOptionsDataType; idx: number }) {
  const {
    children,
    className,
    itemType = 'label',
    value,
    action,
    nestedData,
    key: _key,
    ...props
  } = item

  const {
    children: Icon,
    className: iconClassName,
    ...iconProps
  } = item.icon ?? {}

  const {
    className: commandClassName,
    label: commandLabel,
    action: commandAction,
    ...commandProps
  } = item.command ?? {}

  const Component =
    itemType === 'checkbox'
      ? DropdownMenuCheckboxItem
      : itemType === 'radio'
        ? DropdownMenuRadioItem
        : DropdownMenuItem

  return (
    <Component
      value={value as string}
      className={cn('flex gap-2 items-center', className)}
      {...props}
    >
      {Icon && <Icon className={cn('h-4 w-4', iconClassName)} {...iconProps} />}
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
          <Button command={item.command} className="sr-only hidden" />
        </>
      )}
    </Component>
  )
}

export function DropdownWrapperSubItem({
  item,
}: { item: DropdownMenuOptionsDataType }) {
  const { children, className, icon, ...props } = item
  return (
    <DropdownMenuSubTrigger className={cn('flex item-center gap-2')}>
      {Icon && <Icon className={cn('h-4 w-4', iconClassName)} {...iconProps} />}
      {children}
    </DropdownMenuSubTrigger>
  )
}
