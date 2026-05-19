import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createJiti } from 'jiti'

export async function loadValueFile(filePath: string): Promise<unknown> {
  const extension = path.extname(filePath).toLowerCase()
  const canUseJiti = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'].includes(extension)

  if (extension === '.json') {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  }

  try {
    const moduleUrl = `${pathToFileURL(filePath).href}?t=${Date.now()}`
    const module = (await import(moduleUrl)) as Record<string, unknown>

    return module['default'] ?? module
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
