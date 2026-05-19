/** Strips `#` comments (whole-line or end-of-line). Does not handle `#` inside quoted strings. */
export function strip_comment(line: string) {
  const idx = line.indexOf('#')
  if (idx === -1) return line
  return line.slice(0, idx)
}

/** Parses a single RHS value: booleans, `[..]` arrays of strings, quoted strings, or bare tokens. */
export function parse_value(raw: string, lineNo: number) {
  const v = raw.trim()

  if (v === 'true') return true
  if (v === 'false') return false

  if (v.startsWith('[') && v.endsWith(']')) {
    const inside = v.slice(1, -1).trim()
    if (!inside) return []

    return inside
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((item) => unquote(item, lineNo))
  }

  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return unquote(v, lineNo)
  }

  // Bare tokens (e.g. `./tsconfig.json`, `/api`) pass through unquoted.
  return v
}

export function unquote(s: string, _lineNo: number) {
  const t = s.trim()
  const isDouble = t.startsWith('"') && t.endsWith('"')
  const isSingle = t.startsWith("'") && t.endsWith("'")
  if (isDouble || isSingle) return t.slice(1, -1)
  return t
}

export function ensure_object_at_path(root: any, pathParts: string[]) {
  let cur = root
  for (const part of pathParts) {
    if (cur[part] == null) cur[part] = {}
    if (typeof cur[part] !== 'object' || Array.isArray(cur[part])) {
      throw new Error(`Path "${pathParts.join('.')}" is not an object`)
    }
    cur = cur[part]
  }
}

export function get_object_at_path(root: any, pathParts: string[]) {
  let cur = root
  for (const part of pathParts) {
    if (cur[part] == null || typeof cur[part] !== 'object') {
      // Reachable only if `ensure_object_at_path` was skipped for this path.
      throw new Error(`Internal error: missing object at "${pathParts.join('.')}"`)
    }
    cur = cur[part]
  }
  return cur
}
