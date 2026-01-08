import { createDocsVeliteConfig } from '@gentleduck/docs/velite'
import { rehypeComponent } from './velite-configs'

export default createDocsVeliteConfig({
  rehypePluginsBefore: [rehypeComponent],
})
