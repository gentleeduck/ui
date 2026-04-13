import type { Diff } from '~/utils/diff-format'

// -- Language detection --

/** Map file extensions to shiki language identifiers for syntax highlighting. */
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

// -- Singleton highlighter (lazy-initialized, loads languages on demand) --

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

/**
 * Lazy-initialize and cache a shiki highlighter singleton.
 * Uses a promise lock (_init_promise) to prevent concurrent initialization.
 * Loads additional languages on demand via loadLanguage().
 */
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

// -- Token types --

type SyntaxToken = {
  content: string
  color: string
}

// -- Core tokenization --

/**
 * Tokenize source code into colored token arrays using shiki.
 * Returns a 2D array (line -> token[]) or null on failure.
 */
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

// -- Build per-line token lookup (1-based line numbers) --

/** Convert tokenized output into a Map keyed by 1-based line numbers for O(1) lookup. */
function buildLineTokenMap(tokenLines: SyntaxToken[][]): Map<number, SyntaxToken[]> {
  const map = new Map<number, SyntaxToken[]>()
  for (const [index, line] of tokenLines.entries()) {
    map.set(index + 1, line)
  }
  return map
}

// -- Public API --

/**
 * Pre-warm the shiki highlighter for a given file type.
 * Call this early (fire-and-forget) so tokenization is instant later.
 */
export async function warmHighlighter(filePath: string): Promise<void> {
  const lang = detectLanguage(filePath)
  if (!lang) return
  await getHighlighter(lang)
}

/**
 * Apply syntax highlighting colors to Diff.DisplayLine[].
 * Tokenizes the full code with shiki, then overlays syntax colors
 * onto existing diff segments. Word-level diff highlights are preserved.
 */
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

/**
 * Overlay syntax colors from shiki tokens onto existing diff segments.
 * Word-level diff highlights (seg.highlight === true) pass through unchanged.
 * Non-highlighted segments get split at syntax token color boundaries.
 */
function overlaySyntaxOnSegments(diffSegments: Diff.Segment[], syntaxTokens: SyntaxToken[]): Diff.Segment[] {
  // Step 1: Reconstruct the full line text from diff segments so we can
  // build a character-level color map from the shiki tokens.
  const lineText = diffSegments.map((s) => s.text).join('')

  // Build a per-character color array from syntax tokens.
  // Each character gets the hex color from its corresponding shiki token.
  const charColors: string[] = new Array(lineText.length).fill(DEFAULT_COLOR)
  let pos = 0
  for (const token of syntaxTokens) {
    for (let i = 0; i < token.content.length && pos < charColors.length; i++) {
      charColors[pos] = token.color
      pos++
    }
  }

  // Step 2: Walk each diff segment. For highlighted segments (word-level
  // diff markers), preserve them as-is -- diff highlighting takes priority
  // over syntax colors. For non-highlighted segments, split at color
  // boundaries to apply per-character syntax coloring.
  const result: Diff.Segment[] = []
  let charOffset = 0

  for (const seg of diffSegments) {
    if (seg.highlight) {
      // Word-level diff highlight takes priority -- keep as-is
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

    // Emit final run
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
