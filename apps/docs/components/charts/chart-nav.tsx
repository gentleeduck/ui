'use client'

import { cn } from '@gentleduck/libs/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  {
    href: '/charts/area',
    name: 'Area Chart',
  },
  {
    href: '/charts/bar',
    name: 'Bar Chart',
  },
  {
    href: '/charts/line',
    name: 'Line Chart',
  },
  {
    href: '/charts/pie',
    name: 'Pie Chart',
  },
  {
    href: '/charts/radar',
    name: 'Radar Chart',
  },
  {
    href: '/charts/radial',
    name: 'Radial Chart',
  },
  {
    href: '/charts/tooltip',
    name: 'Tooltip',
  },
]

export function ChartsNav({ className, ...props }: React.ComponentProps<'div'>) {
  const pathname = usePathname()

  return (
    <div className={cn('flex items-center max-w-[600px] lg:max-w-none hide-scroll', className)} {...props}>
      {links.map((example, index) => (
        <Link
          className={cn(
            'flex h-7 shrink-0 items-center justify-center rounded-lg px-4 text-center text-sm transition-colors hover:text-primary',
            pathname?.startsWith(example.href) || (index === 0 && pathname === '/')
              ? 'bg-muted font-medium text-primary'
              : 'text-muted-foreground',
          )}
          href={example.href}
          key={example.href}>
          {example.name}
        </Link>
      ))}
    </div>
  )
}
