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
          href: '/docs/components/badge',
          items: [],
          label: 'refacotored',
          title: 'Badge',
        },
        {
          href: '/docs/components/button',
          items: [],
          label: 'refacotored',
          title: 'Button',
        },
        // {
        //   title: 'Combobox',
        //   href: '/docs/components/combobox',
        //   items: [],
        //   label: 'new',
        // },
        // {
        //   title: 'Command',
        //   href: '/docs/components/command',
        //   items: [],
        //   label: 'new',
        // },
        // {
        //   title: 'DropdowmMenu',
        //   href: '/docs/components/dropdowm-menu',
        //   items: [],
        //   label: 'new',
        // },
        {
          href: '/docs/components/drawer',
          items: [],
          title: 'Drawer',
          // label: 'new',
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
          title: 'Input',
          // label: 'new',
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
          title: 'Sheet',
          // label: 'new',
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
