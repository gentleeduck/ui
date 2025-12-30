'use client'

import { HeaderBrand, HeaderContainer, HeaderRoot, ModeSwitcher, useSiteConfig } from '@gentleduck/duck-docs'
import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@gentleduck/registry-ui-duckui/navigation-menu'
import { BookOpen, Boxes, Building2, Github, TerminalSquare } from 'lucide-react'
import Link from 'next/link'
import type { ComponentType } from 'react'

type MenuItem = {
  description: string
  external?: boolean
  href: string
  title: string
}

type MenuCard = {
  className?: string
  description: string
  external?: boolean
  href: string
  icon: ComponentType<{ className?: string }>
  label: string
  title: string
}

const productCard: MenuCard = {
  className: 'from-zinc-950 via-zinc-900 to-amber-700/70',
  description: 'Core packages that ship together and scale with your app.',
  href: '/docs',
  icon: Boxes,
  label: 'GentleDuck Stack',
  title: 'Build with the full toolkit',
}

const documentationCard: MenuCard = {
  className: 'from-slate-950 via-slate-900 to-sky-700/70',
  description: 'Guides, references, and install steps for every package.',
  href: '/docs',
  icon: BookOpen,
  label: 'Documentation',
  title: 'Start with the essentials',
}

const companyCard: MenuCard = {
  className: 'from-emerald-950 via-emerald-900 to-emerald-700/70',
  description: 'Open source, transparent roadmap, and community support.',
  external: true,
  href: 'https://github.com/gentleeduck/duck-ui',
  icon: Building2,
  label: 'Company',
  title: 'Built in public',
}

const productItems: MenuItem[] = [
  {
    description: 'General-purpose compiler extension for type-safe contracts.',
    href: '/docs/duck-gen',
    title: 'Duck Gen',
  },
  {
    description: 'Component library and registry for production UI.',
    external: true,
    href: 'https://ui.gentleduck.org',
    title: 'Duck UI',
  },
  {
    description: 'Docs app kit for Next.js, MDX, and product guides.',
    href: '/docs',
    title: 'Duck Docs',
  },
  {
    description: 'CLI tooling for scaffolding, registry sync, and setup.',
    external: true,
    href: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-cli',
    title: 'Duck CLI',
  },
]

const documentationItems: MenuItem[] = [
  {
    description: 'How the stack fits together and where to start.',
    href: '/docs',
    title: 'Overview',
  },
  {
    description: 'Install and configure the GentleDuck toolchain.',
    href: '/docs/installation',
    title: 'Installation',
  },
  {
    description: 'Compiler extension fundamentals and workflows.',
    href: '/docs/duck-gen',
    title: 'Duck Gen Docs',
  },
  {
    description: 'API route contracts, inputs, and shared types.',
    href: '/docs/duck-gen/api-routes',
    title: 'API Routes',
  },
]

const companyItems = (github: string, twitter?: string): MenuItem[] => [
  {
    description: 'Source, releases, and issue tracking.',
    external: true,
    href: github,
    title: 'GitHub',
  },
  {
    description: 'Roadmap ideas and community support.',
    external: true,
    href: 'https://github.com/gentleeduck/duck-ui/discussions',
    title: 'Discussions',
  },
  {
    description: 'Release notes for the full monorepo.',
    external: true,
    href: 'https://github.com/gentleeduck/duck-ui/releases',
    title: 'Changelog',
  },
  {
    description: 'Updates and build notes from the team.',
    external: true,
    href: twitter ?? 'https://x.com/wild_ducka',
    title: 'X / Twitter',
  },
]

export function SiteHeader() {
  const siteConfig = useSiteConfig()
  const github = siteConfig.links?.github ?? 'https://github.com/gentleeduck/duck-ui'

  return (
    <HeaderRoot className="border-b border-border/50 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/70">
      <HeaderContainer className="justify-between gap-4">
        <div className="flex items-center gap-8">
          <HeaderBrand className="shrink-0" />

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">Products</NavigationMenuTrigger>
                <MenuPanel card={productCard} items={productItems} />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">Documentation</NavigationMenuTrigger>
                <MenuPanel card={documentationCard} items={documentationItems} />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">Company</NavigationMenuTrigger>
                <MenuPanel card={companyCard} items={companyItems(github, siteConfig.links?.twitter)} />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <Link
            className={cn(
              buttonVariants({
                size: 'sm',
                variant: 'outline',
              }),
              'hidden md:inline-flex',
            )}
            href="/docs/duck-gen">
            Get Started
          </Link>
          <Link
            aria-label="GitHub"
            className={cn(
              buttonVariants({
                size: 'icon',
                variant: 'ghost',
              }),
            )}
            href={github}
            rel="noreferrer"
            target="_blank">
            <Github className="size-4" />
          </Link>
          <ModeSwitcher />
          <Link
            aria-label="Documentation"
            className={cn(
              buttonVariants({
                size: 'icon',
                variant: 'ghost',
              }),
              'md:hidden',
            )}
            href="/docs">
            <TerminalSquare className="size-4" />
          </Link>
        </div>
      </HeaderContainer>
    </HeaderRoot>
  )
}

function MenuPanel({ card, items }: { card: MenuCard; items: MenuItem[] }) {
  return (
    <NavigationMenuContent className="md:w-140">
      <div className="grid gap-4 p-4 md:grid-cols-[220px_1fr]">
        <MenuCard {...card} />
        <ul className="grid gap-2">
          {items.map((item) => (
            <MenuListItem key={item.title} {...item} />
          ))}
        </ul>
      </div>
    </NavigationMenuContent>
  )
}

function MenuCard({ className, description, external, href, icon: Icon, label, title }: MenuCard) {
  return (
    <NavigationMenuLink asChild>
      {external ? (
        <a
          className={cn(
            'group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-linear-to-br p-4 text-white shadow-sm',
            className,
          )}
          href={href}
          rel="noreferrer"
          target="_blank">
          <CardContent description={description} icon={Icon} label={label} title={title} />
        </a>
      ) : (
        <Link
          className={cn(
            'group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-linear-to-br p-4 text-white shadow-sm',
            className,
          )}
          href={href}>
          <CardContent description={description} icon={Icon} label={label} title={title} />
        </Link>
      )}
    </NavigationMenuLink>
  )
}

function CardContent({
  description,
  icon: Icon,
  label,
  title,
}: {
  description: string
  icon: ComponentType<{ className?: string }>
  label: string
  title: string
}) {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(255,255,255,0.18),transparent_65%)] opacity-80" />
      <div className="relative flex size-11 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
        <Icon className="size-5 text-white" />
      </div>
      <div className="relative space-y-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/70">{label}</p>
        <p className="text-base font-semibold leading-tight">{title}</p>
        <p className="text-sm text-white/75">{description}</p>
      </div>
    </>
  )
}

function MenuListItem({ description, external, href, title }: MenuItem) {
  const className =
    'group flex flex-col gap-1 rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground'

  if (external) {
    return (
      <li>
        <NavigationMenuLink className={className} href={href} rel="noreferrer" target="_blank">
          <span className="font-medium">{title}</span>
          <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/80">{description}</span>
        </NavigationMenuLink>
      </li>
    )
  }

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link className={className} href={href}>
          <span className="font-medium">{title}</span>
          <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/80">{description}</span>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
