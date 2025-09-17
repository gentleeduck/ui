'use server'

import { cn } from '@gentleduck/libs/cn'
import { registry_item_file_schema } from '@gentleduck/registers'
import * as React from 'react'
import { z } from 'zod'
import { createFileTreeForRegistryItemFiles, getRegistryItem } from '~/lib/get-registry-item'
import { highlightCode } from '~/lib/highlight-code'
import { ComponentPreview } from '../mdx/mdx-components'
import { BlockViewer } from './block-viewer'

export async function BlockDisplay({ name }: { name: string }) {
  const item = await getCachedRegistryItem(name)

  if (!item?.files) {
    return null
  }

  const [tree, highlightedFiles] = await Promise.all([
    getCachedFileTree(item.files),
    getCachedHighlightedFiles(item.files),
  ])

  return (
    <BlockViewer item={item} tree={tree} highlightedFiles={highlightedFiles}>
      <ComponentPreview
        name={item.name}
        hideCode
        className={cn(
          // 'my-0 **:[.preview]:h-auto **:[.preview]:p-4 **:[.preview>.p-6]:p-0',
          // item.meta?.containerClassName,
        )}
      />
    </BlockViewer>
  )
}

const getCachedRegistryItem = React.cache(async (name: string) => {
  return await getRegistryItem(name)
})

const getCachedFileTree = React.cache(async (files: Array<{ path: string; target?: string }>) => {
  if (!files) {
    return null
  }

  return createFileTreeForRegistryItemFiles(files)
})

const getCachedHighlightedFiles = React.cache(async (files: z.infer<typeof registry_item_file_schema>[]) => {
  return await Promise.all(
    files.map(async (file) => ({
      ...file,
      highlightedContent: await highlightCode(file.content ?? ''),
    })),
  )
})
