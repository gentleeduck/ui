import { z } from 'zod'

const eventSchema = z.object({
  name: z.enum([
    'copy_npm_command',
    'copy_usage_import_code',
    'copy_usage_code',
    'copy_primitive_code',
    'copy_theme_code',
    'copy_block_code',
    'copy_chunk_code',
    'enable_lift_mode',
    'copy_chart_code',
    'copy_chart_theme',
    'copy_chart_data',
    'copy_color',
  ]),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
})

export type Event = z.infer<typeof eventSchema>

export function trackEvent(input: Event): void {
  // `safeParse` so bad MDX-supplied event names can't crash the page; the
  // analytics sink is wired up by the consuming docs app (no-op here).
  eventSchema.safeParse(input)
}
