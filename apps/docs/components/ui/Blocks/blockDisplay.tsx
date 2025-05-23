import { styles } from '@gentleduck/registers'
import { CodePreview } from '~/components/mdx/mdx-components'
import { getBlock } from '~/lib/blocks'

export async function BlockDisplay({ name }: { name: string }) {
  const blocks = await Promise.all(
    styles.map(async (style) => {
      const block = await getBlock(name, style.name)
      const hasLiftMode = block?.chunks ? block?.chunks?.length > 0 : false

      // Cannot (and don't need to) pass to the client.
      delete block?.component
      delete block?.chunks

      return {
        ...block,
        hasLiftMode,
      }
    }),
  )

  if (!blocks?.length) {
    return null
  }

  return blocks.map((block) => <CodePreview key={`${block.style}-${block.name}`} block={block} />)
}
