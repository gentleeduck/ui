import { REGISTRY_URL } from '~/main'
import { highlighter, logger } from '../text-styling'
import { ERROR_MESSAGES } from './get-registry.constants'

const REGISTRY_REQUEST_TIMEOUT_MS = 30_000

/** Hosts trusted to serve component registry data without an explicit opt-in. */
export const DEFAULT_ALLOWED_REGISTRY_HOSTS = ['gentleduck.org'] as const

/**
 * Extra hosts the user has explicitly opted into via the `COMPONENTS_ALLOW_REGISTRY`
 * env var (comma-separated). Provides a deliberate escape hatch for custom registries.
 */
function getUserAllowedRegistryHosts(): string[] {
  return (process.env['COMPONENTS_ALLOW_REGISTRY'] ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Hostname of the URL set via `COMPONENTS_REGISTRY_URL`, lowercased. Treated as an implicit
 * allowlist entry so a developer override actually works without also setting
 * `COMPONENTS_ALLOW_REGISTRY`. A loud warning is emitted exactly once when the override
 * points outside the default allowlist, to flag the trust delegation.
 */
let _envRegistryHostWarned = false
function getEnvRegistryHost(): string | null {
  const raw = process.env['COMPONENTS_REGISTRY_URL']
  if (!raw) return null
  try {
    return new URL(raw).hostname.toLowerCase()
  } catch {
    return null
  }
}

function maybeWarnEnvRegistryOverride(host: string): void {
  if (_envRegistryHostWarned) return
  const inDefault = DEFAULT_ALLOWED_REGISTRY_HOSTS.some((a) => host === a || host.endsWith(`.${a}`))
  if (inDefault) {
    _envRegistryHostWarned = true
    return
  }
  _envRegistryHostWarned = true
  logger.warn({
    args: [
      `COMPONENTS_REGISTRY_URL is overriding the registry to "${host}". You are trusting this host with file writes into your project.`,
    ],
    withIcon: true,
  })
}

/**
 * Asserts a registry URL uses `https:` and targets an allowlisted host before it is fetched.
 * Component registry JSON drives filesystem writes, so an arbitrary host is a supply-chain risk.
 *
 * Allowlist composition (in priority order):
 *  1. `DEFAULT_ALLOWED_REGISTRY_HOSTS` — always trusted.
 *  2. The host of `COMPONENTS_REGISTRY_URL` (if set) — implicit, warned once on first use.
 *  3. Hosts in `COMPONENTS_ALLOW_REGISTRY` (comma-separated) — explicit opt-in.
 *
 * A non-https URL is always rejected.
 */
export function assertAllowedRegistryHost(url: string): void {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`Invalid registry URL: ${url}`)
  }

  const host = parsed.hostname.toLowerCase()
  const envHost = getEnvRegistryHost()
  const isLoopback = host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
  // Allow `http://localhost*` exclusively when the loopback override was set via env var —
  // mirrors the `start:dev` script's local registry use case without opening a generic http hole.
  const allowInsecureLoopback = isLoopback && envHost && (host === envHost || host.endsWith(`.${envHost}`))

  if (parsed.protocol !== 'https:' && !allowInsecureLoopback) {
    throw new Error(`Refusing to fetch registry over insecure protocol "${parsed.protocol}". Use https.`)
  }

  const allowed = [...DEFAULT_ALLOWED_REGISTRY_HOSTS, ...(envHost ? [envHost] : []), ...getUserAllowedRegistryHosts()]
  const isAllowed = allowed.some((a) => host === a || host.endsWith(`.${a}`))

  if (!isAllowed) {
    throw new Error(
      `Refusing to fetch from untrusted registry host "${host}".\n` +
        `If you trust this registry, opt in by setting COMPONENTS_ALLOW_REGISTRY=${host}`,
    )
  }

  // Warn after-the-fact so we only ever emit the warning when something is actually fetched.
  if (envHost && (host === envHost || host.endsWith(`.${envHost}`))) {
    maybeWarnEnvRegistryOverride(envHost)
  }
}

export function isUrl(path: string) {
  try {
    new URL(path)
    return true
  } catch (_error) {
    return false
  }
}

export function getRegistryUrl(path: string) {
  if (isUrl(path)) {
    const url = new URL(path)
    // v0.dev's `/chat/b/...` registry URLs require a `/json` suffix that users typically omit.
    // Pin the rewrite to the v0.dev host so a malicious URL on a different host cannot be
    // morphed by this branch.
    if (url.hostname === 'v0.dev' && url.pathname.match(/^\/chat\/b\//) && !url.pathname.endsWith('/json')) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  return `${REGISTRY_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

async function fetchRegistryJson(url: string): Promise<unknown> {
  assertAllowedRegistryHost(url)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REGISTRY_REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      checkStatus(response.status, response.statusText, url, await response.text())
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${REGISTRY_REQUEST_TIMEOUT_MS}ms`)
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

/** Returns unknown JSON — callers must parse with their zod schema before use. */
export async function fetchRegistryUrl(paths: string[]): Promise<unknown[]> {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = getRegistryUrl(path)
        return await fetchRegistryJson(url)
      }),
    )

    return results
  } catch (error) {
    logger.error({
      args: [`\nFailed to fetch from registry.\n${error instanceof Error ? error.message : String(error)}`],
      withIcon: true,
    })
    return []
  }
}

export function checkStatus(status: number, statusText: string, url: string, body: string) {
  if (status === 401) {
    throw new Error(
      `You are not authorized to access the component at ${highlighter.info(
        url,
      )}.\nIf this is a remote registry, you may need to authenticate.`,
    )
  }

  if (status === 404) {
    throw new Error(
      `The component at ${highlighter.info(
        url,
      )} was not found.\nIt may not exist at the registry. Please make sure it is a valid component.`,
    )
  }

  if (status === 403) {
    throw new Error(
      `You do not have access to the component at ${highlighter.info(
        url,
      )}.\nIf this is a remote registry, you may need to authenticate or a token.`,
    )
  }

  let message: string
  try {
    const result = JSON.parse(body)
    message =
      result && typeof result === 'object' && 'error' in result
        ? String(result.error)
        : statusText || ERROR_MESSAGES[status] || 'Unknown registry error'
  } catch {
    message = statusText || ERROR_MESSAGES[status] || 'Unknown registry error'
  }
  throw new Error(`Failed to fetch from ${highlighter.info(url)}.\n${message}`)
}
