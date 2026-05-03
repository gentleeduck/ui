'use client'

import { usePathname } from 'next/navigation'

const ORIGIN = 'https://ui.gentleduck.org'

const titlecase = (segment: string) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export function BreadcrumbJsonLd() {
  const pathname = usePathname() ?? '/'
  if (pathname === '/' || pathname === '') return null

  const segments = pathname.split('/').filter(Boolean)
  if (!segments.length) return null

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'gentleduck',
      item: ORIGIN,
    },
    ...segments.map((segment, idx) => {
      const url = `${ORIGIN}/${segments.slice(0, idx + 1).join('/')}`
      return {
        '@type': 'ListItem',
        position: idx + 2,
        name: titlecase(segment.replace(/\.md$/, '')),
        item: url,
      }
    }),
  ]

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement,
        }),
      }}
    />
  )
}
