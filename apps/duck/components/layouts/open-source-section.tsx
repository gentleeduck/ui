import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui/button'
import Link from 'next/link'
import { siteConfig } from '~/config/site'

const SPONSORS: { name: string; href: string }[] = [
  { name: 'StackBlitz', href: 'https://stackblitz.com' },
  { name: 'Netlify', href: 'https://netlify.com' },
  { name: 'Nx', href: 'https://nx.dev' },
  { name: 'JetBrains', href: 'https://jetbrains.com' },
  { name: 'Nuxt Labs', href: 'https://nuxtlabs.com' },
]

export function OpenSourceSection({ className }: { className?: string }) {
  return (
    <section className={cn('container-wrapper', className)}>
      <div className="container">
        <div className="flex flex-col items-center py-16 text-center md:py-24">
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
              className={buttonVariants({ size: 'sm', variant: 'outline', className: 'mx-auto w-fit' })}
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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
