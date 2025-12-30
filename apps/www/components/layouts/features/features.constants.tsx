import { Code2, Layers, LayoutGrid, Rocket, Sparkles, Terminal } from 'lucide-react'
import { FeatureItem } from './features.types'

export const features: FeatureItem[] = [
  {
    bgColor: 'rgba(16, 185, 129, 0.12)',
    description:
      'A unified UI platform including components, blocks, motion, hooks, and registries, built to keep large products consistent and fast to evolve.',
    icon: <LayoutGrid aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(16, 185, 129)',
    title: 'UI Platforms and Registries',
  },
  {
    bgColor: 'rgba(59, 130, 246, 0.12)',
    description:
      'Low-level primitives and interaction engines for accessibility, keyboard input, shortcuts, and complex UI behavior.',
    icon: <Layers aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(59, 130, 246)',
    title: 'Interaction and Primitives',
  },
  {
    bgColor: 'rgba(245, 158, 11, 0.12)',
    description:
      'Compiler and code-generation tools for producing type-safe APIs, routes, tags, and cross-framework glue.',
    icon: <Sparkles aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(245, 158, 11)',
    title: 'Compiler and Generation Tooling',
  },
  {
    bgColor: 'rgba(14, 116, 144, 0.12)',
    description:
      'CLI-driven workflows for installing, scaffolding, syncing, and maintaining tools across projects and teams.',
    icon: <Terminal aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(14, 116, 144)',
    title: 'CLI and Developer Experience',
  },
  {
    bgColor: 'rgba(249, 115, 22, 0.12)',
    description:
      'Performance-focused systems tooling including benchmarking, structured logging, and runtime utilities.',
    icon: <Rocket aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(249, 115, 22)',
    title: 'Systems and Performance Tools',
  },
  {
    bgColor: 'rgba(34, 197, 94, 0.12)',
    description:
      'Testing, state, and data libraries that help teams ship safely with predictable behavior and strong guarantees.',
    icon: <Code2 aria-hidden="true" className="h-7 w-7" />,
    textColor: 'rgb(34, 197, 94)',
    title: 'Testing, State, and Data',
  },
]
