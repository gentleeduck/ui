export * from './src/accordion'
export * from './src/accordion'
export * from './src/alert'
export * from './src/alert-dialog'
export * from './src/aspect-ratio'
export * from './src/avatar'
export * from './src/badge'
export * from './src/badge'
export * from './src/breadcrumb'
export * from './src/button'
export * from './src/button'
export * from './src/calendar'
export * from './src/card'
export * from './src/carousel'
export * from './src/chart'
export * from './src/checkbox'
export * from './src/collapsible'
export * from './src/combobox'
export * from './src/command'
export * from './src/context-menu'
export * from './src/dialog'
export * from './src/drawer'
export * from './src/dropdown-menu'
export * from './src/form'
export * from './src/hover-card'
export * from './src/input'
export * from './src/input-otp'
export * from './src/label'
export * from './src/menubar'
export * from './src/navigation-menu'
export * from './src/pagination'
export * from './src/popover'
export * from './src/progress'
export * from './src/radio-group'
export * from './src/resizable'
export * from './src/scroll-area'
export * from './src/select'
export * from './src/separator'
export * from './src/sheet'
export * from './src/skeleton'
export * from './src/slider'
export * from './src/sonner'
export * from './src/switch'
export * from './src/table'
export * from './src/tabs'
export * from './src/textarea'
export * from './src/toggle'
export * from './src/toggle'
export * from './src/toggle-group'
export * from './src/toggle-group'
export * from './src/tooltip'
export * from './src/tooltip'
export * from './src/upload'

const components: Record<
  string,
  Partial<{
    component: boolean
    docs: boolean
    benchmark: boolean
    test: boolean
    examples: boolean
  }>
> = {
  button: {
    docs: false,
  },
  badge: {
    docs: false,
  },
  switch: {},
  checkbox: {},
  textarea: {},
  input: {},
  label: {},
  command: {
    component: false,
  },
  separator: {},
  portal: {},
  radioGroup: {},
  tabs: {},
  skeleton: {},
  card: {},
  aspectRatio: {},
  avatar: {},
  scrollArea: {},
  form: {},
  table: {},
  sonner: {},
  alert: {},
  calendar: {},
  pagination: {},
  chart: {},
  carousel: {},
  resizable: {},

  dialog: {},
  sheet: {},
  alertDialog: {},
  popover: {},
  hoverCard: {},
  tooltip: {},

  breadcrumb: {},
  inputOTP: {},
  progress: {},
  toggle: {},
  toggleGroup: {},
  collapsible: {},
  select: {},

  // TODO: check for backward compatibility
  contextMenu: {},
  dropdownMenu: {},
  menuBar: {},

  slider: {},
  accordion: {},

  navigationMenu: {},

  combobox: {},
  upload: {},

  drawer: {},
}
