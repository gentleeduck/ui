'use client'

import { Card, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { Accessibility, Code2, Layers, Package, Paintbrush, Puzzle, Rocket, Table, Zap } from 'lucide-react'

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
        className="absolute top-1/4 left-1/4 z-0 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div
        aria-hidden="true"
        className="absolute right-1/4 bottom-1/4 z-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>

      <div className="container relative mx-auto py-24 sm:py-32 lg:py-40">
        <SectionTitle
          subtitle="Everything you need to build fast, accessible UI primitives and scalable design systems."
          title="Powerful Features"
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
