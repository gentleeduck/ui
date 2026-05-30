/**
 * SECURITY: Strip script-bearing constructs from an SVG string before it is
 * passed to `dangerouslySetInnerHTML` (e.g. via `<PreviewPanelDialog
 * unsafeHtml={…}/>`).
 *
 * This is an allowlist-leaning scrubber that closes the documented XSS
 * vectors. It assumes the caller produced the SVG from a Mermaid render (or
 * equivalent server-side renderer) and provides defense-in-depth against:
 *
 *   - `<script>` tags (including nested / lazy variants)
 *   - `<foreignObject>` (HTML-in-SVG escape hatch)
 *   - `<iframe>` / `<embed>` / `<object>` (even when emitted outside foreignObject)
 *   - SMIL animation elements (`<set>`, `<animate>`, `<animateTransform>`,
 *     `<animateMotion>`) that can rewrite `on*` / `href` at runtime
 *   - `on*` event-handler attributes
 *   - `href` / `xlink:href` with `javascript:` or `data:text/html` schemes,
 *     including the unquoted attribute form (`href=javascript:alert(1)`)
 *   - CSS `style="…url(javascript:…)"` / `expression(…)` payloads
 *
 * Output that doesn't start with `<svg` after stripping is rejected — the
 * caller gets an empty string and the renderer falls back to its placeholder.
 *
 * If you need stronger guarantees (untrusted SVG from third parties), pipe
 * the result through DOMPurify with `USE_PROFILES: { svg: true, svgFilters: true }`.
 */

// Elements that are dropped wholesale (tag + content). Each entry matches
// the open/close pair OR the self-closing form, case-insensitively.
const FORBIDDEN_ELEMENTS = [
  'script',
  'foreignObject',
  'foreignobject',
  'iframe',
  'embed',
  'object',
  'set',
  'animate',
  'animateTransform',
  'animatetransform',
  'animateMotion',
  'animatemotion',
] as const

// Strip on* event handlers regardless of casing or quoting style.
const EVENT_HANDLER_RE = /\s+on[a-z][a-z0-9_-]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi

// `javascript:` / `data:text/html` URIs inside href / xlink:href. Covers
// double-quoted, single-quoted, AND unquoted attribute values. The
// `[\s\S]` class works because the attribute value cannot contain a literal
// `>` without being quoted (HTML spec).
// Note: each branch is the full scheme prefix INCLUDING its trailing colon —
// `data:text/html` is the entire dangerous scheme (no second colon follows).
const JAVASCRIPT_URI_QUOTED_RE =
  /(\s(?:xlink:href|href)\s*=\s*)(["'])\s*(?:javascript\s*:|vbscript\s*:|data\s*:\s*text\/html)[^"']*\2/gi
const JAVASCRIPT_URI_UNQUOTED_RE =
  /(\s(?:xlink:href|href)\s*=\s*)(?!["'])\s*(?:javascript\s*:|vbscript\s*:|data\s*:\s*text\/html)[^\s>]*/gi

// CSS payloads inside `style="…"` attributes. We don't try to parse CSS;
// we just neutralise the attribute when it contains a known sink.
const STYLE_ATTR_RE = /\s+style\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi
const CSS_SINK_RE = /(?:javascript\s*:|vbscript\s*:|expression\s*\(|url\s*\(\s*["']?\s*(?:javascript|vbscript)\s*:)/i

function buildElementRegexes(tag: string) {
  // Block element with content (greedy until matching close, but anchored so
  // nested same-tag instances are handled by the repeat-until-idempotent loop
  // in stripForbiddenElements).
  const block = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, 'gi')
  // Self-closing form.
  const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/>`, 'gi')
  // Orphaned open tag with no close (safety net so we don't leave a
  // dangling `<script ...>` in the output).
  const orphanOpen = new RegExp(`<${tag}\\b[^>]*>`, 'gi')
  // Orphaned close tag.
  const orphanClose = new RegExp(`<\\/${tag}\\s*>`, 'gi')
  return { block, selfClosing, orphanOpen, orphanClose }
}

const ELEMENT_REGEXES = FORBIDDEN_ELEMENTS.map((tag) => ({
  tag,
  ...buildElementRegexes(tag),
}))

function stripForbiddenElements(input: string): string {
  let prev: string
  let next = input
  // Loop until idempotent — handles nested `<script>a<script>b</script>c</script>`
  // and other adversarial nesting.
  let guard = 0
  do {
    prev = next
    for (const { block, selfClosing } of ELEMENT_REGEXES) {
      next = next.replace(block, '').replace(selfClosing, '')
    }
    guard++
  } while (next !== prev && guard < 16)

  // Final pass: drop any orphaned open/close tags the recursion left behind.
  for (const { orphanOpen, orphanClose } of ELEMENT_REGEXES) {
    next = next.replace(orphanOpen, '').replace(orphanClose, '')
  }
  return next
}

function stripDangerousStyles(input: string): string {
  return input.replace(STYLE_ATTR_RE, (match, rawValue: string) => {
    // Strip outer quotes for inspection.
    const unquoted = rawValue.startsWith('"') || rawValue.startsWith("'") ? rawValue.slice(1, -1) : rawValue
    return CSS_SINK_RE.test(unquoted) ? '' : match
  })
}

export function sanitizeSvg(svg: string): string {
  if (!svg) return ''

  let scrubbed = stripForbiddenElements(svg)
    .replace(EVENT_HANDLER_RE, '')
    .replace(JAVASCRIPT_URI_QUOTED_RE, '$1$2#$2')
    .replace(JAVASCRIPT_URI_UNQUOTED_RE, '$1#')

  scrubbed = stripDangerousStyles(scrubbed)

  // Defense-in-depth: ensure the root is still an <svg>. If the scrub
  // mangled the structure or the input wasn't an SVG to begin with, drop it.
  const leading = scrubbed.trimStart()
  if (!leading.toLowerCase().startsWith('<svg')) return ''

  return leading
}
