import { defineConfig, s, ZodMeta } from 'velite'
// import { docs } from '~/velite-configs'

import { getHighlighter, loadTheme } from '@shikijs/compat'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// @ts-ignore
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { codeImport } from 'remark-code-import'
import remarkGfm from 'remark-gfm'
import { Pluggable, PluggableList, Plugin } from 'unified'
import { rehypeNpmCommand } from './lib/rehype-npm-command'
import { UnistNode, UnistTree } from './types/unist'
import { rhypeMetadataPlugin, rehypeComponent, rehypePreBlockSource } from './velite-configs/plugins'
import { visit } from 'unist-util-visit'
import { rehypeTitle } from './velite-configs/plugins/regype-title'

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

// rehypeExtractTitle.js
// ! FIX: type error
const config = defineConfig({
  collections: {
    docs: {
      name: 'Docs',
      // pattern: 'docs/components/chart.mdx',
      pattern: 'docs/**/*.mdx',
      schema: s
        .object({
          title: s.string().max(99),
          metadata: s.metadata(),
          description: s.string(),
          links: s.object({ doc: s.string().optional(), api: s.string().optional() }).optional(),
          excerpt: s.excerpt(),
          content: s.markdown(),
          body: s.mdx(),
          toc: s.toc(),
        })
        //NOTE:: more additional fields (computed fields)
        .transform((data, { path, meta }) => {
          const _meta = meta as ZodMeta & { path: string }
          return {
            ...data,
            toc: cleanTocItems(data.toc),
            slug: _meta.path
              .split('docs/')
              .pop() // take everything after the first "docs/"
              ?.replace(/\.mdx$/, '') // remove .mdx extension
              .replace(/^\/+/, '') // remove leading slashes
              ? `docs/${_meta.path
                  .split('docs/')
                  .pop()
                  ?.replace(/\.mdx$/, '')
                  .replace(/^\/+/, '')}`
              : 'docs',

            permalink: `${_meta.path.split('/').slice(-2, -1).join('/')}/${_meta.path.split('/').pop()?.replace('.mdx', '')}`,
            sourceFilePath: path,
            sourceFileName: _meta.path.split('/').pop(),
            sourceFileDir: _meta.path.split('/').slice(-3, -1).join('/'),
            contentType: _meta.path.split('.').pop(),
            flattenedPath: _meta.path
              .split('/')
              .slice(-2, -1)
              .join('/')
              .replace(/\.mdx$/, ''),
          }
        }),
    },
  },
  mdx: {
    remarkPlugins: [remarkGfm, codeImport],
    rehypePlugins: [
      rehypeComponent,
      // @ts-ignore
      rehypeSlug,
      rhypeMetadataPlugin,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'catppuccin-mocha',
            light: 'github-light',
          },

          getHighlighter,
          onVisitLine(node: UnistNode) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children?.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node: UnistNode) {
            // @ts-ignore
            node.properties.className.push('line--highlighted')
          },
          onVisitHighlightedWord(node: UnistNode) {
            // @ts-ignore
            node.properties.className = ['word--highlighted']
          },
        },
      ],
      // rehypeTitle,
      rehypePreBlockSource,
      rehypeNpmCommand,
      // @ts-ignore
      [rehypeAutolinkHeadings, { properties: { className: ['subheading-anchor'], ariaLabel: 'Link to section' } }],
    ],
  },
}) as any
function cleanTocItems(items: any[]): any[] {
  return items.map((item) => {
    return {
      ...item,
      title: item.title?.replace('undefined', ''),
      items: item.items ? cleanTocItems(item.items) : [],
    }
  })
}

export default config
