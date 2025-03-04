import { cosmiconfig } from 'cosmiconfig'
import { RawConfigType } from './get-project-config.dto'

export const explorer = cosmiconfig('duck-ui', {
  searchPlaces: ['duck-ui.config.js', 'duck-ui.config.ts'],
})

export const default_js_config = (config: RawConfigType) => `export default ${JSON.stringify(config, null, 2)};
`
