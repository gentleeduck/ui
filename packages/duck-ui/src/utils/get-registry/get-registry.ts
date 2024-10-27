import axios from 'axios'
import { REGISTRY_URL } from '@/src/main'
import { highlighter, logger } from '../text-styling'

function isUrl(path: string) {
  try {
    new URL(path)
    return true
  } catch (error) {
    return false
  }
}

function getRegistryUrl(path: string) {
  if (isUrl(path)) {
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

export async function fetch_registry_url(path: string) {
  try {
    const url = getRegistryUrl(path)

    const res = await axios.get(url)
    const data = res.data
    return data
  } catch (error) {
    console.log(error)
  }
}

import { HttpsProxyAgent } from 'https-proxy-agent'
const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

export async function fetchRegistry(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = getRegistryUrl(path)
        const response = await fetch(url, { agent })

        if (!response.ok) {
          const errorMessages: { [key: number]: string } = {
            400: 'Bad request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not found',
            500: 'Internal server error'
          }

          if (response.status === 401) {
            throw new Error(
              `You are not authorized to access the component at ${highlighter.info(
                url
              )}.\nIf this is a remote registry, you may need to authenticate.`
            )
          }

          if (response.status === 404) {
            throw new Error(
              `The component at ${highlighter.info(
                url
              )} was not found.\nIt may not exist at the registry. Please make sure it is a valid component.`
            )
          }

          if (response.status === 403) {
            throw new Error(
              `You do not have access to the component at ${highlighter.info(
                url
              )}.\nIf this is a remote registry, you may need to authenticate or a token.`
            )
          }

          const result = await response.json()
          const message =
            result && typeof result === 'object' && 'error' in result
              ? result.error
              : response.statusText || errorMessages[response.status]
          throw new Error(
            `Failed to fetch from ${highlighter.info(url)}.\n${message}`
          )
        }

        return response.json()
      })
    )

    return results
  } catch (error) {
    logger.error({ args: [] }).split('\n')
    // handleError(error)
    return []
  }
}
