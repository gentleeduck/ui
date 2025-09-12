import { cn } from '@gentleduck/libs/cn'
import { registry_entry_schema, registry_item_file_schema } from '@gentleduck/registers'
import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import React from 'react'
import z from 'zod'
import { Index } from '~/__ui_registry__'
import { siteConfig } from '~/config/site'
import { getRegistryComponent, getRegistryItem } from '~/lib/get-registry-item'
import { absoluteUrl } from '~/lib/utils'

export const revalidate = false
export const dynamic = 'force-static'
export const dynamicParams = false

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
  const description = item.description

  return {
    title: item.description,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: absoluteUrl(`/view/${item.name}`),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.ogImage],
      creator: '@shadcn',
    },
  }
}

export async function generateStaticParams() {
  const { Index } = await import('~/__ui_registry__/index')
  // const index = z.record(registry_entry_schema).parse(Index)

  return Object.values(Index)
    .filter((block) =>
      ['registry:block', 'registry:component', 'registry:example', 'registry:internal'].includes(block.type),
    )
    .map((block) => ({
      name: block.name,
    }))
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
  const Component = getRegistryComponent(name)
  console.log({ item, Component })

  if (!Component) {
    return notFound()
  }

  return (
    <>
      <div
        className={cn(
          'bg-background',
          // item.meta?.container
        )}>
        <Component />
      </div>
    </>
  )
}
