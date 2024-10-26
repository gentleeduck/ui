import { z } from 'zod'

export const pref_light_typescript_options_schema = z.object({
  typescript: z
    .boolean({
      message: 'You have to pick one option',
      description: 'Would you like to use TypeScript? (yes/no) -default: no'
    })
    .default(false)
})
