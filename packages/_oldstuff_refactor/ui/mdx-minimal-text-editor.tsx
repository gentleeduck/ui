// 'use client'
// import React from 'react'
//
// import { Editor, EditorContent, useEditor } from '@tiptap/react'
// import Highlight from '@tiptap/extension-highlight'
// import Link from '@tiptap/extension-link'
// import Underline from '@tiptap/extension-underline'
// import FontFamily from '@tiptap/extension-font-family'
// import ListKeymap from '@tiptap/extension-list-keymap'
// import Placeholder from '@tiptap/extension-placeholder'
// import TextAlign from '@tiptap/extension-text-align'
// import { Color } from '@tiptap/extension-color'
// import Image from '@tiptap/extension-image'
// import TextStyle from '@tiptap/extension-text-style'
// import StarterKit from '@tiptap/starter-kit'
// // import Ai from '@tiptap-pro/extension-ai'
// import { all, createLowlight } from 'lowlight'
//
// import data from '@emoji-mart/data'
// import { useDebounceCallback } from '@gentleduck/hooks/use-debounce-callback'
// import { cn } from '@gentleduck/libs/cn'
// import { ScrollArea } from '@gentleduck/registry-ui-duckui/scroll-area'
// import { init, SearchIndex } from 'emoji-mart'
// import { SpaceNode } from './space-node'
// import { z } from 'zod'
// import { MDXTextEditorToolbar } from './mdx-toolbar'
// import css from 'highlight.js/lib/languages/css'
// import js from 'highlight.js/lib/languages/javascript'
// import ts from 'highlight.js/lib/languages/typescript'
// import html from 'highlight.js/lib/languages/xml'
// import { CodeBlockLowlight } from './mdx-code-block-lowlight'
// import { MDXContext } from '../example/mdx-context-provider'
// import { EmojiFont, EmojiReplacer } from './mdx-emoji'
// import { CustomSuggestion, Mention } from './mdx-mention'
// import { Command, CommandGroup, CommandItem, CommandList } from './command'
// import { Separator } from './ShadcnUI'
//
// const lowlight = createLowlight(all)
// lowlight.register('html', html)
// lowlight.register('css', css)
// lowlight.register('js', js)
// lowlight.register('ts', ts)
//
// const emojiShortcodeSchema = z
//   .string()
//   .min(2)
//   .regex(/^[a-zA-Z0-9_]+$/)
//
// interface SearchEmojiArgs {
//   value: string
//   setData: React.Dispatch<React.SetStateAction<DataState>>
// }
//
// type DataState = { data: Emoji[]; q: string }
//
// interface Emoji {
//   id: string
//   skins: Skin[]
// }
//
// interface Skin {
//   unified: string
//   native: string
//   shortcodes: string
// }
//
// // Mocked search function for demo purposes
// async function searchEmoji({ value, setData }: SearchEmojiArgs) {
//   init({ data })
//   const searchResults = await SearchIndex.search(value ?? '')
//   setData({ data: searchResults || [], q: value })
// }
//
// export type MDXMinimalTextEditorProps = {
//   valid: boolean
//   name: string
//   className?: string
//   content?: string
//   type?: string
// }
//
// export const MDXMinimalTextEditor = ({
//   valid,
//   name,
//   className,
//   content,
//   type,
// }: MDXMinimalTextEditorProps) => {
//   const [data, setData] = React.useState<DataState>({ data: [], q: '' })
//   const [inputValue, setInputValue] = React.useState<string>('')
//
//   const editor = useEditor(
//     {
//       extensions: [
//         TextStyle,
//         Color.configure({
//           types: ['textStyle'],
//         }),
//         CodeBlockLowlight.configure({
//           defaultLanguage: 'typescript',
//           lowlight,
//         }),
//         Highlight.configure({ multicolor: true }),
//         StarterKit.configure({
//           code: false,
//           codeBlock: false,
//         }),
//         Link.configure({
//           openOnClick: true,
//           autolink: true,
//         }),
//         Underline,
//         FontFamily,
//         ListKeymap,
//         TextAlign.configure({
//           types: ['heading', 'paragraph'],
//         }),
//         Placeholder.configure({
//           placeholder: 'Type something...',
//         }),
//         Image,
//         SpaceNode,
//         // Emoji2.configure({
//         //   HTMLAttributes: {
//         //     class: 'mention',
//         //   },
//         //   suggestion: {
//         //     ...CustomSuggestion,
//         //     //   items: ({ query }) => {
//         //     //     return data
//         //     //     // .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
//         //     //     // .slice(0, 5)
//         //     //   },
//         //   },
//         // }),
//         EmojiReplacer.configure({
//           shouldUseExtraLookupSpace: false,
//           shouldUseExtraReplacementSpace: false,
//         }),
//         Mention.configure({
//           HTMLAttributes: {
//             class: 'mention',
//           },
//           suggestion: {
//             ...CustomSuggestion,
//             items: ({ query }) => {
//               return [
//                 'wildduck',
//                 'Lea Thompson',
//                 'Cory House',
//                 'Marisa Solace',
//                 'Huck Finn',
//                 'Bugs Bunny',
//               ]
//                 .filter((item) =>
//                   item.toLowerCase().startsWith(query.toLowerCase()),
//                 )
//                 .slice(0, 5)
//             },
//           },
//         }),
//       ],
//       //   content: `
//       // <p>Hi everyone! Don’t forget the daily stand up at 8 AM.</p>
//       //     <p><span data-type="mention" data-id="Jennifer Grey"></span> Would you mind to share what you’ve been working on lately? We fear not much happened since Dirty Dancing.
//       //     <p><span data-type="mention" data-id="Winona Ryder"></span> <span data-type="mention" data-id="Axl Rose"></span> Let’s go through your most important points quickly.</p>
//       //     <p>I have a meeting with <span data-type="mention" data-id="Christina Applegate"></span> and don’t want to come late.</p>
//       //     <p>– Thanks, your big boss</p>`,
//       editorProps: {
//         attributes: {
//           autocomplete: 'on',
//           autocorrect: 'on',
//           autocapitalize: 'on',
//           class: cn(!valid && 'opacity-50 pointer-events-none', className),
//         },
//       },
//       immediatelyRender: true,
//       shouldRerenderOnTransaction: true,
//     },
//     [valid, name],
//   )
//
//   const { mention, editContent, mdxContent, setMention, setMdxContent } =
//     React.useContext(MDXContext)
//   React.useEffect(() => {
//     if (editor && mdxContent === '') {
//       editor.commands.clearContent()
//       setMention(null)
//     }
//   }, [mdxContent])
//
//   const updateEditorContent = useDebounceCallback((html: string) => {
//     return setMdxContent && setMdxContent(html)
//   }, 300)
//
//   React.useEffect(() => {
//     if (editor) {
//       if (mention) {
//         // @ts-ignore
//         editor
//           .chain()
//           .focus()
//           .insertMentions({ id: mention?.id, label: mention?.name })
//           .run()
//       }
//     }
//   }, [mention, editor])
//
//   React.useEffect(() => {
//     if (editor) {
//       editor.on('update', ({ editor }) => {
//         const text = editor.getText()
//         const html = editor.getHTML()
//
//         updateEditorContent(html)
//         handleInputChange(text)
//       })
//     }
//   }, [editor, editContent, mention, mdxContent])
//
//   const handleInputChange = useDebounceCallback(async (value: string) => {
//     setInputValue(value)
//
//     if (value.trim() === '') {
//       setData({ data: [], q: '' })
//       return
//     }
//
//     const match = value.match(/(?:\s|^):([a-zA-Z0-9_]{2,})$/)
//     if (match) {
//       const shortcode = match[1]
//       if (emojiShortcodeSchema.safeParse(shortcode).success) {
//         await searchEmoji({ value: shortcode, setData })
//       }
//     } else {
//       setData({ data: [], q: '' })
//     }
//   }, 300)
//
//   const handleEmojiClick = React.useCallback(
//     (emoji: Emoji) => {
//       const regex = /:[a-zA-Z0-9_]+$/
//       const newValue = inputValue.replace(regex, emoji.skins[0].native)
//       if (editor) {
//         // @ts-ignore
//         editor
//           .chain()
//           .focus()
//           .insertEmoji(emoji.skins[0].native, emoji.skins[0].shortcodes)
//           .run()
//       }
//       setInputValue(newValue)
//       setData({ data: [], q: '' })
//     },
//     [editor, inputValue, editor, data],
//   )
//
//   if (!editor) {
//     return null
//   }
//
//   return (
//     <>
//       <MDXTextEditorToolbar editor={editor} />
//       <ScrollArea
//         className={cn(
//           'mdx__minimal__text__editor max-h-[4.5rem] rounded-xs text-[0.7rem] py-[5px] px-2 overflow-x-hidden overflow-y-scroll',
//           valid && 'disabled',
//         )}
//       >
//         {data?.data.length > 0 && (
//           <Command className="fixed bottom-[50px] left-0 right-0 w-[221px] h-auto">
//             <div className="text-sm font-medium px-3 pt-2 pb-1">
//               EMOJI MATCHING <span className="text-sky-500">:{data.q}</span>
//             </div>
//             <Separator />
//             <CommandList>
//               <CommandGroup>
//                 {data?.data.map((emoji) => (
//                   <CommandItem
//                     key={emoji.id}
//                     value={emoji.skins[0].native}
//                     onSelect={(_) => {
//                       handleEmojiClick(emoji)
//                     }}
//                     className="flex items-center justify-start gap-1"
//                   >
//                     <span className={cn('text-xl', EmojiFont.className)}>
//                       {emoji.skins[0].native}
//                     </span>
//                     <span className="text-muted-foreground">
//                       {emoji.skins[0].shortcodes}
//                     </span>
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         )}
//         <EditorContent editor={editor} />
//       </ScrollArea>
//     </>
//   )
// }
//
// //
// // <p> </p>
// //
// //         <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
// // {
// //   if (i % 15 == 0)
// //     console.log("FizzBuzz");
// //   else if (i % 3 == 0)
// //     console.log("Fizz");
// //   else if (i % 5 == 0)
// //     console.log("Buzz");
// //   else
// //     console.log(i);
// // }</code></pre>
// //         <p>
// //           Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
// //         </p>
// //     <p>Hi everyone! Don’t forget the daily stand up at 8 AM.</p>
// //         <p><span data-type="mention" data-id="Jennifer Grey"></span> Would you mind to share what you’ve been working on lately? We fear not much happened since Dirty Dancing.
// //         <p><span data-type="mention" data-id="Winona Ryder"></span> <span data-type="mention" data-id="Axl Rose"></span> Let’s go through your most important points quickly.</p>
// //         <p>I have a meeting with <span data-type="mention" data-id="Christina Applegate"></span> and don’t want to come late.</p>
// //         <p>– Thanks, your big boss</p>
