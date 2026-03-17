/**
 * Rate limiting, slug validation, and request logging.
 */

const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 60

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 5 * 60_000).unref?.()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

export function getRateLimitResponse(ip: string): Response | null {
  if (checkRateLimit(ip)) return null
  return new Response(JSON.stringify({ error: 'Rate limit exceeded. Max 60 requests per minute.' }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
  })
}

export function validateSlug(slug: string): { valid: boolean; sanitized: string; error?: string } {
  if (slug.includes('..')) return { valid: false, sanitized: '', error: 'Path traversal ("..") is not allowed.' }
  if (slug.startsWith('/') || slug.startsWith('\\'))
    return { valid: false, sanitized: '', error: 'Absolute paths are not allowed.' }
  if (/[<>:"|?*\\]/.test(slug)) return { valid: false, sanitized: '', error: 'Slug contains invalid characters.' }

  const sanitized = slug
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
  if (sanitized.length === 0) return { valid: false, sanitized: '', error: 'Slug cannot be empty.' }

  return { valid: true, sanitized }
}

export function logRequest(tool: string, params: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const paramStr = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(' ')
  console.log(`[MCP ${timestamp}] ${tool} ${paramStr}`)
}
