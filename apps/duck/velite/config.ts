import { defineConfig, s } from '@gentleduck/md'
import type { Pluggable } from 'unified'
import { rehypeComponent } from './plugins'
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
      content: s.markdown(),
      // Served as text/markdown by /llm/[...slug] so "View as Markdown"
      // returns the original source, not the compiled HTML in `content`.
      raw: s.raw(),
      description: s.string(),
      links: s.object({ api: s.string().optional(), doc: s.string().optional() }).optional(),
      order: s.number().optional(),
      section: s.string().optional(),
      title: s.string().max(99),
      toc: s.toc(),
    })
    .transform((data, { meta }) => {
      const _meta = meta
      const slugTail = _meta.path
        .split('docs/')
        .pop()
        ?.replace(/\.mdx$/, '')
        .replace(/^\/+/, '')
        // `<dir>/index.mdx` routes as `/<dir>` in Next; drop the trailing
        // `/index` segment from the canonical slug so consumers building
        // URLs off this field land on a valid route.
        .replace(/\/index$/, '')
      return {
        ...data,
        permalink: _meta.path.replace(/^.*docs\//, '').replace(/\.mdx$/, ''),
        slug: slugTail ? `docs/${slugTail}` : 'docs',
        toc: cleanTocItems(data.toc),
      }
    })

const collectionKey = (pkg: string) => pkg.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

export function createDocsVeliteConfig({
  docsPattern = 'docs/**/*.mdx',
  packages = [],
  rehypePlugins,
  remarkPlugins,
}: IDocsVeliteConfigOptions = {}) {
  const collections: Record<string, { name: string; pattern: string; schema: ReturnType<typeof docSchema> }> = {
    docs: {
      name: 'docs',
      pattern: docsPattern,
      schema: docSchema(),
    },
  }

  // `name` is both the on-disk filename (`<name>.json`) and the index.js
  // export identifier — keep camelCase so `import { duckUi }` resolves.
  for (const pkg of packages) {
    const key = collectionKey(pkg)
    collections[key] = {
      name: key,
      pattern: `docs/${pkg}/**/*.mdx`,
      schema: docSchema(),
    }
  }

  return defineConfig({
    collections,
    content: {
      gfm: true,
      remarkPlugins,
      rehypePlugins,
      // Runs at mdast level (before dmc parse) so injected fenced code
      // blocks ride dmc's native PrettyCode pass — no runtime compile.
      preMdxPlugins: [rehypeComponent],
      mermaid: {
        theme: { light: 'default', dark: 'dark' },
      },
      prettyCode: {
        // Bundled syntect themes only. `github-light` is NOT bundled — picking
        // it leaves `--dmc-light` undefined and pages fall back to default mode.
        theme: { light: 'Catppuccin Latte', dark: 'Catppuccin Mocha' },
        defaultMode: 'dark',
        // 'css-vars' emits one `<pre>` per fence with `--dmc-{light,dark}`
        // tokens; default 'split' would emit a second `<pre>` per theme.
        multiThemeStrategy: 'css-vars',
        // Outer `[data-dmc-fragment]` wrapper owns surface color via consumer CSS.
        includePreBackground: false,
      },
    },
  })
}

export const docsVeliteConfig = createDocsVeliteConfig()
