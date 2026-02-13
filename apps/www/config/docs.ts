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
          items: [],
        },
        {
          title: 'FAQs',
          href: '/docs/faqs',
          items: [],
        },
        {
          title: 'Who am I?',
          href: '/docs/whoiam',
          items: [],
        },
      ],
    },
    {
      title: 'News',
      items: [
        {
          title: "What's New",
          href: '/docs/news',
          label: 'new',
          items: [],
        },
        {
          title: 'February 2026 Updates',
          href: '/docs/news/february-2026-updates',
          label: 'new',
          items: [],
        },
        {
          title: 'Duck Gen & Duck Query',
          href: '/docs/news/duck-gen-and-query',
          label: 'new',
          items: [],
        },
        {
          title: 'Component Library',
          href: '/docs/news/component-library',
          label: 'new',
          items: [],
        },
        {
          title: 'The Ecosystem',
          href: '/docs/news/ecosystem-overview',
          label: 'new',
          items: [],
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
