import type { DocsConfig } from '@gentleduck/docs/context'

export const docsConfig: DocsConfig = {
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
        {
          href: '/docs/packages/duck-cli',
          items: [],
          title: 'Gentleduck CLI',
        },
        {
          href: '/docs/packages/duck-lazy',
          items: [],
          title: 'Gentleduck Lazy',
        },
        {
          href: '/docs/packages/duck-variants',
          items: [],
          title: 'Gentleduck Variants',
        },
        {
          href: '/docs/packages/duck-vim',
          collapsible: true,
          label: 'new',
          items: [
            {
              href: '/docs/packages/duck-vim',
              items: [],
              title: 'Overview',
            },
            {
              href: '/docs/packages/duck-vim/getting-started',
              items: [],
              title: 'Getting Started',
            },
            {
              href: '/docs/packages/duck-vim/concepts',
              items: [],
              title: 'Concepts',
            },
            {
              href: '/docs/packages/duck-vim/guides',
              title: 'Guides',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-vim/guides/command-palette',
                  items: [],
                  title: 'Command Palette',
                },
                {
                  href: '/docs/packages/duck-vim/guides/scoped-bindings',
                  items: [],
                  title: 'Scoped Bindings',
                },
                {
                  href: '/docs/packages/duck-vim/guides/shortcut-settings',
                  items: [],
                  title: 'Shortcut Settings',
                },
                {
                  href: '/docs/packages/duck-vim/guides/custom-framework',
                  items: [],
                  title: 'Custom Framework',
                },
              ],
            },
            {
              href: '/docs/packages/duck-vim/api',
              title: 'API Reference',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-vim/api/platform',
                  items: [],
                  title: 'Platform',
                },
                {
                  href: '/docs/packages/duck-vim/api/parser',
                  items: [],
                  title: 'Parser',
                },
                {
                  href: '/docs/packages/duck-vim/api/matcher',
                  items: [],
                  title: 'Matcher',
                },
                {
                  href: '/docs/packages/duck-vim/api/command',
                  items: [],
                  title: 'Command',
                },
                {
                  href: '/docs/packages/duck-vim/api/sequence',
                  items: [],
                  title: 'Sequence',
                },
                {
                  href: '/docs/packages/duck-vim/api/recorder',
                  items: [],
                  title: 'Recorder',
                },
                {
                  href: '/docs/packages/duck-vim/api/format',
                  items: [],
                  title: 'Format',
                },
                {
                  href: '/docs/packages/duck-vim/api/react',
                  items: [],
                  title: 'React',
                },
              ],
            },
            {
              href: '/docs/packages/duck-vim/course',
              title: 'Course',
              label: 'try',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-vim/course/01-introduction',
                  items: [],
                  title: '01: Introduction',
                },
                {
                  href: '/docs/packages/duck-vim/course/02-first-shortcut',
                  items: [],
                  title: '02: First Shortcut',
                },
                {
                  href: '/docs/packages/duck-vim/course/03-key-bindings',
                  items: [],
                  title: '03: Key Bindings',
                },
                {
                  href: '/docs/packages/duck-vim/course/04-react',
                  items: [],
                  title: '04: React',
                },
                {
                  href: '/docs/packages/duck-vim/course/05-sequences',
                  items: [],
                  title: '05: Sequences',
                },
                {
                  href: '/docs/packages/duck-vim/course/06-formatting',
                  items: [],
                  title: '06: Formatting',
                },
                {
                  href: '/docs/packages/duck-vim/course/07-recorder',
                  items: [],
                  title: '07: Recorder',
                },
                {
                  href: '/docs/packages/duck-vim/course/08-advanced',
                  items: [],
                  title: '08: Advanced',
                },
              ],
            },
          ],
          title: 'Gentleduck Vim',
        },
        {
          href: '/docs/packages/duck-primitives',
          collapsible: true,
          label: 'new',
          items: [
            {
              href: '/docs/packages/duck-primitives',
              items: [],
              title: 'Overview',
            },
            {
              href: '/docs/packages/duck-primitives/getting-started',
              items: [],
              title: 'Getting Started',
            },
            {
              href: '/docs/packages/duck-primitives/concepts',
              items: [],
              title: 'Core Concepts',
            },
            {
              href: '/docs/packages/duck-primitives/guides',
              title: 'Guides',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-primitives/guides/accessibility',
                  items: [],
                  title: 'Accessibility',
                },
                {
                  href: '/docs/packages/duck-primitives/guides/animation',
                  items: [],
                  title: 'Animation',
                },
                {
                  href: '/docs/packages/duck-primitives/guides/composition',
                  items: [],
                  title: 'Composition',
                },
                {
                  href: '/docs/packages/duck-primitives/guides/styling',
                  items: [],
                  title: 'Styling',
                },
              ],
            },
            {
              href: '/docs/packages/duck-primitives/api',
              title: 'API Reference',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-primitives/api/dialog',
                  items: [],
                  title: 'Dialog',
                },
                {
                  href: '/docs/packages/duck-primitives/api/alert-dialog',
                  items: [],
                  title: 'Alert Dialog',
                },
                {
                  href: '/docs/packages/duck-primitives/api/arrow',
                  items: [],
                  title: 'Arrow',
                },
                {
                  href: '/docs/packages/duck-primitives/api/checkers',
                  items: [],
                  title: 'Checkers',
                },
                {
                  href: '/docs/packages/duck-primitives/api/drawer',
                  items: [],
                  title: 'Drawer',
                },
                {
                  href: '/docs/packages/duck-primitives/api/popover',
                  items: [],
                  title: 'Popover',
                },
                {
                  href: '/docs/packages/duck-primitives/api/tooltip',
                  items: [],
                  title: 'Tooltip',
                },
                {
                  href: '/docs/packages/duck-primitives/api/hover-card',
                  items: [],
                  title: 'Hover Card',
                },
                {
                  href: '/docs/packages/duck-primitives/api/menu',
                  items: [],
                  title: 'Menu',
                },
                {
                  href: '/docs/packages/duck-primitives/api/context-menu',
                  items: [],
                  title: 'Context Menu',
                },
                {
                  href: '/docs/packages/duck-primitives/api/dropdown-menu',
                  items: [],
                  title: 'Dropdown Menu',
                },
                {
                  href: '/docs/packages/duck-primitives/api/menubar',
                  items: [],
                  title: 'Menubar',
                },
                {
                  href: '/docs/packages/duck-primitives/api/navigation-menu',
                  items: [],
                  title: 'Navigation Menu',
                },
                {
                  href: '/docs/packages/duck-primitives/api/progress',
                  items: [],
                  title: 'Progress',
                },
                {
                  href: '/docs/packages/duck-primitives/api/input-otp',
                  items: [],
                  title: 'Input OTP',
                },
                {
                  href: '/docs/packages/duck-primitives/api/pagination',
                  items: [],
                  title: 'Pagination',
                },
                {
                  href: '/docs/packages/duck-primitives/api/select',
                  items: [],
                  title: 'Select',
                },
                {
                  href: '/docs/packages/duck-primitives/api/radio-group',
                  items: [],
                  title: 'Radio Group',
                },
                {
                  href: '/docs/packages/duck-primitives/api/slider',
                  items: [],
                  title: 'Slider',
                },
                {
                  href: '/docs/packages/duck-primitives/api/sheet',
                  items: [],
                  title: 'Sheet',
                },
                {
                  href: '/docs/packages/duck-primitives/api/slot',
                  items: [],
                  title: 'Slot',
                },
                {
                  href: '/docs/packages/duck-primitives/api/presence',
                  items: [],
                  title: 'Presence',
                },
                {
                  href: '/docs/packages/duck-primitives/api/portal',
                  items: [],
                  title: 'Portal',
                },
                {
                  href: '/docs/packages/duck-primitives/api/focus-scope',
                  items: [],
                  title: 'Focus Scope',
                },
                {
                  href: '/docs/packages/duck-primitives/api/dismissable-layer',
                  items: [],
                  title: 'Dismissable Layer',
                },
                {
                  href: '/docs/packages/duck-primitives/api/roving-focus',
                  items: [],
                  title: 'Roving Focus',
                },
                {
                  href: '/docs/packages/duck-primitives/api/popper',
                  items: [],
                  title: 'Popper',
                },
                {
                  href: '/docs/packages/duck-primitives/api/mount',
                  items: [],
                  title: 'Mount',
                },
                {
                  href: '/docs/packages/duck-primitives/api/direction',
                  items: [],
                  title: 'Direction',
                },
                {
                  href: '/docs/packages/duck-primitives/api/layer',
                  items: [],
                  title: 'Layer',
                },
                {
                  href: '/docs/packages/duck-primitives/api/primitive-elements',
                  items: [],
                  title: 'Primitive Elements',
                },
                {
                  href: '/docs/packages/duck-primitives/api/visibility-hidden',
                  items: [],
                  title: 'Visibility Hidden',
                },
              ],
            },
            {
              href: '/docs/packages/duck-primitives/course',
              title: 'Course',
              label: 'try',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-primitives/course/01-why-primitives',
                  items: [],
                  title: '01: Why Primitives',
                },
                {
                  href: '/docs/packages/duck-primitives/course/02-first-dialog',
                  items: [],
                  title: '02: First Dialog',
                },
                {
                  href: '/docs/packages/duck-primitives/course/03-as-child',
                  items: [],
                  title: '03: asChild Pattern',
                },
                {
                  href: '/docs/packages/duck-primitives/course/04-popover',
                  items: [],
                  title: '04: Popover',
                },
                {
                  href: '/docs/packages/duck-primitives/course/05-menus',
                  items: [],
                  title: '05: Menus + Select',
                },
                {
                  href: '/docs/packages/duck-primitives/course/06-animation',
                  items: [],
                  title: '06: Animation',
                },
                {
                  href: '/docs/packages/duck-primitives/course/07-accessibility',
                  items: [],
                  title: '07: Accessibility',
                },
                {
                  href: '/docs/packages/duck-primitives/course/08-design-system',
                  items: [],
                  title: '08: Design System',
                },
                {
                  href: '/docs/packages/duck-primitives/course/09-testing-quality',
                  items: [],
                  title: '09: Testing + Quality',
                },
                {
                  href: '/docs/packages/duck-primitives/course/10-operations-migration',
                  items: [],
                  title: '10: Operations + Migration',
                },
              ],
            },
          ],
          title: 'Gentleduck Primitives',
        },
        {
          href: '/docs/packages/duck-libs',
          items: [],
          title: 'Gentleduck Libs',
        },
        {
          href: '/docs/packages/duck-hooks',
          items: [],
          title: 'Gentleduck Hooks',
        },
        {
          href: '/docs/packages/duck-motion',
          items: [],
          title: 'Gentleduck Motion',
        },
        {
          href: '/docs/packages/duck-state',
          items: [],
          title: 'Gentleduck State',
        },
        {
          href: '/docs/packages/duck-shortcut',
          items: [],
          title: 'Gentleduck Shortcut (Deprecated)',
        },
      ],
      title: 'Core Packages',
    },
    {
      collapsible: false,
      items: [
        {
          href: '/docs/components/accordion',
          items: [],
          title: 'Accordion',
        },
        {
          href: '/docs/components/alert',
          items: [],
          title: 'Alert',
        },
        {
          href: '/docs/components/alert-dialog',
          items: [],
          title: 'Alert Dialog',
        },
        {
          href: '/docs/components/aspect-ratio',
          items: [],
          title: 'Aspect Ratio',
        },
        {
          href: '/docs/components/avatar',
          items: [],
          title: 'Avatar',
        },
        {
          href: '/docs/components/badge',
          items: [],
          title: 'Badge',
        },
        {
          href: '/docs/components/breadcrumb',
          items: [],
          title: 'Breadcrumb',
        },
        {
          href: '/docs/components/button',
          items: [],
          title: 'Button',
        },
        {
          href: '/docs/components/button-group',
          items: [],
          title: 'Button Group',
        },
        {
          href: '/docs/components/calendar',
          items: [],
          title: 'Calendar',
        },
        {
          href: '/docs/components/card',
          items: [],
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
          title: 'Checkbox',
        },
        {
          href: '/docs/components/collapsible',
          items: [],
          title: 'Collapsible',
        },
        {
          href: '/docs/components/combobox',
          items: [],
          title: 'Combobox',
        },
        {
          href: '/docs/components/command',
          items: [],
          title: 'Command',
        },
        {
          href: '/docs/components/context-menu',
          items: [],
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
          title: 'Dropdown Menu',
        },
        {
          href: '/docs/components/empty',
          items: [],
          title: 'Empty',
        },
        {
          href: '/docs/components/field',
          items: [],
          title: 'Field',
        },
        {
          href: '/docs/components/navigation-menu',
          items: [],
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
          title: 'Hover Card',
        },
        {
          href: '/docs/components/item',
          items: [],
          title: 'Item',
        },
        {
          href: '/docs/components/input',
          items: [],
          title: 'Input',
        },
        {
          href: '/docs/components/input-group',
          items: [],
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
          title: 'Input OTP',
        },
        {
          href: '/docs/components/kbd',
          items: [],
          title: 'Kbd',
        },
        {
          href: '/docs/components/label',
          items: [],
          title: 'Label',
        },
        {
          href: '/docs/components/menubar',
          items: [],
          title: 'Menubar',
        },
        {
          href: '/docs/components/pagination',
          items: [],
          title: 'Pagination',
        },
        {
          href: '/docs/components/popover',
          items: [],
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
          title: 'Progress',
        },
        {
          href: '/docs/components/radio-group',
          items: [],
          title: 'Radio Group',
        },
        {
          href: '/docs/components/resizable',
          items: [],
          title: 'Resizable',
        },
        {
          href: '/docs/components/scroll-area',
          items: [],
          title: 'Scroll Area',
        },
        {
          href: '/docs/components/select',
          items: [],
          title: 'Select',
        },
        {
          href: '/docs/components/separator',
          items: [],
          title: 'Separator',
        },
        {
          href: '/docs/components/sheet',
          items: [],
          title: 'Sheet',
        },
        {
          href: '/docs/components/sidebar',
          items: [],
          title: 'Sidebar',
        },
        {
          href: '/docs/components/skeleton',
          items: [],
          title: 'Skeleton',
        },
        {
          href: '/docs/components/slider',
          items: [],
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
          title: 'Switch',
        },
        {
          href: '/docs/components/table',
          items: [],
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
          title: 'Tabs',
        },
        {
          href: '/docs/components/textarea',
          items: [],
          title: 'Text Area',
        },
        {
          href: '/docs/components/toggle',
          items: [],
          title: 'Toggle',
        },
        {
          href: '/docs/components/toggle-group',
          items: [],
          title: 'Toggle Group',
        },
        {
          href: '/docs/components/tooltip',
          items: [],
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
