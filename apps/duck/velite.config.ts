import { createDocsVeliteConfig } from '@gentleduck/docs/velite'
import { rehypeComponent } from './velite-configs'

export default createDocsVeliteConfig({
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
