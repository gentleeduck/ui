export function parseFrontmatter(content: string): { title: string; description: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { title: '', description: '', body: content }

  const frontmatter = match[1] ?? ''
  const body = match[2] ?? ''

  const title = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? ''
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? ''

  return { title, description, body }
}

/** Strip JSX, imports, and mermaid components to leave plain markdown. */
export function stripMdxSyntax(body: string): string {
  const unwrapComponents = ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent', 'Steps', 'Step']
  const removeComponents = ['MermaidDiagram', 'ComponentSource', 'ComponentPreview']

  let stripped = body.replace(/^import\s+.*$/gm, '')

  for (const component of unwrapComponents) {
    stripped = stripped.replace(new RegExp(`<${component}[^>]*>([\\s\\S]*?)<\\/${component}>`, 'g'), '$1')
  }

  for (const component of removeComponents) {
    stripped = stripped.replace(new RegExp(`<${component}[^>]*>[\\s\\S]*?<\\/${component}>`, 'g'), '')
  }

  return stripped
    .replace(/<\w+[\s\S]*?\/>/g, '')
    .replace(/^\s*<\/?\w+[^>]*>\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function extractCodeBlocks(body: string): string[] {
  const blocks: string[] = []
  const regex = /```(\w*)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null = regex.exec(body)
  while (match !== null) {
    const lang = match[1] ?? ''
    const code = (match[2] ?? '').trim()
    blocks.push(`\`\`\`${lang}\n${code}\n\`\`\``)
    match = regex.exec(body)
  }
  return blocks
}

/** Headings + first paragraph under each — compact summary. */
export function extractSummary(cleanBody: string): string {
  const lines = cleanBody.split('\n')
  const summary: string[] = []
  let collecting = false

  for (const line of lines) {
    if (line.startsWith('#')) {
      summary.push(line)
      collecting = true
    } else if (collecting && line.trim()) {
      summary.push(line)
      collecting = false
    }
  }

  return summary.join('\n')
}

export function extractSection(
  cleanBody: string,
  sectionName: string,
): { found: boolean; content: string; headings: string[] } {
  const sectionLower = sectionName.toLowerCase()
  const lines = cleanBody.split('\n')
  const sectionLines: string[] = []
  const headings: string[] = []
  let capturing = false
  let sectionLevel = 0

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      headings.push(line)
      const level = headingMatch[1]?.length ?? 0
      const text = headingMatch[2]?.toLowerCase() ?? ''
      if (text.includes(sectionLower)) {
        capturing = true
        sectionLevel = level
        sectionLines.push(line)
        continue
      }
      if (capturing && level <= sectionLevel) break
    }
    if (capturing) sectionLines.push(line)
  }

  return {
    found: sectionLines.length > 0,
    content: sectionLines.join('\n').trim(),
    headings,
  }
}
