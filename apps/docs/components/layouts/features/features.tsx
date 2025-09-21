'use client'

import { Card, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { Accessibility, Code2, Layers, Package, Paintbrush, Puzzle, Rocket, Table, Zap } from 'lucide-react'

/**
 * SectionTitle component for consistent headings across sections
 */
export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="text-5xl font-medium sm:text-4xl uppercase">{title}</h2>
      <p className="text-muted-foreground mt-4 max-w-2xl text-center text-lg">{subtitle}</p>
    </div>
  )
}

/**
 * FeatureCard component displaying individual feature with icon and description
 */
function FeatureCard({ feature, index }: { feature: any; index: number }) {
  return (
    <Card
      className="border-border/50 bg-background/60 hover:border-primary/20 group overflow-hidden rounded-xl border p-1 transition-all duration-300 hover:shadow-lg"
      key={index}>
      <div className="relative p-5">
        <div
          aria-hidden="true"
          className="group-hover:bg-opacity-80 mb-3 flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-300"
          style={{ backgroundColor: feature.bgColor, color: feature.textColor }}>
          {feature.icon}
        </div>
        <CardTitle className="mb-1 text-xl font-semibold tracking-tight">{feature.title}</CardTitle>
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
    description:
      'Lightweight, fast, and scalable React UI primitives designed with performance and accessibility in mind.',
    icon: <Zap aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(59, 130, 246)',
    title: 'High Performance',
  },
  {
    bgColor: 'rgba(234, 179, 8, 0.1)',
    description:
      'Fully typed with TypeScript, offering rock-solid type safety, autocompletion, and zero room for runtime surprises.',
    icon: <Code2 aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(234, 179, 8)',
    title: 'Type-Safe by Design',
  },
  {
    bgColor: 'rgba(168, 85, 247, 0.1)',
    description:
      'Low-level, composable building blocks for creating complex UI components without being locked into rigid patterns.',
    icon: <Layers aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(168, 85, 247)',
    title: 'Composable Primitives',
  },
  {
    bgColor: 'rgba(34, 197, 94, 0.1)',
    description:
      'Optimized data components like DuckTable with virtual scrolling, advanced filtering, sorting, and undo/redo support. (coming soon)',
    icon: <Table aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(34, 197, 94)',
    title: 'Data-Heavy UI',
  },
  {
    bgColor: 'rgba(249, 115, 22, 0.1)',
    description: 'Built-in accessibility and keyboard navigation for dropdowns, modals, and menus — no hacks required.',
    icon: <Accessibility aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(249, 115, 22)',
    title: 'Accessible by Default',
  },
  {
    bgColor: 'rgba(14, 165, 233, 0.1)',
    description:
      'Tailwind CSS v4 plugin ecosystem with utilities, configs, and design tokens to power consistent theming.',
    icon: <Paintbrush aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(14, 165, 233)',
    title: 'Theming & Styling',
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
        className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl z-0"></div>
      <div
        aria-hidden="true"
        className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl z-0"></div>

      <div className="relative mx-auto py-24 sm:py-32 lg:py-40 container">
        <SectionTitle
          subtitle="Everything you need to manage relationships, close deals, and grow your business effectively."
          title="Powerful Features"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard feature={feature} index={i} key={i} />
          ))}
        </div>

        {/* Feature highlight */}
        <div className="border-border/50 bg-background/50 mt-24 rounded-xl border p-8 lg:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <div
              aria-hidden="true"
              className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-lg md:h-24 md:w-24">
              <Layers className="text-primary h-10 w-10 md:h-12 md:w-12" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold tracking-tight">OUR ECOSYSTEM</h3>
              <p className="text-muted-foreground mt-4 text-lg">
                We’ve built our own ecosystem from the ground up, continuously refining and expanding our core packages.
                Every component is designed to work seamlessly together, giving developers the tools they need to build
                faster, scale with confidence, and stay focused on creating value.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Package className="text-primary h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">Core packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Puzzle className="text-primary h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">Seamless integrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Rocket className="text-primary h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">Continuous innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
