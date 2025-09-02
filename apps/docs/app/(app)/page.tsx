'use client'

import Link from 'next/link'

import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/page-header'
import { Button, buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { cn } from '@gentleduck/libs/cn'
import { toast } from 'sonner'
import { CommandMenu } from '~/components/layouts'

export default function IndexPage() {
  return (
    <>
      <div className="grid gap-8 grid-cols-2 select-none container h-[90svh]">
        <PageHeader className="flex flex-col justify-center px-0">
          <PageHeaderHeading className="text-3xl font-semibold mb-3 sm:text-7xl lg:text-6xl px-0">
            Build Beautiful UIs with Simplicity and Power.
          </PageHeaderHeading>
          <PageHeaderDescription className="mb-3 sm:text-xl max-w-[800px] text-muted-foreground font-normal">
            Bring life to your own website with a pack full of ideas made specially for magical websites.
          </PageHeaderDescription>
          <Link
            href={'/docs/components/button'}
            className={cn(
              buttonVariants({
                variant: 'default',
                size: '2xl',
              }),
            )}>
            Get Stared
          </Link>
        </PageHeader>
        <div className="flex flex-col justify-center items-center">
          <img
            src={'/home.avif'}
            width={570}
            height={530}
            className="w-full"
            alt="3 people happy to see you using duck ui"
          />
        </div>
      </div>
    </>
  )
}
