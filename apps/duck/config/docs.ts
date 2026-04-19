import type { IDocsConfig } from '@gentleduck/docs/context'
import { DuckCalendarNavItem } from './packages/duck-calendar'
import { DuckCliNavItem } from './packages/duck-cli'
import { DuckHooksNavItem } from './packages/duck-hooks'
import { DuckLazyNavItem } from './packages/duck-lazy'
import { DuckLibsNavItem } from './packages/duck-libs'
import { DuckMotionNavItem } from './packages/duck-motion'
import { DuckPrimitivesNavItem } from './packages/duck-primitives'
import { DuckRegistryBuildNavItem } from './packages/duck-registry-build'
import { DuckShortcutNavItem } from './packages/duck-shortcut'
import { DuckStateNavItem } from './packages/duck-state'
import { DuckVariantsNavItem } from './packages/duck-variants'
import { DuckVimNavItem } from './packages/duck-vim'

export * from './packages/duck-calendar'
export * from './packages/duck-cli'
export * from './packages/duck-hooks'
export * from './packages/duck-lazy'
export * from './packages/duck-libs'
export * from './packages/duck-motion'
export * from './packages/duck-primitives'
export * from './packages/duck-registry-build'
export * from './packages/duck-shortcut'
export * from './packages/duck-state'
export * from './packages/duck-variants'
export * from './packages/duck-vim'

export const docsConfig: IDocsConfig = {
  chartsNav: [],
  mainNav: [
    {
      href: '/docs',
      title: 'Documentation',
    },
    {
      href: '/components',
      title: 'Components',
    },
    {
      href: '/blocks',
      title: 'Blocks',
    },
    {
      href: '/themes',
      title: 'Themes',
    },
    {
      href: '/charts/area',
      title: 'Charts',
    },
  ],
  sidebarNav: [
    {
      collapsible: false,
      items: [
        {
          href: '/docs',
          items: [],
          title: 'Introduction',
        },
        {
          href: '/docs/installation',
          collapsible: true,
          items: [
            {
              href: '/docs/installation/next',
              items: [],
              title: 'Next.js',
            },
            {
              href: '/docs/installation/vite',
              items: [],
              title: 'Vite',
            },
            {
              href: '/docs/installation/astro',
              items: [],
              title: 'Astro',
            },
            {
              href: '/docs/installation/laravel',
              items: [],
              title: 'Laravel',
            },
            {
              href: '/docs/installation/react-router',
              items: [],
              title: 'React Router',
            },
            {
              href: '/docs/installation/tanstack',
              items: [],
              title: 'TanStack Start',
            },
            {
              href: '/docs/installation/tanstack-router',
              items: [],
              title: 'TanStack Router',
            },
            {
              href: '/docs/installation/manual',
              items: [],
              title: 'Manual Installation',
            },
            {
              href: '/docs/installation/monorepo',
              items: [],
              title: 'Monorepo',
            },
          ],
          title: 'Installation',
        },
        {
          href: '/docs/components',
          items: [],
          title: 'Components',
        },
        {
          href: '/docs/theming',
          items: [],
          title: 'Theming',
        },
        {
          href: '/docs/javascript',
          items: [],
          title: 'JavaScript',
        },
        {
          href: '/docs/mdx',
          items: [],
          title: 'MDX Authoring',
        },
        {
          href: '/docs/dark-theme',
          collapsible: true,
          items: [
            {
              href: '/docs/dark-theme/next',
              items: [],
              title: 'Next.js',
            },
            {
              href: '/docs/dark-theme/vite',
              items: [],
              title: 'Vite',
            },
            {
              href: '/docs/dark-theme/astro',
              items: [],
              title: 'Astro',
            },
            {
              href: '/docs/dark-theme/remix',
              items: [],
              title: 'Remix',
            },
          ],
          title: 'Dark Theme',
        },
        {
          href: '/docs/mcp',
          items: [],
          label: 'new',
          title: 'MCP Server',
        },
        {
          href: '/docs/skills',
          items: [],
          label: 'new',
          title: 'Agent Skills',
        },
        {
          href: '/docs/faqs',
          items: [],
          title: 'FAQs',
        },
        {
          href: '/docs/whoiam',
          items: [],
          title: 'Who am I?',
        },
        {
          href: '/docs/changelog',
          collapsible: true,
          label: 'new',
          items: [
            {
              href: '/docs/changelog/march-2026',
              items: [],
              label: 'new',
              title: 'March 2026',
            },
            {
              href: '/docs/changelog/february-2026',
              items: [],
              title: 'February 2026',
            },
            {
              href: '/docs/changelog/january-2026',
              items: [],
              title: 'January 2026',
            },
            {
              href: '/docs/changelog/december-2025',
              items: [],
              title: 'December 2025',
            },
            {
              href: '/docs/changelog/november-2025',
              items: [],
              title: 'November 2025',
            },
            {
              href: '/docs/changelog/october-2025',
              items: [],
              title: 'October 2025',
            },
            {
              href: '/docs/changelog/september-2025',
              items: [],
              title: 'September 2025',
            },
            {
              href: '/docs/changelog/august-2025',
              items: [],
              title: 'August 2025',
            },
            {
              href: '/docs/changelog/july-2025',
              items: [],
              title: 'July 2025',
            },
            {
              href: '/docs/changelog/june-2025',
              items: [],
              title: 'June 2025',
            },
            {
              href: '/docs/changelog/may-2025',
              items: [],
              title: 'May 2025',
            },
            {
              href: '/docs/changelog/april-2025',
              items: [],
              title: 'April 2025',
            },
            {
              href: '/docs/changelog/2024',
              items: [],
              title: '2024',
            },
          ],
          title: 'Changelog',
        },
      ],
      title: 'Getting Started',
    },
    {
      collapsible: false,
      items: [
        DuckCliNavItem,
        DuckRegistryBuildNavItem,
        DuckLazyNavItem,
        DuckVariantsNavItem,
        DuckVimNavItem,
        DuckPrimitivesNavItem,
        DuckLibsNavItem,
        DuckHooksNavItem,
        DuckMotionNavItem,
        DuckStateNavItem,
        DuckCalendarNavItem,
        DuckShortcutNavItem,
      ],
      title: 'Core Packages',
    },
    {
      collapsible: false,
      items: [
        {
          href: '/docs/comparisons/vs-react-day-picker',
          items: [],
          title: 'vs react-day-picker',
        },
        {
          href: '/docs/comparisons/vs-radix',
          items: [],
          title: 'vs Radix UI',
        },
        {
          href: '/docs/comparisons/vs-shadcn',
          items: [],
          title: 'vs shadcn/ui',
        },
      ],
      title: 'Comparisons',
    },
    {
      collapsible: false,
      items: [
        {
          href: '/docs/components/accordion',
          items: [],
          label: 'new',
          title: 'Accordion',
        },
        {
          href: '/docs/components/alert',
          items: [],
          label: 'new',
          title: 'Alert',
        },
        {
          href: '/docs/components/alert-dialog',
          items: [],
          label: 'new',
          title: 'Alert Dialog',
        },
        {
          href: '/docs/components/aspect-ratio',
          items: [],
          label: 'new',
          title: 'Aspect Ratio',
        },
        {
          href: '/docs/components/avatar',
          items: [],
          label: 'new',
          title: 'Avatar',
        },
        {
          href: '/docs/components/badge',
          items: [],
          label: 'new',
          title: 'Badge',
        },
        {
          href: '/docs/components/breadcrumb',
          items: [],
          label: 'new',
          title: 'Breadcrumb',
        },
        {
          href: '/docs/components/button',
          items: [],
          label: 'new',
          title: 'Button',
        },
        {
          href: '/docs/components/button-group',
          items: [],
          label: 'new',
          title: 'Button Group',
        },
        {
          href: '/docs/components/calendar',
          items: [],
          label: 'new',
          title: 'Calendar',
        },
        {
          href: '/docs/components/card',
          items: [],
          label: 'new',
          title: 'Card',
        },
        {
          href: '/docs/components/carousel',
          items: [],
          title: 'Carousel',
        },
        {
          href: '/docs/components/chart',
          items: [],
          label: 'new',
          title: 'Chart',
        },
        {
          href: '/docs/components/checkbox',
          items: [],
          label: 'new',
          title: 'Checkbox',
        },
        {
          href: '/docs/components/collapsible',
          items: [],
          label: 'new',
          title: 'Collapsible',
        },
        {
          href: '/docs/components/combobox',
          items: [],
          label: 'new',
          title: 'Combobox',
        },
        {
          href: '/docs/components/command',
          items: [],
          label: 'new',
          title: 'Command',
        },
        {
          href: '/docs/components/context-menu',
          items: [],
          label: 'new',
          title: 'Context Menu',
        },
        {
          href: '/docs/components/data-table',
          items: [],
          title: 'Data Table',
        },
        {
          href: '/docs/components/date-picker',
          items: [],
          label: 'new',
          title: 'Date Picker',
        },
        {
          href: '/docs/components/direction',
          items: [],
          title: 'Direction',
        },
        {
          href: '/docs/components/dialog',
          items: [],
          label: 'new',
          title: 'Dialog',
        },
        {
          href: '/docs/components/drawer',
          items: [],
          title: 'Drawer',
        },
        {
          href: '/docs/components/dropdown-menu',
          items: [],
          label: 'new',
          title: 'Dropdown Menu',
        },
        {
          href: '/docs/components/empty',
          items: [],
          label: 'new',
          title: 'Empty',
        },
        {
          href: '/docs/components/field',
          items: [],
          label: 'new',
          title: 'Field',
        },
        {
          href: '/docs/components/navigation-menu',
          items: [],
          label: 'new',
          title: 'Navigation Menu',
        },
        {
          href: '/docs/components/react-hook-form',
          items: [],
          title: 'React Hook Form',
        },
        {
          href: '/docs/components/hover-card',
          items: [],
          label: 'new',
          title: 'Hover Card',
        },
        {
          href: '/docs/components/item',
          items: [],
          label: 'new',
          title: 'Item',
        },
        {
          href: '/docs/components/input',
          items: [],
          label: 'new',
          title: 'Input',
        },
        {
          href: '/docs/components/input-group',
          items: [],
          label: 'new',
          title: 'Input Group',
        },
        {
          href: '/docs/components/json-editor',
          items: [],
          label: 'new',
          title: 'JSON Editor',
        },
        {
          href: '/docs/components/input-otp',
          items: [],
          label: 'new',
          title: 'Input OTP',
        },
        {
          href: '/docs/components/kbd',
          items: [],
          label: 'new',
          title: 'Kbd',
        },
        {
          href: '/docs/components/label',
          items: [],
          label: 'new',
          title: 'Label',
        },
        {
          href: '/docs/components/menubar',
          items: [],
          label: 'new',
          title: 'Menubar',
        },
        {
          href: '/docs/components/pagination',
          items: [],
          label: 'new',
          title: 'Pagination',
        },
        {
          href: '/docs/components/popover',
          items: [],
          label: 'new',
          title: 'Popover',
        },
        {
          href: '/docs/components/preview-panel',
          items: [],
          label: 'new',
          title: 'Preview Panel',
        },
        {
          href: '/docs/components/progress',
          items: [],
          label: 'new',
          title: 'Progress',
        },
        {
          href: '/docs/components/radio-group',
          items: [],
          label: 'new',
          title: 'Radio Group',
        },
        {
          href: '/docs/components/resizable',
          items: [],
          label: 'new',
          title: 'Resizable',
        },
        {
          href: '/docs/components/scroll-area',
          items: [],
          label: 'new',
          title: 'Scroll Area',
        },
        {
          href: '/docs/components/select',
          items: [],
          label: 'new',
          title: 'Select',
        },
        {
          href: '/docs/components/separator',
          items: [],
          label: 'new',
          title: 'Separator',
        },
        {
          href: '/docs/components/sheet',
          items: [],
          label: 'new',
          title: 'Sheet',
        },
        {
          href: '/docs/components/sidebar',
          items: [],
          label: 'new',
          title: 'Sidebar',
        },
        {
          href: '/docs/components/skeleton',
          items: [],
          label: 'new',
          title: 'Skeleton',
        },
        {
          href: '/docs/components/slider',
          items: [],
          label: 'new',
          title: 'Slider',
        },
        {
          href: '/docs/components/sonner',
          items: [],
          title: 'Sonner',
        },
        {
          href: '/docs/components/switch',
          items: [],
          label: 'new',
          title: 'Switch',
        },
        {
          href: '/docs/components/table',
          items: [],
          label: 'new',
          title: 'Table',
        },
        {
          href: '/docs/components/tanstack-form',
          items: [],
          title: 'TanStack Form',
        },
        {
          href: '/docs/components/tabs',
          items: [],
          label: 'new',
          title: 'Tabs',
        },
        {
          href: '/docs/components/textarea',
          items: [],
          label: 'new',
          title: 'Text Area',
        },
        {
          href: '/docs/components/toggle',
          items: [],
          label: 'new',
          title: 'Toggle',
        },
        {
          href: '/docs/components/toggle-group',
          items: [],
          label: 'new',
          title: 'Toggle Group',
        },
        {
          href: '/docs/components/tooltip',
          items: [],
          label: 'new',
          title: 'Tooltip',
        },
        // {
        //   title: 'Upload',
        //   href: '/docs/components/upload',
        //   items: [],
        // },
        {
          href: '/docs/components/typography',
          items: [],
          label: 'new',
          title: 'Typography',
        },
      ],
      title: 'Components',
    },
  ],
}

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
  ...extractTitles(docsConfig.chartsNav ?? []),
]

