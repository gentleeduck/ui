import { createDocsVeliteConfig } from '@gentleduck/duck-docs/velite'
import { rehypeComponent } from './velite-configs/plugins/rehype-component'

export default createDocsVeliteConfig({
  rehypePluginsBefore: [rehypeComponent],
})
