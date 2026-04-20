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
  return (
    <header className={cn('sticky top-0 z-47 w-full pr-(--removed-body-scroll-bar-size,0)', className)} {...props} />
  )
}

export function HeaderContainer({ className, children, ...props }: HeaderContainerProps) {
  return (
    <div className="container-wrapper">
      <div
        className={cn(
          'container relative z-47 flex h-16 items-center justify-between gap-2 border-x md:gap-4 [&::after]:absolute [&::after]:-right-px [&::after]:-bottom-1.25 [&::after]:z-50 [&::after]:border-t-[5px] [&::after]:border-t-transparent [&::after]:border-r-[5px] [&::after]:border-r-border [&::after]:border-b-[5px] [&::after]:border-b-transparent [&::after]:border-l-[5px] [&::after]:border-l-transparent [&::after]:content-[""] [&::before]:absolute [&::before]:-bottom-1.25 [&::before]:-left-px [&::before]:z-50 [&::before]:border-t-[5px] [&::before]:border-t-transparent [&::before]:border-r-[5px] [&::before]:border-r-transparent [&::before]:border-b-[5px] [&::before]:border-b-transparent [&::before]:border-l-[5px] [&::before]:border-l-border [&::before]:content-[""]',
          className,
        )}
        {...props}>
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
  const logoDark = '/icons/dark.png'
  const logoLight = '/icons/light.png'
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
