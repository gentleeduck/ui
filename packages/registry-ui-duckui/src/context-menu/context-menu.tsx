'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  useDropdownMenuContext,
} from '../dropdown-menu'

function ContextMenu(props: React.ComponentPropsWithoutRef<typeof DropdownMenu>) {
  return <DropdownMenu contextMenu {...props} duck-context-menu="" />
}

function ContextMenuTrigger(props: React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>) {
  const { triggerRef, open, onOpenChange } = useDropdownMenuContext()

  React.useLayoutEffect(() => {
    triggerRef.current?.addEventListener('click', (e) => {
      e.preventDefault()
    })

    triggerRef.current?.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      if (open) return

      const trigger = triggerRef.current
      const content = trigger?.nextSibling as HTMLDivElement
      if (!trigger || !content) return

      const mouseX = e.clientX
      const mouseY = e.clientY

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let left = mouseX + 4
      let top = mouseY + 4

      if (mouseX > viewportWidth * 0.5) {
        left = mouseX - 210
      }

      if (mouseY > viewportHeight * 0.6) {
        top = mouseY - 310
      }

      content.style.transform = 'translate(0,0)'
      content.style.left = `${left}px`
      content.style.top = `${top}px`
      content.style.zIndex = '9999'
      setTimeout(() => {
        onOpenChange(true)
      }, 100)
    })
  }, [])

  return (
    <DropdownMenuTrigger
      {...props}
      className={cn(
        'h-[200px] w-[300px] justify-center border-dashed bg-background p-2 hover:bg-background',
        props.className,
      )}
      duck-context-menu-trigger=""
    />
  )
}

function ContextMenuGroup(props: React.ComponentPropsWithoutRef<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup {...props} duck-context-menu-group="" />
}

function ContextMenuSub(props: React.ComponentPropsWithoutRef<typeof DropdownMenuSub>) {
  return <DropdownMenuSub {...props} duck-context-menu-sub="" />
}

function ContextMenuRadioGroup(props: React.ComponentPropsWithoutRef<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup {...props} duck-context-menu-radio-group="" />
}

function ContextMenuSubTrigger(props: React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>) {
  return <DropdownMenuSubTrigger {...props} duck-context-menu-sub-trigger="" />
}

function ContextMenuSubContent(props: React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent>) {
  return <DropdownMenuSubContent {...props} duck-context-menu-sub-content="" />
}

function ContextMenuContent(props: React.ComponentPropsWithoutRef<typeof DropdownMenuContent>) {
  return <DropdownMenuContent {...props} className={cn('fixed', props.className)} duck-context-menu-content="" />
}

function ContextMenuItem(props: React.ComponentPropsWithoutRef<typeof DropdownMenuItem>) {
  return <DropdownMenuItem {...props} duck-context-menu-item="" />
}

function ContextMenuCheckboxItem(props: React.ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItem>) {
  return <DropdownMenuCheckboxItem {...props} duck-context-menu-checkbox-item="" />
}

function ContextMenuRadioItem(props: React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem>) {
  return <DropdownMenuRadioItem {...props} duck-context-menu-radio-item="" />
}

function ContextMenuLabel(props: React.ComponentPropsWithoutRef<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel {...props} duck-context-menu-label="" />
}

function ContextMenuSeparator(props: React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator {...props} duck-context-menu-separator="" />
}

function ContextMenuShortcut(props: React.ComponentPropsWithoutRef<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut {...props} duck-context-menu-shortcut="" />
}

// /////////////
//
// type DropdownMenuOptionsDataType<T, Y extends boolean = true> = {
//   command?: React.ComponentPropsWithoutRef<typeof ContextMenuShortcut> & CommandType
//   nestedData?: Y extends true
//     ? Partial<React.ComponentPropsWithoutRef<typeof ContextMenuSubContent> & ContextMenuOptionsType<T>>
//     : never
// } & Partial<Omit<ButtonProps, 'command'>> &
//   Partial<React.ComponentPropsWithoutRef<typeof ContextMenuCheckboxItem>> &
//   Partial<React.ComponentPropsWithoutRef<typeof ContextMenuItem>> &
//   Partial<React.ComponentPropsWithoutRef<typeof ContextMenuRadioItem>>
//
// interface ContextMenuOptionsType<T> {
//   itemType?: 'checkbox' | 'radio' | 'label'
//   actionsArgs?: T extends {} ? T : never
//   optionsData?: DropdownMenuOptionsDataType<T>[]
//   group?: number[]
// }
//
// export type ContextContent<T> = Partial<{
//   label?: React.ComponentPropsWithoutRef<typeof ContextMenuLabel>
//   options?: ContextMenuOptionsType<T>
// }> //& React.ComponentPropsWithoutRef<typeof ContextMenuContent>
//
// export interface DuckContextMenuProps<T> {
//   wrapper?: Partial<React.ComponentPropsWithoutRef<typeof ContextMenu>>
//   content?: ContextContent<T>
//   trigger?: React.ComponentPropsWithoutRef<typeof ContextMenuTrigger> & ButtonProps
// }
//
// export const DuckContextMenu = <T,>({ content, trigger, wrapper }: DuckContextMenuProps<T>) => {
//   const { className: triggerClassName, icon: Icon, children: triggerChildren, ...triggerProps } = trigger ?? {}
//   const {
//     // /className: optionsClassName,
//     options,
//     ...contentProps
//   } = content ?? {}
//   const groupedOption = groupArrays(options?.group ?? [options?.optionsData?.length || 1], options?.optionsData ?? [])
//   const {} = wrapper ?? {}
//
//   return (
//     <ContextMenu>
//       <ContextMenuTrigger asChild>
//         {triggerChildren ? (
//           triggerChildren
//         ) : (
//           <Button variant="outline" size="sm" className={cn(triggerClassName)} icon={Icon} {...triggerProps} />
//         )}
//       </ContextMenuTrigger>
//       {options?.optionsData?.length ? (
//         <ContextMenuContent
//           className={cn(
//             'w-[200px]',
//             // optionsClassName
//           )}
//           {...contentProps}>
//           {groupedOption.map((group, idx) => {
//             return (
//               <React.Fragment key={`group - ${ idx }`}>
//                 {group.map((item, idx) => {
//                   const { children, className, value, nestedData, ...props } = item
//                   const {
//                     className: commandClassName,
//                     label: commandLabel,
//                     action: commandAction,
//                     ...commandProps
//                   } = item.command ?? {}
//                   const groupedNestedOption =
//                     groupArrays(
//                       nestedData?.group ?? [nestedData?.optionsData?.length || 1],
//                       nestedData?.optionsData ?? [],
//                     ) ?? []
//                   const {
//                     className: nestedClassName,
//                     group: nestedGroup,
//                     optionsData: nestedOptions,
//                     ...nestedProps
//                   } = nestedData ?? {}
//
//                   const Component =
//                     options?.itemType === 'checkbox'
//                       ? ContextMenuCheckboxItem
//                       : options?.itemType === 'radio'
//                         ? ContextMenuRadioItem
//                         : ContextMenuItem
//
//                   return (
//                     <React.Fragment key={`item - ${ idx }`}>
//                       {nestedData?.optionsData?.length ? (
//                         <ContextMenuSub key={`sub - item - ${ idx }`}>
//                           <ContextMenuSubTrigger className={cn('flex item-center gap-2')}>
//                             {children}
//                           </ContextMenuSubTrigger>
//                           <ContextMenuPortal>
//                             <ContextMenuSubContent className={cn('w-[200px]', nestedClassName)} {...nestedProps}>
//                               {groupedNestedOption?.map((nestedItem, idx) => {
//                                 return (
//                                   <React.Fragment key={`nested - ${ idx }`}>
//                                     {nestedItem.map((nestedItemInner, idx) => {
//                                       const {
//                                         children: nestedChildren,
//                                         value,
//                                         className: nestedClassName,
//                                         ...nestedProps
//                                       } = nestedItemInner
//                                       // const {
//                                       //   children: NestedIcon,
//                                       //   className: nestedIconClassName,
//                                       //   ...nestedIconProps
//                                       // } = nestedItemInner.icon ?? {}
//                                       const {
//                                         className: nestedCommandClassName,
//                                         label: enstedCommandLabel,
//                                         action: nestedCommandAction,
//                                         ...nestedCommandProps
//                                       } = nestedItemInner.command ?? {}
//
//                                       const NestedComponent =
//                                         nestedData.itemType === 'checkbox'
//                                           ? ContextMenuCheckboxItem
//                                           : nestedData.itemType === 'radio'
//                                             ? ContextMenuRadioItem
//                                             : ContextMenuItem
//
//                                       return (
//                                         <NestedComponent
//                                           value={value as string}
//                                           key={`nested - item - ${ idx }`}
//                                           className={cn('flex gap-2 items-center', nestedClassName)}
//                                           {...nestedProps}>
//                                           {nestedItemInner.icon && nestedItemInner.icon}
//                                           {nestedChildren}
//                                           {nestedItemInner.command && (
//                                             <>
//                                               <ContextMenuShortcut
//                                                 children={enstedCommandLabel}
//                                                 {...nestedCommandProps}
//                                                 key={`nested - item - shortcut - ${ idx }`}
//                                               />
//                                               <Button command={nestedItemInner.command} className="sr-only hidden" />
//                                             </>
//                                           )}
//                                         </NestedComponent>
//                                       )
//                                     })}
//                                     {idx !== groupedNestedOption?.length - 1 && (
//                                       <ContextMenuSeparator key={`separator - ${ idx }`} />
//                                     )}
//                                   </React.Fragment>
//                                 )
//                               })}
//                             </ContextMenuSubContent>
//                           </ContextMenuPortal>
//                         </ContextMenuSub>
//                       ) : (
//                         <Component
//                           value={value as string}
//                           className={cn('flex gap-2 items-center', className)}
//                           {...props}>
//                           {item.icon && item.icon}
//                           {children}
//                           {item.command && (
//                             <>
//                               <ContextMenuShortcut children={commandLabel} {...commandProps} key={`command - ${ idx }`} />
//                               <Button command={item.command} className="sr-only hidden" />
//                             </>
//                           )}
//                         </Component>
//                       )}
//                     </React.Fragment>
//                   )
//                 })}
//                 {idx !== groupedOption.length - 1 && <ContextMenuSeparator />}
//               </React.Fragment>
//             )
//           })}
//         </ContextMenuContent>
//       ) : null}
//     </ContextMenu>
//   )
// }
//
// DuckContextMenu.displayName = 'ContextCustomGroup'

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
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
