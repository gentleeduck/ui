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
        },
      ],
      title: 'Getting Started',
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
          // label: 'refacotored',
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
          href: '/docs/components/dialog',
          items: [],
          label: 'new',
          title: 'Dialog',
        },
        // {
        //   title: 'Combobox',
        //   href: '/docs/components/combobox',
        //   items: [],
        //   label: 'new',
        // },
        {
          title: 'Checkbox',
          href: '/docs/components/checkbox',
          label: 'new',
          items: [],
        },
        {
          title: 'Command',
          href: '/docs/components/command',
          label: 'new',
          items: [],
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
          href: '/docs/components/date-picker',
          items: [],
          label: 'new',
          title: 'Date Picker',
        },
        {
          title: 'popover',
          href: '/docs/components/popover',
          items: [],
          label: 'new',
        },
        {
          href: '/docs/components/drawer',
          items: [],
          label: 'new',
          title: 'Drawer',
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
          href: '/docs/components/label',
          items: [],
          label: 'new',
          title: 'Label',
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
          href: '/docs/components/scroll-area',
          items: [],
          label: 'new',
          title: 'Scroll Area',
        },
        {
          href: '/docs/components/resizable',
          items: [],
          label: 'new',
          title: 'Resizable',
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
          label: 'refacotored',
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
          title: 'Slider',
          // label: 'new',
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
