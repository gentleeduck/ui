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
    <footer className="w-full py-6 md:px-8 md:py-0">
      <div className="container relative mx-auto flex flex-col items-center justify-between gap-4 border-x border-t md:h-24 md:flex-row [&::after]:absolute [&::after]:-top-1.25 [&::after]:-right-px [&::after]:z-50 [&::after]:border-t-[5px] [&::after]:border-t-transparent [&::after]:border-r-[5px] [&::after]:border-r-border [&::after]:border-b-[5px] [&::after]:border-b-transparent [&::after]:border-l-[5px] [&::after]:border-l-transparent [&::after]:content-[''] [&::before]:absolute [&::before]:-top-1.25 [&::before]:-left-px [&::before]:z-50 [&::before]:border-t-[5px] [&::before]:border-t-transparent [&::before]:border-r-[5px] [&::before]:border-r-transparent [&::before]:border-b-[5px] [&::before]:border-b-transparent [&::before]:border-l-[5px] [&::before]:border-l-border [&::before]:content-['']">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
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
