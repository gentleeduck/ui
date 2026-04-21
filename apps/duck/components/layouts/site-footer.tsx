'use client'

import { buttonVariants } from '@gentleduck/registry-ui/button'
import { HeartIcon, Mail } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '~/config/site'

export function SiteFooter() {
  const authorName = siteConfig.author?.name ?? siteConfig.name
  const authorUrl = siteConfig.author?.url ?? siteConfig.links?.twitter
  const githubUrl = siteConfig.links?.github

  return (
    <footer className="w-full border-t py-6 md:px-8 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-balance text-center text-muted-foreground text-sm leading-loose md:text-left">
            Built by{' '}
            {authorUrl ? (
              <a className="font-medium underline underline-offset-4" href={authorUrl} rel="noreferrer" target="_blank">
                {authorName}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span className="font-medium">{authorName}</span>
            )}
            {githubUrl ? (
              <>
                . The source code is available on{' '}
                <a
                  className="font-medium underline underline-offset-4"
                  href={githubUrl}
                  rel="noreferrer"
                  target="_blank">
                  GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                .
              </>
            ) : null}
          </p>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <FooterButtons />
        </div>
      </div>
    </footer>
  )
}

export function FooterButtons() {
  return (
    <>
      <Link
        className={buttonVariants({ size: 'sm', variant: 'outline' })}
        href={siteConfig.links?.sponsor ?? 'https://opencollective.com/gentelduck'}
        rel="noreferrer"
        target="_blank">
        <HeartIcon aria-hidden="true" className="mr-2 h-4 w-4 fill-current text-red-600" />
        Sponsor
        <span className="sr-only"> (opens in a new tab)</span>
      </Link>
      <Link
        className={buttonVariants({ size: 'sm', variant: 'outline' })}
        href={siteConfig.links?.email ? `mailto:${siteConfig.links.email}` : 'mailto:support@gentleduck.org'}>
        <Mail aria-hidden="true" />
        <span>Email</span>
      </Link>
    </>
  )
}
