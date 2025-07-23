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
          title: 'Accordion',
        },
        {
          href: '/docs/components/badge',
          items: [],
          label: 'new',
          title: 'Badge',
        },
        {
          title: 'Button',
          href: '/docs/components/button',
          items: [
            {
              title: 'Button',
              href: '/docs/components/button2',
              items: [],
            },
          ],
          label: 'new',
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
          title: 'Drawer',
          href: '/docs/components/drawer',
          items: [],
          // label: 'new',
        },
        // {
        //   title: 'Header',
        //   href: '/docs/components/header',
        //   items: [],
        //   label: 'new',
        // },
        {
          title: 'Hover Card',
          href: '/docs/components/hover-card',
          items: [],
          // label: 'new',
        },
        {
          title: 'Input',
          href: '/docs/components/input',
          items: [],
          // label: 'new',
        },
        {
          title: 'Label',
          href: '/docs/components/label',
          items: [],
          // label: 'new',
        },
        // {
        //   title: 'NavGroup',
        //   href: '/docs/components/nav-group',
        //   items: [],
        //   label: 'new',
        // },
        {
          title: 'Progress',
          href: '/docs/components/progress',
          items: [],
          // label: 'new',
        },
        {
          title: 'Radio Group',
          href: '/docs/components/radio-group',
          items: [],
          // label: 'new',
        },
        {
          title: 'Scroll Area',
          href: '/docs/components/scroll-area',
          items: [],
          // label: 'new',
        },
        {
          title: 'Select',
          href: '/docs/components/select',
          items: [],
          // label: 'new',
        },
        {
          title: 'Separator',
          href: '/docs/components/separator',
          items: [],
          // label: 'new',
        },
        {
          title: 'Sheet',
          href: '/docs/components/sheet',
          items: [],
          // label: 'new',
        },
        {
          title: 'Skeleton',
          href: '/docs/components/skeleton',
          items: [],
          // label: 'new',
        },
        {
          title: 'Slider',
          href: '/docs/components/slider',
          items: [],
          // label: 'new',
        },
        {
          title: 'Sonner',
          href: '/docs/components/sonner',
          items: [],
        },
        {
          title: 'Switch',
          href: '/docs/components/switch',
          items: [],
          // label: 'new',
        },
        // {
        //   title: 'Table',
        //   href: '/docs/components/table',
        //   items: [],
        //   label: 'new',
        // },
        {
          title: 'Tabs',
          href: '/docs/components/tabs',
          items: [],
        },
        {
          title: 'Text Area',
          href: '/docs/components/textarea',
          label: 'new',
          items: [],
        },
        {
          title: 'Toggle',
          href: '/docs/components/toggle',
          label: 'new',
          items: [],
        },
        {
          title: 'Toggle Group',
          href: '/docs/components/toggle-group',
          label: 'new',
          items: [],
        },
        {
          title: 'Tooltip',
          href: '/docs/components/tooltip',
          items: [],
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
