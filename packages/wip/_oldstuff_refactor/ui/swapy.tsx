// 'use client'
//
// import React from 'react'
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
//   DroppableStateSnapshot,
//   DroppableProvided,
//   DraggableStateSnapshot,
//   DraggableProvided,
//   DraggableProvidedDragHandleProps,
// } from '@hello-pangea/dnd'
// import { cn } from '@/lib'
// import { Button } from '@/registry/registry-ui-components'
// import { Plus } from 'lucide-react'
//
// // Type for a Subtask
// interface Subtask {
//   id: string
//   title: string
// }
//
// // Type for Attachments
// export interface AttachmentType {
//   id: string
//   file: Blob | null
//   url: string | null
//   type: string
//   name: string
//   size: string
// }
//
// // Type for a Link (reference, URL, etc.)
// interface Link {
//   id: string
//   title: string
//   url?: string
// }
//
// // Type for a Comment
// export interface CommentType {
//   id: string
//   content: string
//   attachments: AttachmentType[]
//   createdAt: string
//   user: TaggedUserType
//   likes: LikedType
// }
//
// export interface LikedType {
//   amount: number
//   users: TaggedUserType[]
// }
//
// // Type for a Tagged User
// export interface TaggedUserType {
//   id: string
//   name?: string
//   verified?: boolean
//   badge?: any[]
//   avatarUrl?: string
// }
//
// // Type for Labels (tags or categories)
// interface Label {
//   id: string
//   content: string
//   className?: string // Tailwind CSS class or custom class
// }
//
// // Type for Task Options (could be buttons or dropdowns, etc.)
// interface TaskOption {
//   id?: string
//   type?: string // Specify the type of option if needed
//   label?: string
// }
//
// // Main Task Type
// interface Task {
//   id: string
//   title: string
//   description: string
//   subtasks: Subtask[]
//   attachments: AttachmentType[]
//   links: Link[]
//   comments: CommentType[]
//   taggedUsers: TaggedUserType[]
//   labels: Label[]
//   options: TaskOption[]
// }
//
// // Type for a Column containing task IDs
// interface Column {
//   id: string
//   title: string
//   taskIds: string[] // Array of task IDs in the column
// }
//
// // Type for Initial Data containing tasks and columns
// export interface InitDataType {
//   tasks: Record<string, Task> // Key is the task ID
//   columns: Record<string, Column> // Key is the column ID
//   columnOrder: string[] // Array of column IDs
// }
//
// interface OnDragEndType {
//   result: DropResult
//   state: InitDataType
//   setState: React.Dispatch<React.SetStateAction<InitDataType>>
// }
//
// const onDragEnd = ({ result, state, setState }: OnDragEndType) => {
//   const { source, destination } = result
//
//   // Dropped outside the list
//   if (!destination) return
//
//   const sourceColumn = state.columns[source.droppableId]
//   const destinationColumn = state.columns[destination.droppableId]
//
//   // Reordering within the same column
//   if (sourceColumn === destinationColumn) {
//     const newTaskIds = reorder(
//       sourceColumn.taskIds,
//       source.index,
//       destination.index,
//     )
//     const newColumn: Column = {
//       ...sourceColumn,
//       taskIds: newTaskIds,
//     }
//
//     setState({
//       ...state,
//       columns: {
//         ...state.columns,
//         [newColumn.id]: newColumn,
//       },
//     })
//   } else {
//     // Moving to a different column
//     const result = move(
//       sourceColumn.taskIds,
//       destinationColumn.taskIds,
//       source,
//       destination,
//     )
//
//     const newState: InitDataType = {
//       ...state,
//       columns: {
//         ...state.columns,
//         [sourceColumn.id]: {
//           ...sourceColumn,
//           taskIds: result[source.droppableId],
//         },
//         [destinationColumn.id]: {
//           ...destinationColumn,
//           taskIds: result[destination.droppableId],
//         },
//       },
//     }
//
//     setState(newState)
//   }
// }
//
// // Initial data structure with tasks and columns
// // Function to reorder the list on drag end
// export const reorder = <T,>(
//   list: T[],
//   startIndex: number,
//   endIndex: number,
// ): T[] => {
//   const result = Array.from(list)
//   const [removed] = result.splice(startIndex, 1)
//   result.splice(endIndex, 0, removed)
//   return result
// }
//
// // Function to move tasks between columns
// export const move = (
//   source: string[],
//   destination: string[],
//   droppableSource: { index: number; droppableId: string },
//   droppableDestination: { index: number; droppableId: string },
// ) => {
//   const sourceClone = Array.from(source)
//   const destClone = Array.from(destination)
//   const [removed] = sourceClone.splice(droppableSource.index, 1)
//   destClone.splice(droppableDestination.index, 0, removed)
//
//   return {
//     [droppableSource.droppableId]: sourceClone,
//     [droppableDestination.droppableId]: destClone,
//   }
// }
//
// export const KanbanAddTaskRow = React.memo(() => {
//   return (
//     <div className="flex items-center gap-2 mb-1rem px-4">
//       <Button size={'default'} variant={'secondary'} className={cn('w-full')}>
//         <Plus className={cn('size-5')} />
//       </Button>
//     </div>
//   )
// })
//
// export const KanbanColumnBodyDraggable = React.memo(
//   ({
//     column,
//     tasks,
//     kanbanColumnRow,
//   }: {
//     column: Column
//     tasks: Task[]
//     kanbanColumnRow: KanbanColumnBodyProps
//   }) => {
//     return (
//       <>
//         <Droppable key={column.id} droppableId={column.id}>
//           {(provided, snapshot) => (
//             <KanbanColumnBody
//               kanbanColumnRow={kanbanColumnRow}
//               provided={provided}
//               snapshot={snapshot}
//               column={column}
//               tasks={tasks}
//             />
//           )}
//         </Droppable>
//       </>
//     )
//   },
// )
//
// export const KanbanColumnBody = React.memo(
//   ({
//     provided,
//     snapshot,
//     column,
//     tasks,
//     kanbanColumnRow,
//   }: {
//     provided: DroppableProvided
//     snapshot: DroppableStateSnapshot
//     column: Column
//     tasks: Task[]
//     kanbanColumnRow: KanbanColumnBodyProps
//   }) => {
//     return (
//       <div
//         ref={provided.innerRef}
//         className={cn(
//           'pt-2 border-[2px] border-dashed border-transparent rounded-md transition-all w-full',
//           snapshot.isDraggingOver && 'bg-green-100/30 border-green-400/30',
//           column.taskIds.includes(snapshot.draggingFromThisWith ?? '') &&
//           'bg-red-100/30 border-red-400/30',
//           snapshot.draggingFromThisWith === snapshot.draggingOverWith &&
//           snapshot.draggingOverWith &&
//           'bg-sky-100/30 border-sky-400/30',
//         )}
//         style={{
//           height: 500,
//         }}
//       // {...provided.droppableProps}
//       >
//         {tasks.map((task, index) => (
//           <SwapyColumnRowDraggable
//             key={task.id}
//             task={task}
//             idx={index}
//             kanbanColumnRow={kanbanColumnRow}
//             columnProvided={provided}
//             columnSnapshot={snapshot}
//             {...provided.droppableProps}
//           />
//         ))}
//         {provided.placeholder}
//       </div>
//     )
//   },
// )
//
// export const SwapyColumnRowDraggable = React.memo(
//   ({
//     task,
//     idx,
//     columnProvided,
//     columnSnapshot,
//     kanbanColumnRow,
//   }: {
//     task: Task
//     idx: number
//     columnProvided: DroppableProvided
//     columnSnapshot: DroppableStateSnapshot
//     kanbanColumnRow: KanbanColumnBodyProps
//   }) => {
//     return (
//       <Draggable draggableId={task.id} index={idx}>
//         {(provided, snapshot) => (
//           <KanbanColumnRow
//             provided={provided}
//             snapshot={snapshot}
//             task={task}
//             kanbanColumnRow={kanbanColumnRow}
//             columnProvided={columnProvided}
//             columnSnapshot={columnSnapshot}
//           />
//         )}
//       </Draggable>
//     )
//   },
// )
//
// //NOTE: KanbanColumnAddRow
//
// export interface KanbanColumnAddRowBodyArgs {
//   column: Column
// }
//
// export interface KanbanAddColumnRowBodyProps
//   extends Omit<React.HTMLProps<HTMLDivElement>, 'children'> {
//   children: React.FC<KanbanColumnAddRowBodyArgs>
// }
//
// export interface KanbanAddColumnRow {
//   column: Column
//   kanbanColumnAddRow: KanbanAddColumnRowBodyProps
// }
//
// export const KanbanColumnAddRow: React.FC<KanbanAddColumnRow> = React.memo(
//   ({ column, kanbanColumnAddRow }) => {
//     const {
//       className,
//       children: KanbanColumnAddRowBody,
//       ...props
//     } = kanbanColumnAddRow ?? {}
//     return (
//       <div className={cn('', className)} {...props}>
//         <KanbanColumnAddRowBody column={column} />
//       </div>
//     )
//   },
// )
//
// //NOTE:  KanbanColumnHeader
// export type KanbanColumnRowBodyContentArgs = {
//   column: Column
// }
//
// export interface KanbanColumnHeaderBodyProps
//   extends Partial<
//     Omit<React.HTMLProps<HTMLDivElement>, 'children'> &
//     Pick<KanbanColumnHeaderProps, 'dragHandlerProps'>
//   > {
//   children: React.FC<KanbanColumnRowBodyContentArgs>
// }
//
// export interface KanbanColumnHeaderProps
//   extends Omit<React.HTMLProps<HTMLDivElement>, 'children'> {
//   column: Column
//   dragHandlerProps?: DraggableProvidedDragHandleProps | null
//   kanbanColumnHeader: KanbanColumnHeaderBodyProps
// }
//
// export const KanbanColumnHeader: React.FC<KanbanColumnHeaderProps> = React.memo(
//   ({ column, dragHandlerProps, kanbanColumnHeader }) => {
//     const {
//       children: KanbanColumnRowBody,
//       className,
//       ...restProps
//     } = kanbanColumnHeader ?? {}
//
//     return (
//       <div
//         className={cn(
//           'flex items-center justify-between gap-2 mb-2 px-4',
//           className,
//         )}
//         {...dragHandlerProps}
//         {...restProps}
//       >
//         {<KanbanColumnRowBody column={column} />}
//       </div>
//     )
//   },
// )
//
// //NOTE: KanbanColumnRow
// export interface KanbanColumnRowComponentArgs
//   extends Pick<KanbanColumnRowProps, 'task'> { }
// export interface KanbanColumnBodyProps
//   extends Omit<React.HTMLProps<HTMLDivElement>, 'children'> {
//   options: {
//     draggingOutStyle?: string
//     draggingOnOriginStyle?: string
//     draggingOverNoColumnStyle?: string
//   }
//   children: React.FC<KanbanColumnRowComponentArgs>
// }
//
// export interface KanbanColumnRowProps {
//   provided: DraggableProvided
//   snapshot: DraggableStateSnapshot
//   task: Task
//   columnProvided: DroppableProvided
//   columnSnapshot: DroppableStateSnapshot
//   kanbanColumnRow: KanbanColumnBodyProps
// }
//
// export const KanbanColumnRow = React.memo(
//   ({
//     provided,
//     snapshot,
//     task,
//     columnProvided,
//     columnSnapshot,
//     kanbanColumnRow,
//   }: KanbanColumnRowProps) => {
//     const draggingOut = task.id === columnSnapshot.draggingFromThisWith
//     const draggingToOrigin = (task.id === columnSnapshot.draggingOverWith &&
//       columnSnapshot.draggingOverWith) as boolean
//     const draggingOverNoColumn = snapshot.isDragging && !snapshot.draggingOver
//
//     const {
//       children: KanbanColumnRowBody,
//       className,
//       options,
//     } = kanbanColumnRow ?? {}
//     const {
//       draggingOutStyle,
//       draggingOnOriginStyle,
//       draggingOverNoColumnStyle,
//     } = options ?? {}
//
//     const kanbanStyle = cn(
//       //FIX:
//       'select-none p-4 b-secondary border border-border  border-solid  rounded-md flex items-center gap-3 mb-2 mx-2 z-10 relative',
//       draggingOut &&
//       (draggingOutStyle
//         ? cn('border-red-400/30 border-dashed border-2', draggingOutStyle)
//         : 'border-red-400/30 border-dashed border-2'),
//       draggingToOrigin &&
//       (draggingOnOriginStyle
//         ? cn(
//           'border-sky-400/30 border-dashed border-2',
//           draggingOnOriginStyle,
//         )
//         : 'border-sky-400/30 border-dashed border-2'),
//       //NOTE: you will have to add some outline animation here for deleting for
//       //example
//       draggingOverNoColumn &&
//       (draggingOverNoColumnStyle
//         ? cn(
//           'border-purple-400/30 border-dashed border-2',
//           draggingOverNoColumnStyle,
//         )
//         : 'border-purple-400/30 border-dashed border-2'),
//     )
//
//     return (
//       <div className="relative">
//         <div
//           className={cn(
//             'overflow-hidden  bg-background',
//             kanbanStyle,
//             className,
//           )}
//           style={{ ...provided.draggableProps.style }}
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//         >
//           <KanbanColumnRowBody task={task} />
//         </div>
//       </div>
//     )
//   },
// )
//
// // NOTE: Kanban
// interface KanbanType {
//   initData: InitDataType
//   kanbanColumnRow: KanbanColumnBodyProps
//   kanbanColumnHeader: KanbanColumnHeaderBodyProps
//   kanbanColumnAddRow: KanbanAddColumnRowBodyProps
// }
//
// export const Kanban = React.forwardRef(
//   (
//     {
//       initData,
//       kanbanColumnRow,
//       kanbanColumnHeader,
//       kanbanColumnAddRow,
//     }: KanbanType,
//     ref: React.ForwardedRef<HTMLDivElement>,
//   ) => {
//     const [state, setState] = React.useState<InitDataType>(initData)
//     const onDragEndd = React.useCallback(
//       (result: DropResult) => onDragEnd({ state, setState, result }),
//       [state],
//     )
//
//     return (
//       <div ref={ref} className="w-full h-full">
//         <DragDropContext onDragEnd={onDragEndd}>
//           <Droppable
//             droppableId="board"
//             type="COLUMN"
//             direction="horizontal"
//             ignoreContainerClipping={true}
//           // isCombineEnabled={isCombineEnabled}
//           >
//             {(provided, snapshot) => (
//               <div
//                 className={cn(
//                   //FIX:
//                   'flex space-around bg-[161617] p-4 rounded-lg border border-border border-solid gap-4 mr-4',
//                 )}
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//               >
//                 {state.columnOrder.map((columnId, idx) => {
//                   const column = state.columns[columnId]
//                   const tasks = column.taskIds.map(
//                     (taskId) => state.tasks[taskId],
//                   )
//
//                   return (
//                     <Draggable
//                       key={column.id}
//                       draggableId={column.id}
//                       index={idx}
//                     >
//                       {(provided, snapshot) => (
//                         <div
//                           className="flex flex-col gap-2 bg-:w rounded-md py-2  w-[350px]"
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                         >
//                           <KanbanColumnHeader
//                             column={column}
//                             kanbanColumnHeader={kanbanColumnHeader}
//                             dragHandlerProps={provided.dragHandleProps}
//                           />
//                           <KanbanColumnAddRow
//                             kanbanColumnAddRow={kanbanColumnAddRow}
//                             column={column}
//                           />
//                           <KanbanColumnBodyDraggable
//                             kanbanColumnRow={kanbanColumnRow}
//                             column={column}
//                             tasks={tasks}
//                           />
//                         </div>
//                       )}
//                     </Draggable>
//                   )
//                 })}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </div>
//     )
//   },
// )
// // https://chatgpt.com/
// share/66e80c4a-ebfc-8009-aa04-d56fd753c19f
