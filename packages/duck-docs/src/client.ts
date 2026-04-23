'use client'

// components/docs
export { DocsCopyPage } from './components/docs/docs-copy-page'
export { DocsPagerBottom, DocsPagerTop, flatten, getPagerForDoc } from './components/docs/docs-pager'
export { DocsPathBreadcrumb } from './components/docs/docs-path-breadcrumb'
export type { IDocsSidebarNavProps } from './components/docs/docs-sidebar'
export { DocsSidebarNav, DocsSidebarNavItem, DocsSidebarNavItems } from './components/docs/docs-sidebar'
export { DashboardTableOfContents } from './components/docs/docs-toc'
// components/icons
export { getIconForLanguageExtension } from './components/icons'

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

// components/providers
export { ThemeProvider } from './components/providers'

// components/style-switcher
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
