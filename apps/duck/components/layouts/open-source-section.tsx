import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui/button'
import Link from 'next/link'
import { siteConfig } from '~/config/site'

export function OpenSourceSection({ className }: { className?: string }) {
  return (
    <section className={cn('container-wrapper', className)}>
      <div className="container">
        <div className="mb-24 flex flex-col items-center py-16 text-center md:py-24">
          <div className="flex max-w-xl flex-col items-center gap-6">
            <div>
              <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
                Free &amp; open source
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                gentleduck is MIT licensed and will always be free and open source. Every package ships with full source
                access — fork it, modify it, own it.
              </p>
            </div>

            <Link
              className={buttonVariants({ size: 'default', variant: 'outline', className: 'mx-auto w-fit' })}
              href={siteConfig.links?.sponsor ?? 'https://opencollective.com/gentelduck'}
              rel="noreferrer"
              target="_blank">
              Become a Sponsor
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
