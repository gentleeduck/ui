import { cn } from '@gentleduck/libs/cn'
import Link from 'next/link'

export function CtaSection({ className }: { className?: string }) {
  return (
    <section className={cn('container-wrapper mb-8', className)}>
      <div className="container">
        <div className="relative overflow-hidden rounded-none">
          {/* Gradient background */}
          <div
            className="relative flex min-h-95 flex-col items-center justify-center px-6 py-24 text-center"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.55 0.25 264 / 0.55) 0%, oklch(0.45 0.22 280 / 0.35) 40%, transparent 75%), oklch(0.12 0.02 264)',
            }}>
            {/* Noise texture overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundSize: '200px 200px',
              }}
            />

            {/* Radial glow rings */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, oklch(0.65 0.28 260 / 0.08) 0deg, transparent 60deg, oklch(0.65 0.28 280 / 0.08) 120deg, transparent 180deg, oklch(0.65 0.28 260 / 0.08) 240deg, transparent 300deg, oklch(0.65 0.28 260 / 0.08) 360deg)',
              }}
            />

            <div className="relative space-y-6">
              <h2 className="mx-auto max-w-xl text-balance font-semibold text-3xl text-white leading-tight tracking-tight sm:text-4xl xl:text-5xl">
                Start building with gentleduck
              </h2>
              <p className="mx-auto max-w-md text-base text-white/60 sm:text-lg">
                Install the CLI, pick your components, and ship. Zero config, full ownership.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/www/installation"
                  className="inline-flex items-center rounded-md bg-white px-5 py-2.5 font-semibold text-black text-sm transition-opacity hover:opacity-90">
                  Get Started
                </Link>
                <Link
                  href="/www/packages"
                  className="inline-flex items-center rounded-md border-white/20 px-5 py-2.5 font-medium text-sm text-white/80 transition-colors hover:border-white/40 hover:text-white">
                  Browse Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
