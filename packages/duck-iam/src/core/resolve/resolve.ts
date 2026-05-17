import type { Primitives, Request } from '../types'
/**
 * Top-level path prefixes accepted by {@link resolve}.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const ALLOWED_ROOTS = new Set(['subject', 'resource', 'environment'])

/** Property names refused at any segment - blocks prototype-pollution lookups. */
const BLOCKED_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype'])

/**
 * Hard cap for {@link pathCache}. Each entry is at most ~200 bytes
 * (path string + segment array), so 10k entries ~ 2 MB worst case.
 * Insertion-order eviction (FIFO) when the cap is hit.
 */
const PATH_CACHE_MAX = 10_000
const pathCache = new Map<string, string[] | null>()

function rememberPath(path: string, value: string[] | null): string[] | null {
  if (pathCache.size >= PATH_CACHE_MAX) {
    const oldest = pathCache.keys().next().value
    if (oldest !== undefined) pathCache.delete(oldest)
  }
  pathCache.set(path, value)
  return value
}

/**
 * Splits and validates a dot-path, memoizing the result.
 * Returns `null` for paths with an unknown root or a blocked segment.
 */
function getSegments(path: string): string[] | null {
  const cached = pathCache.get(path)
  if (cached !== undefined) return cached

  const segments = path.split('.')

  if (!segments[0] || !ALLOWED_ROOTS.has(segments[0])) return rememberPath(path, null)

  for (const seg of segments) {
    if (BLOCKED_SEGMENTS.has(seg)) return rememberPath(path, null)
  }

  return rememberPath(path, segments)
}

/**
 * Resolves dot-path field references against an {@link Request.IAccessRequest}.
 *
 * Supported paths:
 *   subject.id, subject.roles, subject.attributes.*
 *   resource.type, resource.id, resource.attributes.*
 *   environment.*
 *   action (shorthand for the action string)
 *   scope (shorthand for the scope string)
 *
 * Security: only allows traversal under subject/resource/environment.
 * Blocks __proto__, constructor, and prototype access.
 *
 * @param request - The access request providing root data.
 * @param path    - Dot-path string starting with an allowed root or shorthand.
 * @returns The resolved attribute value, or `null` when the path is invalid or missing.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function resolve(request: Request.IAccessRequest, path: string): Primitives.AttributeValue {
  if (path === 'action') return request.action
  if (path === 'scope') return request.scope ?? null

  const segments = getSegments(path)
  if (!segments) return null

  let node: unknown = request

  for (const seg of segments) {
    if (node == null || typeof node !== 'object') return null
    node = (node as Record<string, unknown>)[seg]
  }

  return node === undefined ? null : (node as Primitives.AttributeValue)
}

/**
 * Tests if an action matches a pattern.
 * Supports wildcards: "*" matches all, "posts:*" matches "posts:read", "posts:write"
 *
 * @param pattern - Action pattern from a rule (may include `'*'` or `'foo:*'`).
 * @param action  - The literal action from the request.
 * @returns `true` when the request action matches the pattern.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function matchesAction(pattern: string, action: string): boolean {
  if (pattern === '*') return true
  if (pattern === action) return true

  if (pattern.endsWith(':*')) {
    const prefix = pattern.slice(0, -1)
    return action.startsWith(prefix)
  }

  return false
}

/**
 * Tests if a resource type matches a pattern (colon-based hierarchy).
 * Supports hierarchical matching: "org:*" matches "org:project", "org:project:doc"
 *
 * @param pattern      - Resource pattern from a rule.
 * @param resourceType - The literal resource type from the request.
 * @returns `true` when the request resource type matches the pattern.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function matchesResource(pattern: string, resourceType: string): boolean {
  if (pattern === '*') return true
  if (pattern === resourceType) return true

  if (pattern.endsWith(':*')) {
    const prefix = pattern.slice(0, -1)
    return resourceType.startsWith(prefix)
  }

  // Hierarchical: "org" matches "org:project:doc"
  if (resourceType.startsWith(`${pattern}:`)) return true

  return false
}

/**
 * Tests if a resource type matches a pattern using dot-notation hierarchy.
 *
 * - "*" matches everything
 * - "dashboard" matches "dashboard", "dashboard.users", "dashboard.users.settings"
 * - "dashboard.*" matches any child: "dashboard.users", "dashboard.users.settings" (NOT "dashboard" itself)
 * - "dashboard.users" matches "dashboard.users", "dashboard.users.settings"
 *
 * @param pattern      - Resource pattern from a rule (dot-notation).
 * @param resourceType - The literal resource type from the request.
 * @returns `true` when the request resource type matches the pattern.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function matchesResourceHierarchical(pattern: string, resourceType: string): boolean {
  if (pattern === '*') return true
  if (pattern === resourceType) return true

  if (pattern.endsWith('.*')) {
    const prefix = pattern.slice(0, -1) // "dashboard."
    return resourceType.startsWith(prefix)
  }

  // Parent matches children: "dashboard" matches "dashboard.users.settings"
  if (resourceType.startsWith(`${pattern}.`)) return true

  return false
}

/**
 * Tests if a scope matches a pattern.
 *
 * - undefined/null pattern or "*" matches any scope (global permission)
 * - If request has no scope, only global patterns match
 * - Otherwise exact match
 *
 * @param pattern - Scope pattern from a rule (may be `undefined`, `null`, or `'*'`).
 * @param scope   - The request's scope (may be `undefined` or `null`).
 * @returns `true` when the request scope matches the pattern.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function matchesScope(pattern: string | undefined | null, scope: string | undefined | null): boolean {
  if (!pattern || pattern === '*') return true
  if (!scope) return false
  return pattern === scope
}
