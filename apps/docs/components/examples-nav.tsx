'use client'

import { cn } from '@gentleduck/libs/cn'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const examples = [
  {
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/mail',
    href: '/examples/mail',
    name: 'Mail',
  },
  {
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/dashboard',
    href: '/examples/dashboard',
    name: 'Dashboard',
  },
  {
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/cards',
    href: '/examples/cards',
    name: 'Cards',
  },
  {
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/tasks',
    href: '/examples/tasks',
    name: 'Tasks',
  },
  {
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/playground',
    href: '/examples/playground',
    name: 'Playground',
  },
  {
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/forms',
    href: '/examples/forms',
    name: 'Forms',
  },
  {
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/music',
    href: '/examples/music',
    name: 'Music',
  },
  {
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/authentication',
    href: '/examples/authentication',
    name: 'Authentication',
  },
]

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ExamplesNav({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname()

  return (
    <div className="relative">
      <div className="max-w-[600px] lg:max-w-none hide-scroll">
        <div className={cn('mb-4 flex items-center', className)} {...props}>
          {examples.map((example, index) => (
            <Link
              className={cn(
                'flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary',
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
      </div>
    </div>
  )
}

interface ExampleCodeLinkProps {
  pathname: string | null
}

export function ExampleCodeLink({ pathname }: ExampleCodeLinkProps) {
  const example = examples.find((example) => pathname?.startsWith(example.href))

  if (!example?.code) {
    return null
  }

  return (
    <Link
      className="absolute right-0 top-0 hidden items-center rounded-[0.5rem] text-sm font-medium md:flex"
      href={example?.code}
      rel="nofollow"
      target="_blank">
      View code
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  )
}
