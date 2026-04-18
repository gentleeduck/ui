'use client'

export type { ICopyButtonProps } from './copy-button'
export { CopyButton } from './copy-button'

export { DocsCopyPage } from './docs/docs-copy-page'
export { DocsPagerBottom, DocsPagerTop, flatten, getPagerForDoc } from './docs/docs-pager'
export { DocsPathBreadcrumb } from './docs/docs-path-breadcrumb'
export type { IDocsSidebarNavProps } from './docs/docs-sidebar'
export { DocsSidebarNav, DocsSidebarNavItem, DocsSidebarNavItems } from './docs/docs-sidebar'
export { DashboardTableOfContents } from './docs/docs-toc'

export { getIconForLanguageExtension, Icons } from './icons'

export { CommandMenu } from './layouts/command-menu'
export { HeaderBrand, HeaderContainer, HeaderRoot, HeaderSection } from './layouts/header-shell'
export { FooterButtons, SiteFooter } from './layouts/site-footer'
export { FontStyleButton, SiteHeader } from './layouts/site-header'
export { TailwindIndicator } from './layouts/tailwind-indicator'

export { MainNav } from './main-nav'
export { Mdx } from './mdx/mdx'
export { Callout } from './mdx/mdx-components/callout'
export {
  BuildTab,
  CodeBlock,
  CodeBlockWrapper,
  CodePreview,
  ComponentPreview,
  ComponentSource,
  FigcaptionBlock,
  MermaidBlock,
  PreBlock,
  TABS,
} from './mdx/mdx-components/code'
export type { IMermaidBlockProps } from './mdx/mdx-components/code/mermaid-block'
export { ComponentsList } from './mdx/mdx-components/components-list'
export { Table, TableCell, TableHeader, TableRow } from './mdx/mdx-components/table'
export { Tab, TabContent, TabList, TabTrigger } from './mdx/mdx-components/tabs'
export {
  A,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Hr,
  LinkBlock,
  LinkedCard,
  P,
} from './mdx/mdx-components/typepography'

export { MobileNav } from './mobile-nav'
export { ModeSwitcher } from './mode-toggle'
export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from './page-header'
export { ThemeProvider } from './providers'
export { StyleSwitcher } from './style-switcher'
