import { z } from 'zod'

export const preflight_typescript_options_schema = z.object({
  typescript: z
    .boolean({
      description: 'Would you like to use TypeScript? (yes/no) -default: no',
      message: 'You have to pick one option',
    })
    .default(false),
})
