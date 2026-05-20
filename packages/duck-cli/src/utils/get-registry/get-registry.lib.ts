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
 * Asserts a registry URL uses `https:` and targets an allowlisted host before it is fetched.
 * Component registry JSON drives filesystem writes, so an arbitrary host is a supply-chain risk.
 */
export function assertAllowedRegistryHost(url: string): void {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`Invalid registry URL: ${url}`)
  }

  if (parsed.protocol !== 'https:') {
    throw new Error(`Refusing to fetch registry over insecure protocol "${parsed.protocol}". Use https.`)
  }

  const host = parsed.hostname.toLowerCase()
  const allowed = [...DEFAULT_ALLOWED_REGISTRY_HOSTS, ...getUserAllowedRegistryHosts()]
  const isAllowed = allowed.some((a) => host === a || host.endsWith(`.${a}`))

  if (!isAllowed) {
    throw new Error(
      `Refusing to fetch from untrusted registry host "${host}".\n` +
        `If you trust this registry, opt in by setting COMPONENTS_ALLOW_REGISTRY=${host}`,
    )
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
    // v0.dev's `/chat/b/...` registry URLs require a `/json` suffix that users typically omit.
    const url = new URL(path)
    if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith('/json')) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  return `${REGISTRY_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

async function fetchRegistryJson(url: string) {
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

export async function fetchRegistryUrl(paths: string[]) {
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
