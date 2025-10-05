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
import { visit } from 'unist-util-visit'
import { rehypeNpmCommand } from './lib/rehype-npm-command'
import { UnistNode, UnistTree } from './types/unist'
import { rehypeComponent, rehypePreBlockSource, rhypeMetadataPlugin } from './velite-configs/plugins'
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
          body: s.mdx(),
          component: s.boolean().default(false),
          content: s.markdown(),
          description: s.string(),
          excerpt: s.excerpt(),
          links: s.object({ api: s.string().optional(), doc: s.string().optional() }).optional(),
          metadata: s.metadata(),
          title: s.string().max(99),
          toc: s.toc(),
        })
        //NOTE:: more additional fields (computed fields)
        .transform((data, { path, meta }) => {
          const _meta = meta as ZodMeta & { path: string }
          return {
            ...data,
            contentType: _meta.path.split('.').pop(),
            flattenedPath: _meta.path
              .split('/')
              .slice(-2, -1)
              .join('/')
              .replace(/\.mdx$/, ''),

            permalink: _meta.path.replace(/^.*docs\//, '').replace(/\.mdx$/, ''),
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
            sourceFileDir: _meta.path.split('/').slice(-3, -1).join('/'),
            sourceFileName: _meta.path.split('/').pop(),
            sourceFilePath: path,
            toc: cleanTocItems(data.toc),
          }
        }),
    },
  },
  mdx: {
    rehypePlugins: [
      rehypeComponent,
      // @ts-ignore
      rehypeSlug,
      rhypeMetadataPlugin,
      [
        rehypePrettyCode,
        {
          getHighlighter,
          onVisitHighlightedLine(node: UnistNode) {
            // @ts-ignore
            node.properties.className.push('line--highlighted')
          },
          onVisitHighlightedWord(node: UnistNode) {
            // @ts-ignore
            node.properties.className = ['word--highlighted']
          },
          onVisitLine(node: UnistNode) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children?.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          theme: {
            dark: 'catppuccin-mocha',
            light: 'github-light',
          },
        },
      ],
      rehypeTitle,
      rehypePreBlockSource,
      rehypeNpmCommand,
      // @ts-ignore
      [rehypeAutolinkHeadings, { properties: { ariaLabel: 'Link to section', className: ['subheading-anchor'] } }],
    ],
    remarkPlugins: [remarkGfm, codeImport],
  },
}) as any
function cleanTocItems(items: any[]): any[] {
  return items.map((item) => {
    return {
      ...item,
      items: item.items ? cleanTocItems(item.items) : [],
      title: item.title?.replace('undefined', ''),
    }
  })
}

export default config
