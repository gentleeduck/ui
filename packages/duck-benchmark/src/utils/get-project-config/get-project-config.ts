import { raw_config_schema, RawConfigType } from './get-project-config.dto'
import { logger } from '../text-styling'
import { explorer } from './get-project-config.constants'

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
