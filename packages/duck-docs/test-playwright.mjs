import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

// Load mermaid from CDN in a real browser page
await page.setContent(
  `<!DOCTYPE html><html><body><div id="output"></div>
<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
window.__mermaid = mermaid;
window.__ready = true;
</script></body></html>`,
  { waitUntil: 'networkidle' },
)

// Wait for mermaid to load
await page.waitForFunction(() => window.__ready, { timeout: 15000 })

// Render a diagram
const svg = await page.evaluate(
  async ({ source, theme, id }) => {
    const mermaid = window.__mermaid
    mermaid.initialize({ startOnLoad: false, theme, fontFamily: 'sans-serif', securityLevel: 'loose' })
    const { svg } = await mermaid.render(id, source)
    return svg
  },
  {
    source: `flowchart LR
    A["duck-gen"] --> B["api-routes.d.ts"]
    A --> C["messages.d.ts"]
    B --> D["ApiRoutes\\nRouteReq\\nRouteRes"]
    C --> E["DuckgenMessageKey\\nDuckgenI18n"]`,
    theme: 'dark',
    id: 'test1',
  },
)

await browser.close()

const vb = svg.match(/viewBox="([^"]*)"/)?.[1]
const foCount = (svg.match(/<foreignObject/g) || []).length
console.log('viewBox:', vb)
console.log('foreignObject count:', foCount)
console.log('SVG length:', svg.length)
console.log('Has text labels:', svg.includes('duck-gen'))

import { writeFileSync } from 'fs'

writeFileSync(
  '/tmp/mermaid-playwright.html',
  `<!DOCTYPE html><html><body style="background:#1e1e1e;padding:40px">${svg}</body></html>`,
)
console.log('\nWritten to /tmp/mermaid-playwright.html')
