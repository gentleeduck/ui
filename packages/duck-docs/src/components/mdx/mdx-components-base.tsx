import { cn } from '@gentleduck/libs/cn'
import Image from 'next/image'
import type * as React from 'react'
import type { MdxComponentMap } from './mdx-component-registry.types'
import { Callout } from './mdx-components/callout'
import {
  CodeBlock,
  CodeBlockWrapper,
  ComponentPreview,
  ComponentSource,
  MermaidBlock,
  PreBlock,
} from './mdx-components/code'
import { FigcaptionBlock } from './mdx-components/code/figcaption-block'
import { ShellCommand } from './mdx-components/code/pre-block/shell-command'
import { ComponentsList } from './mdx-components/components-list'
import { Table, TableCell, TableHeader, TableRow } from './mdx-components/table'
import { Tab, TabContent, TabList, TabTrigger } from './mdx-components/tabs'
import { A, H1, H2, H3, H4, H5, H6, Hr, LinkBlock, LinkedCard, P } from './mdx-components/typography'
import { mdxIcons } from './mdx-icons'

type PreRendererProps = React.ComponentProps<typeof PreBlock> & {
  __isMermaid__?: boolean
}

export const mdxBaseComponents = {
  ...mdxIcons,
  a: A,
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props} />
  ),
  ApiRoutes: ({ children }: { children?: React.ReactNode }) => <div className="api-routes">{children}</div>,
  Callout,
  CodeBlockWrapper,
  ComponentPreview,
  ComponentSource,
  ComponentsList,
  MathMl: ({ children }: { children?: React.ReactNode }) => <span className="mathml">{children}</span>,
  MermaidSvg: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className="mermaid-svg" {...props}>
      {children}
    </div>
  ),
  PackageManagerTabs: ({ npm, yarn, pnpm, bun }: { npm?: string; yarn?: string; pnpm?: string; bun?: string }) => (
    <ShellCommand bun={bun} npm={npm} pnpm={pnpm} yarn={yarn} />
  ),
  SequenceDisplay: ({ children }: { children?: React.ReactNode }) => <div className="sequence-display">{children}</div>,
  code: CodeBlock,
  figcaption: FigcaptionBlock,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: Hr,
  Image,
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/performance/noImgElement: MDX component override for the native `img` tag
    <img alt={alt} className={cn('rounded-md', className)} {...props} />
  ),
  Link: LinkBlock,
  LinkedCard,
  li: (props: React.HTMLAttributes<HTMLElement>) => <li {...props} />,
  MermaidDiagram: MermaidBlock,
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-7 flex list-decimal flex-col gap-2', className)} {...props} />
  ),
  p: P,
  pre: (props: PreRendererProps) => {
    if (props.__isMermaid__) {
      return <MermaidBlock {...props} className="my-0 border-none [&_*]:border-none" />
    }

    return <PreBlock {...props} />
  },
  Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3 className={cn('step scroll-m-20 font-heading font-semibold text-base tracking-tight', className)} {...props} />
  ),
  Steps: ({ ...props }: React.ComponentProps<'div'>) => (
    <div className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]" {...props} />
  ),
  // Tailwind's preflight resets <strong>/<b> to `font-weight: inherit`,
  // so without an explicit mapping `**foo**` renders unbolded in the
  // docs surface. Map both intrinsics to a `font-semibold` span-style.
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn('font-semibold', className)} {...props} />
  ),
  b: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <b className={cn('font-semibold', className)} {...props} />
  ),
  em: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className={cn('italic', className)} {...props} />
  ),
  table: Table,
  Tabs: Tab,
  TabsContent: TabContent,
  TabsList: TabList,
  TabsTrigger: TabTrigger,
  td: TableCell,
  th: TableHeader,
  tr: TableRow,
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 flex list-disc flex-col gap-2', className)} {...props} />
  ),
} satisfies MdxComponentMap
