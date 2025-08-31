import { MainNavItem, SidebarNavItem } from 'types/nav'

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
  chartsNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  chartsNav: [],
  mainNav: [
    {
      title: 'Documentation',
      href: '/docs',
    },
  ],
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
          items: [],
        },
        {
          title: 'Installation',
          href: '/docs/installation',
          items: [],
        },
      ],
    },
    {
      title: 'Components',
      items: [
        {
          title: 'Accordion',
          href: '/docs/components/accordion',
          items: [],
        },
        {
          title: 'AlertDialog',
          href: '/docs/components/alert-dialog',
          items: [],
          label: 'new',
        },
        {
          title: 'Badge',
          href: '/docs/components/badge',
          items: [],
          label: 'new',
        },
        {
          title: 'Button',
          href: '/docs/components/button',
          items: [
            {
              //TODO: make new side bar type
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
          label: 'new',
        },
        // {
        //   title: 'Header',
        //   href: '/docs/components/header',
        //   items: [],
        //   label: 'new',
        // },
        // {
        //   title: 'NavGroup',
        //   href: '/docs/components/nav-group',
        //   items: [],
        //   label: 'new',
        // },
        {
          title: 'Upload',
          href: '/docs/components/upload',
          items: [],
          label: 'new',
        },
        // {
        //   title: 'Swapy',
        //   href: '/docs/components/swapy',
        //   label: 'new',
        //   items: [],
        // },
        {
          title: 'Table',
          href: '/docs/components/table',
          items: [],
          label: 'new',
        },
        {
          title: 'Tabs',
          href: '/docs/components/tabs',
          items: [],
        },
        {
          title: 'Text Area',
          href: '/docs/components/textarea',
          items: [],
        },
        {
          title: 'Toast',
          href: '/docs/components/toast',
          items: [],
        },
        {
          title: 'sonner',
          href: '/docs/components/sonner',
          items: [],
        },
        {
          title: 'Toggle',
          href: '/docs/components/toggle',
          items: [],
        },
        {
          title: 'Toggle Group',
          href: '/docs/components/toggle-group',
          items: [],
        },
        {
          title: 'Tooltip',
          href: '/docs/components/tooltip',
          items: [],
        },
      ],
    },
  ],
}
