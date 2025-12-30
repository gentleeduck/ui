import { FileText, Layers, Package, Puzzle, Rocket, Server, Terminal, Zap } from 'lucide-react'
export const features = [
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
