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
        {
          href: '/docs/packages/duck-cli',
          items: [],
          title: 'Gentleduck CLI',
        },
        {
          href: '/docs/packages/duck-registry-build',
          collapsible: true,
          label: 'new',
          items: [
            {
              href: '/docs/packages/duck-registry-build',
              items: [],
              title: 'Overview',
            },
            {
              href: '/docs/packages/duck-registry-build/getting-started',
              items: [],
              title: 'Getting Started',
            },
            {
              href: '/docs/packages/duck-registry-build/architecture',
              items: [],
              title: 'Architecture',
            },
            {
              href: '/docs/packages/duck-registry-build/reference',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-registry-build/configuration',
                  items: [],
                  title: 'Configuration',
                },
                {
                  href: '/docs/packages/duck-registry-build/extensions',
                  items: [],
                  title: 'Extensions',
                },
                {
                  href: '/docs/packages/duck-registry-build/cli',
                  items: [],
                  title: 'CLI',
                },
              ],
              title: 'Reference',
            },
            {
              href: '/docs/packages/duck-registry-build/operations',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-registry-build/performance',
                  items: [],
                  title: 'Performance',
                },
                {
                  href: '/docs/packages/duck-registry-build/testing-ci',
                  items: [],
                  title: 'Testing and CI',
                },
                {
                  href: '/docs/packages/duck-registry-build/troubleshooting',
                  items: [],
                  title: 'Troubleshooting',
                },
              ],
              title: 'Operations',
            },
            {
              href: '/docs/packages/duck-registry-build/recipes',
              items: [],
              title: 'Recipes',
            },
            {
              href: '/docs/packages/duck-registry-build/course',
              collapsible: true,
              items: [
                {
                  href: '/docs/packages/duck-registry-build/course',
                  items: [],
                  title: 'Overview',
                },
                {
                  href: '/docs/packages/duck-registry-build/course-arch-package-index',
                  items: [],
                  title: 'Arch Package Index',
                },
              ],
              title: 'Course',
            },
          ],
          title: 'Gentleduck Registry Build',
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
              href: '/docs/packages/duck-primitives/benchmarks',
              items: [],
              title: 'Benchmarks',
              label: 'new',
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
                  href: '/docs/packages/duck-primitives/api/calendar',
                  items: [],
                  label: 'new',
                  title: 'Calendar',
                },
                {
                  href: '/docs/packages/duck-primitives/api/checkers',
                  items: [],
                  title: 'Checkers',
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
                  href: '/docs/packages/duck-primitives/api/primitive-elements',
                  items: [],
                  title: 'Primitive Elements',
                },
                {
                  href: '/docs/packages/duck-primitives/api/visibility-hidden',
                  items: [],
                  title: 'Visibility Hidden',
                },
                {
                  href: '/docs/packages/duck-primitives/api/avatar',
                  items: [],
                  title: 'Avatar',
                },
                {
                  href: '/docs/packages/duck-primitives/api/command',
                  items: [],
                  title: 'Command',
                },
                {
                  href: '/docs/packages/duck-primitives/api/toggle',
                  items: [],
                  title: 'Toggle',
                },
                {
                  href: '/docs/packages/duck-primitives/api/toggle-group',
                  items: [],
                  title: 'Toggle Group',
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
          collapsible: true,
          href: '/docs/packages/duck-calendar',
          items: [
            {
              href: '/docs/packages/duck-calendar',
              items: [],
              title: 'Overview',
            },
            {
              href: '/docs/packages/duck-calendar/getting-started',
              items: [],
              title: 'Getting Started',
            },
            {
              href: '/docs/packages/duck-calendar/benchmarks',
              items: [],
              title: 'Benchmarks',
              label: 'new',
            },
            {
              collapsible: true,
              href: '/docs/packages/duck-calendar/guides',
              items: [
                {
                  href: '/docs/packages/duck-calendar/guides/adapters',
                  items: [],
                  title: 'Date Adapters',
                },
                {
                  href: '/docs/packages/duck-calendar/guides/styling',
                  items: [],
                  title: 'Styling',
                },
                {
                  href: '/docs/packages/duck-calendar/guides/accessibility',
                  items: [],
                  title: 'Accessibility',
                },
              ],
              title: 'Guides',
            },
            {
              collapsible: true,
              href: '/docs/packages/duck-calendar/api',
              items: [
                {
                  href: '/docs/packages/duck-calendar/api/use-calendar',
                  items: [],
                  title: 'useCalendar',
                },
                {
                  href: '/docs/packages/duck-calendar/api/use-time-picker',
                  items: [],
                  title: 'useTimePicker',
                },
                {
                  href: '/docs/packages/duck-calendar/api/use-datetime',
                  items: [],
                  title: 'useDateTime',
                },
                {
                  href: '/docs/packages/duck-calendar/api/grid',
                  items: [],
                  title: 'Grid Builder',
                },
                {
                  href: '/docs/packages/duck-calendar/api/selection',
                  items: [],
                  title: 'Selection',
                },
                {
                  href: '/docs/packages/duck-calendar/api/navigation',
                  items: [],
                  title: 'Navigation',
                },
              ],
              title: 'API Reference',
            },
            {
              collapsible: true,
              href: '/docs/packages/duck-calendar/course',
              label: 'try',
              items: [
                {
                  href: '/docs/packages/duck-calendar/course/01-introduction',
                  items: [],
                  title: '01: Introduction',
                },
                {
                  href: '/docs/packages/duck-calendar/course/02-adapter-pattern',
                  items: [],
                  title: '02: Adapter Pattern',
                },
                {
                  href: '/docs/packages/duck-calendar/course/03-building-a-grid',
                  items: [],
                  title: '03: Building a Grid',
                },
                {
                  href: '/docs/packages/duck-calendar/course/04-selection-modes',
                  items: [],
                  title: '04: Selection Modes',
                },
                {
                  href: '/docs/packages/duck-calendar/course/05-keyboard-a11y',
                  items: [],
                  title: '05: Keyboard & A11y',
                },
                {
                  href: '/docs/packages/duck-calendar/course/06-time-picker',
                  items: [],
                  title: '06: Time Picker',
                },
                {
                  href: '/docs/packages/duck-calendar/course/07-styling',
                  items: [],
                  title: '07: Styling',
                },
                {
                  href: '/docs/packages/duck-calendar/course/08-performance',
                  items: [],
                  title: '08: Performance',
                },
              ],
              title: 'Course',
            },
          ],
          label: 'new',
          title: 'Gentleduck Calendar',
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
