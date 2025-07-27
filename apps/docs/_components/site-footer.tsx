import { siteConfig } from '@/config/site'
import { buttonVariants } from '@/registry/registry-ui-components'
import { HeartIcon } from 'lucide-react'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between py-6 md:px-8 md:py-0 container">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{' '}
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Ahmed Ayob
          </a>
          . The source code is available on{' '}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
      <div className="gap-4 items-center hidden md:flex">
        <FooterButtons />
      </div>
    </footer>
  )
}

export function FooterButtons() {
  return (
    <>
      <Link
        href="https://github.com/sponsors/wildduck2"
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        <HeartIcon className="h-4 w-4 mr-2 text-red-600 fill-current" />
        Sponsor
      </Link>
    </>
  )
}
