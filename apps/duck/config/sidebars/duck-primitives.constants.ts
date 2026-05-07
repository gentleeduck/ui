import { defineSidebar } from './types'

export type DuckPrimitivesHref =
  | '/duck-primitives/api'
  | '/duck-primitives/api/accordion'
  | '/duck-primitives/api/alert-dialog'
  | '/duck-primitives/api/arrow'
  | '/duck-primitives/api/avatar'
  | '/duck-primitives/api/calendar'
  | '/duck-primitives/api/checkers'
  | '/duck-primitives/api/command'
  | '/duck-primitives/api/context-menu'
  | '/duck-primitives/api/dialog'
  | '/duck-primitives/api/direction'
  | '/duck-primitives/api/dismissable-layer'
  | '/duck-primitives/api/dropdown-menu'
  | '/duck-primitives/api/focus-scope'
  | '/duck-primitives/api/hover-card'
  | '/duck-primitives/api/input-otp'
  | '/duck-primitives/api/menu'
  | '/duck-primitives/api/menubar'
  | '/duck-primitives/api/mount'
  | '/duck-primitives/api/navigation-menu'
  | '/duck-primitives/api/pagination'
  | '/duck-primitives/api/popover'
  | '/duck-primitives/api/popper'
  | '/duck-primitives/api/portal'
  | '/duck-primitives/api/presence'
  | '/duck-primitives/api/primitive-elements'
  | '/duck-primitives/api/progress'
  | '/duck-primitives/api/radio-group'
  | '/duck-primitives/api/roving-focus'
  | '/duck-primitives/api/select'
  | '/duck-primitives/api/sheet'
  | '/duck-primitives/api/slider'
  | '/duck-primitives/api/slot'
  | '/duck-primitives/api/toggle'
  | '/duck-primitives/api/toggle-group'
  | '/duck-primitives/api/tooltip'
  | '/duck-primitives/api/visibility-hidden'
  | '/duck-primitives/benchmarks'
  | '/duck-primitives/changelog'
  | '/duck-primitives/concepts'
  | '/duck-primitives/course'
  | '/duck-primitives/course/01-why-primitives'
  | '/duck-primitives/course/02-first-dialog'
  | '/duck-primitives/course/03-as-child'
  | '/duck-primitives/course/04-popover'
  | '/duck-primitives/course/05-menus'
  | '/duck-primitives/course/06-animation'
  | '/duck-primitives/course/07-accessibility'
  | '/duck-primitives/course/08-design-system'
  | '/duck-primitives/course/09-testing-quality'
  | '/duck-primitives/course/10-operations-migration'
  | '/duck-primitives/getting-started'
  | '/duck-primitives/guides'
  | '/duck-primitives/guides/accessibility'
  | '/duck-primitives/guides/animation'
  | '/duck-primitives/guides/composition'
  | '/duck-primitives/guides/styling'
  | '/duck-primitives/introduction'

export const duckPrimitivesSidebar = defineSidebar<DuckPrimitivesHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-primitives/introduction' },
      { title: 'Getting Started', href: '/duck-primitives/getting-started' },
      { title: 'Core Concepts', href: '/duck-primitives/concepts' },
    ],
  },
  {
    title: 'API',
    items: [{ title: 'API Reference', href: '/duck-primitives/api' }],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Guides', href: '/duck-primitives/guides' },
      { title: 'Accessibility', href: '/duck-primitives/guides/accessibility' },
      { title: 'Animation', href: '/duck-primitives/guides/animation' },
      { title: 'Composition with asChild', href: '/duck-primitives/guides/composition' },
      { title: 'Styling gentleduck/primitives', href: '/duck-primitives/guides/styling' },
    ],
  },
  {
    title: 'Course',
    items: [
      { title: 'gentleduck/primitives Course', href: '/duck-primitives/course' },
      { title: 'Lesson 1: Why Primitives', href: '/duck-primitives/course/01-why-primitives' },
      { title: 'Lesson 2: Your First Dialog', href: '/duck-primitives/course/02-first-dialog' },
      { title: 'Lesson 3: The asChild Pattern', href: '/duck-primitives/course/03-as-child' },
      { title: 'Lesson 4: Popover and Positioning', href: '/duck-primitives/course/04-popover' },
      { title: 'Lesson 5: Menus, Dropdowns, and Selection', href: '/duck-primitives/course/05-menus' },
      { title: 'Lesson 6: Animation with Presence', href: '/duck-primitives/course/06-animation' },
      { title: 'Lesson 7: Accessibility Deep Dive', href: '/duck-primitives/course/07-accessibility' },
      { title: 'Lesson 8: Building a Design System', href: '/duck-primitives/course/08-design-system' },
      { title: 'Lesson 9: Testing and Quality Gates', href: '/duck-primitives/course/09-testing-quality' },
      {
        title: 'Lesson 10: Operations, Migration, and Internal Registry',
        href: '/duck-primitives/course/10-operations-migration',
      },
    ],
  },
  {
    title: 'Benchmarks',
    items: [{ title: 'Benchmarks', href: '/duck-primitives/benchmarks' }],
  },
  {
    title: 'Misc',
    items: [
      { title: 'Arrow', href: '/duck-primitives/api/arrow' },
      { title: 'Checkers', href: '/duck-primitives/api/checkers' },
      { title: 'Direction', href: '/duck-primitives/api/direction' },
      { title: 'Dismissable Layer', href: '/duck-primitives/api/dismissable-layer' },
      { title: 'Focus Scope', href: '/duck-primitives/api/focus-scope' },
      { title: 'Mount', href: '/duck-primitives/api/mount' },
      { title: 'Popper', href: '/duck-primitives/api/popper' },
      { title: 'Portal', href: '/duck-primitives/api/portal' },
      { title: 'Presence', href: '/duck-primitives/api/presence' },
      { title: 'Primitive Elements', href: '/duck-primitives/api/primitive-elements' },
      { title: 'Roving Focus', href: '/duck-primitives/api/roving-focus' },
      { title: 'Slot', href: '/duck-primitives/api/slot' },
      { title: 'Visibility Hidden', href: '/duck-primitives/api/visibility-hidden' },
    ],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-primitives/changelog' }],
  },
  {
    title: 'Disclosure',
    items: [{ title: 'Accordion', href: '/duck-primitives/api/accordion' }],
  },
  {
    title: 'Overlay',
    items: [
      { title: 'Alert Dialog', href: '/duck-primitives/api/alert-dialog' },
      { title: 'Dialog', href: '/duck-primitives/api/dialog' },
      { title: 'Hover Card', href: '/duck-primitives/api/hover-card' },
      { title: 'Popover', href: '/duck-primitives/api/popover' },
      { title: 'Sheet', href: '/duck-primitives/api/sheet' },
      { title: 'Tooltip', href: '/duck-primitives/api/tooltip' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { title: 'Avatar', href: '/duck-primitives/api/avatar' },
      { title: 'Calendar', href: '/duck-primitives/api/calendar' },
    ],
  },
  {
    title: 'Selection',
    items: [
      { title: 'Command', href: '/duck-primitives/api/command' },
      { title: 'Select', href: '/duck-primitives/api/select' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { title: 'Context Menu', href: '/duck-primitives/api/context-menu' },
      { title: 'Dropdown Menu', href: '/duck-primitives/api/dropdown-menu' },
      { title: 'Menu', href: '/duck-primitives/api/menu' },
      { title: 'Menubar', href: '/duck-primitives/api/menubar' },
      { title: 'Navigation Menu', href: '/duck-primitives/api/navigation-menu' },
      { title: 'Pagination', href: '/duck-primitives/api/pagination' },
    ],
  },
  {
    title: 'Forms',
    items: [
      { title: 'Input OTP', href: '/duck-primitives/api/input-otp' },
      { title: 'Radio Group', href: '/duck-primitives/api/radio-group' },
      { title: 'Slider', href: '/duck-primitives/api/slider' },
    ],
  },
  {
    title: 'Feedback',
    items: [{ title: 'Progress', href: '/duck-primitives/api/progress' }],
  },
  {
    title: 'Toggle',
    items: [
      { title: 'Toggle', href: '/duck-primitives/api/toggle' },
      { title: 'Toggle Group', href: '/duck-primitives/api/toggle-group' },
    ],
  },
])
