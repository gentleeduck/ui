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
          label: 'refacotored',
          title: 'Accordion',
        },
        {
          href: '/docs/components/alert',
          items: [],
          label: 'refacotored',
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
          label: 'refacotored',
          title: 'Aspect Ratio',
        },
        {
          href: '/docs/components/avatar',
          items: [],
          label: 'refacotored',
          title: 'Avatar',
        },
        {
          href: '/docs/components/badge',
          items: [],
          label: 'refacotored',
          title: 'Badge',
        },
        {
          href: '/docs/components/breadcrumb',
          items: [],
          label: 'refacotored',
          title: 'Breadcrumb',
        },
        {
          href: '/docs/components/button',
          items: [],
          label: 'refacotored',
          title: 'Button',
        },
        {
          href: '/docs/components/dialog',
          items: [],
          // label: 'refacotored',
          title: 'Dialog',
        },
        // {
        //   title: 'Combobox',
        //   href: '/docs/components/combobox',
        //   items: [],
        //   label: 'new',
        // },
        {
          title: 'Command',
          href: '/docs/components/command',
          label: 'refacotored',
          items: [],
        },
        {
          href: '/docs/components/calendar',
          items: [],
          label: 'refacotored',
          title: 'Calendar',
        },
        // {
        //   title: 'DropdowmMenu',
        //   href: '/docs/components/dropdowm-menu',
        //   items: [],
        //   label: 'new',
        // },
        {
          href: '/docs/components/drawer',
          items: [],
          label: 'refacotored',
          title: 'Drawer',
        },
        // {
        //   title: 'Header',
        //   href: '/docs/components/header',
        //   items: [],
        //   label: 'new',
        // },
        {
          href: '/docs/components/hover-card',
          items: [],
          title: 'Hover Card',
          // label: 'new',
        },
        {
          href: '/docs/components/input',
          items: [],
          label: 'refacotored',
          title: 'Input',
        },
        {
          href: '/docs/components/label',
          items: [],
          label: 'refacotored',
          title: 'Label',
        },
        // {
        //   title: 'NavGroup',
        //   href: '/docs/components/nav-group',
        //   items: [],
        //   label: 'new',
        // },
        {
          href: '/docs/components/progress',
          items: [],
          label: 'refacotored',
          title: 'Progress',
        },
        {
          href: '/docs/components/radio-group',
          items: [],
          label: 'still-working',
          title: 'Radio Group',
        },
        {
          href: '/docs/components/scroll-area',
          items: [],
          title: 'Scroll Area',
          label: 'refacotored',
        },
        {
          href: '/docs/components/select',
          items: [],
          title: 'Select',
          // label: 'new',
        },
        {
          href: '/docs/components/separator',
          items: [],
          label: 'refacotored',
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
          title: 'Skeleton',
          label: 'refacotored',
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
          title: 'Sonner',
          label: 'refacotored',
        },
        {
          href: '/docs/components/switch',
          items: [],
          title: 'Switch',
          label: 'refacotored',
        },
        // {
        //   title: 'Table',
        //   href: '/docs/components/table',
        //   items: [],
        //   label: 'new',
        // },
        {
          href: '/docs/components/tabs',
          items: [],
          title: 'Tabs',
          label: 'refacotored',
        },
        {
          href: '/docs/components/textarea',
          items: [],
          label: 'refacotored',
          title: 'Text Area',
        },
        {
          href: '/docs/components/toggle',
          items: [],
          label: 'refacotored',
          title: 'Toggle',
        },
        {
          href: '/docs/components/toggle-group',
          items: [],
          label: 'refacotored',
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
        //   label: 'new',
        // },
      ],
      title: 'Components',
    },
  ],
}
