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
    href: '/docs',
    icon: LayoutGrid,
    name: 'duck-ui',
    status: 'new',
  },
  {
    description:
      'Accessible, unstyled building blocks (dialogs, popovers, tooltips, and more) to power any design system.',
    href: `/docs/packages/duck-primitives`,
    icon: Layers,
    name: 'duck-ui Primitives',
    status: 'new',
  },
  {
    description:
      'A focused set of reusable hooks for UI interaction, state glue, and patterns used across the ecosystem.',
    href: `/docs/packages/duck-hooks`,
    icon: Code2,
    name: 'duck-ui Hooks',
    status: 'new',
  },
  {
    description: 'Motion primitives and animation utilities for smooth UI interactions without fighting configuration.',
    href: '',
    icon: Move3d,
    name: 'duck-ui Motion',
    status: 'under development',
  },
  {
    description:
      'Type-safe variant utilities for Tailwind and component APIs. Fast, ergonomic, and scalable across apps.',
    href: `/docs/packages/duck-variants`,
    icon: Puzzle,
    name: 'duck-ui Variants',
    status: 'new',
  },
  {
    description: 'Small, composable utilities you can import individually or bundle together across projects.',
    href: `/docs/packages/duck-libs`,
    icon: Library,
    name: 'duck-ui Libs',
    status: 'new',
  },
  {
    description:
      'Accessible lazy-loading for images and components using IntersectionObserver for smooth, modern performance.',
    href: `/docs/packages/duck-lazy`,
    icon: Package,
    name: 'duck-ui Lazy',
    status: 'new',
  },
  {
    description:
      'A tiny, framework-agnostic keyboard engine with optional React bindings for serious shortcuts and keymaps.',
    href: `/docs/packages/duck-vim`,
    icon: Keyboard,
    name: 'duck-ui Vim',
    status: 'new',
  },
  {
    description:
      'A fast data-fetching and caching layer designed for real apps: predictable APIs, great DX, and performance.',
    href: '',
    icon: Server,
    name: 'duck-ui Query',
    status: 'under development',
  },
  {
    description: 'A scalable data table built for customization and large datasets, without sacrificing performance.',
    href: '',
    icon: Table,
    name: 'duck-ui Table',
    status: 'under development',
  },
  {
    description: 'CLI workflows to install, add, and sync components, blocks, and utilities across projects.',
    href: `/docs/packages/duck-cli`,
    icon: Terminal,
    name: 'duck-ui CLI',
    status: 'new',
  },
  {
    description:
      'Compiler tooling for type-safe generation (routes, tags, and app glue) across frameworks and codebases.',
    href: 'https://gen.gentleduck.org/docs/installation',
    icon: Sparkles,
    name: 'duck-ui Gen',
    status: 'new',
  },
  {
    description: 'Type-level testing for TypeScript. Assert types at compile time to keep APIs safe as code evolves.',
    href: `/docs/packages/duck-ttest`,
    icon: TestTube,
    name: 'duck-ui Test',
    status: 'new',
  },
  {
    description: 'A lightweight benchmarking toolkit to measure performance regressions and validate speed claims.',
    href: '',
    icon: Workflow,
    name: 'duck-ui Benchmark',
    status: 'planned',
  },
  {
    description:
      'A docs framework built for product teams: fast authoring, clean structure, and great reading experience.',
    href: '',
    icon: BookOpenText,
    name: 'duck-ui Docs',
    status: 'under development',
  },
  {
    description: 'Simple, fast state management with clear patterns for both local UI state and shared app state.',
    href: '',
    icon: Workflow,
    name: 'duck-ui State',
    status: 'under development',
  },
  {
    description:
      'A minimal server framework for APIs and services with strong types, sensible defaults, and performance focus.',
    href: '',
    icon: Server,
    name: 'duck-ui Server',
    status: 'planned',
  },
  {
    description:
      'High-throughput structured logging designed for debugging and production observability without overhead.',
    href: '',
    icon: FileText,
    name: 'duck-ui TTLog',
    status: 'waiting for docs',
  },
]
