import type { IDocsConfig } from '@gentleduck/docs'
import { buildSidebar, type SidebarDoc } from '@gentleduck/docs'

const SECTION_ORDER_DEFAULT = [
  'Getting Started',
  'Concepts',
  'Core',
  'API',
  'Guides',
  'Course',
  'Advanced',
  'Integrations',
  'Adapters',
  'Benchmarks',
  'News',
  'Misc',
]

export function packageSidebar(docs: SidebarDoc[], pkg: string, custom: string[] = []): IDocsConfig {
  return {
    mainNav: [],
    chartsNav: [],
    sidebarNav: buildSidebar(docs, {
      pkg,
      sectionOrder: custom.length ? custom : SECTION_ORDER_DEFAULT,
      introSlug: `${pkg}/introduction`,
      collapsibleThreshold: 6,
    }),
  }
}
