import type { AccessRequest, AttributeValue } from '../types'

/** Allowed top-level path prefixes for field resolution */
const ALLOWED_ROOTS = new Set(['subject', 'resource', 'environment'])

/** Property names that must never be traversed */
const BLOCKED_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype'])

/** Cache for validated, split path segments. */
const pathCache = new Map<string, string[] | null>()

/**
 * Splits and validates a dot-path, caching the result.
 * Returns `null` for invalid paths (bad root or blocked segments).
 */
function getSegments(path: string): string[] | null {
  let cached = pathCache.get(path)
  if (cached !== undefined) return cached

  const segments = path.split('.')

  // Validate root path is an allowed prefix
  if (!segments[0] || !ALLOWED_ROOTS.has(segments[0])) {
    pathCache.set(path, null)
    return null
  }

  // Check for blocked segments once at cache time
  for (const seg of segments) {
    if (BLOCKED_SEGMENTS.has(seg)) {
      pathCache.set(path, null)
      return null
    }
  }

  pathCache.set(path, segments)
  cached = segments
  return cached
}

/**
 * Resolves dot-path field references against an AccessRequest.
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
 */
export function resolve(request: AccessRequest, path: string): AttributeValue {
  if (path === 'action') return request.action
  if (path === 'scope') return request.scope ?? null

  const segments = getSegments(path)
  if (!segments) return null

  let node: unknown = request

  for (const seg of segments) {
    if (node == null || typeof node !== 'object') return null
    node = (node as Record<string, unknown>)[seg]
  }

  return node === undefined ? null : (node as AttributeValue)
}

/**
 * Tests if an action matches a pattern.
 * Supports wildcards: "*" matches all, "posts:*" matches "posts:read", "posts:write"
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
 */
export function matchesScope(pattern: string | undefined | null, scope: string | undefined | null): boolean {
  if (!pattern || pattern === '*') return true
  if (!scope) return false
  return pattern === scope
}
