import { REGISTRY_URL } from '@/src/main'
import { pathnameSchema, pathSchema } from './url-mutating.dto'

function isUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Function that returns the registry URL, ensuring the /json suffix is added if missing
export async function getRegistryUrl(path: string) {
  if (!pathSchema.parse(path)) return

  if (isUrl(path)) {
    const url = new URL(path)

    // Validate the pathname using Zod to check if it contains /chat/b/
    pathnameSchema.parse(url.pathname)

    // Ensure the /json suffix is present
    if (!url.pathname.endsWith('/json')) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  // If it's not a URL, append it to the registry base URL, ensuring /json is added if missing
  const formattedPath = path.endsWith('/json') ? path : `${path}/json`
  return `${REGISTRY_URL}/${formattedPath}`
}
