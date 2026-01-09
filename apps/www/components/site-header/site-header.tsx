'use client'

import {
  CommandMenu,
  FontStyleButton,
  HeaderBrand,
  HeaderContainer,
  HeaderRoot,
  MobileNav,
  ModeSwitcher,
  useSiteConfig,
} from '@gentleduck/docs/client'
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
import { Github, TerminalSquare, Twitter } from 'lucide-react'
import Link from 'next/link'
import type { ComponentType } from 'react'
import {
  companyCard,
  companyItems,
  documentationCard,
  documentationItems,
  productCard,
  productItems,
} from './site-header.constants'
import type { MenuCard, MenuItem } from './site-header.types'

export function SiteHeader() {
  const siteConfig = useSiteConfig()
  const github = siteConfig.links?.github ?? 'https://github.com/gentleeduck'

  return (
    <HeaderRoot className="border-b border-border/50 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/70">
      <HeaderContainer className="justify-between gap-4">
        <div className="flex items-center gap-8">
          <HeaderBrand className="shrink-0 hidden md:flex" />
          <MobileNav />

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm bg-transparent">Products</NavigationMenuTrigger>
                <MenuPanel card={productCard} items={productItems} />
              </NavigationMenuItem>
              {/* <NavigationMenuItem> */}
              {/*   <NavigationMenuTrigger className="text-sm bg-transparent">Documentation</NavigationMenuTrigger> */}
              {/*   <MenuPanel card={documentationCard} items={documentationItems} /> */}
              {/* </NavigationMenuItem> */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm bg-transparent">Company</NavigationMenuTrigger>
                <MenuPanel card={companyCard} items={companyItems(github, siteConfig.links?.twitter)} />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            <FontStyleButton />
            {siteConfig.links?.twitter ? (
              <Link aria-label="Twitter" href={siteConfig.links.twitter} rel="noreferrer" target="_blank">
                <div
                  className={cn(
                    buttonVariants({
                      size: 'icon',
                      variant: 'ghost',
                    }),
                  )}>
                  <Twitter />
                </div>
              </Link>
            ) : null}

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
          </nav>
        </div>
      </HeaderContainer>
    </HeaderRoot>
  )
}

function MenuPanel({ card, items }: { card: MenuCard; items: MenuItem[] }) {
  return (
    <NavigationMenuContent className={cn('md:w-150', items.length > 6 && 'md:w-230')}>
      <div className="grid gap-4 p-4 md:grid-cols-[280px_1fr]">
        <MenuCard {...card} />
        <ul className={cn('grid gap-2', items.length > 6 && 'grid-cols-[300px_1fr]')}>
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
            'group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border bg-linear-to-br p-4 text-white shadow-sm',
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
            'group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border bg-linear-to-br p-4 text-white shadow-sm',
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
