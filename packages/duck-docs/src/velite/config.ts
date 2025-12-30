import { getHighlighter } from '@shikijs/compat'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { codeImport } from 'remark-code-import'
import remarkGfm from 'remark-gfm'
import { defineConfig, s, type ZodMeta } from 'velite'
import type { UnistNode } from '../types'
import { rhypeMetadataPlugin, rehypePreBlockSource, rehypeTitle } from './plugins'
import { rehypeNpmCommand } from './rehype-npm-command'
import { cleanTocItems } from './utils'

export type DocsVeliteConfigOptions = {
  docsPattern?: string
  rehypePlugins?: unknown[]
  rehypePluginsBefore?: unknown[]
  remarkPlugins?: unknown[]
  remarkPluginsBefore?: unknown[]
}

export function createDocsVeliteConfig({
  docsPattern = 'docs/**/*.mdx',
  rehypePlugins = [],
  rehypePluginsBefore = [],
  remarkPlugins = [],
  remarkPluginsBefore = [],
}: DocsVeliteConfigOptions = {}) {
  return defineConfig({
    collections: {
      docs: {
        name: 'Docs',
        pattern: docsPattern,
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
                .pop()
                ?.replace(/\.mdx$/, '')
                .replace(/^\/+/, '')
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
        ...rehypePluginsBefore,
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
        ...rehypePlugins,
      ],
      remarkPlugins: [...remarkPluginsBefore, remarkGfm, codeImport, ...remarkPlugins],
    },
  }) as any
}

export const docsVeliteConfig = createDocsVeliteConfig()
