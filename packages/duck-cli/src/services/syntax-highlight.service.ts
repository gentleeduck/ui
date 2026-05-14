import type { Diff } from '~/utils/diff-format'

const EXT_TO_LANG: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.js': 'javascript',
  '.jsx': 'jsx',
  '.css': 'css',
  '.json': 'json',
  '.html': 'html',
  '.md': 'markdown',
  '.mdx': 'mdx',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.svg': 'xml',
}

export function detectLanguage(filePath: string): string | null {
  const dotIndex = filePath.lastIndexOf('.')
  if (dotIndex === -1) return null
  const ext = filePath.slice(dotIndex).toLowerCase()
  return EXT_TO_LANG[ext] ?? null
}

type ShikiHighlighter = {
  codeToTokensBase: (
    code: string,
    opts: { lang: string; theme: string },
  ) => Promise<{ content: string; color?: string }[][]>
  loadLanguage: (lang: string) => Promise<void>
}

const SHIKI_THEME = 'tokyo-night'
const DEFAULT_COLOR = '#d4d4d4'

let _highlighter: ShikiHighlighter | null = null
const _loaded_langs = new Set<string>()
let _init_promise: Promise<ShikiHighlighter> | null = null

/** `_init_promise` serves as a lock so concurrent first-callers share a single `createHighlighter` call. */
async function getHighlighter(lang: string): Promise<ShikiHighlighter> {
  if (_highlighter && _loaded_langs.has(lang)) {
    return _highlighter
  }

  if (!_highlighter) {
    if (_init_promise) {
      _highlighter = await _init_promise
    } else {
      _init_promise = (async () => {
        const { createHighlighter } = await import('shiki')
        const h = await createHighlighter({
          themes: [SHIKI_THEME],
          langs: [lang],
        })
        _loaded_langs.add(lang)
        return h as unknown as ShikiHighlighter
      })()
      _highlighter = await _init_promise
      _init_promise = null
      return _highlighter
    }
  }

  if (!_loaded_langs.has(lang)) {
    await _highlighter.loadLanguage(lang as Parameters<ShikiHighlighter['loadLanguage']>[0])
    _loaded_langs.add(lang)
  }

  return _highlighter
}

type SyntaxToken = {
  content: string
  color: string
}

async function tokenizeCode(code: string, lang: string): Promise<SyntaxToken[][] | null> {
  try {
    const highlighter = await getHighlighter(lang)
    const tokenLines = await highlighter.codeToTokensBase(code, {
      lang,
      theme: SHIKI_THEME,
    })
    return tokenLines.map((line) =>
      line.map((token) => ({
        content: token.content,
        color: token.color ?? DEFAULT_COLOR,
      })),
    )
  } catch {
    return null
  }
}

/** Keys are 1-based to match diff line numbers, not the array index. */
function buildLineTokenMap(tokenLines: SyntaxToken[][]): Map<number, SyntaxToken[]> {
  const map = new Map<number, SyntaxToken[]>()
  for (const [index, line] of tokenLines.entries()) {
    map.set(index + 1, line)
  }
  return map
}

/** Fire-and-forget on file open so the first diff render does not block on shiki init. */
export async function warmHighlighter(filePath: string): Promise<void> {
  const lang = detectLanguage(filePath)
  if (!lang) return
  await getHighlighter(lang)
}

/** Overlays shiki colors on top of diff segments; word-level diff highlights win over syntax colors. */
export async function highlightDiffLines(
  lines: Diff.DisplayLine[],
  fullCode: string,
  filePath: string,
): Promise<Diff.DisplayLine[]> {
  const lang = detectLanguage(filePath)
  if (!lang) return lines

  const tokenLines = await tokenizeCode(fullCode, lang)
  if (!tokenLines) return lines

  const tokenMap = buildLineTokenMap(tokenLines)
  return lines.map((line) => applyTokensToLine(line, tokenMap))
}

function applyTokensToLine(line: Diff.DisplayLine, tokenMap: Map<number, SyntaxToken[]>): Diff.DisplayLine {
  if (line.type === 'hunk-header' || line.type === 'file-header') {
    return line
  }

  const lineNum = line.oldLineNum ?? line.newLineNum
  if (lineNum === null) return line

  const tokens = tokenMap.get(lineNum)
  if (!tokens || tokens.length === 0) return line

  const newSegments = overlaySyntaxOnSegments(line.segments, tokens)
  return { ...line, segments: newSegments }
}

function overlaySyntaxOnSegments(diffSegments: Diff.Segment[], syntaxTokens: SyntaxToken[]): Diff.Segment[] {
  // Build a per-character color map: shiki returns variable-length tokens but diff segments
  // have their own boundaries, so we go down to char granularity to splice cleanly.
  const lineText = diffSegments.map((s) => s.text).join('')
  const charColors: string[] = new Array(lineText.length).fill(DEFAULT_COLOR)
  let pos = 0
  for (const token of syntaxTokens) {
    for (let i = 0; i < token.content.length && pos < charColors.length; i++) {
      charColors[pos] = token.color
      pos++
    }
  }

  const result: Diff.Segment[] = []
  let charOffset = 0

  for (const seg of diffSegments) {
    if (seg.highlight) {
      result.push(seg)
      charOffset += seg.text.length
      continue
    }

    let runStart = 0
    let currentColor = charColors[charOffset] ?? DEFAULT_COLOR

    for (let i = 0; i < seg.text.length; i++) {
      const c = charColors[charOffset + i] ?? DEFAULT_COLOR
      if (c !== currentColor) {
        if (i > runStart) {
          result.push({
            text: seg.text.slice(runStart, i),
            highlight: false,
            color: currentColor,
          })
        }
        runStart = i
        currentColor = c
      }
    }

    if (runStart < seg.text.length) {
      result.push({
        text: seg.text.slice(runStart),
        highlight: false,
        color: currentColor,
      })
    }

    charOffset += seg.text.length
  }

  return result
}
