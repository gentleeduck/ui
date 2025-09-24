// import React from 'react'
// import { HexColorPicker } from 'react-colorful'
// import { Separator } from '@gentleduck/registry-ui-duckui/separator'
// import { Dialog, DialogClose , DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@gentleduck/registry-ui-duckui/dialog'
// import { Button } from '@gentleduck/registry-ui-duckui/button'
// // import {
// //   bubbleMenuIconsData,
// //   emailToolbarEditor,
// //   emailToolbarEditorAlign,
// //   highlightButtons,
// //   useTextmenuCommands,
// //   useTextmenuContentTypes,
// //   useTextmenuStates,
// // } from './Notion/mdx-editor'
// import {
//   AlignCenter,
//   CircleOff,
//   Heading,
//   Highlighter,
//   Link2,
//   LucideIcon,
//   Pencil,
// } from 'lucide-react'
// import { cn } from '@gentleduck/libs/cn'
// import { Editor } from '@tiptap/core'
// import { BubbleMenu } from '@tiptap/react'
//
// export type NotionEditorButtonPickerWrapperProps = {
//   trigger: React.ReactElement
//   onClick: (color: string) => void
//   title: string
//   description: string
// }
//
// const NotionEditorButtonPickerWrapper = ({
//   trigger,
//   onClick,
//   title,
//   description,
// }: NotionEditorButtonPickerWrapperProps) => {
//   const [color, setColor] = React.useState('#fff')
//
//   const handleChangeComplete = (color: string) => {
//     setColor(color)
//   }
//
//   return (
//     <Dialog>
//     <DialogTrigger
//       asChild>
//           <Button
//             variant="ghost"
//             className="editor_button"
//           >
//             {trigger}
//           </Button>
//           </DialogTrigger>
//       <DialogContent className="w-[300px]">
//             <DialogHeader>
//               <DialogTitle>{title}</DialogTitle>
//               <DialogDescription>
//                 Pick color down to {description} the text with. Click save when
//                 you're done.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="w-full [&>div]:w-full">
//               <HexColorPicker
//                 color={color}
//                 onChange={(color) => handleChangeComplete(color)}
//               />
//             </div>
//             <div className="flex items-center justify-end gap-2">
//               <DialogClose asChild>
//                 <Button variant="secondary">Cancel</Button>
//               </DialogClose>
//               <DialogClose asChild>
//                 <Button
//                   onClick={() => {
//                     onClick(color)
//                   }}
//                 >
//                   Apply
//                 </Button>
//               </DialogClose>
//             </div>
//             </DialogContent>
//             </Dialog>
//   )
// }
//
//
//
// export type NotionEditorAlignPickerProps = {
//   states: ReturnType<typeof useTextmenuStates>
//   commands: ReturnType<typeof useTextmenuCommands>
// }
//
// const MDXEditoerAlign = ({
//   commands,
//   states,
// }: NotionEditorAlignPickerProps) => {
//   return (
//     <>
//       <PopoverWrapper
//         trigger={{
//           children: (
//             <Button
//               label={{
//                 children: 'Align',
//                 showLabel: true,
//                 side: 'top',
//               }}
//               icon={{ children: AlignCenter }}
//               variant="ghost"
//               className="w-[1.85rem] h-[1.85rem]"
//             />
//           ),
//         }}
//         content={{
//           className: 'w-fit p-2',
//           children: (
//             <div className="flex items justify-start gap-1 shrink-0">
//               {emailToolbarEditorAlign.map((item, idx) => (
//                 <Button
//                   key={idx}
//                   variant="ghost"
//                   className={cn(
//                     'editor_button p-0',
//                     states[item.value] && 'active',
//                   )}
//                   label={{
//                     children: item.label,
//                     showLabel: true,
//                     side: 'top',
//                   }}
//                   onClick={
//                     commands[
//                       item.action
//                     ] as React.MouseEventHandler<HTMLButtonElement>
//                   }
//                   icon={{ children: item.icon! ?? {} }}
//                 ></Button>
//               ))}
//             </div>
//           ),
//         }}
//       />
//     </>
//   )
// }
//
// export interface ColorTriggerType {
//   label?: string
//   trigger?: LucideIcon
// }
//
// export type MDXToolBarColorWrapperProps = {
//   trigger: ColorTriggerType
//   currentColor: string
//   commands: {
//     onClearColor: () => void
//     onChangeColor: (color: string) => boolean
//   }
// }
//
// const MDXColorWrapper = ({
//   trigger,
//   currentColor,
//   commands,
// }: MDXToolBarColorWrapperProps) => {
//   return (
//     <>
//       <PopoverWrapper
//         trigger={{
//           children: (
//             <Button
//               label={{
//                 children: trigger.label ?? '',
//                 showLabel: true,
//                 side: 'top',
//               }}
//               icon={{ children: trigger.trigger! ?? {} }}
//               className="w-[1.85rem] h-[1.85rem]"
//               variant="ghost"
//             />
//           ),
//         }}
//         content={{
//           className: 'w-fit p-2',
//           children: (
//             <div className="flex items-center justify-start gap-2">
//               <NotionEditorButtonPickerWrapper
//                 description="Highlight"
//                 title="Highlight"
//                 onClick={commands.onChangeColor}
//                 trigger={
//                   <ColorWeelIcon className="opacity-60 !w-[1.18rem] !h-[1.18rem] " />
//                 }
//               />
//
//               {highlightButtons.map((item, idx) => (
//                 <Button
//                   key={idx}
//                   variant="ghost"
//                   className={cn(
//                     'editor_button',
//                     item.color === currentColor && 'active',
//                   )}
//                   label={{
//                     children: item.label,
//                     showLabel: true,
//                     side: 'top',
//                   }}
//                   onClick={() => commands.onChangeColor(item.color)}
//                 >
//                   <span
//                     className={cn(
//                       'border border-solid w-[1.18rem] h-[1.18rem] rounded-full',
//                       item.style,
//                     )}
//                   />
//                 </Button>
//               ))}
//               <Separator orientation="vertical" className="h-[26px]" />
//               <Button
//                 variant="ghost"
//                 className={cn('editor_button')}
//                 label={{
//                   children: 'clear',
//                   showLabel: true,
//                   side: 'top',
//                 }}
//                 onClick={() => commands.onClearColor()}
//               >
//                 <CircleOff className="opacity-60" />
//               </Button>
//             </div>
//           ),
//         }}
//       />
//     </>
//   )
// }
//
// export type NotionEditorHeadingPickerWrapperProps = {
//   commands: ReturnType<typeof useTextmenuCommands>
//   activeItem: string
//   trigger: React.ReactElement
// }
//
// const MDXHeading = ({
//   commands,
//   activeItem,
// }: NotionEditorHeadingPickerWrapperProps) => {
//   return (
//     <>
//       <PopoverWrapper
//         trigger={{
//           children: (
//             <Button
//               label={{
//                 children: 'Heading',
//                 showLabel: true,
//                 side: 'top',
//               }}
//               icon={{ children: Heading }}
//               className="w-[1.85rem] h-[1.85rem]"
//               variant="ghost"
//             />
//           ),
//         }}
//         content={{
//           className: 'w-[140px] p-2 gap-1 flex flex-col ',
//           children: (
//             <>
//               <span className="text-sm font-medium text-foreground">
//                 Turn into
//               </span>
//               <Separator className="mb-1" />
//               {emailToolbarEditor.map((item, idx) => (
//                 <Button
//                   key={idx}
//                   variant="ghost"
//                   className={cn(
//                     'h-[1.85rem] !w-full !px-2 rounded-md',
//                     item.label === activeItem && 'active',
//                   )}
//                   onClick={
//                     commands[
//                       item.action
//                     ] as React.MouseEventHandler<HTMLElement>
//                   }
//                   icon={{
//                     children: item.icon! ?? {},
//                   }}
//                 >
//                   <span>{item.label}</span>
//                 </Button>
//               ))}
//             </>
//           ),
//         }}
//       />
//     </>
//   )
// }
//
// export interface NotionEditorLinkManagerProps {
//   states: ReturnType<typeof useTextmenuStates>
//   commands: ReturnType<typeof useTextmenuCommands>
//   editor: Editor
// }
//
// const MDXEditorLink: React.FC<NotionEditorLinkManagerProps> = ({
//   states,
//   commands,
//   editor,
// }: NotionEditorLinkManagerProps) => {
//   const [url, setUrl] = React.useState('')
//
//   const openDialog = () => {
//     const previousUrl = editor.getAttributes('link').href
//     setUrl(previousUrl || '')
//   }
//
//   return (
//     <DialogWrapper
//       trigger={{
//         children: (
//           <Button
//             variant={'ghost'}
//             size={'icon'}
//             label={{ children: 'Link', showLabel: true, side: 'top' }}
//             icon={{ children: Link2 }}
//             className={cn(
//               'w-[1.85rem] h-[1.85rem]',
//               states.isLink && 'bg-foreground/10',
//             )}
//             onClick={openDialog}
//           />
//         ),
//       }}
//       content={{
//         className: 'flex flex-col center w-[400px]',
//         children: (
//           <>
//             <DialogHeader>
//               <DialogTitle>Set Link</DialogTitle>
//             </DialogHeader>
//             <DialogDescription>
//               {' '}
//               Set the link here. Click save when you're done.
//             </DialogDescription>
//             <div>
//               <Input
//                 type="text"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 placeholder="Enter URL"
//               />
//             </div>
//             <div className="flex items-center justify-end gap-2">
//               <DialogClose asChild>
//                 <Button variant="secondary">Cancel</Button>
//               </DialogClose>
//               <DialogClose asChild>
//                 <Button
//                   onClick={() => {
//                     url.length > 0
//                       ? commands.onLink(url, true)
//                       : editor.commands.unsetLink()
//                   }}
//                 >
//                   Apply
//                 </Button>
//               </DialogClose>
//             </div>
//           </>
//         ),
//       }}
//     />
//   )
// }
//
// export type ToolBarToggleButtonsProps = {
//   commands: ReturnType<typeof useTextmenuCommands>
//   states: ReturnType<typeof useTextmenuStates>
// }
//
// const MDXToggleButtons = ({ commands, states }: ToolBarToggleButtonsProps) => {
//   return (
//     <>
//       <div className="flex items-center justify-start gap-1 shrink-0">
//         {bubbleMenuIconsData.map((item, idx) => {
//           return (
//             <Button
//               key={idx}
//               size={'icon'}
//               variant={'ghost'}
//               label={{
//                 children: item.label,
//                 showLabel: true,
//                 side: 'top',
//               }}
//               icon={{ children: item.icon }}
//               className={cn(
//                 'w-[1.85rem] h-[1.85rem]',
//                 states[item.value] && 'bg-foreground/10',
//               )}
//               onClick={
//                 commands[
//                   item.action
//                 ] as React.MouseEventHandler<HTMLButtonElement>
//               }
//             />
//           )
//         })}
//       </div>
//     </>
//   )
// }
//
// const ColorWeelIcon = ({ className }: { className: string }) => (
//   <svg
//     viewBox="0 0 202 202"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     xmlnsXlink="http://www.w3.org/1999/xlink"
//     className={cn('!stroke-none', className)}
//   >
//     <rect width="202" height="202" fill="url(#pattern0_301_437)" />
//     <defs>
//       <pattern
//         id="pattern0_301_437"
//         patternContentUnits="objectBoundingBox"
//         width="1"
//         height="1"
//       >
//         <use xlinkHref="#image0_301_437" transform="scale(0.0049505)" />
//       </pattern>
//       <image
//         id="image0_301_437"
//         width="220"
//         height="220"
//         xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAYAAAAbWs+BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBOTBDMDhDMkU1OTZFMjExODJFQThDRjJCNDQ1RjkzNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4RDRGMzhFMzk4QkIxMUUyQTVENTgzNjYwNTU5MTYxRSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4RDRGMzhFMjk4QkIxMUUyQTVENTgzNjYwNTU5MTYxRSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MTQ3NzYyNUI3OThFMjExQUMyQUU0RTY5NzFFNDRFMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBOTBDMDhDMkU1OTZFMjExODJFQThDRjJCNDQ1RjkzNiIvPiA8L3JkZjpEZXNjcmlwdGlv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"
//       />
//     </defs>
//   </svg>
// )
//
// //NOTE: We memorize the button so each button is not rerendered
// // on every editor state change
// const MDXToggleButtonsMemo = React.memo(MDXToggleButtons)
// const MDXHeadingMemo = React.memo(MDXHeading)
// const MDXColorHighlightMemo = React.memo(MDXColorWrapper)
// const MDXColorColorMemo = React.memo(MDXColorWrapper)
// const MDXLinkMemo = React.memo(MDXEditorLink)
// const MDXrAligaMemo = React.memo(MDXEditoerAlign)
//
// export interface MDXTextEditorToolbarProps {
//   editor: Editor
// }
//
// const MDXTextEditorToolbar = ({ editor }: MDXTextEditorToolbarProps) => {
//   const commands = useTextmenuCommands(editor)
//   const states = useTextmenuStates(editor)
//   const blockOptions = useTextmenuContentTypes(editor)
//
//   const activeItem = React.useMemo(
//     () =>
//       blockOptions.find(
//         (option) => option.type === 'option' && (option.isActive!() ?? false),
//       ),
//     [blockOptions],
//   )
//
//   //{
//   //  <MemoContentTypePicker options={blockOptions} />
//   //  <MemoFontFamilyPicker
//   //    onChange={commands.onSetFont}
//   //    value={states.currentFont || ''}
//   //  />
//   //  <MemoFontSizePicker
//   //    onChange={commands.onSetFontSize}
//   //    value={states.currentSize || ''}
//   //  />
//   //}
//   return (
//     <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
//       <div className="flex items-center gap-[.325rem] p-1.5 border border-border border-solid ronded-[.5rem] bg-background rounded-lg fixed">
//         <MDXrAligaMemo commands={commands} states={states} />
//         <MDXHeadingMemo
//           trigger={<Heading />}
//           activeItem={activeItem?.label || ''}
//           commands={commands}
//         />
//         <Separator orientation="vertical" className="h-[26px]" />
//         <MDXToggleButtonsMemo commands={commands} states={states} />
//         <Separator orientation="vertical" className="h-[26px]" />
//         <MDXLinkMemo editor={editor} commands={commands} states={states} />
//         <MDXColorHighlightMemo
//           trigger={{
//             trigger: Highlighter,
//             label: 'Highlight',
//           }}
//           currentColor={states.currentHighlight}
//           commands={{
//             onChangeColor: commands.onChangeHighlight,
//             onClearColor: commands.onClearHighlight,
//           }}
//         />
//         <MDXColorColorMemo
//           trigger={{
//             trigger: Pencil,
//             label: 'Color',
//           }}
//           currentColor={states.currentColor}
//           commands={{
//             onChangeColor: commands.onChangeColor,
//             onClearColor: commands.onClearColor,
//           }}
//         />
//       </div>
//     </BubbleMenu>
//   )
// }
//
// export { MDXTextEditorToolbar }
