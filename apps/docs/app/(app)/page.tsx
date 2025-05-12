'use client'

import Link from 'next/link'

import { siteConfig } from '~/config/site'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/page-header'
import { Button, buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { cn } from '@gentleduck/libs/cn'
import { toast } from 'sonner'
import { CommandMenu } from '~/components/layouts'

export default function IndexPage() {
  return (
    <>
      <div className="grid gap-8 grid-cols-2 select-none container h-[90svh]">
        <CommandMenu />
      </div>
    </>
  )
}
