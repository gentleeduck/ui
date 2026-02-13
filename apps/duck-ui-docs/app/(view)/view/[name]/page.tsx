import { absoluteUrl } from '@gentleduck/docs/lib'
import { cn } from '@gentleduck/libs/cn'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import React from 'react'
import { siteConfig } from '~/config/site'
import { getRegistryComponent, getRegistryItem } from '~/lib/get-registry-item'

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
    description,
    openGraph: {
      description,
      images: [
        {
          alt: siteConfig.name,
          height: 630,
          url: siteConfig.ogImage,
          width: 1200,
        },
      ],
      title,
      type: 'article',
      url: absoluteUrl(`/view/${item.name}`),
    },
    title: item.description,
    twitter: {
      card: 'summary_large_image',
      creator: '@wildduck2',
      description,
      images: [siteConfig.ogImage],
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
  const Component = getRegistryComponent(name)

  if (!Component || !item) {
    return notFound()
  }

  return (
    <>
      <div className={cn('flex min-h-screen flex-col items-center justify-center p-4')}>
        <div className="w-full max-w-screen-2xl">
          <Component />
        </div>
      </div>
    </>
  )
}
