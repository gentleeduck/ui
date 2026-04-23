// // @ts-noCheck
// import React from 'react'
// import { mergeAttributes, Node } from '@tiptap/core'
// import { DOMOutputSpec, Node as ProseMirrorNode } from '@tiptap/pm/model'
// import { PluginKey } from '@tiptap/pm/state'
// import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
// import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
// import { tippy } from '@tippyjs/react'
// import { ReactRenderer } from '@tiptap/react'
// import { cn } from '@/lib'
// import { Button } from '@/registry/registry-ui-components'
// import { Separator } from './ShadcnUI'
//
// // MentionNodeAttrs Interface
// export interface MentionNodeAttrs {
//   id: string | null
//   label?: string | null
// }
//
// // MentionOptions Interface
// export type MentionOptions<
//   SuggestionItem = any,
//   Attrs extends Record<string, any> = MentionNodeAttrs,
// > = {
//   HTMLAttributes: Record<string, any>
//   renderText: (props: {
//     options: MentionOptions<SuggestionItem, Attrs>
//     node: ProseMirrorNode
//   }) => string
//   renderHTML: (props: {
//     options: MentionOptions<SuggestionItem, Attrs>
//     node: ProseMirrorNode
//   }) => DOMOutputSpec
//   deleteTriggerWithBackspace: boolean
//   suggestion: Omit<SuggestionOptions<SuggestionItem, Attrs>, 'editor'>
// }
//
// // Plugin Key
// export const MentionPluginKey = new PluginKey('mention')
//
// // MentionTooltip Component
// const MentionTooltip = ({ node }: any) => {
//   const label = node.attrs.label || node.attrs.id || ''
//   // console.log(label)
//
//   return (
//     <NodeViewWrapper className="inline-flex">
//       <span className="font-medium bg-foreground/10 px-1 !my-[0px] rounded-sm text-sm hover:bg-foreground/20 transition cursor-pointer text-primary/60">
//         @{label}
//       </span>
//     </NodeViewWrapper>
//   )
// }
//
// // Mention Node Definition
// export const Mention = Node.create<MentionOptions>({
//   name: 'mention',
//
//   addOptions() {
//     return {
//       HTMLAttributes: {},
//       renderText({ options, node }) {
//         return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
//       },
//       deleteTriggerWithBackspace: false,
//       renderHTML({ options, node }) {
//         return [
//           'span',
//           mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
//           `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
//         ]
//       },
//       suggestion: {
//         char: '@',
//         pluginKey: MentionPluginKey,
//         command: ({ editor, range, props }) => {
//           const nodeAfter = editor.view.state.selection.$to.nodeAfter
//           const overrideSpace = nodeAfter?.text?.startsWith(' ')
//
//           if (overrideSpace) {
//             range.to += 1
//           }
//
//           editor
//             .chain()
//             .focus()
//             .insertContentAt(range, [
//               {
//                 type: this.name,
//                 attrs: props,
//               },
//               {
//                 type: 'text',
//                 text: ' ',
//               },
//             ])
//             .run()
//
//           window.getSelection()?.collapseToEnd()
//         },
//         allow: ({ state, range }) => {
//           const $from = state.doc.resolve(range.from)
//           const type = state.schema.nodes[this.name]
//           const allow = !!$from.parent.type.contentMatch.matchType(type)
//
//           return allow
//         },
//       },
//     }
//   },
//
//   // @ts-ignore
//   addCommands() {
//     return {
//       // Custom command for inserting mentions
//       insertMentions:
//         // @ts-ignore
//
//           (content) =>
//           // @ts-ignore
//           ({ commands, editor }) => {
//             const range = editor.state.selection
//             const nodeAfter = editor.view.state.selection.$to.nodeAfter
//             const overrideSpace = nodeAfter?.text?.startsWith(' ')
//
//             if (overrideSpace) {
//               range.to += 1
//             }
//
//             // Insert mention content
//             return commands.insertContentAt(range, [
//               {
//                 type: this.name,
//                 attrs: content, // Provide content with id/label
//               },
//               {
//                 type: 'text',
//                 text: ' ',
//               },
//             ])
//           },
//     }
//   },
//
//   group: 'inline',
//
//   inline: true,
//
//   selectable: false,
//
//   atom: true,
//
//   addAttributes() {
//     return {
//       id: {
//         default: null,
//         parseHTML: (element) => element.getAttribute('data-id'),
//         renderHTML: (attributes) => {
//           if (!attributes.id) {
//             return {}
//           }
//
//           return {
//             'data-id': attributes.id,
//           }
//         },
//       },
//
//       label: {
//         default: null,
//         parseHTML: (element) => element.getAttribute('data-label'),
//         renderHTML: (attributes) => {
//           if (!attributes.label) {
//             return {}
//           }
//
//           return {
//             'data-label': attributes.label,
//           }
//         },
//       },
//     }
//   },
//
//   parseHTML() {
//     return [
//       {
//         tag: `span[data-type="${this.name}"]`,
//       },
//     ]
//   },
//
//   renderHTML({ node, HTMLAttributes }) {
//     // @ts-ignore
//     if (this.options.renderLabel !== undefined) {
//       console.warn(
//         'renderLabel is deprecated use renderText and renderHTML instead',
//       )
//       return [
//         'span',
//         mergeAttributes(
//           { 'data-type': this.name },
//           this.options.HTMLAttributes,
//           HTMLAttributes,
//         ),
//         // @ts-ignore
//         this.options.renderLabel({
//           options: this.options,
//           node,
//         }),
//       ]
//     }
//     const mergedOptions = { ...this.options }
//
//     mergedOptions.HTMLAttributes = mergeAttributes(
//       { 'data-type': this.name },
//       this.options.HTMLAttributes,
//       HTMLAttributes,
//     )
//     const html = this.options.renderHTML({
//       options: mergedOptions,
//       node,
//     })
//
//     if (typeof html === 'string') {
//       return [
//         'span',
//         mergeAttributes(
//           { 'data-type': this.name },
//           this.options.HTMLAttributes,
//           HTMLAttributes,
//         ),
//         html,
//       ]
//     }
//     return html
//   },
//
//   renderText({ node }) {
//     // @ts-ignore
//     if (this.options.renderLabel !== undefined) {
//       console.warn(
//         'renderLabel is deprecated use renderText and renderHTML instead',
//       )
//       // @ts-ignore
//       return this.options.renderLabel({
//         options: this.options,
//         node,
//       })
//     }
//     return this.options.renderText({
//       options: this.options,
//       node,
//     })
//   },
//
//   addKeyboardShortcuts() {
//     return {
//       Backspace: () =>
//         this.editor.commands.command(({ tr, state }) => {
//           let isMention = false
//           const { selection } = state
//           const { empty, anchor } = selection
//
//           if (!empty) {
//             return false
//           }
//
//           state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
//             if (node.type.name === this.name) {
//               isMention = true
//               tr.insertText(
//                 this.options.deleteTriggerWithBackspace
//                   ? ''
//                   : this.options.suggestion.char || '',
//                 pos,
//                 pos + node.nodeSize,
//               )
//
//               return false
//             }
//           })
//
//           return isMention
//         }),
//     }
//   },
//
//   addProseMirrorPlugins() {
//     return [
//       Suggestion({
//         editor: this.editor,
//         ...this.options.suggestion,
//       }),
//     ]
//   },
//
//   addNodeView() {
//     return ReactNodeViewRenderer(MentionTooltip)
//   },
// })
//
// // MentionList component with customization
// export const MentionList = React.forwardRef((props, ref) => {
//   const [selectedIndex, setSelectedIndex] = React.useState(0)
//
//   // @ts-ignore
//   const selectItem = (index) => {
//     // @ts-ignore
//     const item = props.items[index]
//     if (item) {
//       // @ts-ignore
//       props.command({ id: item })
//     }
//   }
//
//   const upHandler = () => {
//     // @ts-ignore
//     setSelectedIndex(
//       (selectedIndex + props.items.length - 1) % props.items.length,
//     )
//   }
//
//   const downHandler = () => {
//     // @ts-ignore
//     setSelectedIndex((selectedIndex + 1) % props.items.length)
//   }
//
//   const enterHandler = () => {
//     selectItem(selectedIndex)
//   }
//
//   // @ts-ignore
//   React.useEffect(() => setSelectedIndex(0), [props.items])
//
//   React.useImperativeHandle(ref, () => ({
//     // @ts-ignore
//     onKeyDown: ({ event }) => {
//       if (event.key === 'ArrowUp') {
//         upHandler()
//         return true
//       }
//       if (event.key === 'ArrowDown') {
//         downHandler()
//         return true
//       }
//       if (event.key === 'Enter') {
//         enterHandler()
//         return true
//       }
//       return false
//     },
//   }))
//
//   return (
//     <div
//       className={cn(
//         'bg-background border border-border shadow-sm p-2 rounded-md flex flex-col gap-1 w-full',
//         // @ts-ignore
//         props.customClass,
//       )}
//     >
//       <h4 className="text-xs font-medium text-muted-foreground">Suggestions</h4>
//       <Separator />
//       <div className={cn('flex flex-col items-start gap-[2px]')}>
//         {/* @ts-ignore */}
//         {props.items.length ? (
//           // @ts-ignore
//           props.items.map((item, index) => (
//             <Button
//               variant="ghost"
//               size="sm"
//               className={cn(
//                 'h-7 w-full justify-start',
//                 index === selectedIndex ? 'bg-primary/20' : '',
//               )}
//               key={index}
//               onClick={() => selectItem(index)}
//             >
//               {/* Render a custom React component for each item
//         // @ts-ignore*/}
//               {props.renderItem ? props.renderItem(item) : item}
//             </Button>
//           ))
//         ) : (
//           <div className="text-sm text-muted-foreground text-center">
//             No result
//           </div>
//         )}
//       </div>
//     </div>
//   )
// })
//
// export const CustomSuggestion = {
//   // @ts-ignore
//   items: ({ query }) => {
//     return [
//       'Lea Thompson',
//       'Cory House',
//       'Marisa Solace',
//       'Huck Finn',
//       'Bugs Bunny',
//       'LeBron James',
//       'Kobe Bryant',
//       'Michael Jordan',
//       'Cyndi Lauper',
//       'Tom Cruise',
//       'Madonna',
//
//       // more items...
//     ]
//       .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
//       .slice(0, 5)
//   },
//
//   render: () => {
//     // @ts-ignore
//     let component
//     // @ts-ignore
//     let popup
//
//     return {
//       // @ts-ignore
//       onStart: (props) => {
//         component = new ReactRenderer(MentionList, {
//           props,
//           editor: props.editor,
//         })
//
//         if (!props.clientRect) {
//           return
//         }
//
//         popup = tippy('body', {
//           getReferenceClientRect: props.clientRect,
//           appendTo: () => document.body,
//           content: component.element,
//           showOnCreate: true,
//           interactive: true,
//           trigger: 'manual',
//           placement: 'bottom-start',
//         })
//       },
//       // @ts-ignore
//       onUpdate(props) {
//         // @ts-ignore
//         component.updateProps({
//           ...props,
//           customClass: '', // Updated class if needed
//           // @ts-ignore
//           renderItem: (item) => (
//             <div className="">
//               <span>{item}</span>
//             </div>
//           ),
//         })
//
//         if (!props.clientRect) {
//           return
//         }
//
//         // @ts-ignore
//         popup[0].setProps({
//           getReferenceClientRect: props.clientRect,
//         })
//       },
//
//       // @ts-ignore
//       onKeyDown(props) {
//         if (props.event.key === 'Escape') {
//           // @ts-ignore
//           popup[0].hide()
//           return true
//         }
//         // @ts-ignore
//         return component.ref?.onKeyDown(props)
//       },
//
//       onExit() {
//         // @ts-ignore
//         popup[0].destroy()
//         // @ts-ignore
//         component.destroy()
//       },
//     }
//   },
// }
