import { defineConfig, s } from '@gentleduck/md'
// import { getHighlighter } from '@shikijs/compat'
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// // @ts-expect-error -- rehype-pretty-code has no published type declarations
// import rehypePrettyCode from 'rehype-pretty-code'
// import rehypeSlug from 'rehype-slug'
// import { codeImport } from 'remark-code-import'
// import remarkGfm from 'remark-gfm'
import type { Pluggable } from 'unified'
import {
  rehypeComponent,
  //   rehypeMermaid,
  //   rehypeMetadataPlugin,
  //   rehypeNpmCommand,
  //   rehypePreBlockSource,
  //   rehypeTitle,
} from './plugins'
// import type { IUnistNode } from './types'
import { cleanTocItems } from './utils'

export interface IDocsVeliteConfigOptions {
  docsPattern?: string
  packages?: string[]
  rehypePlugins?: Pluggable[]
  rehypePluginsBefore?: Pluggable[]
  remarkPlugins?: Pluggable[]
  remarkPluginsBefore?: Pluggable[]
}

// Note: `component`, the only plain schema field nothing reads, has been
// removed below. The other emitted-but-unused fields (`excerpt`,
// `metadata`, `contentType`, `flattenedPath`, `sourceFile{Dir,Name,Path}`)
// are derived by the dmc engine itself, not by this schema, so dropping
// them here has no runtime effect; they are tiny per record anyway
// (~300 bytes total). The bulk of `.gentleduck/` is `body` (the compiled
// MDX runtime, rendered by `<Mdx>`) plus `content`/`raw` (the mdx source,
// used by the "copy page" button and /llm/[...slug]).
const docSchema = () =>
  s
    .object({
      body: s.mdx(),
      content: s.markdown(),
      // Raw mdx source. Served as text/markdown by /llm/[...slug] so
      // "View as Markdown" returns the original document instead of
      // the compiled HTML stored in `content`.
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

  // `name` doubles as the on-disk filename (`<name>.json`) and the
  // `index.js` export identifier. Keep it in camelCase so the
  // search-index builder + every `import { duckUi } from '.gentleduck'`
  // call-site resolves without renames.
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
    // Single `content` block — drives both `.md` and `.mdx`. Native dmc
    // transformers (mermaid, pretty-code, npm-command, autolink-headings,
    // …) handle the velite-era plugin chain natively; pass extra rehype/
    // remark plugins here only when something genuinely isn't covered.
    content: {
      gfm: true,
      remarkPlugins,
      rehypePlugins,
      // `rehypeComponent` runs at the source-MDX level (mdast, before
      // dmc parses) so it can inject fenced code blocks as JSX
      // children. dmc's native PrettyCode then highlights every
      // injected block as part of the normal compile pipeline — no
      // runtime compile, no extra fetch.
      preMdxPlugins: [rehypeComponent],
      mermaid: {
        // Single flat object — dmc render knobs (theme, responsiveSvg, …)
        // sit alongside mermaid.initialize() pass-through (themeVariables,
        // flowchart, look, layout, …). dmc defaults: htmlLabels:false +
        // centered labels. Per-mode theme map → lightSvg + darkSvg.
        theme: { light: 'default', dark: 'dark' },
        // Anything else here goes straight to mermaid.initialize().
        // themeVariables: { primaryColor: '#1e1e2e', fontFamily: 'Geist' },
        // flowchart: { curve: 'basis', nodeSpacing: 80 },
      },
      prettyCode: {
        // Bundled syntect themes only. Available light names:
        // `Catppuccin Latte`, `gruvbox-light`, `OneHalfLight`,
        // `Solarized (light)`, `Coldark-Cold`. `github-light` is NOT
        // bundled — picking it leaves `--dmc-light` undefined and the
        // page falls back to the default-mode color.
        theme: { light: 'Catppuccin Latte', dark: 'Catppuccin Mocha' },
        defaultMode: 'dark',
        // 'css-vars' renders each code block ONCE (one `<pre>`, every token
        // carries `--dmc-light` / `--dmc-dark` and reads `var(--dmc-<mode>)`)
        // instead of the default 'split' which emits a full second `<pre>`
        // per fence for the dark theme. Roughly halves the highlighted
        // markup; the consumer CSS already defines the `--dmc-{light,dark}`
        // vars (see the theme note above).
        multiThemeStrategy: 'css-vars',
        // Outer `[data-dmc-fragment]` wrapper owns the surface color via
        // consumer CSS — keep the theme bg out of the inline `<pre>` style.
        includePreBackground: false,
      },
    },
  })
}

export const docsVeliteConfig = createDocsVeliteConfig()
