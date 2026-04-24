export function strip_comment(line: string) {
  // supports whole-line comments and end-of-line comments (simple version)
  const idx = line.indexOf('#')
  if (idx === -1) return line
  return line.slice(0, idx)
}

export function parse_value(raw: string, lineNo: number) {
  const v = raw.trim()

  // boolean
  if (v === 'true') return true
  if (v === 'false') return false

  // array of strings: ["a", "b"]
  if (v.startsWith('[') && v.endsWith(']')) {
    const inside = v.slice(1, -1).trim()
    if (!inside) return []

    // split by commas, trim, remove quotes if present
    return inside
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((item) => unquote(item, lineNo))
  }

  // string (quoted)
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return unquote(v, lineNo)
  }

  // allow bare strings too (like ./tsconfig.json or /api)
  return v
}

export function unquote(s: string, _lineNo: number) {
  const t = s.trim()
  const isDouble = t.startsWith('"') && t.endsWith('"')
  const isSingle = t.startsWith("'") && t.endsWith("'")
  if (isDouble || isSingle) return t.slice(1, -1)

  // In arrays you might get unquoted tokens by mistake.
  // Keep them, but you can be strict if you want:
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
      // Should not happen if ensureObjectAtPath is used correctly
      throw new Error(`Internal error: missing object at "${pathParts.join('.')}"`)
    }
    cur = cur[part]
  }
  return cur
}
