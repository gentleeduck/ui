import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Component, FileText, Lock, Package, Server, Users } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { PackageStatusBadge } from '~/components/package-status-badge'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck IAM'
const description =
  'ABAC + RBAC access control engine. Server adapters for Express, NestJS, Hono, and Next.js. Client bindings for React and Vue.'

const features = [
  {
    icon: Lock,
    title: 'ABAC engine',
    description:
      'Attribute-based rules over subject, resource, action, and context. Combine predicates, negate them, trace the decision.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'RBAC roles',
    description: 'Typed roles and role hierarchies. Use alone, or layer ABAC predicates on top for per-resource rules.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: FileText,
    title: 'Policy DSL',
    description: 'Declarative policies with typed keys. Typos in action or resource names fail at compile time.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Server,
    title: 'Server adapters',
    description:
      'Middleware for Express, NestJS, Hono, and Next.js route handlers. One policy graph runs the same everywhere.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Component,
    title: 'React + Vue clients',
    description:
      'Typed `<Can />` components and hooks. The UI shows or hides using the same policies the API enforces.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Package,
    title: 'Explain + benchmarks',
    description:
      'Every decision ships with a reason trace. Designed to stay under a microsecond per check. See the benchmarks page.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/iam

# Define a policy
import { createEngine } from '@gentleduck/iam'

export const iam = createEngine({
  roles: { admin: ['*'], editor: ['post:write'] },
})`

export default async function DuckIamPage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'typescript',
    themes: {
      dark: 'catppuccin-macchiato',
      light: 'light-plus',
    },
    transformers: [
      {
        pre(node) {
          node.properties.class =
            'no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none !bg-transparent text-sm font-mono'
        },
      },
    ],
  })

  return (
    <div className="container py-8">
      <PageHeader>
        <PackageStatusBadge status="wip" />
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <PageHeaderHeading className="max-w-none">{title}</PageHeaderHeading>
        </div>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-iam/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-iam/core">Core Concepts</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="relative space-y-20">
        <div>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                ABAC + RBAC
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              One policy graph. Server and client.
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Define roles and predicates once. The server enforces. The UI projects. Swap frameworks without rewriting
              access rules.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, bg, color }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1 font-mono font-semibold text-sm">{title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-8 flex flex-col items-center gap-1 text-center">
            <h2 className="font-semibold text-xl leading-tight tracking-tight">Install</h2>
            <p className="text-muted-foreground text-sm">Pick an adapter on the server or the client.</p>
          </div>
          <div className="relative mx-auto max-w-2xl">
            <CopyButton value={INSTALL_CODE} variant="ghost" className="absolute top-3 right-3" />
            <div
              className="overflow-hidden rounded-lg border border-border/50 bg-muted/30 [&_pre]:bg-transparent!"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </div>
        </div>

        <OpenSourceSection className="!px-0" />
      </div>
    </div>
  )
}
