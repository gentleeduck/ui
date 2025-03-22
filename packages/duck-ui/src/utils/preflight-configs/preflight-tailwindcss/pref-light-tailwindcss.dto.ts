import { z } from 'zod'

export const pref_light_tailwindcss_options_schema = z.object({
  tailwind: z
    .boolean({
      message: 'You have to pick one option',
      description: 'Would you like to use TailwindCSS? (yes/no) -default: no',
    })
    .default(false),
})
