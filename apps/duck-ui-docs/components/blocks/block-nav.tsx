'use client'

import { ScrollArea } from '@gentleduck/registry-ui-duckui/scroll-area'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BlocksNav() {
  const pathname = usePathname()

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-none">
        <div className="flex items-center">
          <BlocksNavLink category={{ hidden: false, name: 'Featured', slug: '' }} isActive={pathname === '/blocks'} />
          {registryCategories.map((category) => (
            <BlocksNavLink category={category} isActive={pathname === `/blocks/${category.slug}`} key={category.slug} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function BlocksNavLink({ category, isActive }: { category: (typeof registryCategories)[number]; isActive: boolean }) {
  if (category.hidden) {
    return null
  }

  return (
    <Link
      className="flex h-7 items-center justify-center px-4 text-center font-medium text-base text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary"
      data-active={isActive}
      href={`/blocks/${category.slug}`}
      key={category.slug}>
      {category.name}
    </Link>
  )
}
export const registryCategories = [
  {
    hidden: true,
    name: 'Sidebar',
    slug: 'sidebar',
  },
  {
    hidden: true,
    name: 'Dashboard',
    slug: 'dashboard',
  },
  {
    hidden: false,
    name: 'Authentication',
    slug: 'authentications',
  },
  {
    hidden: false,
    name: 'Dashboards',
    slug: 'dashboard',
  },
  {
    hidden: true,
    name: 'Calendar',
    slug: 'calendar',
  },
]
