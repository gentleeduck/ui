import { REGISTRY_URL } from '~/main'
import axios from 'axios'
import { highlighter, logger } from '../text-styling'
import { error_messages } from './get-registry.constants'

export function is_url(path: string) {
  try {
    new URL(path)
    return true
  } catch (error) {
    return false
  }
}

export function get_registry_url(path: string) {
  if (is_url(path)) {
    // If the url contains /chat/b/, we assume it's the v0 registry.
    //NOTE: We need to add the /json suffix if it's missing.
    const url = new URL(path)
    if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith('/json')) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  return `${REGISTRY_URL}/${path}`
}

export async function fetch_registry_url(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = get_registry_url(path)
        const response = await axios.get(url)

        if (response.status !== 200) {
          check_status(response, url)
        }

        return response.data
      }),
    )

    return results
  } catch (error) {
    logger.error({
      args: ['\nFailed to fetch from registry.'],
      with_icon: true,
    })
    return []
  }
}

export function check_status(response: any, url: string) {
  if (response.status === 401) {
    throw new Error(
      `You are not authorized to access the component at ${highlighter.info(
        url,
      )}.\nIf this is a remote registry, you may need to authenticate.`,
    )
  }

  if (response.status === 404) {
    throw new Error(
      `The component at ${highlighter.info(
        url,
      )} was not found.\nIt may not exist at the registry. Please make sure it is a valid component.`,
    )
  }

  if (response.status === 403) {
    throw new Error(
      `You do not have access to the component at ${highlighter.info(
        url,
      )}.\nIf this is a remote registry, you may need to authenticate or a token.`,
    )
  }

  const result = response.data
  const message =
    result && typeof result === 'object' && 'error' in result
      ? result.error
      : response.statusText || error_messages[response.status]
  throw new Error(`Failed to fetch from ${highlighter.info(url)}.\n${message}`)
}
