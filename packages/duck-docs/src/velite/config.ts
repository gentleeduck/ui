import type { IUnistNode } from '@duck-docs/types'
import { getHighlighter } from '@shikijs/compat'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// @ts-expect-error -- rehype-pretty-code has no published type declarations
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { codeImport } from 'remark-code-import'
import remarkGfm from 'remark-gfm'
import type { Pluggable } from 'unified'
import { defineConfig, s, type ZodMeta } from 'velite'
import { rehypeMermaid, rehypeMetadataPlugin, rehypeNpmCommand, rehypePreBlockSource, rehypeTitle } from './plugins'
import { cleanTocItems } from './utils'

export interface IDocsVeliteConfigOptions {
  docsPattern?: string
  packages?: string[]
  rehypePlugins?: Pluggable[]
  rehypePluginsBefore?: Pluggable[]
  remarkPlugins?: Pluggable[]
  remarkPluginsBefore?: Pluggable[]
}

const docSchema = () =>
  s
    .object({
      body: s.mdx(),
      component: s.boolean().default(false),
      content: s.markdown(),
      // Raw mdx source. Served as text/markdown by /llm/[...slug] so
      // "View as Markdown" returns the original document instead of
      // the compiled HTML stored in `content`.
      raw: s.raw(),
      description: s.string(),
      excerpt: s.excerpt(),
      links: s.object({ api: s.string().optional(), doc: s.string().optional() }).optional(),
      metadata: s.metadata(),
      order: s.number().optional(),
      section: s.string().optional(),
      title: s.string().max(99),
      toc: s.toc(),
    })
    .transform((data, { path, meta }) => {
      const _meta = meta as ZodMeta & { path: string }
      const slugTail = _meta.path
        .split('docs/')
        .pop()
        ?.replace(/\.mdx$/, '')
        .replace(/^\/+/, '')
      return {
        ...data,
        contentType: _meta.path.split('.').pop(),
        flattenedPath: _meta.path
          .split('/')
          .slice(-2, -1)
          .join('/')
          .replace(/\.mdx$/, ''),
        permalink: _meta.path.replace(/^.*docs\//, '').replace(/\.mdx$/, ''),
        slug: slugTail ? `docs/${slugTail}` : 'docs',
        sourceFileDir: _meta.path.split('/').slice(-3, -1).join('/'),
        sourceFileName: _meta.path.split('/').pop(),
        sourceFilePath: path,
        toc: cleanTocItems(data.toc),
      }
    })

const collectionKey = (pkg: string) => pkg.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

function buildDefaultRehypePlugins({
  rehypePlugins = [],
  rehypePluginsBefore = [],
}: Pick<IDocsVeliteConfigOptions, 'rehypePlugins' | 'rehypePluginsBefore'>): Pluggable[] {
  const prettyCodePlugin = [
    rehypePrettyCode,
    {
      getHighlighter,
      onVisitHighlightedLine(node: IUnistNode) {
        ;(node.properties?.className as string[]).push('line--highlighted')
      },
      onVisitHighlightedWord(node: IUnistNode) {
        if (node.properties) node.properties.className = ['word--highlighted']
      },
      onVisitLine(node: IUnistNode) {
        if (node.children?.length === 0) {
          node.children = [{ type: 'text', value: ' ' }]
        }
      },
      // Dual-theme output: rehype-pretty-code emits CSS custom properties
      // for both themes per token. The inline `color` defaults to the
      // dark palette; the CSS in apps/duck/app/globals.css swaps to the
      // light vars when `html` is not `.dark`.
      theme: {
        dark: 'catppuccin-mocha',
        light: 'github-light',
      },
      defaultTheme: 'dark',
    },
  ] as Pluggable

  const autolinkHeadingsPlugin = [
    rehypeAutolinkHeadings,
    { properties: { ariaLabel: 'Link to section', className: ['subheading-anchor'] } },
  ] as Pluggable

  return [
    ...rehypePluginsBefore,
    // 1) Structural transforms.
    rehypeSlug as Pluggable,
    rehypeMetadataPlugin,
    // 2) Syntax highlighting.
    prettyCodePlugin,
    // 3) Post-highlight enrichments and specialized transforms.
    rehypeTitle,
    rehypePreBlockSource,
    rehypeMermaid,
    rehypeNpmCommand,
    // 4) Heading links for docs navigation.
    autolinkHeadingsPlugin,
    ...rehypePlugins,
  ]
}

function buildDefaultRemarkPlugins({
  remarkPlugins = [],
  remarkPluginsBefore = [],
}: Pick<IDocsVeliteConfigOptions, 'remarkPlugins' | 'remarkPluginsBefore'>): Pluggable[] {
  return [...remarkPluginsBefore, remarkGfm, codeImport, ...remarkPlugins]
}

export function createDocsVeliteConfig({
  docsPattern = 'docs/**/*.mdx',
  packages = [],
  rehypePlugins = [],
  rehypePluginsBefore = [],
  remarkPlugins = [],
  remarkPluginsBefore = [],
}: IDocsVeliteConfigOptions = {}) {
  const collections: Record<string, { name: string; pattern: string; schema: ReturnType<typeof docSchema> }> = {
    docs: {
      name: 'Docs',
      pattern: docsPattern,
      schema: docSchema(),
    },
  }

  for (const pkg of packages) {
    const key = collectionKey(pkg)
    const typeName = key.charAt(0).toUpperCase() + key.slice(1)
    collections[key] = {
      name: typeName,
      pattern: `docs/${pkg}/**/*.mdx`,
      schema: docSchema(),
    }
  }

  return defineConfig({
    collections,
    mdx: {
      rehypePlugins: buildDefaultRehypePlugins({ rehypePlugins, rehypePluginsBefore }),
      remarkPlugins: buildDefaultRemarkPlugins({ remarkPlugins, remarkPluginsBefore }),
    },
  }) as unknown as ReturnType<typeof defineConfig>
}

export const docsVeliteConfig = createDocsVeliteConfig()
