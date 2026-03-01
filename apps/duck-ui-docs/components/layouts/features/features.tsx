'use client'

import { Card, CardTitle } from '@gentleduck/registry-ui/card'
import { Blocks, Code2, Keyboard, Layers, LayoutTemplate, Terminal } from 'lucide-react'

export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="font-medium text-5xl uppercase sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-center text-lg text-muted-foreground">{subtitle}</p>
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
        <CardTitle className="mb-1 font-semibold text-xl tracking-tight">{feature.title}</CardTitle>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </Card>
  )
}

const features = [
  {
    bgColor: 'bg-blue-500/10',
    description:
      'Stop rebuilding the same UI from scratch. Ship faster with production-ready components that just work -- accessible, composable, and styled with Tailwind CSS.',
    icon: <Blocks aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-blue-500',
    title: 'Build Once, Use Everywhere',
  },
  {
    bgColor: 'bg-purple-500/10',
    description:
      'Own every pixel. Unstyled, ARIA-compliant primitives give you full control over markup and styling -- no fighting the framework.',
    icon: <Layers aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-purple-500',
    title: 'Headless by Default',
  },
  {
    bgColor: 'bg-green-500/10',
    description:
      'One command. Pick your framework. Start building. Supports Next.js, Vite, Astro, Laravel, and more out of the box.',
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
    description:
      'A built-in vim-style command engine with hotkey parsing, sequence recording, and playback. Power users will love you.',
    icon: <Keyboard aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-orange-500',
    title: 'Keyboard-First',
  },
  {
    bgColor: 'bg-sky-500/10',
    description:
      'Auth flows, dashboards, sidebars, charts -- drop them in, tweak the styles, and move on to what matters.',
    icon: <LayoutTemplate aria-hidden="true" className="h-7 w-7" />,
    textColor: 'text-sky-500',
    title: 'Pre-built Blocks',
  },
]

export function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading" className="relative" id="features">
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 z-0 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div
        aria-hidden="true"
        className="absolute right-1/4 bottom-1/4 z-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>

      <div className="container relative mx-auto py-24 sm:py-32 lg:py-40">
        <SectionTitle
          subtitle="Stop gluing libraries together. Everything you need to build fast, accessible interfaces -- in one ecosystem."
          title="Why duck ui"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard feature={feature} key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
