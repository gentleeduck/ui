'use client'

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  MotionBreadcrumbItem,
} from '@gentleduck/registry-ui/breadcrumb'
import Link from 'next/link'

export default function Demo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <MotionBreadcrumbItem index={0}>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </MotionBreadcrumbItem>
        <BreadcrumbSeparator />
        <MotionBreadcrumbItem index={1}>
          <BreadcrumbLink asChild>
            <Link href="/docs">Docs</Link>
          </BreadcrumbLink>
        </MotionBreadcrumbItem>
        <BreadcrumbSeparator />
        <MotionBreadcrumbItem index={2}>
          <BreadcrumbLink asChild>
            <Link href="/docs/components">Components</Link>
          </BreadcrumbLink>
        </MotionBreadcrumbItem>
        <BreadcrumbSeparator />
        <MotionBreadcrumbItem index={3}>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </MotionBreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
