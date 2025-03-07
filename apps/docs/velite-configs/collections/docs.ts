import { defineCollection, s } from 'velite'

export const docsLinksSchema = s.object({ doc: s.string(), api: s.string() })

export const docsSchema = s
  .object({
    title: s.string().max(99),
    // slug: s.slug('docs'),
    metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
    description: s.string(),

    links: docsLinksSchema.optional(),
    excerpt: s.excerpt(), // excerpt of markdown content
    body: s.mdx(),
    toc: s.toc(),
    content: s.markdown(), // transform markdown to html
  })
  //NOTE:: more additional fields (computed fields)
  .transform((data) => ({
    ...data,
    permalink: `/docs/components/${data.title}`,
  }))

export const docs = defineCollection({
  name: 'Docs',
  pattern: 'docs/**/*.mdx',
  schema: docsSchema,
})
