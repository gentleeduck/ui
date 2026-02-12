'use client'

import { cn } from '@gentleduck/libs/cn'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@gentleduck/registry-ui-duckui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui-duckui/alert'
import { AspectRatio } from '@gentleduck/registry-ui-duckui/aspect-ratio'
import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Kbd } from '@gentleduck/registry-ui-duckui/kbd'
import Image from 'next/image'
import type * as React from 'react'
import runtime from 'react/jsx-runtime'
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
import { ComponentsList } from './mdx-components/components-list'
import { Table, TableCell, TableHeader, TableRow } from './mdx-components/table'
import { Tab, TabContent, TabList, TabTrigger } from './mdx-components/tabs'
import { A, H1, H2, H3, H4, H5, H6, Hr, LinkBlock, LinkedCard, P } from './mdx-components/typepography'
import { mdxIcons } from './mdx-icons'

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

const components = {
  ...mdxIcons,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  AspectRatio,
  a: A,
  Badge,
  Button,
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props} />
  ),
  Callout,
  CodeBlockWrapper,
  ComponentPreview,
  ComponentSource,
  ComponentsList,
  code: CodeBlock,
  figcaption: FigcaptionBlock,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: Hr,
  // span: SpanBlock,
  Image,
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={alt} className={cn('rounded-md', className)} {...props} />
  ),
  Kbd: Kbd,
  Link: LinkBlock,
  LinkedCard,
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  p: P,
  MermaidDiagram: MermaidBlock,
  pre: (props: any) => {
    if (props.__isMermaid__) {
      return <MermaidBlock {...props} />
    }
    return <PreBlock {...props} />
  },
  Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3 className={cn('step scroll-m-20 font-heading font-semibold text-xl tracking-tight', className)} {...props} />
  ),
  Steps: ({ ...props }) => (
    <div className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]" {...props} />
  ),
  Tabs: Tab,
  TabsContent: TabContent,
  TabsList: TabList,
  TabsTrigger: TabTrigger,
  table: Table,
  td: TableCell,
  th: TableHeader,
  tr: TableRow,
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  // FrameworkDocs,
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)

  return (
    <div className="mdx">
      <Component components={components} />
    </div>
  )
}
