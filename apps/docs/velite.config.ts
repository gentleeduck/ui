import { Config, defineConfig, s } from 'velite'

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

const config = defineConfig({
  collections: {
    docs: {
      name: 'Docs',
      pattern: 'docs/**/*.mdx', // content files glob pattern
      schema: s
        .object({
          title: s.string().max(99),
          slug: s.slug('docs'),
          date: s.isodate(),
          metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
          excerpt: s.excerpt(), // excerpt of markdown content
          content: s.markdown(), // transform markdown to html
        })
        // more additional fields (computed fields)
        .transform((data) => ({ ...data, permalink: `/docs/${data.slug}` })),
    },
    // others: {
    //   name: 'Other',
    //         schema: {},
    //         pattern: 'others/**/*.md',
    //
    //   // other collection schema options
    // },
  },
})

export default config
