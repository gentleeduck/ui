// //
// // @ts-noCheck
// // @ts-nocheck
// import React, { useMemo } from 'react'
// import { findChildren } from '@tiptap/core'
// import { Node as ProsemirrorNode } from '@tiptap/pm/model'
// import { Plugin, PluginKey } from '@tiptap/pm/state'
// import { Decoration, DecorationSet } from '@tiptap/pm/view'
// import highlight from 'highlight.js/lib/core'
// import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block'
// import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
//
// // Component to render the CodeBlock with lowlight
// export const CodeBlockLowlightView = ({
//   node,
//   updateAttributes,
//   extension,
// }) => {
//   const {
//     attrs: { language: defaultLanguage },
//     textContent,
//   } = node
//
//   const highlightedCode = useMemo(() => {
//     const language = defaultLanguage || 'plaintext'
//     const highlighted = extension.options.lowlight.highlight(
//       language,
//       textContent,
//     )
//     return parseNodes(getHighlightNodes(highlighted))
//   }, [defaultLanguage, textContent])
//
//   return (
//     <NodeViewWrapper className="code-block">
//       <select
//         contentEditable={false}
//         defaultValue={defaultLanguage}
//         onChange={(event) => updateAttributes({ language: event.target.value })}
//       >
//         <option value="null">auto</option>
//         <option disabled>—</option>
//         {extension.options.lowlight.listLanguages().map((lang, index) => (
//           <option key={index} value={lang}>
//             {lang}
//           </option>
//         ))}
//       </select>
//       <pre>
//         <code className={`language-${defaultLanguage}`}>
//           {highlightedCode.map((node, index) => (
//             <span key={index} className={node.classes.join(' ')}>
//               {node.text}
//             </span>
//           ))}
//         </code>
//       </pre>
//     </NodeViewWrapper>
//   )
// }
//
// // Extending the CodeBlock with lowlight functionality
// export interface CodeBlockLowlightOptions extends CodeBlockOptions {
//   lowlight: any
// }
//
// export const CodeBlockLowlight = CodeBlock.extend<CodeBlockLowlightOptions>({
//   addOptions() {
//     return {
//       ...this.parent?.(),
//       lowlight: {}, // Ensure you pass the lowlight instance
//     }
//   },
//
//   // Render as React component instead of HTML
//   renderReact({ node }) {
//     const language =
//       node.attrs.language || this.options.defaultLanguage || 'plaintext'
//     const highlighted = this.options.lowlight.highlight(
//       language,
//       node.textContent,
//     )
//     const parsedNodes = parseNodes(getHighlightNodes(highlighted))
//
//     return (
//       <pre>
//         <code className={`language-${language}`}>
//           {parsedNodes.map(({ text, classes }, index) => (
//             <span key={index} className={classes.join(' ')}>
//               {text}
//             </span>
//           ))}
//         </code>
//       </pre>
//     )
//   },
//
//   addProseMirrorPlugins() {
//     return [
//       ...(this.parent?.() || []),
//       LowlightPlugin({
//         name: this.name,
//         lowlight: this.options.lowlight,
//         defaultLanguage: this.options.defaultLanguage,
//       }),
//     ]
//   },
// })
//
// // Helper functions for parsing and decorations
//
// function parseNodes(
//   nodes: any[],
//   className: string[] = [],
// ): { text: string; classes: string[] }[] {
//   return nodes
//     .map((node) => {
//       const classes = [
//         ...className,
//         ...(node.properties ? node.properties.className : []),
//       ]
//
//       if (node.children) {
//         return parseNodes(node.children, classes)
//       }
//
//       return {
//         text: node.value,
//         classes,
//       }
//     })
//     .flat()
// }
//
// function getHighlightNodes(result: any) {
//   return result.value || result.children || []
// }
//
// function registered(aliasOrLanguage: string) {
//   return Boolean(highlight.getLanguage(aliasOrLanguage))
// }
//
// function getDecorations({
//   doc,
//   name,
//   lowlight,
//   defaultLanguage,
// }: {
//   doc: ProsemirrorNode
//   name: string
//   lowlight: any
//   defaultLanguage: string | null | undefined
// }) {
//   const decorations: Decoration[] = []
//
//   findChildren(doc, (node) => node.type.name === name).forEach((block) => {
//     let from = block.pos + 1
//     const language = block.node.attrs.language || defaultLanguage
//     const languages = lowlight.listLanguages()
//
//     const nodes =
//       language && (languages.includes(language) || registered(language))
//         ? getHighlightNodes(
//             lowlight.highlight(language, block.node.textContent),
//           )
//         : getHighlightNodes(lowlight.highlightAuto(block.node.textContent))
//
//     parseNodes(nodes).forEach((node) => {
//       const to = from + node.text.length
//
//       if (node.classes.length) {
//         const decoration = Decoration.inline(from, to, {
//           class: node.classes.join(' '),
//         })
//
//         decorations.push(decoration)
//       }
//
//       from = to
//     })
//   })
//
//   return DecorationSet.create(doc, decorations)
// }
//
// // LowlightPlugin for handling syntax highlighting in ProseMirror
// export function LowlightPlugin({
//   name,
//   lowlight,
//   defaultLanguage,
// }: {
//   name: string
//   lowlight: any
//   defaultLanguage: string | null | undefined
// }) {
//   if (
//     !['highlight', 'highlightAuto', 'listLanguages'].every(
//       (api) => typeof lowlight[api] === 'function',
//     )
//   ) {
//     throw Error(
//       'You should provide an instance of lowlight to use the code-block-lowlight extension',
//     )
//   }
//
//   const lowlightPlugin: Plugin<any> = new Plugin({
//     key: new PluginKey('lowlight'),
//
//     state: {
//       init: (_, { doc }) =>
//         getDecorations({
//           doc,
//           name,
//           lowlight,
//           defaultLanguage,
//         }),
//       apply: (transaction, decorationSet, oldState, newState) => {
//         const oldNodeName = oldState.selection.$head.parent.type.name
//         const newNodeName = newState.selection.$head.parent.type.name
//         const oldNodes = findChildren(
//           oldState.doc,
//           (node) => node.type.name === name,
//         )
//         const newNodes = findChildren(
//           newState.doc,
//           (node) => node.type.name === name,
//         )
//
//         if (
//           transaction.docChanged &&
//           ([oldNodeName, newNodeName].includes(name) ||
//             newNodes.length !== oldNodes.length ||
//             transaction.steps.some((step) => {
//               return (
//                 step.from !== undefined &&
//                 step.to !== undefined &&
//                 oldNodes.some(
//                   (node) =>
//                     node.pos >= step.from &&
//                     node.pos + node.node.nodeSize <= step.to,
//                 )
//               )
//             }))
//         ) {
//           return getDecorations({
//             doc: transaction.doc,
//             name,
//             lowlight,
//             defaultLanguage,
//           })
//         }
//
//         return decorationSet.map(transaction.mapping, transaction.doc)
//       },
//     },
//
//     props: {
//       decorations(state) {
//         return lowlightPlugin.getState(state)
//       },
//     },
//   })
//
//   return lowlightPlugin
// }
//
// // import { DOMSerializer, Fragment, Schema } from '@tiptap/pm/model'
// //
// // export function getHTMLFromFragment(fragment: Fragment, schema: Schema): string {
// //   const documentFragment = DOMSerializer.fromSchema(schema).serializeFragment(fragment)
// //
// //   const temporaryDocument = document.implementation.createHTMLDocument()
// //   const container = temporaryDocument.createElement('div')
// //
// //   container.appendChild(documentFragment)
// //   console.log(container.innerHTML, 'asdf')
// //
// //   return container.innerHTML
// // }
//
// import { DOMSerializer, Fragment, Schema } from '@tiptap/pm/model'
//
// // Function to get the HTML from the fragment exactly as is
// export function getHTMLFromFragment(
//   fragment: Fragment,
//   schema: Schema,
// ): string {
//   const serializer = DOMSerializer.fromSchema(schema)
//   const documentFragment = serializer.serializeFragment(fragment)
//   console.log(serializer, documentFragment)
//
//   const temporaryDocument = document.implementation.createHTMLDocument()
//   const container = temporaryDocument.createElement('div')
//
//   container.appendChild(documentFragment)
//
//   return container.innerHTML
// }
