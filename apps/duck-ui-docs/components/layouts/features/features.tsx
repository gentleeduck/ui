'use client'

import { Card, CardTitle } from '@gentleduck/registry-ui/card'
import { Blocks, Code2, Keyboard, Layers, LayoutTemplate, Terminal } from 'lucide-react'

export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="font-medium text-2xl uppercase sm:text-3xl md:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-center text-base text-muted-foreground sm:text-lg">{subtitle}</p>
    </div>
  )
}

function FeatureCard({
  feature,
}: {
  feature: { bgColor: string; description: string; icon: React.ReactNode; textColor: string; title: string }
}) {
  return (
    <Card className="group overflow-hidden rounded-xl border border-border/60 bg-background/60 p-1 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md">
      <div className="relative p-5">
        <div
          aria-hidden="true"
          className={`mb-3 flex h-14 w-14 items-center justify-center rounded-lg ${feature.bgColor} ${feature.textColor} transition-all duration-300 group-hover:scale-105`}>
          {feature.icon}
        </div>
        <CardTitle className="mb-1 font-semibold text-lg tracking-tight sm:text-xl">{feature.title}</CardTitle>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </Card>
  )
}

const features = [
  {
    bgColor: 'bg-blue-500/10',
    description:
      'Ship faster with production-ready components that are accessible, composable, and styled with Tailwind CSS.',
    icon: <Blocks aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-blue-500',
    title: 'Build Once, Use Everywhere',
  },
  {
    bgColor: 'bg-purple-500/10',
    description: 'Unstyled, ARIA-compliant primitives give you full control over markup and styling. Own every pixel.',
    icon: <Layers aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-purple-500',
    title: 'Headless by Default',
  },
  {
    bgColor: 'bg-green-500/10',
    description: 'One command to get started. Supports Next.js, Vite, Astro, Laravel, and more out of the box.',
    icon: <Terminal aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-green-500',
    title: 'Install in Seconds',
  },
  {
    bgColor: 'bg-yellow-500/10',
    description: 'Every component, hook, and primitive is fully typed. Your editor knows what to do before you do.',
    icon: <Code2 aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-yellow-500',
    title: 'TypeScript Native',
  },
  {
    bgColor: 'bg-orange-500/10',
    description: 'A vim-style command engine with hotkey parsing, sequence recording, and playback for power users.',
    icon: <Keyboard aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-orange-500',
    title: 'Keyboard-First',
  },
  {
    bgColor: 'bg-sky-500/10',
    description: 'Auth flows, dashboards, sidebars, and charts. Drop them in, tweak the styles, and ship faster.',
    icon: <LayoutTemplate aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-sky-500',
    title: 'Pre-built Blocks',
  },
]

export function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading" className="relative isolate overflow-x-clip" id="features">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-20 z-0 h-[12rem] w-[12rem] rounded-full bg-gradient-to-br from-purple-500/12 to-indigo-400/8 blur-[90px] md:h-[18rem] md:w-[18rem]"></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-32 z-0 h-[10rem] w-[10rem] rounded-full bg-gradient-to-tl from-blue-500/10 to-cyan-400/6 blur-[100px] md:h-[16rem] md:w-[16rem]"></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/3 z-0 h-[8rem] w-[8rem] rounded-full bg-gradient-to-r from-emerald-400/5 to-teal-400/4 blur-[80px] md:h-[14rem] md:w-[14rem]"></div>

      <div className="container relative mx-auto py-24 sm:py-32 lg:py-40">
        <SectionTitle
          subtitle="Everything you need to build fast, accessible interfaces, all in one ecosystem."
          title="Why Duck UI"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard feature={feature} key={feature.title} />
          ))}
        </div>
      </div>
    </section>
  )
}
