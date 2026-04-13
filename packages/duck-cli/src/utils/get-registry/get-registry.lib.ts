import { REGISTRY_URL } from '~/main'
import { highlighter, logger } from '../text-styling'
import { errorMessages } from './get-registry.constants'

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
    // If the url contains /chat/b/, we assume it's the v0 registry.
    // We need to add the /json suffix if it's missing.
    const url = new URL(path)
    if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith('/json')) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  return `${REGISTRY_URL}/${path}`
}

export async function fetchRegistryUrl(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = getRegistryUrl(path)
        const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })

        if (!response.ok) {
          checkStatus(response.status, response.statusText, url, await response.text())
        }

        return await response.json()
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
        : statusText || errorMessages[status] || 'Unknown registry error'
  } catch {
    message = statusText || errorMessages[status] || 'Unknown registry error'
  }
  throw new Error(`Failed to fetch from ${highlighter.info(url)}.\n${message}`)
}
