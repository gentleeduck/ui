// import { Ellipsis, Pen, Trash2 } from 'lucide-react'
// import React from 'react'
// import { toast } from 'sonner'
// import { cn } from '@/lib/cn'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/registry/registry-ui-components/alert-dialog'
// import { Button, buttonVariants } from '@/registry/registry-ui-components/button'
// import {
//   type DropdownMenuOptionsDataType,
//   DropdownMenuProvider,
//   DropdownMenuView,
//   useDropdownMenuContext,
// } from '@/registry/registry-ui-components/dropdown-menu/dropdown-menu-wrapper'
// import { SheetWrapper } from '@/registry/registry-ui-components/sheet'
// import { TableCell, TableRow } from '@/registry/registry-ui-components/table'
// import {
//   DuckTable,
//   DuckTableBody,
//   DuckTableHeader,
//   DuckTableProvider,
//   DuckTableRowCheckbox,
//   DuckTableSearchInput,
//   DuckTableTopBar,
//   useDuckTable,
// } from '@/registry/registry-ui-components/table/table-advanced'
// import { columns } from './table-1'
// import { tableData } from './table-2'
//
// export default function TableDemo3() {
//   return (
//     <>
//       <DuckTableProvider table_columns={columns} table_rows={tableData}>
//         <DuckTableTopBar>
//           <DuckTableSearchInput />
//         </DuckTableTopBar>
//         <DuckTable>
//           <DuckTableHeader />
//           <DuckTableBody>
//             <Rows />
//           </DuckTableBody>
//         </DuckTable>
//       </DuckTableProvider>
//     </>
//   )
// }
// export function Rows() {
//   const { tableRows, tableColumns } = useDuckTable<typeof columns>()
//
//   return tableRows?.map((row, idx) => {
//     return (
//       <TableRow key={idx}>
//         {Object.values(row).map((item, idx) => {
//           const Component = () => (
//             <div className="flex items-center gap-2 [&>svg]:size-4 [&>svg]:stroke-[1.5] [&>svg]:text-muted-foreground">
//               {item.icon}
//               <span className="duck-truncate overflow-hidden text-ellipsis">{item?.children}</span>
//             </div>
//           )
//
//           return (
//             !Array.from(tableColumns.values())[idx]?.['aria-hidden'] && (
//               <TableCell key={idx}>
//                 {idx === 0 ? (
//                   <div className="flex items-center gap-4">
//                     <DuckTableRowCheckbox<typeof columns> tableRow={row} />
//                     <Component />
//                   </div>
//                 ) : (
//                   <div className="flex w-full items-center justify-between gap-4">
//                     <Component />
//                     {idx === Array.from(tableColumns.values()).length - 1 && (
//                       <DropdownMenuProvider>
//                         <RowOptions idx={idx} key={idx} />
//                       </DropdownMenuProvider>
//                     )}
//                   </div>
//                 )}
//               </TableCell>
//             )
//           )
//         })}
//       </TableRow>
//     )
//   })
// }
//
// export const RowOptions = ({ idx }: { idx: number }) => {
//   const { open, setOpen } = useDropdownMenuContext()
//   const [dropOpen, setDropOpen] = React.useState(false)
//
//   return (
//     <>
//       {/* NOTE: THE MAIN TEST*/}
//       <DropdownMenuView
//         content={{
//           className: 'min-w-[180px]',
//           label: { children: 'User Menu' },
//           options: {
//             group: [1, 1], // First 3 items in group 1, next 2 in group 2
//             itemType: 'label',
//             optionsData: menuItems(),
//           },
//         }}
//         modal={false}
//         onOpenChange={setDropOpen}
//         open={dropOpen}
//         trigger={{
//           className: 'px-1 py-0 h-auto [&>div>span]:sr-only',
//           command: {
//             action: () => {
//               setDropOpen(true)
//             },
//             key: 'Alt+p',
//             label: '⌘+k',
//           },
//           icon: <Ellipsis />,
//           size: 'sm',
//           variant: 'ghost',
//         }}
//       />
//
//       {/* NOTE: THE FIRST TEST*/}
//       <SheetWrapper
//         content={{
//           _footer: {
//             _cancel: { children: <Button variant="outline">Cancel</Button> },
//             _submit: {
//               children: (
//                 <Button onClick={() => toast.success('Goal updated!')} variant="default">
//                   Submit
//                 </Button>
//               ),
//             },
//             className: 'flex w-full justify-between items-end',
//           },
//           _header: {
//             _description: { children: <>Set your daily calorie goal</> },
//             _title: { children: <>Edit the table row</> },
//           },
//           children: <div className={cn('h-full')}>you're amazing wildduck</div>,
//         }}
//         onOpenChange={(value) => {
//           setOpen((_) => ({
//             ..._!,
//             value,
//           }))
//         }}
//         open={open?.id.includes(`sheet`) && open.value}
//         trigger={{ className: 'sr-only' }}
//       />
//
//       {/* NOTE: the second test*/}
//       <AlertDialog
//         onOpenChange={(value) => {
//           setOpen((_) => ({
//             ..._!,
//             value,
//           }))
//         }}
//         open={open?.id.includes(`dialog`) && open.value}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete your account and remove your data from our
//               servers.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel asChild>
//               <Button
//                 className={cn(
//                   buttonVariants({
//                     border: 'secondary',
//                     className: 'px-8',
//                     size: 'sm',
//                     variant: 'secondary',
//                   }),
//                 )}>
//                 Cancel
//               </Button>
//             </AlertDialogCancel>
//             <AlertDialogAction asChild>
//               <Button
//                 className={cn(
//                   buttonVariants({
//                     border: 'destructive',
//                     className: 'px-8',
//                     size: 'sm',
//                     variant: 'destructive',
//                   }),
//                 )}>
//                 Delete
//               </Button>
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   )
// }
//
// function menuItems() {
//   return [
//     {
//       actionType: 'sheet',
//       children: 'Settings',
//       command: {
//         key: 'Alt+o',
//         label: '⌘+o+k',
//       },
//       icon: <Pen />,
//     },
//     {
//       actionType: 'dialog',
//       children: 'Delete',
//       className: 'bg-destructive/40 dark:text-white/70 text-destructive hover:!bg-destructive hover:!text-white',
//       command: {
//         key: 'Alt+n',
//         label: '⌘+o+d',
//       },
//       icon: <Trash2 />,
//     },
//   ] as DropdownMenuOptionsDataType[]
// }
