'use client'

import { useSiteConfig } from '@duck-docs/context'
import { cn } from '@gentleduck/libs/cn'
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'

type HeaderRootProps = React.HTMLAttributes<HTMLElement>

type HeaderContainerProps = React.HTMLAttributes<HTMLDivElement>

type HeaderBrandProps = {
  className?: string
  href?: string
  logoClassName?: string
  name?: string
  nameClassName?: string
  showName?: boolean
}

type HeaderSectionProps = React.HTMLAttributes<HTMLDivElement>

export function HeaderRoot({ className, ...props }: HeaderRootProps) {
  return <header className={cn('sticky top-0 z-[47] w-full', className)} {...props} />
}

export function HeaderContainer({ className, children, ...props }: HeaderContainerProps) {
  return (
    <div className="container-wrapper">
      <div className={cn('container flex h-16 items-center justify-between gap-2 md:gap-4', className)} {...props}>
        {children}
      </div>
    </div>
  )
}

export function HeaderBrand({
  className,
  href = '/',
  logoClassName,
  name,
  nameClassName,
  showName = true,
}: HeaderBrandProps) {
  const siteConfig = useSiteConfig()
  const logoDark = siteConfig.branding?.logoDark ?? '/icons/dark.png'
  const logoLight = siteConfig.branding?.logoLight ?? '/icons/light.png'
  const label = name ?? siteConfig.name
  const nameClasses = nameClassName ?? 'hidden font-bold lg:inline-block'

  return (
    <Link className={cn('flex items-center gap-2 text-foreground', className)} href={href}>
      <Image
        alt="Logo"
        className={cn('hidden h-6 w-6 dark:block', logoClassName)}
        height={512}
        src={logoDark}
        width={512}
      />
      <Image
        alt="Logo"
        className={cn('block h-6 w-6 dark:hidden', logoClassName)}
        height={512}
        src={logoLight}
        width={512}
      />
      {showName ? <span className={nameClasses}>{label}</span> : null}
    </Link>
  )
}

export function HeaderSection({ className, ...props }: HeaderSectionProps) {
  return <div className={cn('flex items-center gap-2', className)} {...props} />
}
