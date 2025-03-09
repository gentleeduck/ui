import { defineConfig } from 'velite'
import { docs } from '~/velite-configs'

import { toString } from 'hast-util-to-string'
import { getHighlighter, loadTheme } from '@shikijs/compat'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { codeImport } from 'remark-code-import'
import remarkGfm from 'remark-gfm'
import { Pluggable } from 'unified'
import { rehypeNpmCommand } from './lib/rehype-npm-command'
import { UnistNode, UnistTree } from './types/unist'
import {
  metadataPlugin,
  rehypeComponent,
  rehypeExtractTitle,
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
      rehypeSlug as Pluggable,
      rehypeComponent,
      rehypeExtractTitle,
      metadataPlugin,
      () =>
        (tree: UnistTree): UnistTree => {
          tree.children.map((node: UnistNode) => {
            // console.log(node)
          })
          return tree
        },
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'catppuccin-mocha',
            light: 'catppuccin-latte',
          },
          getHighlighter,
          onVisitLine(node: UnistNode) {
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

      () => (tree: UnistTree) => {
        return {
          ...tree,
          children: tree.children.map((node: UnistNode) => {
            if (node?.type === 'element' && node?.tagName === 'div') {
              if (!('data-rehype-pretty-code-fragment' in node.properties!)) {
                return
              }

              return {
                ...node,
                children: node.children?.map((child: UnistNode) => {
                  if (child?.tagName !== 'pre') {
                    return child
                  }

                  return {
                    ...child,
                    properties: {
                      ...child?.properties,
                      __rawString__: toString(child as Nodes),
                    },
                  }
                }),
              }
            }
          }),
        }
      },
      rehypeNpmCommand,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
})

export default config
