import { defineCollection, s } from 'velite'

export const docsLinksSchema = s.object({ doc: s.string(), api: s.string() })

export const docsSchema = s
  .object({
    title: s.string().max(99),
    // slug: s.slug('docs'),
    metadata: s.metadata().optional(), // extract markdown reading-time, word-count, etc.
    description: s.string(),

    links: docsLinksSchema.optional(),
    excerpt: s.excerpt().optional(), // excerpt of markdown content
    content: s.markdown().optional(), // transform markdown to html
    body: s.mdx(),
    toc: s.toc(),
  })
  //NOTE:: more additional fields (computed fields)
  .transform((data, { path, meta }) => ({
    ...data,
    slug: `${meta.path.split('/').slice(-3, -1).join('/')}/${meta.path.split('/').pop()?.replace('.mdx', '')}`,
    permalink: `${meta.path.split('/').slice(-2, -1).join('/')}/${meta.path.split('/').pop()?.replace('.mdx', '')}`,
    sourceFilePath: path,
    sourceFileName: meta.path.split('/').pop(),
    sourceFileDir: meta.path.split('/').slice(-3, -1).join('/'),
    contentType: meta.path.split('.').pop(),
    flattenedPath: meta.path
      .split('/')
      .slice(-2, -1)
      .join('/')
      .replace(/\.mdx$/, ''),
  }))

export const docs = defineCollection({
  name: 'Docs',
  pattern: 'docs/**/*.mdx',
  schema: docsSchema,
})
