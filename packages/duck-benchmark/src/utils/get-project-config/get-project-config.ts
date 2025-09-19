import { logger } from '../text-styling'
import { explorer } from './get-project-config.constants'
import { RawConfigType, raw_config_schema } from './get-project-config.dto'

export async function get_project_config(cwd: string) {
  try {
    const rawConfig = await explorer.search(cwd)
    if (!rawConfig) {
      return null
    }

    return raw_config_schema.parse(rawConfig.config)
  } catch (error) {
    logger.error({
      args: [`Invalid configuration found in ${cwd}/duck-benchmark.config.ts`],
    })
    process.exit(1)
  }
}
