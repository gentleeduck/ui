// //
// // @ts-noCheck
// // @ts-nocheck
//
// import data from '@emoji-mart/data'
// import { escapeForRegEx, Node } from '@tiptap/core'
// import { TextSelection } from '@tiptap/pm/state'
// import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
// import { init, SearchIndex } from 'emoji-mart'
// import localFont from 'next/font/local'
// import { cn } from '@/lib'
// import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
//
// type SearchEmojiArgs = {
//   value: string
// }
//
// async function searchEmoji({ value }: SearchEmojiArgs) {
//   // Initialize emoji-mart with the provided data
//   init({ data })
//
//   // Perform the search using SearchIndex
//   const searchResults = await SearchIndex.search(value)
//
//   // Return the search results
//   return searchResults
// }
//
// export const EmojiFont = localFont({ src: '../../../assets/fonts/font.ttf' })
//
// const EmojiTooltip = ({ node }: any) => {
//   const shortcode = node.attrs.shortcode || ''
//
//   return (
//     <NodeViewWrapper className={cn('inline-flex', EmojiFont.className)}>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <span className="text-lg h-fit leading-none">
//             {/* @ts-ignore */}
//             <span className={cn('inline-flex', EmojiFont.className)}> {node.attrs.emoji} </span>
//           </span>
//         </TooltipTrigger>
//         <TooltipContent>
//           <div className="flex items-center gap-1">
//             <span className="!text-lg leading-none">
//               {/* @ts-ignore */}
//               <span> {node.attrs.emoji} </span>
//             </span>
//             <p className="text-muted-foreground font-semibold font-mono">{shortcode}</p>
//           </div>
//         </TooltipContent>
//       </Tooltip>
//     </NodeViewWrapper>
//   )
// }
//
// type InputRuleOptions = { find: string; replace: string }
// export type EmojiReplacerOptions = {
//   ruleConfigs: InputRuleOptions[]
//   shouldUseExtraLookupSpace: boolean
//   shouldUseExtraReplacementSpace: boolean
// }
//
// export const EmojiReplacer = Node.create<EmojiReplacerOptions>({
//
//   addAttributes() {
//     return {
//       emoji: {
//         default: null,
//       },
//       shortcode: {
//         default: null,
//       },
//     }
//   },
//
//   // @ts-ignore
//   addCommands() {
//     return {
//       insertEmoji:
//         (emoji: string, shortcode: string) =>
//         // @ts-ignore
//         ({ commands }) => {
//           return commands.insertContent({
//             attrs: { emoji, shortcode },
//             type: this.name,
//           })
//         },
//     }
//   },
//   addInputRules() {
//     init({ data })
//
//     const emojis_native = Object.values(data.emojis).map((emoji) => {
//       const shortcode = emoji.skins[0].shortcodes
//       const native = emoji.skins[0].native
//       // console.log({ shortcode, native }) // Check values here
//       return { find: shortcode, replace: native }
//     })
//
//     const lookupSpace = this.options.shouldUseExtraLookupSpace ? ' ' : ''
//     const replacementSpace = this.options.shouldUseExtraReplacementSpace ? ' ' : ''
//
//     const createRule = (inputRule: InputRuleOptions) => {
//       if (typeof inputRule.find !== 'string') {
//         console.error('Invalid inputRule:', inputRule) // Log invalid inputRule
//         return null // Skip this rule
//       }
//
//       const basePattern = this.options.shouldUseExtraLookupSpace
//         ? `${lookupSpace}${escapeForRegEx(inputRule.find.trim())}`
//         : `${escapeForRegEx(inputRule.find.trim())}${lookupSpace}`
//
//       return {
//         find: new RegExp(`${basePattern}$`),
//         handler: ({ state, range }: any) => {
//           const { tr } = state
//           const emoji = inputRule.replace.trim()
//
//           tr.replaceWith(
//             range.from,
//             range.to,
//             this.type.create({
//               emoji: emoji,
//               shortcode: inputRule.find.trim(),
//             }),
//           )
//
//           const newPos = tr.selection.from
//           if (replacementSpace && newPos <= tr.doc.content.size) {
//             const spaceTextNode = state.schema.text(replacementSpace)
//             if (this.options.shouldUseExtraReplacementSpace) {
//               tr.insert(newPos, spaceTextNode)
//             } else {
//               tr.insert(newPos - 1, spaceTextNode)
//             }
//           }
//
//           return tr
//         },
//       }
//     }
//
//     const rules = [...this.options.ruleConfigs, ...emojis_native].map(createRule).filter((rule) => rule !== null) // Only keep valid rules
//
//     return rules
//   },
//
//   // @ts-ignore
//   addKeyboardShortcuts() {
//     return {
//       Backspace: ({ editor }) => {
//         const { state, view } = editor
//         const { selection } = state
//         const { $from } = selection
//         const nodeBefore = $from.nodeBefore
//
//         if (nodeBefore?.type.name === 'text' && nodeBefore.text === ' ') {
//           const pos = $from.pos - nodeBefore.nodeSize
//           const tr = state.tr.delete(pos, $from.pos)
//
//           view.dispatch(tr)
//
//           return true
//         }
//
//         if (nodeBefore?.type.name === 'emojiReplacer') {
//           const pos = $from.pos - nodeBefore.nodeSize
//           const tr = state.tr.delete(pos, $from.pos)
//
//           if (this.options.shouldUseExtraReplacementSpace) {
//             const spaceTextNode = state.schema.text(' ')
//             if (this.options.shouldUseExtraReplacementSpace) {
//               tr.insert($from.pos - nodeBefore.nodeSize, spaceTextNode)
//             } else {
//               tr.insert($from.pos, spaceTextNode)
//             }
//           }
//
//           view.dispatch(tr)
//
//           return true
//         }
//
//         return false
//       },
//       Enter: async ({ editor }) => {
//         const { state, view } = editor
//         const { schema, selection } = state
//         const { $from } = selection
//         const cursorPos = $from.pos
//
//         // Extract the text before the cursor position
//         const nodeText = state.doc.textBetween($from.before(), cursorPos, ' ')
//
//         // Define your pattern and use it to find the shortcode
//         const basePattern = ':[a-zA-Z0-9_]+$' // Adjust this pattern as needed
//         const regex = new RegExp(`${basePattern}$`)
//         const match = nodeText.match(regex)
//
//         if (match) {
//           const shortcodeText = match[0].slice(1).trim() // Remove the leading `:` and trim
//
//           if (shortcodeText) {
//             // Search for the emoji
//             const searchResults = await searchEmoji({ value: shortcodeText })
//
//             if (searchResults.length > 0) {
//               const emoji = searchResults[0].skins[0].native // Get the native emoji
//               const emojiShortcode = searchResults[0].skins[0].shortcodes // Get the shortcode
//
//               // Calculate the actual positions in the document
//               const shortcodeStart = cursorPos - (nodeText.length - match.index! ?? ''.length)
//               const shortcodeEnd = cursorPos
//
//               // Ensure positions are within valid ranges
//               if (shortcodeStart < 0 || shortcodeEnd <= shortcodeStart || shortcodeEnd > state.doc.content.size) {
//                 return false // Invalid range, do nothing
//               }
//
//               // Create a transaction to replace the shortcode with the native emoji
//               const tr = state.tr.replaceRangeWith(
//                 shortcodeStart,
//                 shortcodeEnd,
//                 this.type.create({
//                   emoji: emoji,
//                   shortcode: emojiShortcode,
//                 }),
//               )
//
//               // Optionally handle extra replacement space
//               const replacementSpace = ' ' // Adjust as needed
//               if (replacementSpace && this.options.shouldUseExtraReplacementSpace) {
//                 const newPos = tr.selection.from
//                 const spaceTextNode = state.schema.text(replacementSpace)
//                 if (this.options.shouldUseExtraReplacementSpace) {
//                   tr.insert(newPos, spaceTextNode)
//                 } else {
//                   tr.insert(newPos - 1, spaceTextNode)
//                 }
//               }
//
//               // Apply the transaction
//               view.dispatch(tr)
//
//               // Move the cursor to the end of the emoji node
//               const newPos = tr.mapping.map(cursorPos)
//               view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, newPos)))
//
//               // Scroll to the new position
//               view.someProp('handleScrollToSelection', (f) => f(view))
//
//               return true // Action completed successfully
//             }
//           }
//         }
//
//         // Default behavior: insert a new paragraph and move the cursor to it
//         const paragraph = schema.nodes.paragraph.create()
//         const tr = state.tr.insert($from.pos, paragraph)
//
//         // Apply the transaction
//         view.dispatch(tr)
//
//         // Move the cursor to the end of the newly created paragraph
//         const newPos = $from.pos + paragraph.nodeSize
//         view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, newPos)))
//
//         // Scroll to the new position
//         view.someProp('handleScrollToSelection', (f) => f(view))
//
//         return true // Return true to indicate that the Enter key action has been handled
//       },
//     }
//   },
//   addNodeView() {
//     return ReactNodeViewRenderer(EmojiTooltip)
//   },
//
//   addOptions() {
//     return {
//       ruleConfigs: [],
//       shouldUseExtraLookupSpace: false,
//       shouldUseExtraReplacementSpace: true,
//     }
//   },
//   atom: true,
//
//   group: 'inline',
//   inline: true,
//
//   // New method to allow external emoji insertion
//
//   insertEmoji(editor: any, emoji: string, shortcode: string) {
//     const { state, view } = editor
//     const { schema, selection } = state
//     const { $from } = selection
//     const cursorPos = $from.pos
//     const { tr } = state
//
//     // Get the current selection
//     const { from, to } = state.selection
//
//     // console.log('hi')
//     // console.log(from, to)
//
//     // Create a transaction to replace the selection with the emoji
//     tr.replaceRangeWith(
//       from,
//       to,
//       this.type.create({
//         emoji,
//         shortcode,
//       }),
//     )
//
//     // // Optionally handle extra replacement space
//     // const replacementSpace = ' ' // Adjust as needed
//     // if (replacementSpace) {
//     //   const newPos = to
//     //   const spaceTextNode = schema.text(replacementSpace)
//     //   if (this.options.shouldUseExtraReplacementSpace) {
//     //     tr.insert(newPos, spaceTextNode)
//     //   } else {
//     //     tr.insert(newPos - 1, spaceTextNode)
//     //   }
//     // }
//
//     // Apply the transaction
//     view.dispatch(tr)
//
//     // Optionally move the cursor to the end of the inserted emoji
//     const newPos = tr.mapping.map(to + (this.options.shouldUseExtraReplacementSpace ? replacementSpace.length : 0))
//     view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, newPos)))
//
//     // Scroll to the new position
//     view.someProp('handleScrollToSelection', (f) => f(view))
//   },
//   name: 'emojiReplacer',
//
//   parseHTML() {
//     return [
//       {
//         tag: 'span[data-emoji]',
//       },
//     ]
//   },
//
//   // renderHTML({ HTMLAttributes }) {
//   //   return ['span', { ...HTMLAttributes, 'data-emoji': HTMLAttributes.emoji }]
//   // },
//   //
//   renderHTML({ HTMLAttributes }) {
//     // Ensure HTMLAttributes.emoji is properly formatted or replaced
//     return [
//       'span',
//       {
//         ...HTMLAttributes,
//         class: cn('inline-flex text-lg leading-none', EmojiFont.className), // You can add classes for styling
//         'data-emoji': HTMLAttributes.emoji,
//       },
//       HTMLAttributes.emoji, // Directly output the emoji character or HTML
//     ]
//   },
// })
