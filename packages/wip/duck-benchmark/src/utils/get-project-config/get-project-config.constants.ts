import { cosmiconfig } from 'cosmiconfig'
import type { RawConfigType } from './get-project-config.dto'

export const explorer = cosmiconfig('duck-benchmark', {
  searchPlaces: ['duck-benchmark.config.ts', 'duck-benchmark.config.js'],
})

export const defaultJsConfig = (config: RawConfigType) => `export default ${JSON.stringify(config, null, 2)};
`
