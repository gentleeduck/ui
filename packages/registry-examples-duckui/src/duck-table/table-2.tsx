// import {
//   ArrowDownIcon,
//   ArrowRightIcon,
//   ArrowUpIcon,
//   Circle,
//   CircleCheck,
//   CircleHelp,
//   CircleX,
//   Clock12,
//   Ellipsis,
// } from 'lucide-react'
// import React from 'react'
// import { cn } from '@/lib'
// import { groupArrays } from '@/lib/utils'
// import {
//   optionsData,
//   type PriorityType,
//   type StatusType,
//   type TableDataType,
//   tableHeaderDropDown,
// } from '@/registry/default/example/TableAdvancedDemo'
// import {
//   Checkbox,
//   type ComboboxType,
//   ContextContent,
//   ContextMenuLabel,
//   type ContextMenuOptionsType,
//   DropdownMenuOptionsDataType,
//   DropdownMenuView,
// } from '@/registry/default/ui'
// import {
//   DuckTable,
//   DuckTableBar,
//   DuckTableBarLeftSide,
//   DuckTableBarRightSide,
//   DuckTableBody,
//   DuckTableBodyRow,
//   DuckTableDownBar,
//   DuckTableFilter,
//   DuckTableFooter,
//   DuckTableHeader,
//   DuckTablePagination,
//   DuckTableProvider,
//   DuckTableSearch,
//   type FooterColumnType,
//   TableBarViewButton,
//   TableBody,
//   TableCell,
//   type TableContentDataType,
//   TableHeaderOptionsType,
//   type TableHeaderType,
// } from '@/registry/registry-ui-components/table'
//
// export default function Table1Demo() {
//   return (
//     <>
//       <DuckTableProvider>
//         <DuckTableBar>
//           <DuckTableBarRightSide>
//             <DuckTableSearch
//               input={{
//                 trigger: {
//                   placeholder: 'Search...',
//                 },
//               }}
//             />
//             <DuckTableFilter filter={combinedFiltersData} />
//           </DuckTableBarRightSide>
//           <DuckTableBarLeftSide>
//             <TableBarViewButton header={columns} />
//           </DuckTableBarLeftSide>
//         </DuckTableBar>
//         <DuckTable>
//           <DuckTableHeader headers={columns} selectable={true} />
//
//           <DuckTableBody<(typeof tableData)[number]> data={tableData}>
//             {(data) =>
//               data.map((row, idx) => {
//                 return (
//                   <DuckTableRowWrapper
//                     key={idx}
//                     options={{
//                       group: [3, 1],
//                       optionsData: optionsData,
//                     }}
//                     row={row}
//                   />
//                 )
//               })
//             }
//           </DuckTableBody>
//           <DuckTableFooter columns={footerColumns} />
//         </DuckTable>
//         <DuckTableDownBar>
//           <DuckTablePagination />
//         </DuckTableDownBar>
//       </DuckTableProvider>
//     </>
//   )
// }
//
// export const DuckTableRowWrapper = ({
//   row,
//   options,
// }: {
//   row: TableContentDataType<TableDataType>
//   options: ContextMenuOptionsType<Record<string, unknown>> | undefined
// }) => {
//   return (
//     <DuckTableBodyRow
//       content={{
//         options,
//       }}
//       row={{
//         children: (
//           <>
//             {Object.values(row).map((item, idx) => {
//               const { children, icon, ...props } = item ?? {}
//               const { children: Icon, ...iconProps } = icon ?? {}
//
//               return (
//                 <React.Fragment>
//                   {/*NOTE: Rendering Checkbox */}
//                   {idx === 0 && (
//                     <TableCell key={idx} {...props}>
//                       <Checkbox className="border-border" />
//                     </TableCell>
//                   )}
//                   <TableCell key={idx} {...props}>
//                     <div className="flex items-center justify-between gap-4">
//                       {/*NOTE: Rendering Label */}
//
//                       {/*NOTE: Rendering the row column childrend */}
//                       <div className="grid [&_*]:overflow-hidden [&_*]:text-ellipsis [&_*]:whitespace-nowrap">
//                         <span className={cn(Icon && 'flex items-center gap-2 [&_svg]:flex-shrink-0')}>
//                           {Icon && <Icon {...iconProps} />}
//                           {Icon ? <span> {children}</span> : children}
//                         </span>
//                       </div>
//                       {/*NOTE: Dropdown Menu */}
//                       {idx === Object.values(row).length - 1 && optionsData?.length && (
//                         <DropdownMenuView
//                           content={{
//                             align: 'end',
//                             options,
//                           }}
//                           trigger={{
//                             children: <span className="sr-only">Open menu</span>,
//                             className: 'flex h-8 w-8 p-0 data-[state=open]:bg-muted',
//                             icon: {
//                               children: Ellipsis,
//                               className: 'h-4 w-4',
//                             },
//                             size: 'icon',
//                             variant: 'ghost',
//                           }}
//                         />
//                       )}
//                     </div>
//                   </TableCell>
//                 </React.Fragment>
//               )
//             })}
//           </>
//         ),
//       }}></DuckTableBodyRow>
//   )
// }
//
// const footerColumns: FooterColumnType[] = [
//   {
//     children: 'Total',
//     colSpan: 3,
//   },
//   {
//     children: '50000$',
//     className: 'w-full text-end',
//     colSpan: 3,
//   },
// ]
//
// const iconStyle = 'size-4 stroke-[1.5] text-muted-foreground'
// // Assuming you have separate filter arrays for StatusType and PriorityType
// const filtersDataForStatusType: ComboboxType<keyof TableDataType, StatusType>[] = [
//   {
//     content: {
//       data: [
//         {
//           element: {
//             icon: {
//               children: CircleHelp,
//               className: iconStyle,
//             },
//           },
//           label: 'Backlog',
//         },
//         {
//           element: {
//             icon: {
//               children: Circle,
//               className: iconStyle,
//             },
//           },
//           label: 'Todo',
//         },
//         {
//           element: {
//             icon: {
//               children: Clock12,
//               className: iconStyle,
//             },
//           },
//           label: 'In Progress',
//         },
//         {
//           element: {
//             icon: {
//               children: CircleCheck,
//               className: iconStyle,
//             },
//           },
//           label: 'Done',
//         },
//         {
//           element: {
//             icon: {
//               children: CircleX,
//               className: iconStyle,
//             },
//           },
//           label: 'Canceled',
//         },
//       ],
//       showSearchInput: true,
//     },
//     trigger: {
//       children: 'status',
//       command: {
//         key: 'ctrl+shift+s',
//         label: '⌃+⇧+S',
//       },
//       label: {
//         children: 'Filter Status',
//         showCommand: true,
//         showLabel: true,
//         side: 'top',
//       },
//     },
//     type: 'listbox',
//   },
// ]
//
// const filtersDataForPriorityType: ComboboxType<keyof TableDataType, PriorityType>[] = [
//   {
//     content: {
//       data: [
//         {
//           element: {
//             icon: {
//               children: ArrowDownIcon,
//               className: 'size-4 stroke-[1.5]',
//             },
//           },
//           label: 'Low',
//         },
//         {
//           element: {
//             icon: {
//               children: ArrowRightIcon,
//               className: 'size-4 stroke-[1.5]',
//             },
//           },
//           label: 'Medium',
//         },
//         {
//           element: {
//             icon: {
//               children: ArrowUpIcon,
//               className: 'size-4 stroke-[1.5]',
//             },
//           },
//           label: 'High',
//         },
//       ],
//       showSearchInput: true,
//     },
//     trigger: {
//       children: 'priority',
//       command: {
//         key: 'ctrl+shift+m',
//         label: '⌃+⇧+M',
//       },
//       label: {
//         children: 'Filter Method',
//         showCommand: true,
//         showLabel: true,
//         side: 'top',
//       },
//     },
//     type: 'listbox',
//   },
// ]
//
// const combinedFiltersData = [
//   ...filtersDataForStatusType.map(
//     (filter) =>
//       ({
//         ...filter,
//         onSelect: filter.onSelect,
//         type: 'combobox',
//       }) as ComboboxType<StatusType | PriorityType, keyof TableDataType>,
//   ),
//   ...filtersDataForPriorityType.map(
//     (filter) =>
//       ({
//         ...filter,
//         onSelect: filter.onSelect,
//         type: 'combobox',
//       }) as ComboboxType<StatusType | PriorityType, keyof TableDataType>,
//   ),
// ]
//
// const columns: TableHeaderType<TableDataType>[] = [
//   {
//     className: 'w-[110px]',
//     label: 'task',
//     sortable: false,
//   },
//   {
//     className: 'w-[200px]',
//     label: 'title',
//     showLabel: false,
//     sortable: true,
//   },
//   {
//     className: 'w-[90px]',
//     label: 'label',
//     sortable: true,
//   },
//   {
//     className: 'w-[70px]',
//     label: 'status',
//     showLabel: true,
//     sortable: true,
//   },
//   {
//     label: 'priority',
//     sortable: true,
//   },
// ]
//
// export const tableData: TableContentDataType<TableDataType>[] = [
//   {
//     label: { children: 'Documentation' },
//     priority: {
//       children: 'Medium',
//       icon: <ArrowRightIcon className="size-4 stroke-[1.5]" />,
//     },
//     status: {
//       children: 'In Progress',
//       icon: <Clock12 className="size-4 stroke-[1.5]" />,
//     },
//     task: { children: 'TASK-8782' },
//     title: {
//       children: <p> You can't compress the program without quantifying the open-source SSD pixel! </p>,
//     },
//   },
//   {
//     label: { children: 'Documentation' },
//     priority: {
//       children: 'Medium',
//       icon: <ArrowRightIcon className="size-4 stroke-[1.5]" />,
//     },
//     status: {
//       children: 'Backlog',
//       icon: <CircleHelp className="size-4 stroke-[1.5]" />,
//     },
//     task: { children: 'TASK-7878' },
//     title: {
//       children: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
//     },
//   },
// ]
