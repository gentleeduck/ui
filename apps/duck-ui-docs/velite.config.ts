import { createDocsVeliteConfig } from '@gentleduck/duck-docs/velite'
import { rehypeComponent } from './velite-configs'

export default createDocsVeliteConfig({
  rehypePluginsBefore: [rehypeComponent],
})
