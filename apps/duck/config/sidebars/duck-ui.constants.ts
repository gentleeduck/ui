import { defineSidebar } from './types'

export type DuckUiHref =
  | '/duck-ui/changelog'
  | '/duck-ui/components/accordion'
  | '/duck-ui/components/alert'
  | '/duck-ui/components/alert-dialog'
  | '/duck-ui/components/aspect-ratio'
  | '/duck-ui/components/avatar'
  | '/duck-ui/components/badge'
  | '/duck-ui/components/breadcrumb'
  | '/duck-ui/components/button'
  | '/duck-ui/components/button-group'
  | '/duck-ui/components/calendar'
  | '/duck-ui/components/card'
  | '/duck-ui/components/carousel'
  | '/duck-ui/components/chart'
  | '/duck-ui/components/checkbox'
  | '/duck-ui/components/collapsible'
  | '/duck-ui/components/combobox'
  | '/duck-ui/components/command'
  | '/duck-ui/components/context-menu'
  | '/duck-ui/components/data-table'
  | '/duck-ui/components/date-picker'
  | '/duck-ui/components/dialog'
  | '/duck-ui/components/direction'
  | '/duck-ui/components/drawer'
  | '/duck-ui/components/dropdown-menu'
  | '/duck-ui/components/empty'
  | '/duck-ui/components/field'
  | '/duck-ui/components/hover-card'
  | '/duck-ui/components/input'
  | '/duck-ui/components/input-group'
  | '/duck-ui/components/input-otp'
  | '/duck-ui/components/item'
  | '/duck-ui/components/json-editor'
  | '/duck-ui/components/kbd'
  | '/duck-ui/components/label'
  | '/duck-ui/components/menubar'
  | '/duck-ui/components/navigation-menu'
  | '/duck-ui/components/pagination'
  | '/duck-ui/components/popover'
  | '/duck-ui/components/preview-panel'
  | '/duck-ui/components/progress'
  | '/duck-ui/components/radio-group'
  | '/duck-ui/components/react-hook-form'
  | '/duck-ui/components/resizable'
  | '/duck-ui/components/scroll-area'
  | '/duck-ui/components/select'
  | '/duck-ui/components/separator'
  | '/duck-ui/components/sheet'
  | '/duck-ui/components/sidebar'
  | '/duck-ui/components/skeleton'
  | '/duck-ui/components/slider'
  | '/duck-ui/components/sonner'
  | '/duck-ui/components/switch'
  | '/duck-ui/components/table'
  | '/duck-ui/components/tabs'
  | '/duck-ui/components/tanstack-form'
  | '/duck-ui/components/textarea'
  | '/duck-ui/components/toggle'
  | '/duck-ui/components/toggle-group'
  | '/duck-ui/components/tooltip'
  | '/duck-ui/components/typography'
  | '/duck-ui/faqs'
  | '/duck-ui/installation'
  | '/duck-ui/installation/astro'
  | '/duck-ui/installation/laravel'
  | '/duck-ui/installation/manual'
  | '/duck-ui/installation/monorepo'
  | '/duck-ui/installation/next'
  | '/duck-ui/installation/react-router'
  | '/duck-ui/installation/tanstack'
  | '/duck-ui/installation/tanstack-router'
  | '/duck-ui/installation/vite'
  | '/duck-ui/introduction'
  | '/duck-ui/javascript'
  | '/duck-ui/theming'

export const duckUiSidebar = defineSidebar<DuckUiHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-ui/introduction' },
      { title: 'theming', href: '/duck-ui/theming' },
      { title: 'javascript', href: '/duck-ui/javascript' },
      { title: 'faqs', href: '/duck-ui/faqs' },
    ],
  },
  {
    title: 'Misc',
    items: [{ title: 'direction', href: '/duck-ui/components/direction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-ui/changelog' }],
  },
  {
    title: 'Installation',
    items: [
      { title: 'installation', href: '/duck-ui/installation' },
      { title: 'next.js', href: '/duck-ui/installation/next' },
      { title: 'vite', href: '/duck-ui/installation/vite' },
      { title: 'astro', href: '/duck-ui/installation/astro' },
      { title: 'laravel', href: '/duck-ui/installation/laravel' },
      { title: 'react-router', href: '/duck-ui/installation/react-router' },
      { title: 'tanstack-start', href: '/duck-ui/installation/tanstack' },
      { title: 'tanstack-router', href: '/duck-ui/installation/tanstack-router' },
      { title: 'manual-installation', href: '/duck-ui/installation/manual' },
      { title: 'monorepo', href: '/duck-ui/installation/monorepo' },
    ],
  },
  {
    title: 'Disclosure',
    items: [
      { title: 'accordion', href: '/duck-ui/components/accordion' },
      { title: 'collapsible', href: '/duck-ui/components/collapsible' },
      { title: 'tabs', href: '/duck-ui/components/tabs' },
    ],
  },
  {
    title: 'Overlay',
    items: [
      { title: 'alert-dialog', href: '/duck-ui/components/alert-dialog' },
      { title: 'dialog', href: '/duck-ui/components/dialog' },
      { title: 'drawer', href: '/duck-ui/components/drawer' },
      { title: 'hover-card', href: '/duck-ui/components/hover-card' },
      { title: 'popover', href: '/duck-ui/components/popover' },
      { title: 'preview-panel', href: '/duck-ui/components/preview-panel' },
      { title: 'sheet', href: '/duck-ui/components/sheet' },
      { title: 'tooltip', href: '/duck-ui/components/tooltip' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { title: 'alert', href: '/duck-ui/components/alert' },
      { title: 'badge', href: '/duck-ui/components/badge' },
      { title: 'progress', href: '/duck-ui/components/progress' },
      { title: 'skeleton', href: '/duck-ui/components/skeleton' },
      { title: 'sonner', href: '/duck-ui/components/sonner' },
    ],
  },
  {
    title: 'Layout',
    items: [
      { title: 'aspect-ratio', href: '/duck-ui/components/aspect-ratio' },
      { title: 'card', href: '/duck-ui/components/card' },
      { title: 'resizable', href: '/duck-ui/components/resizable' },
      { title: 'scroll-area', href: '/duck-ui/components/scroll-area' },
      { title: 'separator', href: '/duck-ui/components/separator' },
      { title: 'Sidebar', href: '/duck-ui/components/sidebar' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { title: 'avatar', href: '/duck-ui/components/avatar' },
      { title: 'calendar', href: '/duck-ui/components/calendar' },
      { title: 'chart', href: '/duck-ui/components/chart' },
      { title: 'data-table', href: '/duck-ui/components/data-table' },
      { title: 'field', href: '/duck-ui/components/field' },
      { title: 'item', href: '/duck-ui/components/item' },
      { title: 'json-editor', href: '/duck-ui/components/json-editor' },
      { title: 'kbd', href: '/duck-ui/components/kbd' },
      { title: 'table', href: '/duck-ui/components/table' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { title: 'breadcrumb', href: '/duck-ui/components/breadcrumb' },
      { title: 'context-menu', href: '/duck-ui/components/context-menu' },
      { title: 'dropdown-menu', href: '/duck-ui/components/dropdown-menu' },
      { title: 'menubar', href: '/duck-ui/components/menubar' },
      { title: 'navigation-menu', href: '/duck-ui/components/navigation-menu' },
      { title: 'pagination', href: '/duck-ui/components/pagination' },
    ],
  },
  {
    title: 'Forms',
    items: [
      { title: 'button', href: '/duck-ui/components/button' },
      { title: 'button-group', href: '/duck-ui/components/button-group' },
      { title: 'checkbox', href: '/duck-ui/components/checkbox' },
      { title: 'input', href: '/duck-ui/components/input' },
      { title: 'input-group', href: '/duck-ui/components/input-group' },
      { title: 'input-otp', href: '/duck-ui/components/input-otp' },
      { title: 'label', href: '/duck-ui/components/label' },
      { title: 'radio-group', href: '/duck-ui/components/radio-group' },
      { title: 'React Hook Form', href: '/duck-ui/components/react-hook-form' },
      { title: 'slider', href: '/duck-ui/components/slider' },
      { title: 'switch', href: '/duck-ui/components/switch' },
      { title: 'TanStack Form', href: '/duck-ui/components/tanstack-form' },
      { title: 'textarea', href: '/duck-ui/components/textarea' },
    ],
  },
  {
    title: 'Media',
    items: [
      { title: 'carousel', href: '/duck-ui/components/carousel' },
      { title: 'empty', href: '/duck-ui/components/empty' },
    ],
  },
  {
    title: 'Selection',
    items: [
      { title: 'combobox', href: '/duck-ui/components/combobox' },
      { title: 'command', href: '/duck-ui/components/command' },
      { title: 'date-picker', href: '/duck-ui/components/date-picker' },
      { title: 'select', href: '/duck-ui/components/select' },
    ],
  },
  {
    title: 'Toggle',
    items: [
      { title: 'toggle', href: '/duck-ui/components/toggle' },
      { title: 'toggle-group', href: '/duck-ui/components/toggle-group' },
    ],
  },
  {
    title: 'Typography',
    items: [{ title: 'typography', href: '/duck-ui/components/typography' }],
  },
])
