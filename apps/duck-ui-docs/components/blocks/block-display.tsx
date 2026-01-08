'use server'

import { ComponentPreview } from '@gentleduck/docs'
import type { registry_item_file_schema } from '@gentleduck/registers'
import * as React from 'react'
import type { z } from 'zod'
import { createFileTreeForRegistryItemFiles, getRegistryItem } from '~/lib/get-registry-item'
import { highlightCode } from '~/lib/highlight-code'
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
    <BlockViewer highlightedFiles={highlightedFiles} item={item} tree={tree}>
      <ComponentPreview hideCode name={item.name} />
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
