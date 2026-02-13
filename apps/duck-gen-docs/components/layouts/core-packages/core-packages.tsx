import Link from 'next/link'
import { SectionTitle } from '../features'
import { packages } from './core-packages.constants'

function EcosystemCard({ pkg, index }: { pkg: (typeof packages)[number]; index: number }) {
  const Icon = pkg.icon
  const statusStyles: Record<string, string> = {
    new: 'border border-green-500/20 bg-green-500/10 text-green-600',
    planned: 'border border-orange-500/20 bg-orange-500/10 text-orange-600',
    'under development': 'border border-zinc-400/20 bg-zinc-500/5 text-zinc-500',
    'waiting for docs': 'border border-orange-500/20 bg-orange-500/10 text-orange-600',
  }
  const Content = () => (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-lg">{pkg.name}</h3>
            <span
              className={`rounded-full px-2 py-0.5 font-medium text-xs ${
                statusStyles[pkg.status] ?? 'border border-slate-500/20 bg-slate-500/10 text-slate-600'
              }`}>
              {pkg.status}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{pkg.description}</p>
    </>
  )
  return pkg.href.length > 0 ? (
    <Link
      className="rounded-xl border border-border/50 bg-background/60 p-6 shadow-sm transition-colors hover:bg-background/80"
      href={pkg.href}>
      <Content />
    </Link>
  ) : (
    <div className="rounded-xl border border-border/50 bg-background/60 p-6 shadow-sm transition-colors hover:bg-background/80">
      <Content />
    </div>
  )
}

export function EcosystemSection() {
  return (
    <section aria-labelledby="ecosystem-heading" className="relative" id="ecosystem">
      {/* Background elements */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 z-0 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"></div>
      <div
        aria-hidden="true"
        className="absolute right-1/4 bottom-1/4 z-0 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl"></div>

      <div className="container relative mx-auto pb-24 sm:pb-32 lg:pb-40">
        <SectionTitle
          subtitle="A growing ecosystem of tools, primitives, and utilities for modern development."
          title="The Gentleduck Ecosystem"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <EcosystemCard index={i} key={i} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  )
}
