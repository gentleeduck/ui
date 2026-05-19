import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { CheckCircle2, Equal, Feather, Import, Package, Split } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck TType'
const description =
  'Compile-time type testing plus 200+ TypeScript utility types. Primitives, predicates, tuples, brands, and more.'

const features = [
  {
    icon: CheckCircle2,
    title: 'AssertTrue / AssertFalse',
    description:
      'Compile-time boolean assertions with custom error messages. Failing tests show as red underlines in your editor.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Equal,
    title: 'Expect<Equal>',
    description:
      'Structural equality at the type level. Catches widening, distributive drift, and excess-property regressions.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Package,
    title: '200+ utilities',
    description:
      'Primitives, predicates, strings, tuples, objects, numbers, unions, brands. Imported individually via subpath exports.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Feather,
    title: 'Zero runtime',
    description:
      'The `.js` files are intentionally empty. Every utility is erased at build time. No bundle impact, no tree-shaking needed.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Split,
    title: 'Tree-shakeable subpaths',
    description:
      'Import `@gentleduck/ttest/string` or `/tuple`. Each domain is its own entry. You only pay for what you import.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Import,
    title: 'Framework-free',
    description:
      'No Jest, no vitest, no runner. `tsc --noEmit` is the whole story. Works in any TypeScript project, editor, or CI.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add -D @gentleduck/ttest

# Write a type test
import type { AssertTrue, Equal } from '@gentleduck/ttest/assert'

type _test = AssertTrue<Equal<Uppercase<'gentle'>, 'GENTLE'>, 'uppercase works'>`

export default async function DuckTtestPage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'typescript',
    themes: {
      dark: 'catppuccin-mocha',
      light: 'github-light',
    },
    defaultColor: 'dark',
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
    <div className="container pt-24 pb-8">
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-ttest/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/gentleeduck/gentleduck/tree/master/packages/duck-ttest"
              target="_blank"
              rel="noreferrer">
              View Source
            </Link>
          </Button>
        </div>
      </PageHeader>
      <div className="relative space-y-20">
        <div>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                200+ utility types
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Type tests that run in `tsc`
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Compile-time assertions plus a library of utility types. Catch type regressions during type-check, not
              during the next `git blame`.
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
            <p className="text-muted-foreground text-sm">
              Install as a devDep. Write tests in `.test-d.ts` files. `tsc` runs them.
            </p>
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
