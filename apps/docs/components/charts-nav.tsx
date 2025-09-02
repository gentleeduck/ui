'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@gentleduck/duck-libs/cn'

const links = [
  {
    name: 'Area Chart',
    href: '/charts#area-chart',
  },
  {
    name: 'Bar Chart',
    href: '/charts#bar-chart',
  },
  {
    name: 'Line Chart',
    href: '/charts#line-chart',
  },
  {
    name: 'Pie Chart',
    href: '/charts#pie-chart',
  },
  {
    name: 'Radar Chart',
    href: '/charts#radar-chart',
  },
  {
    name: 'Radial Chart',
    href: '/charts#radial-chart',
  },
  {
    name: 'Tooltip',
    href: '/charts#tooltip',
  },
]

export function ChartsNav({ className, ...props }: React.ComponentProps<'div'>) {
  const pathname = usePathname()

  return (
    <div className={cn('flex items-center max-w-[600px] lg:max-w-none hide-scroll', className)} {...props}>
      {links.map((example, index) => (
        <Link
          href={example.href}
          key={example.href}
          className={cn(
            'flex h-7 shrink-0 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary',
            pathname?.startsWith(example.href) || (index === 0 && pathname === '/')
              ? 'bg-muted font-medium text-primary'
              : 'text-muted-foreground',
          )}>
          {example.name}
        </Link>
      ))}
    </div>
  )
}
