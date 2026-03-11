import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionTitle } from '~/components/layouts/features'

interface Sponsor {
  name: string
  href: string
  avatar: string
}

const sponsors: Sponsor[] = [
  {
    avatar: 'https://aibrush.co/sparkles.svg',
    href: 'https://aibrush.co',
    name: 'AIBrush',
  },
]

function SponsorCell({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Link
      className="group flex items-center justify-center gap-3 border-border/60 border-r border-b px-8 py-6 transition-colors last:border-r-0 hover:bg-muted/40"
      href={sponsor.href}
      rel="noreferrer"
      target="_blank">
      <Image
        alt={sponsor.name}
        className="size-8 shrink-0 rounded-full object-cover"
        height={32}
        src={sponsor.avatar}
        unoptimized
        width={32}
      />
      <span className="font-semibold text-foreground text-lg tracking-tight">{sponsor.name}</span>
    </Link>
  )
}

export function SponsorsSection() {
  return (
    <section aria-labelledby="sponsors-heading" className="relative isolate overflow-x-clip" id="sponsors">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-16 z-0 h-[10rem] w-[10rem] rounded-full bg-gradient-to-br from-pink-500/10 to-rose-400/6 blur-[80px] md:h-[16rem] md:w-[16rem]"></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-28 z-0 h-[9rem] w-[9rem] rounded-full bg-gradient-to-tl from-orange-400/8 to-amber-400/5 blur-[90px] md:h-[14rem] md:w-[14rem]"></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 right-1/4 z-0 h-[7rem] w-[7rem] rounded-full bg-gradient-to-b from-fuchsia-400/5 to-purple-400/3 blur-[80px] md:h-[12rem] md:w-[12rem]"></div>

      <div className="container relative mx-auto py-24 sm:py-32">
        <SectionTitle subtitle="The people and organizations that keep this project alive." title="Partners" />

        <div
          className={`mx-auto mt-12 overflow-hidden rounded-xl border border-border/60 ${sponsors.length > 1 ? 'max-w-2xl' : 'max-w-sm'}`}>
          <div className={`grid grid-cols-1 ${sponsors.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {sponsors.map((sponsor) => (
              <SponsorCell key={sponsor.name} sponsor={sponsor} />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            className="group/support inline-flex items-center gap-2 rounded-lg border border-border/50 px-5 py-2.5 text-muted-foreground text-sm transition-colors hover:border-red-500/70 hover:text-foreground"
            href={process.env.NEXT_PUBLIC_SPONSOR_URL ?? 'https://opencollective.com/gentelduck'}
            rel="noreferrer"
            target="_blank">
            <Heart
              aria-hidden="true"
              className="size-4 fill-transparent stroke-current transition-all duration-300 ease-out group-hover/support:animate-[heart-pop_420ms_cubic-bezier(0.22,1,0.36,1)_both] group-hover/support:fill-red-500/75 group-hover/support:stroke-red-400 group-hover/support:text-red-400"
            />
            Become a Sponsor
          </Link>
        </div>
      </div>
    </section>
  )
}
