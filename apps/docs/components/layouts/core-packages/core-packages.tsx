import { Code2, Keyboard, Layers, Library, Move3d, Package, Puzzle, Table, Terminal, TestTube } from 'lucide-react'
import Link from 'next/link'
import { SectionTitle } from '../features'

const packages = [
  {
    description:
      'Lightweight and accessible React library for lazy-loading images and components. Uses IntersectionObserver to load content only when visible, ensuring smooth performance and accessibility.',
    href: '/docs/packages/duck-lazy',
    icon: Package,
    name: 'Gentleduck Lazy',
    status: 'new',
  },
  {
    description:
      'Type-safe utility for generating class names from variant configs. Designed to be fast, ergonomic, and easy to use in both small components and large-scale design systems.',
    href: '/docs/packages/duck-variants',
    icon: Puzzle,
    name: 'Gentleduck Variants',
    status: 'new',
  },
  {
    description:
      'Tiny, framework-agnostic keyboard command engine with optional React bindings. Enables powerful keymaps and shortcuts for building fast, efficient workflows.',
    href: '/docs/packages/duck-vim',
    icon: Keyboard,
    name: 'Gentleduck Vim',
    status: 'new',
  },
  {
    description:
      'Foundational set of UI primitives for building consistent, accessible components. Provides low-level building blocks for design systems and custom interfaces.',
    href: '/docs/packages/duck-primitives',
    icon: Layers,
    name: 'Gentleduck Primitives',
    status: 'new',
  },
  {
    description:
      'Collection of tiny, framework-agnostic React libraries. Each utility can be imported individually or bundled together, giving flexibility and modularity.',
    href: '/docs/packages/duck-libs',
    icon: Library,
    name: 'Gentleduck Libs',
    status: 'new',
  },
  {
    description:
      'Reusable React hooks designed for the duck-ui ecosystem. Covers state, effects, and UI interactions to accelerate component development and consistency.',
    href: '/docs/packages/duck-hooks',
    icon: Code2,
    name: 'Gentleduck Hooks',
    status: 'new',
  },
  {
    description:
      'TypeScript type-level testing framework. Lets you assert and validate types at compile time, ensuring safety and reliability in complex codebases.',
    href: '/docs/packages/duck-ttest',
    icon: TestTube,
    name: 'Gentleduck Ttest',
    status: 'new',
  },
  {
    description:
      'CLI tool for installing, managing, and generating components, blocks, and utilities from the ecosystem. Streamlines setup and speeds up workflow.',
    href: '/docs/packages/duck-cli',
    icon: Terminal,
    name: 'Gentleduck Duck/Ui CLI',
    status: 'new',
  },
  {
    description:
      'Rust-powered project scaffolding tool for starting apps quickly. Provides customizable templates so developers never have to begin from scratch.',
    href: '/docs/packages/duck-template',
    icon: Terminal,
    name: 'Gentleduck Duck Template',
    status: 'new',
  },
  {
    description:
      'Advanced, performant, and flexible data table for React. Designed for scalability, customization, and handling large datasets with ease.',
    href: '',
    icon: Table,
    name: 'Gentleduck Table',
    status: 'coming soon',
  },
  {
    description:
      'Animation and variant utilities for smooth, interactive UI experiences. Build dynamic motion-driven interfaces with minimal configuration.',
    href: '',
    icon: Move3d,
    name: 'Gentleduck Motion',
    status: 'coming soon',
  },
]

function EcosystemCard({ pkg, index }: { pkg: (typeof packages)[number]; index: number }) {
  const Icon = pkg.icon
  const Content = () => (
    <>
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
          <Icon className="text-primary h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{pkg.name}</h3>
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
              pkg.status === 'new' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
            }`}>
            {pkg.status}
          </span>
        </div>
      </div>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{pkg.description}</p>
    </>
  )
  return pkg.href.length > 0 ? (
    <Link
      className="border-border/50 bg-background/60 hover:bg-background/80 transition-colors rounded-xl border p-6 shadow-sm"
      href={pkg.href}>
      <Content />
    </Link>
  ) : (
    <div className="border-border/50 bg-background/60 hover:bg-background/80 transition-colors rounded-xl border p-6 shadow-sm">
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
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 z-0 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"></div>
      <div
        aria-hidden="true"
        className="absolute right-1/4 bottom-1/4 z-0 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl"></div>

      <div className="relative mx-auto py-24 sm:py-32 lg:py-40 container">
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
