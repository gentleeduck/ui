import { z } from 'zod'

// export const blockSchema = registryEntrySchema.extend({
//   type: z.literal('registry:block'),
//   style: z.enum(['default', 'new-york']),
//   component: z.any(),
//   container: z
//     .object({
//       height: z.string().nullish(),
//       className: z.string().nullish(),
//     })
//     .optional(),
//   code: z.string(),
//   highlightedCode: z.string(),
// })
//
// export type Block = z.infer<typeof blockSchema>
//
// export type BlockChunk = z.infer<typeof blockChunkSchema>
