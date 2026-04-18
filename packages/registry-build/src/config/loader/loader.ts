import path from 'node:path'
import { ZodError } from 'zod'
import { pathExists } from '../../lib/fs'
import { DEFAULT_CONFIG_FILENAMES } from '../defaults'
import { resolveRegistryBuildConfig } from '../resolution'
import { loadRegistryBuildConfigInput } from './loader.input'
import { resolveFrom } from './loader.path'
import type { ILoadedRegistryBuildConfig, ILoadRegistryBuildConfigOptions } from './loader.types'

export { resolveRegistryBuildConfig } from '../resolution'

export async function findRegistryBuildConfig(cwd = process.cwd()) {
  let currentDir = path.resolve(cwd)

  while (true) {
    for (const filename of DEFAULT_CONFIG_FILENAMES) {
      const candidate = path.join(currentDir, filename)

      if (await pathExists(candidate)) {
        return candidate
      }
    }

    const parentDir = path.dirname(currentDir)

    if (parentDir === currentDir) {
      return null
    }

    currentDir = parentDir
  }
}

export async function loadRegistryBuildConfig(
  options: ILoadRegistryBuildConfigOptions = {},
): Promise<ILoadedRegistryBuildConfig> {
  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd()
  const configPath = options.configFile ? resolveFrom(cwd, options.configFile) : await findRegistryBuildConfig(cwd)

  if (!configPath) {
    throw new Error(
      `No registry build config file found from "${cwd}". Checked: ${DEFAULT_CONFIG_FILENAMES.join(', ')}`,
    )
  }

  try {
    const rawConfig = await loadRegistryBuildConfigInput(configPath)
    const config = await resolveRegistryBuildConfig(rawConfig, { configPath })

    return {
      config,
      configDir: path.dirname(configPath),
      configPath,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid registry build config at "${configPath}": ${error.message}`)
    }

    throw error
  }
}
