import type { DiffDisplayLine, DiffSegment } from '~/utils/diff-format'

// -- Language detection --

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

export function detect_language(file_path: string): string | null {
  const dot_index = file_path.lastIndexOf('.')
  if (dot_index === -1) return null
  const ext = file_path.slice(dot_index).toLowerCase()
  return EXT_TO_LANG[ext] ?? null
}

// -- Singleton highlighter --

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
let _loaded_langs = new Set<string>()
let _init_promise: Promise<ShikiHighlighter> | null = null

async function get_highlighter(lang: string): Promise<ShikiHighlighter> {
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

async function tokenize_code(code: string, lang: string): Promise<SyntaxToken[][] | null> {
  try {
    const highlighter = await get_highlighter(lang)
    const token_lines = await highlighter.codeToTokensBase(code, {
      lang,
      theme: SHIKI_THEME,
    })
    return token_lines.map((line) =>
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

function build_line_token_map(token_lines: SyntaxToken[][]): Map<number, SyntaxToken[]> {
  const map = new Map<number, SyntaxToken[]>()
  for (let i = 0; i < token_lines.length; i++) {
    map.set(i + 1, token_lines[i])
  }
  return map
}

// -- Public API --

/**
 * Pre-warm the shiki highlighter for a given file type.
 * Call this early (fire-and-forget) so tokenization is instant later.
 */
export async function warm_highlighter(file_path: string): Promise<void> {
  const lang = detect_language(file_path)
  if (!lang) return
  await get_highlighter(lang)
}

/**
 * Apply syntax highlighting colors to DiffDisplayLine[].
 * Tokenizes the full code with shiki, then overlays syntax colors
 * onto existing diff segments. Word-level diff highlights are preserved.
 */
export async function highlight_diff_lines(
  lines: DiffDisplayLine[],
  full_code: string,
  file_path: string,
): Promise<DiffDisplayLine[]> {
  const lang = detect_language(file_path)
  if (!lang) return lines

  const token_lines = await tokenize_code(full_code, lang)
  if (!token_lines) return lines

  const token_map = build_line_token_map(token_lines)
  return lines.map((line) => apply_tokens_to_line(line, token_map))
}

function apply_tokens_to_line(
  line: DiffDisplayLine,
  token_map: Map<number, SyntaxToken[]>,
): DiffDisplayLine {
  if (line.type === 'hunk-header' || line.type === 'file-header') {
    return line
  }

  const line_num = line.old_line_num ?? line.new_line_num
  if (line_num === null) return line

  const tokens = token_map.get(line_num)
  if (!tokens || tokens.length === 0) return line

  const new_segments = overlay_syntax_on_segments(line.segments, tokens)
  return { ...line, segments: new_segments }
}

/**
 * Overlay syntax colors from shiki tokens onto existing diff segments.
 * Word-level diff highlights (seg.highlight === true) pass through unchanged.
 * Non-highlighted segments get split at syntax token color boundaries.
 */
function overlay_syntax_on_segments(diff_segments: DiffSegment[], syntax_tokens: SyntaxToken[]): DiffSegment[] {
  const line_text = diff_segments.map((s) => s.text).join('')

  // Build character-level color map from syntax tokens
  const char_colors: string[] = new Array(line_text.length).fill(DEFAULT_COLOR)
  let pos = 0
  for (const token of syntax_tokens) {
    for (let i = 0; i < token.content.length && pos < char_colors.length; i++) {
      char_colors[pos] = token.color
      pos++
    }
  }

  // Walk diff segments, splitting non-highlighted ones at color boundaries
  const result: DiffSegment[] = []
  let char_offset = 0

  for (const seg of diff_segments) {
    if (seg.highlight) {
      // Word-level diff highlight takes priority -- keep as-is
      result.push(seg)
      char_offset += seg.text.length
      continue
    }

    let run_start = 0
    let current_color = char_colors[char_offset] ?? DEFAULT_COLOR

    for (let i = 0; i < seg.text.length; i++) {
      const c = char_colors[char_offset + i] ?? DEFAULT_COLOR
      if (c !== current_color) {
        if (i > run_start) {
          result.push({
            text: seg.text.slice(run_start, i),
            highlight: false,
            color: current_color,
          })
        }
        run_start = i
        current_color = c
      }
    }

    // Emit final run
    if (run_start < seg.text.length) {
      result.push({
        text: seg.text.slice(run_start),
        highlight: false,
        color: current_color,
      })
    }

    char_offset += seg.text.length
  }

  return result
}
