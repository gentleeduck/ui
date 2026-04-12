'use client'

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbPage,
  MotionBreadcrumbItem,
  MotionBreadcrumbList,
  MotionBreadcrumbSeparator,
} from '@gentleduck/registry-ui/breadcrumb'
import Link from 'next/link'

export default function Demo() {
  return (
    <Breadcrumb>
      <MotionBreadcrumbList>
        <MotionBreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </MotionBreadcrumbItem>
        <MotionBreadcrumbSeparator />
        <MotionBreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs">Docs</Link>
          </BreadcrumbLink>
        </MotionBreadcrumbItem>
        <MotionBreadcrumbSeparator />
        <MotionBreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs/components">Components</Link>
          </BreadcrumbLink>
        </MotionBreadcrumbItem>
        <MotionBreadcrumbSeparator />
        <MotionBreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </MotionBreadcrumbItem>
      </MotionBreadcrumbList>
    </Breadcrumb>
  )
}
