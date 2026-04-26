import type { ISidebarNavItem } from '@duck-docs/types/nav'

export interface SidebarDoc {
  permalink: string
  title: string
  section?: string
  order?: number
}

export interface BuildSidebarOptions {
  pkg: string
  sectionOrder?: string[]
  introSlug?: string
  collapsibleThreshold?: number
}

const titlecase = (segment: string) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const inferSection = (permalink: string, pkg: string): string => {
  const tail = permalink.replace(new RegExp(`^${pkg}/?`), '')
  const parts = tail.split('/')
  if (parts.length <= 1) return 'Getting Started'
  return titlecase(parts[0] ?? 'Misc')
}

const slugTitle = (permalink: string) => {
  const last = permalink.split('/').pop() ?? permalink
  return last === 'index' ? 'Overview' : titlecase(last)
}

export function buildSidebar(docs: SidebarDoc[], options: BuildSidebarOptions): ISidebarNavItem[] {
  const { pkg, sectionOrder = [], introSlug = `${pkg}/introduction`, collapsibleThreshold = 6 } = options

  const grouped = new Map<string, SidebarDoc[]>()
  for (const doc of docs) {
    if (!doc.permalink.startsWith(`${pkg}/`) && doc.permalink !== pkg) continue
    const section = doc.section ?? inferSection(doc.permalink, pkg)
    const list = grouped.get(section) ?? []
    list.push(doc)
    grouped.set(section, list)
  }

  const introSection = grouped.get('Getting Started') ?? []
  const introDoc = introSection.find((d) => d.permalink === introSlug)
  if (introDoc) {
    grouped.set(
      'Getting Started',
      [introDoc, ...introSection.filter((d) => d.permalink !== introSlug)],
    )
  }

  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    const ai = sectionOrder.indexOf(a)
    const bi = sectionOrder.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.localeCompare(b)
  })

  return sortedKeys.map((key, idx) => {
    const items = (grouped.get(key) ?? [])
      .slice()
      .sort((a, b) => {
        if (a.permalink === introSlug) return -1
        if (b.permalink === introSlug) return 1
        const ao = a.order ?? Number.POSITIVE_INFINITY
        const bo = b.order ?? Number.POSITIVE_INFINITY
        if (ao !== bo) return ao - bo
        if (a.permalink.endsWith('/index')) return -1
        if (b.permalink.endsWith('/index')) return 1
        return a.title.localeCompare(b.title)
      })
      .map<ISidebarNavItem>((doc) => ({
        href: `/${doc.permalink}`,
        title: doc.permalink === introSlug ? 'Introduction' : doc.title || slugTitle(doc.permalink),
        items: [],
      }))

    const isFirst = idx === 0
    return {
      title: isFirst ? '' : key,
      ...(isFirst ? { href: `/${introSlug}` } : {}),
      ...(items.length > collapsibleThreshold ? { collapsible: true } : {}),
      items,
    }
  })
}
