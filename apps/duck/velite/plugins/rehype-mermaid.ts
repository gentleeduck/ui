import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Nodes } from 'hast'
import { toString as hastToString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import type { IUnistNode, IUnistTree } from '../types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isMermaidCode(node: IUnistNode): boolean {
  const codeChild = node.children?.[0]
  if (!codeChild || codeChild.type !== 'element' || codeChild.tagName !== 'code') return false
  const dataLang = codeChild.properties?.['data-language']
  const classes = codeChild.properties?.className
  return dataLang === 'mermaid' || (Array.isArray(classes) && classes.includes('language-mermaid'))
}

interface IMdxJsxAttribute {
  type: string
  name: string
  value: string | { type: string; value: string } | null | undefined
}

interface IMdxJsxFlowElement extends IUnistNode {
  type: 'mdxJsxFlowElement'
  name?: string
  attributes?: IMdxJsxAttribute[]
}

/** Safely extract a string value from an mdxJsxAttribute. */
function extractAttrValue(attr: IMdxJsxAttribute | undefined): string | null {
  if (!attr?.value) return null
  if (typeof attr.value === 'string') return attr.value
  if (attr.value?.type === 'mdxJsxAttributeValueExpression') {
    try {
      // eslint-disable-next-line no-new-func
      return new Function(`return ${attr.value.value}`)()
    } catch {
      return null
    }
  }
  return null
}

/** Create an mdxJsxAttribute with an expression value (properly escaped). */
function makeJsxStringAttr(name: string, value: string) {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(value),
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value, raw: JSON.stringify(value) },
            },
          ],
          comments: [],
        },
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Headless Chromium renderer - produces pixel-perfect SVGs using a real browser
// ---------------------------------------------------------------------------

/** Find the system Chromium / Chrome binary. */
function findChromium(): string {
  // 1) Honor explicit env var
  const envPath = process.env['PUPPETEER_EXECUTABLE_PATH'] || process.env['CHROME_BIN'] || process.env['CHROMIUM_BIN']
  if (envPath && existsSync(envPath)) return envPath

  // 2) Try PATH lookups
  for (const bin of ['chromium', 'google-chrome-stable', 'google-chrome', 'chromium-browser']) {
    try {
      const p = execSync(`which ${bin}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
      if (p && existsSync(p)) {
        // Verify the resolved target exists - homebrew shims can point to deleted .app bundles
        try {
          execSync(`"${p}" --version`, { stdio: ['pipe', 'pipe', 'pipe'], timeout: 3000 })
          return p
        } catch {
          /* stale shim, try next */
        }
      }
    } catch {
      /* next */
    }
  }

  // 3) macOS .app bundles
  const macPaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ]
  for (const p of macPaths) {
    if (existsSync(p)) return p
  }

  throw new Error('[rehype-mermaid] No Chromium/Chrome binary found. Install chromium or google-chrome.')
}

let chromiumPath: string | null = null

function resolveMermaidPath(): string {
  try {
    const req = createRequire(import.meta.url)
    const pkgPath = req.resolve('mermaid/package.json')
    return join(pkgPath, '..', 'dist', 'mermaid.esm.min.mjs')
  } catch {
    return ''
  }
}

function buildRenderHtml(diagrams: { source: string; id: string; theme: 'default' | 'dark' }[]): string {
  const localMermaid = resolveMermaidPath()
  const mermaidSrc = localMermaid
    ? `file://${localMermaid}`
    : 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
  return `<!DOCTYPE html><html><head>
<script type="module">
import mermaid from '${mermaidSrc}';
const diagrams = ${JSON.stringify(diagrams)};
const results = {};
for (const d of diagrams) {
  try {
    mermaid.initialize({ startOnLoad: false, theme: d.theme, fontFamily: 'sans-serif', securityLevel: 'loose' });
    const { svg } = await mermaid.render(d.id, d.source);
    results[d.id] = svg;
  } catch (e) {
    results[d.id] = '';
  }
}
document.title = 'DONE:' + btoa(unescape(encodeURIComponent(JSON.stringify(results))));
</script></head><body></body></html>`
}

async function renderSvgBatch(
  diagrams: { source: string; id: string; theme: 'default' | 'dark' }[],
): Promise<Record<string, string>> {
  if (!chromiumPath) chromiumPath = findChromium()

  const dir = mkdtempSync(join(tmpdir(), 'mermaid-'))
  try {
    const htmlFile = join(dir, 'render.html')
    writeFileSync(htmlFile, buildRenderHtml(diagrams))

    const output = execSync(
      `"${chromiumPath}" --headless --disable-gpu --no-sandbox --allow-file-access-from-files --virtual-time-budget=15000 --dump-dom "file://${htmlFile}"`,
      { timeout: 60000, encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] },
    )

    const titleMatch = output.match(/<title>DONE:([\s\S]*?)<\/title>/)
    if (!titleMatch) throw new Error('Chromium did not produce output')

    const json = decodeURIComponent(escape(Buffer.from(titleMatch[1] ?? '', 'base64').toString('binary')))
    const results: Record<string, string> = JSON.parse(json)

    // Make SVGs responsive
    for (const [id, svg] of Object.entries(results)) {
      if (svg) {
        results[id] = svg.replace(/\bwidth="[\d.]+"/, 'width="100%"')
      }
    }

    return results
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export function rehypeMermaid() {
  return async (tree: IUnistTree) => {
    // Two kinds of entries: code-fence <pre> blocks and <MermaidDiagram> JSX elements
    type CodeFenceEntry = { kind: 'fence'; node: IUnistNode; pre: IUnistNode; source: string }
    type JsxEntry = { kind: 'jsx'; node: IUnistNode; source: string }
    type Entry = CodeFenceEntry | JsxEntry

    const entries: Entry[] = []

    visit(tree, (node: IUnistNode) => {
      // 1. <MermaidDiagram chart={`...`} /> JSX elements
      const mdxNode = node as IMdxJsxFlowElement
      if (mdxNode.type === 'mdxJsxFlowElement' && mdxNode.name === 'MermaidDiagram') {
        const attrs = mdxNode.attributes || []
        const chartAttr = attrs.find((a) => a.type === 'mdxJsxAttribute' && a.name === 'chart')
        const chart = extractAttrValue(chartAttr)
        if (chart) {
          entries.push({ kind: 'jsx', node, source: chart.trim() })
        }
        return
      }

      // 2. rehypePrettyCode wrapper div (dual themes, two pre elements)
      if (
        node.type === 'element' &&
        node.tagName === 'div' &&
        node.properties &&
        'data-dmc-fragment' in node.properties
      ) {
        const pres = (node.children || []).filter((c: IUnistNode) => c.type === 'element' && c.tagName === 'pre')
        const mPre = pres.find((c: IUnistNode) => isMermaidCode(c))
        if (!mPre) return
        const src = (mPre.properties?.__rawString__ as string) || hastToString(mPre as Nodes)
        if (src) entries.push({ kind: 'fence', node, pre: mPre, source: src.trim() })
        return
      }

      // 3. Standalone <pre>
      if (node.type === 'element' && node.tagName === 'pre' && isMermaidCode(node)) {
        const src = (node.properties?.__rawString__ as string) || hastToString(node as Nodes)
        if (src) entries.push({ kind: 'fence', node, pre: node, source: src.trim() })
      }
    })

    if (entries.length === 0) return

    // Build all diagrams in a single Chromium invocation (both themes)
    const diagrams: { source: string; id: string; theme: 'default' | 'dark' }[] = []
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (!entry) continue
      const src = entry.source
      diagrams.push({ source: src, id: `ml${i}`, theme: 'default' })
      diagrams.push({ source: src, id: `md${i}`, theme: 'dark' })
    }

    let results: Record<string, string> = {}
    try {
      results = await renderSvgBatch(diagrams)
    } catch (err) {
      console.warn(`[rehype-mermaid] Build-time render failed:`, (err as Error).message)
      return
    }

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (!entry) continue
      const lightSvg = results[`ml${i}`] || ''
      const darkSvg = results[`md${i}`] || ''

      if (!lightSvg && !darkSvg) {
        console.warn(`[rehype-mermaid] No SVG produced for diagram ${i}`)
        continue
      }

      if (entry.kind === 'jsx') {
        const jsxNode = entry.node as IMdxJsxFlowElement
        const attrs = jsxNode.attributes || []
        if (lightSvg) attrs.push(makeJsxStringAttr('lightSvg', lightSvg))
        if (darkSvg) attrs.push(makeJsxStringAttr('darkSvg', darkSvg))
        jsxNode.attributes = attrs
      } else {
        if (entry.node !== entry.pre) {
          entry.node.children = [entry.pre]
        }
        entry.pre.properties = {
          ...entry.pre.properties,
          __isMermaid__: true,
          __mermaidLightSvg__: lightSvg,
          __mermaidDarkSvg__: darkSvg,
        }
      }
    }
  }
}
