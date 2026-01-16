import { Project } from 'ts-morph'
import { spinner } from '../..'
import type { DuckGenConfig } from '../../config/config.dto'
import type { DuckGenOutputTargets } from '../../core/types'
import { scanDuckgenMessages } from '../../messages'
import { processNestJsApiRoutes } from './api-routes'

export async function processNestJs(config: DuckGenConfig['extensions'], outputTargets: DuckGenOutputTargets) {
  let project = new Project({
    tsConfigFilePath: config.shared.tsconfigPath,
  })

  if (config.apiRoutes.enabled) {
    spinner.start('API routes...')
    await processNestJsApiRoutes(project, config, outputTargets.apiRoutes)
    spinner.succeed('API routes done')
  } else {
    spinner.info('API routes disabled')
  }

  if (config.messages.enabled) {
    spinner.start('Messages...')
    await scanDuckgenMessages(project, config, outputTargets.messages)
    spinner.succeed('Messages done')
  } else {
    spinner.info('Messages disabled')
  }
}
