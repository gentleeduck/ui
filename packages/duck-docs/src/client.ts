'use client'

// components/copy-button
export type { CopyButtonProps } from './components/copy-button'
export { CopyButton } from './components/copy-button'

// components/docs
export { DocsCopyPage } from './components/docs/docs-copy-page'
export { DocsPagerBottom, DocsPagerTop, flatten, getPagerForDoc } from './components/docs/docs-pager'
export { DocsPathBreadcrumb } from './components/docs/docs-path-breadcrumb'
export type { IDocsSidebarNavProps } from './components/docs/docs-sidebar'
export { DocsSidebarNav, DocsSidebarNavItem, DocsSidebarNavItems } from './components/docs/docs-sidebar'
export { DashboardTableOfContents } from './components/docs/docs-toc'

// components/icons
export { getIconForLanguageExtension, Icons } from './components/icons'

// components/layouts
export { CommandMenu } from './components/layouts/command-menu'
export { HeaderBrand, HeaderContainer, HeaderRoot, HeaderSection } from './components/layouts/header-shell'
export { FooterButtons, SiteFooter } from './components/layouts/site-footer'
export { FontStyleButton, SiteHeader } from './components/layouts/site-header'
export { TailwindIndicator } from './components/layouts/tailwind-indicator'

// components/main-nav
export { MainNav } from './components/main-nav'

// components/mdx
export { Mdx } from './components/mdx/mdx'

// components/mdx/mdx-components (barrel)
export { Callout } from './components/mdx/mdx-components/callout'
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
} from './components/mdx/mdx-components/code'
export type { IMermaidBlockProps } from './components/mdx/mdx-components/code/mermaid-block'
export { ComponentsList } from './components/mdx/mdx-components/components-list'
export { Table, TableCell, TableHeader, TableRow } from './components/mdx/mdx-components/table'
export { Tab, TabContent, TabList, TabTrigger } from './components/mdx/mdx-components/tabs'
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
} from './components/mdx/mdx-components/typepography'

// components/mobile-nav
export { MobileNav } from './components/mobile-nav'

// components/mode-toggle
export { ModeSwitcher } from './components/mode-toggle'

// components/page-header
export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from './components/page-header'

// components/providers
export { ThemeProvider } from './components/providers'

// components/style-switcher
export { StyleSwitcher } from './components/style-switcher'
export {
  DocsProvider,
  useDocsConfig,
  useDocsContext,
  useDocsEntries,
  useRegistryIndex,
  useSiteConfig,
} from './context/context'
// context
export type {
  IDocsConfig,
  IDocsContextValue,
  IDocsEntry,
  IDocsSiteConfig,
  ITocEntry,
  RegistryIndex,
} from './context/context.types'

// hooks
export { useColors } from './hooks/use-colors'
export { useConfig } from './hooks/use-config'
export { useLiftMode } from './hooks/use-lift-mode'
export { useMetaColor } from './hooks/use-meta-colors'
export { useMounted } from './hooks/use-mounted'
export { useThemesConfig } from './hooks/use-themes-config'
