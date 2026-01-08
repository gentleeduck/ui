import { z } from 'zod'

export const pref_light_tailwindcss_options_schema = z.object({
  tailwind: z
    .boolean({
      error: 'You have to pick one option',
    })
    .default(false)
    .describe('Would you like to use TailwindCSS? (yes/no) -default: no'),
})
