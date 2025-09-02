// 'use client'
// import * as React from 'react'
// import { cn } from '@gentleduck/duck-libs/cn'
// import {  groupArrays } from '@gentleduck/duck-libs/group-array'
// import { Button, ButtonProps } from '@gentleduck/registry-ui-duckui/button'
// import { Separator } from './ShadcnUI/separator'
//
// type NavGroupProps<T extends boolean> = {
//   navigationKeys: ButtonProps[]
//   nav: NavType<T>
//   position?: 'side' | 'top'
// }
//
// type NavType<T extends boolean> = NavCollabsableType<T> & {
//   group: number[]
//   router: any //AppRouterInstance
//   pathname: string
//   className?: string
// }
//
// type NavCollabsableType<K> = K extends true
//   ? NavCollabsedType
//   : NavNotCollabsedType
//
// interface NavCollabsedType {
//   isCollabsed?: boolean
// }
//
// interface NavNotCollabsedType { }
//
// const NavGroup = <T extends boolean>({
//   navigationKeys,
//   nav,
//   position,
// }: NavGroupProps<T>) => {
//   const grouped = groupArrays<ButtonProps>(nav.group, navigationKeys)
//   const navIsCollabsed = (nav as NavCollabsedType).isCollabsed
//   const filteredKeys = filteredObject(
//     ['group', 'router', 'location', 'isCollabsed'],
//     nav,
//   )
//
//   const variants = {
//     default: position === 'side' ? 'grid items-center' : 'flex',
//   }
//
//   return (
//     <div className={cn('h-full', nav.className)} {...filteredKeys}>
//       {
//         <div className={variants.default}>
//           {grouped.map((keyGroup, idx) => (
//             <React.Fragment key={idx}>
//               <ul
//                 className={cn(
//                   variants.default,
//                   'px-2 py-1',
//                   navIsCollabsed ? 'w-fit' : 'w-full',
//                 )}
//               >
//                 {keyGroup.map((key, idx) => {
//                   const {
//                     className,
//                     is_collapsed: isCollapsed,
//                     onClick,
//                     variant,
//                     children,
//                     icon,
//                     ...props
//                   } = key
//                   return (
//                     <li key={idx} className="w-full">
//                       <Button
//                         key={idx}
//                         icon={key.icon}
//                         variant={
//                           nav.pathname === key.route
//                             ? 'secondary'
//                             : position === 'top'
//                               ? 'ghost'
//                               : variant || 'ghost'
//                         }
//                         is_collapsed={navIsCollabsed ? navIsCollabsed : false}
//                         className={cn(
//                           !navIsCollabsed && 'w-full justify-between',
//                           position === 'top' && 'rounded-full',
//                           key.className,
//                         )}
//                         {...props}
//                       >
//                         {children}
//                       </Button>
//                     </li>
//                   )
//                 })}
//               </ul>
//               {idx !== grouped.length - 1 && position === 'side' && (
//                 <Separator className="my-1" />
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       }
//     </div>
//   )
// }
//
// NavGroup.displayName = 'NavGroup'
//
// export {
//   NavGroup,
//   type NavGroupProps,
//   type NavType,
//   type NavCollabsableType,
//   type NavCollabsedType,
//   type NavNotCollabsedType,
// }
