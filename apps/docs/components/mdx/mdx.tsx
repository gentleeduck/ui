'use client'

import { cn } from '@gentleduck/libs/cn'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@gentleduck/registry-ui-duckui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui-duckui/alert'
import { AspectRatio } from '@gentleduck/registry-ui-duckui/aspect-ratio'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import runtime from 'react/jsx-runtime'
import { NpmCommands } from 'types/unist'
import { Event } from '~/lib/events'
import { CopyButton, CopyNpmCommandButton } from '../copy-button'
import { ComponentExample } from '../ui'
import {
  A,
  Callout,
  Code,
  CodeBlockWrapper,
  CodePreview,
  ComponentPreview,
  ComponentSource,
  FrameworkDocs,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Hr,
  LinkBlock,
  LinkedCard,
  P,
  Pre,
  Tab,
  TabContent,
  TabList,
  TabTrigger,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from './mdx-components'
import { Button } from '@gentleduck/registry-ui-duckui/button'

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

const components = {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  a: A,
  p: P,
  Link: LinkBlock,
  LinkedCard,
  Button,
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props} />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className={cn('rounded-md', className)} alt={alt} {...props} />
  ),
  hr: Hr,
  table: Table,
  tr: TableRow,
  th: TableHeader,
  td: TableCell,
  pre: Pre,
  code: Code,
  Image,
  Callout,
  ComponentPreview,
  ComponentExample,
  ComponentSource,
  AspectRatio,
  CodeBlockWrapper,
  Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={cn('font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight step', className)}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]" {...props} />
  ),
  Tabs: Tab,
  TabsList: TabList,
  TabsTrigger: TabTrigger,
  TabsContent: TabContent,
  FrameworkDocs,
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
