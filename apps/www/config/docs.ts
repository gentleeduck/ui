import type { DocsConfig } from '@gentleduck/docs/context'

export const docsConfig = {
  chartsNav: [],
  mainNav: [],
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Overview',
          href: '/docs',
        },
        {
          title: 'What’s new',
          label: 'check me!',
          href: '/docs/news',
        },
        {
          title: 'FAQs',
          href: '/docs/faqs',
        },
        {
          title: 'whoiam',
          href: '/docs/whoiam',
        },
      ],
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
