'use client'

import { DocsSidebarNav } from '@gentleduck/docs/client'
import { usePathname } from 'next/navigation'
import { getPackageDocsConfig } from '~/config/docs'

export function DocsSidebarWrapper() {
  const pathname = usePathname()

  const packageSlugMatch = pathname?.match(/^\/docs\/packages\/([^/]+)/)
  const packageSlug = packageSlugMatch?.[1]
  const packageConfig = packageSlug ? getPackageDocsConfig(packageSlug) : null

  return <DocsSidebarNav config={packageConfig ?? undefined} />
}
