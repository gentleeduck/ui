import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createJiti } from 'jiti'

// Bumped once per loadValueFile call so the ESM URL changes on reloads (watch
// mode) without depending on `Date.now()` collisions or leaking distinct URLs
// into the module cache on every millisecond.
let moduleCacheBuster = 0

export async function loadValueFile(filePath: string): Promise<unknown> {
  const extension = path.extname(filePath).toLowerCase()
  const canUseJiti = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'].includes(extension)

  if (extension === '.json') {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  }

  try {
    moduleCacheBuster += 1
    const moduleUrl = `${pathToFileURL(filePath).href}?t=${moduleCacheBuster}`
    const module: unknown = await import(moduleUrl)

    // Narrow before reaching for `default` — anything else is treated as the
    // module's value and validated by the caller's Zod schema.
    if (typeof module === 'object' && module !== null && 'default' in module) {
      return (module as { default: unknown }).default ?? module
    }

    return module
  } catch (nativeError) {
    if (canUseJiti) {
      try {
        const jiti = createJiti(import.meta.url, {
          fsCache: false,
          interopDefault: true,
          moduleCache: false,
        })

        return await jiti.import(filePath, { default: true })
      } catch (jitiError) {
        throw new Error(
          `Unable to load "${filePath}". Native import failed: ${
            nativeError instanceof Error ? nativeError.message : String(nativeError)
          }. Jiti fallback failed: ${jitiError instanceof Error ? jitiError.message : String(jitiError)}`,
        )
      }
    }

    throw new Error(
      `Unable to load "${filePath}". JSON config works everywhere; TS/JS config requires a runtime that can import the file directly. ${
        nativeError instanceof Error ? nativeError.message : String(nativeError)
      }`,
    )
  }
}
