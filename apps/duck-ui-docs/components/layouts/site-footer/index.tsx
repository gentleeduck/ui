import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { HeartIcon, Mail } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '~/config/site'

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              className="font-medium underline underline-offset-4"
              href={siteConfig.links.twitter}
              rel="noreferrer"
              target="_blank">
              Ahmed Ayob
            </a>
            . The source code is available on{' '}
            <a
              className="font-medium underline underline-offset-4"
              href={siteConfig.links.github}
              rel="noreferrer"
              target="_blank">
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="gap-4 items-center hidden md:flex">
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
        href="https://github.com/sponsors/wildduck2"
        target="_blank">
        <HeartIcon className="h-4 w-4 mr-2 text-red-600 fill-current" />
        Sponsor
      </Link>
      <Link
        className={buttonVariants({ size: 'sm', variant: 'outline' })}
        href="mailto:duckui@duck.com"
        target="_blank">
        <Mail />
        <span className="">Email</span>
      </Link>
    </>
  )
}
