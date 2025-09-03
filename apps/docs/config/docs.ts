import { MainNavItem, SidebarNavItem } from '~/types/nav'

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
  chartsNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
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
          items: [],
          title: 'Introduction',
        },
        {
          href: '/docs/installation',
          items: [],
          title: 'Installation',
          label: 'new',
        },
        {
          href: '/docs/components',
          items: [],
          title: 'Components',
          label: 'new',
        },
        {
          href: '/docs/theming',
          items: [],
          title: 'Thmeing',
          label: 'new',
        },
        {
          href: '/docs/javascript',
          items: [],
          title: 'JavaScript',
          label: 'new',
        },
      ],
      title: 'Getting Started',
    },
    {
      collapsible: false,
      items: [
        {
          href: '/docs/packages/duck-lazy',
          items: [],
          title: 'Gentleduck Lazy',
          label: 'new',
        },
        {
          href: '/docs/packages/duck-variants',
          items: [],
          title: 'Gentleduck Variants',
          label: 'new',
        },
        {
          href: '/docs/packages/duck-vim',
          items: [],
          title: 'Gentleduck Vim',
          label: 'new',
        },
        {
          href: '/docs/packages/duck-primitives',
          items: [],
          title: 'Gentleduck Primitives',
          label: 'new',
        },
        {
          href: '/docs/packages/duck-libs',
          items: [],
          title: 'Gentleduck Libs',
          label: 'new',
        },
        {
          href: '/docs/packages/duck-hooks',
          items: [],
          title: 'Gentleduck Hooks',
          label: 'new',
        },
        {
          href: '/docs/packages/duck-ttest',
          items: [],
          title: 'Gentleduck Ttest',
          label: 'new',
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
          label: 'new',
          title: 'Carousel',
        },
        {
          href: '/docs/components/chart',
          items: [],
          label: '',
          title: 'Chart',
        },
        {
          title: 'Checkbox',
          href: '/docs/components/checkbox',
          label: 'new',
          items: [],
        },
        {
          title: 'Collapsible',
          href: '/docs/components/collapsible',
          items: [],
          label: 'new',
        },
        {
          title: 'Combobox',
          href: '/docs/components/combobox',
          items: [],
          label: 'new',
        },
        {
          title: 'Command',
          href: '/docs/components/command',
          label: 'new',
          items: [],
        },
        {
          title: 'Context Menu',
          href: '/docs/components/context-menu',
          label: 'new',
          items: [],
        },
        {
          href: '/docs/components/data-table',
          items: [],
          label: 'new',
          title: 'Data Table',
        },
        {
          href: '/docs/components/date-picker',
          items: [],
          label: 'new',
          title: 'Date Picker',
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
          label: '',
          title: 'Drawer',
        },
        {
          href: '/docs/components/dropdown-menu',
          items: [],
          label: 'new',
          title: 'Dropdown Menu',
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
          label: 'new',
          title: 'React Hook Form',
        },
        {
          href: '/docs/components/hover-card',
          items: [],
          label: 'new',
          title: 'Hover Card',
        },
        {
          href: '/docs/components/input',
          items: [],
          label: 'new',
          title: 'Input',
        },
        {
          href: '/docs/components/input-otp',
          items: [],
          label: 'new',
          title: 'Input OTP',
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
          label: 'dddddd',
          title: 'Menubar',
        },
        {
          href: '/docs/components/pagination',
          items: [],
          label: 'new',
          title: 'Pagination',
        },
        {
          title: 'Popover',
          href: '/docs/components/popover',
          items: [],
          label: 'new',
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
          label: 'new',
          title: 'Sonner',
        },
        {
          href: '/docs/components/switch',
          items: [],
          label: 'new',
          title: 'Switch',
        },
        {
          title: 'Table',
          href: '/docs/components/table',
          label: 'new',
          items: [],
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
        //   label: 'new',
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
