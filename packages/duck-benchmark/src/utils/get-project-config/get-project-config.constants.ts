import { cosmiconfig } from 'cosmiconfig'
import { RawConfigType } from './get-project-config.dto'

export const explorer = cosmiconfig('duck-benchmark', {
  searchPlaces: ['duck-benchmark.config.ts', 'duck-benchmark.config.js'],
})

export const default_js_config = (config: RawConfigType) => `export default ${JSON.stringify(config, null, 2)};
`
