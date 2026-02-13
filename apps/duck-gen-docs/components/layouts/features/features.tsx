'use client'

import { Card, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { features } from './features.constants'

export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="font-medium text-5xl uppercase sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-center text-lg text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  return (
    <Card
      className="group overflow-hidden rounded-xl border border-border/50 bg-background/60 p-1 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
      key={index}>
      <div className="relative p-5">
        <div
          aria-hidden="true"
          className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-300 group-hover:bg-opacity-80"
          style={{ backgroundColor: feature.bgColor, color: feature.textColor }}>
          {feature.icon}
        </div>
        <CardTitle className="mb-1 font-semibold text-xl tracking-tight">{feature.title}</CardTitle>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </Card>
  )
}

export function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading" className="relative" id="features">
      {/* Background elements */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 z-0 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div
        aria-hidden="true"
        className="absolute right-1/4 bottom-1/4 z-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>

      <div className="container relative mx-auto py-24 sm:py-32 lg:py-40">
        <SectionTitle
          subtitle="General-purpose compiler extension that generates type-safe API contracts and message tags, currently tested with NestJS."
          title="Built for Duck Gen"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard feature={feature} index={i} key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
