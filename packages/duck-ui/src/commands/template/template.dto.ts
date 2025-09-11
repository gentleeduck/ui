import { z } from 'zod'

export const template_options_schema = z.object({
  yes: z.boolean().default(false),
})

export const template_arguments_schema = z.array(z.string()).default([])

export type templateOptions = z.infer<typeof template_options_schema>
