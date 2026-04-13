import { logger } from '../text-styling'
import { explorer } from './get-project-config.constants'
import { RawConfigType, rawConfigSchema } from './get-project-config.dto'

export async function getProjectConfig(cwd: string) {
  try {
    const rawConfig = await explorer.search(cwd)
    if (!rawConfig) {
      return null
    }

    return rawConfigSchema.parse(rawConfig.config)
  } catch (error) {
    logger.error({
      args: [`Invalid configuration found in ${cwd}/duck-benchmark.config.ts`],
    })
    process.exit(1)
  }
}
