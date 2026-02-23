import { writeFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const { JSDOM } = require('jsdom')
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="d"></div></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost',
})
const { window } = dom

const globals = {
  window,
  document: window.document,
  navigator: window.navigator,
  DOMParser: window.DOMParser,
  XMLSerializer: window.XMLSerializer,
  HTMLElement: window.HTMLElement,
  SVGElement: window.SVGElement,
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame: clearTimeout,
}
for (const [key, value] of Object.entries(globals)) {
  Object.defineProperty(globalThis, key, { value, writable: true, configurable: true })
}
try {
  const svgTags = [
    'svg',
    'g',
    'text',
    'tspan',
    'rect',
    'circle',
    'path',
    'line',
    'polygon',
    'polyline',
    'foreignObject',
  ]
  const patched = new Set()
  for (const tag of svgTags) {
    const el = window.document.createElementNS('http://www.w3.org/2000/svg', tag)
    let proto = Object.getPrototypeOf(el)
    while (proto && proto !== Object.prototype && !patched.has(proto)) {
      patched.add(proto)
      if (!proto.getBBox)
        proto.getBBox = function () {
          const t = this.textContent || ''
          const lines = (t.match(/\n/g) || []).length + 1
          const longestLine = t.split('\n').reduce((max, l) => Math.max(max, l.length), 0)
          return { x: 0, y: 0, width: Math.max(longestLine * 8, 50), height: Math.max(lines * 20, 20) }
        }
      if (!proto.getComputedTextLength)
        proto.getComputedTextLength = function () {
          return (this.textContent || '').length * 8
        }
      if (!proto.getTotalLength)
        proto.getTotalLength = function () {
          return 100
        }
      if (!proto.getPointAtLength)
        proto.getPointAtLength = function () {
          return { x: 0, y: 0 }
        }
      proto = Object.getPrototypeOf(proto)
    }
  }
} catch (e) {}

const mermaid = (await import('mermaid')).default

// KEY: use htmlLabels: false so mermaid uses SVG <text> elements, not foreignObject
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  fontFamily: 'inherit',
  securityLevel: 'loose',
  flowchart: { htmlLabels: false },
})

const { svg } = await mermaid.render(
  't1',
  `flowchart LR
    A["duck-gen"] --> B["api-routes.d.ts"]
    A --> C["messages.d.ts"]
    B --> D["ApiRoutes"]
    C --> E["DuckgenI18n"]`,
)

// Check: should have <text> elements now, NOT foreignObject with content
const foCount = (svg.match(/<foreignObject/g) || []).length
const textCount = (svg.match(/<text /g) || []).length
console.log('foreignObject count:', foCount)
console.log('<text> count:', textCount)

// Check viewBox
const vb = svg.match(/viewBox="([^"]*)"/)?.[1]
console.log('viewBox:', vb)

// Check SVG opening
console.log('SVG tag:', svg.match(/<svg[^>]*>/)?.[0]?.substring(0, 200))

// Write to check visually
writeFileSync(
  '/tmp/mermaid-svgtext.html',
  `<!DOCTYPE html><html><body style="background:#1e1e1e;padding:40px">${svg}</body></html>`,
)
writeFileSync('/tmp/mermaid-svgtext.svg', svg)
console.log('\nWritten to /tmp/mermaid-svgtext.html and /tmp/mermaid-svgtext.svg')
