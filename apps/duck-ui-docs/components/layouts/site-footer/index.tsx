import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { HeartIcon, Mail } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '~/config/site'

export function SiteFooter() {
  return (
    <footer className="w-full border-t py-6 md:px-8 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-muted-foreground text-sm leading-loose md:text-left">
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
        href="https://github.com/sponsors/wildduck2"
        target="_blank">
        <HeartIcon className="mr-2 h-4 w-4 fill-current text-red-600" />
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
