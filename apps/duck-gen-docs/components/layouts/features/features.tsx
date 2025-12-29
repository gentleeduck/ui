'use client'

import { Card, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { FileText, Layers, Package, Puzzle, Rocket, Server, Terminal, Zap } from 'lucide-react'

/**
 * SectionTitle component for consistent headings across sections
 */
export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="font-medium text-5xl uppercase sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-center text-lg text-muted-foreground">{subtitle}</p>
    </div>
  )
}

/**
 * FeatureCard component displaying individual feature with icon and description
 */
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

/**
 * Features data array containing all product features with their details
 */
const features = [
  {
    bgColor: 'rgba(59, 130, 246, 0.1)',
    description: 'Generate API contracts from framework controllers so clients stay aligned (tested with NestJS).',
    icon: <Zap aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(59, 130, 246)',
    title: 'Contract-First Generation',
  },
  {
    bgColor: 'rgba(234, 179, 8, 0.1)',
    description: 'Create request and response types for every route without manual duplication.',
    icon: <Server aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(234, 179, 8)',
    title: 'Typed Routes & DTOs',
  },
  {
    bgColor: 'rgba(168, 85, 247, 0.1)',
    description: 'Extract message tags into typed keys for predictable i18n workflows.',
    icon: <FileText aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(168, 85, 247)',
    title: 'Message Tag Safety',
  },
  {
    bgColor: 'rgba(34, 197, 94, 0.1)',
    description: 'Produce structured outputs that plug into clients, SDKs, and docs.',
    icon: <Layers aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(34, 197, 94)',
    title: 'Composable Output',
  },
  {
    bgColor: 'rgba(249, 115, 22, 0.1)',
    description: 'Generate once or stay in sync during development with watch mode.',
    icon: <Terminal aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(249, 115, 22)',
    title: 'CLI + Watch Mode',
  },
  {
    bgColor: 'rgba(14, 165, 233, 0.1)',
    description: 'Built for multiple frameworks, currently being tested with NestJS.',
    icon: <Puzzle aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(14, 165, 233)',
    title: 'Framework Friendly',
  },
]

/**
 * Main Features component
 */
export function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading" className="relative" id="features">
      {/* Background elements */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
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

        {/* Feature highlight */}
        <div className="mt-24 rounded-xl border border-border/50 bg-background/50 p-8 lg:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <div
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10 md:h-24 md:w-24">
              <Layers className="h-10 w-10 text-primary md:h-12 md:w-12" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl tracking-tight">OUR ECOSYSTEM</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                We've built our own ecosystem from the ground up, continuously refining and expanding our core packages.
                Every component is designed to work seamlessly together, giving developers the tools they need to build
                faster, scale with confidence, and stay focused on creating value.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </span>
                  <span className="font-medium text-sm">Core packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Puzzle className="h-4 w-4 text-primary" />
                  </span>
                  <span className="font-medium text-sm">Seamless integrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Rocket className="h-4 w-4 text-primary" />
                  </span>
                  <span className="font-medium text-sm">Continuous innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
