'use client'

import { cn } from '@gentleduck/libs/cn'
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { siteConfig } from '~/config/site'

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
  return <header className={cn('sticky top-0 z-47 w-full bg-background/80 backdrop-blur-md', className)} {...props} />
}

export function HeaderContainer({ className, children, ...props }: HeaderContainerProps) {
  return (
    <div className="container-wrapper">
      <div className={cn('container relative z-47 flex h-16 items-center justify-between gap-2', className)} {...props}>
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
  const logoDark = '/icons/icon-dark.png'
  const logoLight = '/icons/icon.png'
  const label = name ?? siteConfig.name
  const nameClasses = nameClassName ?? 'hidden font-bold lg:inline-block'

  return (
    <Link className={cn('flex items-center gap-2 text-foreground', className)} href={href}>
      <Image
        alt={`${label} logo`}
        className={cn('hidden h-6 w-6 dark:block', logoClassName)}
        height={512}
        src={logoDark}
        width={512}
      />
      <Image
        alt={`${label} logo`}
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
