import { absoluteUrl } from '@gentleduck/docs/lib'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import React from 'react'
import { RegistryPreview } from '~/components/registry-preview'
import { getRegistryItem } from '~/lib/get-registry-item'
import { getRegistryIndex } from '~/lib/registry-index.server'

export const revalidate = false
export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const entries = Object.values(getRegistryIndex())

  const filteredEntries =
    process.env.MODE === 'production' ? entries.filter((entry) => entry.type !== 'registry:example') : entries

  return filteredEntries.map((entry) => ({ name: entry.name }))
}

const getCachedRegistryItem = React.cache(async (name: string) => {
  return await getRegistryItem(name)
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    name: string
  }>
}): Promise<Metadata> {
  const { name } = await params
  const item = await getCachedRegistryItem(name)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description ?? ''
  const ogUrl = `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    alternates: {
      canonical: absoluteUrl(`/view/${item.name}`),
    },
    description,
    openGraph: {
      description,
      images: [{ url: ogUrl }],
      title,
      type: 'article',
      url: absoluteUrl(`/view/${item.name}`),
    },
    title,
    twitter: {
      card: 'summary_large_image',
      creator: '@wildduck2',
      description,
      images: [{ url: ogUrl }],
      title,
    },
  }
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    name: string
  }>
}) {
  const { name } = await params
  const item = await getCachedRegistryItem(name)

  if (!item) {
    return notFound()
  }

  return <RegistryPreview name={name} />
}
