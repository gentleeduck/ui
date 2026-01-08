import type { DocsConfig } from '@gentleduck/docs/context'

export const docsConfig = {
  chartsNav: [],
  mainNav: [
    {
      href: '/docs',
      title: 'Documentation',
    },
  ],
  sidebarNav: [
    {
      collapsible: false,
      items: [
        {
          href: '/docs',
          title: 'Introduction',
        },
        {
          href: '/docs/installation',
          title: 'Installation',
        },
        {
          href: '/docs/templates',
          title: 'Templates',
        },
        {
          href: '/docs/faqs',
          title: 'FAQs',
        },
        {
          href: '/docs/whoiam',
          title: 'whoiam',
        },
      ],
      title: 'Getting Started',
    },
    {
      collapsible: false,
      items: [
        {
          href: '/docs/duck-gen',
          title: 'Core',
        },
        {
          href: '/docs/duck-gen/api-routes',
          title: 'API Routes',
        },
        {
          href: '/docs/duck-gen/messages',
          title: 'Messages',
        },
        {
          href: '/docs/duck-query',
          title: 'Duck Query',
        },
      ],
      title: 'Overview',
    },
  ],
} satisfies DocsConfig

type NavItem = {
  title: string
  href?: string
  label?: string
  items?: NavItem[]
}

function extractTitles(navItems: NavItem[]): string[] {
  const titles: string[] = []

  for (const item of navItems) {
    if (item.title) {
      titles.push(item.title)
    }

    if (item.items && item.items.length > 0) {
      titles.push(...extractTitles(item.items))
    }
  }

  return titles
}

export const allTitles = [
  ...extractTitles(docsConfig.mainNav),
  ...extractTitles(docsConfig.sidebarNav),
  ...extractTitles(docsConfig.chartsNav),
]
