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
          href: '/docs/components/badge',
          items: [],
          label: 'new',
          title: 'Badge',
        },
        {
          href: '/docs/components/button',
          items: [
            {
              href: '/docs/components/button2',
              items: [],
              title: 'Button',
            },
          ],
          label: 'new',
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
          title: 'Label',
          // label: 'new',
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
          title: 'Progress',
          // label: 'new',
        },
        {
          href: '/docs/components/radio-group',
          items: [],
          title: 'Radio Group',
          // label: 'new',
        },
        {
          href: '/docs/components/scroll-area',
          items: [],
          title: 'Scroll Area',
          // label: 'new',
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
          title: 'Separator',
          // label: 'new',
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
          // label: 'new',
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
        },
        {
          href: '/docs/components/switch',
          items: [],
          title: 'Switch',
          // label: 'new',
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
