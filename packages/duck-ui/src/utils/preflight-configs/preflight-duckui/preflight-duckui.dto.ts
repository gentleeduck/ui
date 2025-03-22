import { z } from 'zod'

export const preflight_duckui_options_schema = z.object({
  duckui: z
    .boolean({
      message: 'You have to pick one option',
      description: 'Would you like to use duck-ui? (yes/no) -default: no',
    })
    .default(false),
})
