import { defineConfig } from 'velite'
import { docs } from '~/velite-configs'

import { getHighlighter, loadTheme } from '@shikijs/compat'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { codeImport } from 'remark-code-import'
import remarkGfm from 'remark-gfm'
import { Pluggable, PluggableList, Plugin } from 'unified'
import { rehypeNpmCommand } from './lib/rehype-npm-command'
import { UnistNode, UnistTree } from './types/unist'
import {
  metadataPlugin,
  rehypeComponent,
  rehypeExtractTitle,
  rehypePreBlockSource,
} from './velite-configs/plugins'
import { Nodes } from 'hast'

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

// rehypeExtractTitle.js

const config = defineConfig({
  collections: {
    docs,
  },
  mdx: {
    remarkPlugins: [remarkGfm, codeImport],

    rehypePlugins: [
      rehypeSlug,
      rehypeComponent,
      // rehypeExtractTitle,
      // metadataPlugin,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'catppuccin-mocha',
            light: 'catppuccin-latte',
          },
          getHighlighter,
          onVisitLine(node: UnistNode) {
            console.log(node)
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children?.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node: UnistNode): void {
            // @ts-ignore
            node?.properties?.className.push('line--highlighted')
          },
          onVisitHighlightedWord(node: UnistNode): void {
            // @ts-ignore
            node?.properties?.className.push('word--highlighted')
          },
        },
      ],
      // rehypePreBlockSource,

      () =>
        (tree: UnistTree): UnistTree => {
          tree.children.map((node: UnistNode) => {
            // console.dir(node, { depth: 5 })
          })
          return tree
        },
      // rehypeNpmCommand,
      // [
      //   rehypeAutolinkHeadings,
      //   {
      //     properties: {
      //       className: ['subheading-anchor'],
      //       ariaLabel: 'Link to section',
      //     },
      //   },
      // ],
    ] as PluggableList,
  },
})

export default config
