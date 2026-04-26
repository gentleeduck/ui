import { createDocsVeliteConfig } from '@gentleduck/docs/velite'
import { rehypeComponent } from './velite-configs'

export default createDocsVeliteConfig({
  // Restrict the root `docs` collection to top-level docs only (changelog,
  // comparisons, dark-theme, etc). Per-package MDX is already covered by the
  // dedicated per-package collections below, so the wide `docs/**/*.mdx`
  // default would duplicate every package doc into `docs.json`.
  docsPattern: 'docs/!(duck-*|www)/**/*.mdx',
  packages: [
    'duck-calendar',
    'duck-cli',
    'duck-gen',
    'duck-hooks',
    'duck-iam',
    'duck-lazy',
    'duck-libs',
    'duck-motion',
    'duck-primitives',
    'duck-query',
    'duck-registry-build',
    'duck-shortcut',
    'duck-state',
    'duck-template',
    'duck-ttest',
    'duck-ttlog',
    'duck-ui',
    'duck-upload',
    'duck-variants',
    'duck-vim',
    'www',
  ],
  rehypePluginsBefore: [rehypeComponent],
})
