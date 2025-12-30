import {
  BookOpenText,
  Code2,
  FileText,
  Keyboard,
  Layers,
  LayoutGrid,
  Library,
  Move3d,
  Package,
  Puzzle,
  Server,
  Sparkles,
  Table,
  Terminal,
  TestTube,
  Workflow,
} from 'lucide-react'

const uiDocsBaseUrl = 'https://ui.gentleduck.org'

export const packages = [
  {
    description:
      'Production-ready React components, blocks, and layouts built for speed, accessibility, and consistent product delivery.',
    href: 'https://ui.gentleduck.org',
    icon: LayoutGrid,
    name: 'Gentleduck UI',
    status: 'new',
  },
  {
    description:
      'Accessible, unstyled building blocks (dialogs, popovers, tooltips, and more) to power any design system.',
    href: `${uiDocsBaseUrl}/docs/packages/duck-primitives`,
    icon: Layers,
    name: 'Gentleduck Primitives',
    status: 'new',
  },
  {
    description:
      'A focused set of reusable hooks for UI interaction, state glue, and patterns used across the ecosystem.',
    href: `${uiDocsBaseUrl}/docs/packages/duck-hooks`,
    icon: Code2,
    name: 'Gentleduck Hooks',
    status: 'new',
  },
  {
    description: 'Motion primitives and animation utilities for smooth UI interactions without fighting configuration.',
    href: '',
    icon: Move3d,
    name: 'Gentleduck Motion',
    status: 'under development',
  },
  {
    description:
      'Type-safe variant utilities for Tailwind and component APIs. Fast, ergonomic, and scalable across apps.',
    href: `${uiDocsBaseUrl}/docs/packages/duck-variants`,
    icon: Puzzle,
    name: 'Gentleduck Variants',
    status: 'new',
  },
  {
    description: 'Small, composable utilities you can import individually or bundle together across projects.',
    href: `${uiDocsBaseUrl}/docs/packages/duck-libs`,
    icon: Library,
    name: 'Gentleduck Libs',
    status: 'new',
  },
  {
    description:
      'Accessible lazy-loading for images and components using IntersectionObserver for smooth, modern performance.',
    href: `${uiDocsBaseUrl}/docs/packages/duck-lazy`,
    icon: Package,
    name: 'Gentleduck Lazy',
    status: 'new',
  },
  {
    description:
      'A tiny, framework-agnostic keyboard engine with optional React bindings for serious shortcuts and keymaps.',
    href: `${uiDocsBaseUrl}/docs/packages/duck-vim`,
    icon: Keyboard,
    name: 'Gentleduck Vim',
    status: 'new',
  },
  {
    description:
      'A fast data-fetching and caching layer designed for real apps: predictable APIs, great DX, and performance.',
    href: '',
    icon: Server,
    name: 'Gentleduck Query',
    status: 'under development',
  },
  {
    description: 'A scalable data table built for customization and large datasets, without sacrificing performance.',
    href: '',
    icon: Table,
    name: 'Gentleduck Table',
    status: 'under development',
  },
  {
    description: 'CLI workflows to install, add, and sync components, blocks, and utilities across projects.',
    href: `${uiDocsBaseUrl}/docs/packages/duck-cli`,
    icon: Terminal,
    name: 'Gentleduck UI CLI',
    status: 'new',
  },
  {
    description:
      'Compiler tooling for type-safe generation (routes, tags, and app glue) across frameworks and codebases.',
    href: '/docs/installation',
    icon: Sparkles,
    name: 'Gentleduck Gen',
    status: 'new',
  },
  {
    description: 'Type-level testing for TypeScript. Assert types at compile time to keep APIs safe as code evolves.',
    href: `${uiDocsBaseUrl}/docs/packages/duck-ttest`,
    icon: TestTube,
    name: 'Gentleduck Test',
    status: 'new',
  },
  {
    description: 'A lightweight benchmarking toolkit to measure performance regressions and validate speed claims.',
    href: '',
    icon: Workflow,
    name: 'Gentleduck Benchmark',
    status: 'planned',
  },
  {
    description:
      'A docs framework built for product teams: fast authoring, clean structure, and great reading experience.',
    href: '',
    icon: BookOpenText,
    name: 'Gentleduck Docs',
    status: 'under development',
  },
  {
    description: 'Simple, fast state management with clear patterns for both local UI state and shared app state.',
    href: '',
    icon: Workflow,
    name: 'Gentleduck State',
    status: 'under development',
  },
  {
    description:
      'A minimal server framework for APIs and services with strong types, sensible defaults, and performance focus.',
    href: '',
    icon: Server,
    name: 'Gentleduck Server',
    status: 'planned',
  },
  {
    description:
      'High-throughput structured logging designed for debugging and production observability without overhead.',
    href: '',
    icon: FileText,
    name: 'Gentleduck TTLog',
    status: 'waiting for docs',
  },
]
