import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckVimNavItem: ISidebarNavItem = {
  href: '/duck-vim',
  title: 'Gentleduck Vim',
  label: 'new',
  collapsible: true,
  items: [
    {
      href: '/duck-vim',
      title: 'Overview',
      items: [],
    },
    {
      href: '/duck-vim/getting-started',
      title: 'Getting Started',
      items: [],
    },
    {
      href: '/duck-vim/concepts',
      title: 'Concepts',
      items: [],
    },
    {
      href: '/duck-vim/guides',
      title: 'Guides',
      collapsible: true,
      items: [
        {
          href: '/duck-vim/guides/command-palette',
          title: 'Command Palette',
          items: [],
        }
,
        {
          href: '/duck-vim/guides/scoped-bindings',
          title: 'Scoped Bindings',
          items: [],
        }
,
        {
          href: '/duck-vim/guides/shortcut-settings',
          title: 'Shortcut Settings',
          items: [],
        }
,
        {
          href: '/duck-vim/guides/custom-framework',
          title: 'Custom Framework',
          items: [],
        }
,
      ],
    },
    {
      href: '/duck-vim/api',
      title: 'API Reference',
      collapsible: true,
      items: [
        {
          href: '/duck-vim/api/platform',
          title: 'Platform',
          items: [],
        }
,
        {
          href: '/duck-vim/api/parser',
          title: 'Parser',
          items: [],
        }
,
        {
          href: '/duck-vim/api/matcher',
          title: 'Matcher',
          items: [],
        }
,
        {
          href: '/duck-vim/api/command',
          title: 'Command',
          items: [],
        }
,
        {
          href: '/duck-vim/api/sequence',
          title: 'Sequence',
          items: [],
        }
,
        {
          href: '/duck-vim/api/recorder',
          title: 'Recorder',
          items: [],
        }
,
        {
          href: '/duck-vim/api/format',
          title: 'Format',
          items: [],
        }
,
        {
          href: '/duck-vim/api/react',
          title: 'React',
          items: [],
        }
,
      ],
    },
    {
      href: '/duck-vim/course',
      title: 'Course',
      label: 'try',
      collapsible: true,
      items: [
        {
          href: '/duck-vim/course/01-introduction',
          title: '01: Introduction',
          items: [],
        }
,
        {
          href: '/duck-vim/course/02-first-shortcut',
          title: '02: First Shortcut',
          items: [],
        }
,
        {
          href: '/duck-vim/course/03-key-bindings',
          title: '03: Key Bindings',
          items: [],
        }
,
        {
          href: '/duck-vim/course/04-react',
          title: '04: React',
          items: [],
        }
,
        {
          href: '/duck-vim/course/05-sequences',
          title: '05: Sequences',
          items: [],
        }
,
        {
          href: '/duck-vim/course/06-formatting',
          title: '06: Formatting',
          items: [],
        }
,
        {
          href: '/duck-vim/course/07-recorder',
          title: '07: Recorder',
          items: [],
        }
,
        {
          href: '/duck-vim/course/08-advanced',
          title: '08: Advanced',
          items: [],
        }
,
      ],
    },
  ],
}

export const DuckVimConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck Vim',
      items: DuckVimNavItem.items ?? [],
    },
  ],
}
