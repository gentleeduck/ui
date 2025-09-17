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
          <BlocksNavLink category={{ name: 'Featured', slug: '', hidden: false }} isActive={pathname === '/blocks'} />
          {registryCategories.map((category) => (
            <BlocksNavLink key={category.slug} category={category} isActive={pathname === `/blocks/${category.slug}`} />
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
      href={`/blocks/${category.slug}`}
      key={category.slug}
      className="text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 items-center justify-center px-4 text-center text-base font-medium transition-colors"
      data-active={isActive}>
      {category.name}
    </Link>
  )
}
export const registryCategories = [
  {
    name: 'Sidebar',
    slug: 'sidebar',
    hidden: false,
  },
  {
    name: 'Dashboard',
    slug: 'dashboard',
    hidden: true,
  },
  {
    name: 'Authentication',
    slug: 'authentication',
    hidden: false,
  },
  {
    name: 'Login',
    slug: 'login',
    hidden: false,
  },
  {
    name: 'Calendar',
    slug: 'calendar',
    hidden: false,
  },
]
