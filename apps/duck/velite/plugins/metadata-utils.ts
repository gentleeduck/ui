interface IParsedCodeFenceMeta {
  marks?: string[]
  title?: string
}

export function parseCodeFenceMeta(meta: string): IParsedCodeFenceMeta {
  const title = (meta.match(/title="([^"]*)"/) ?? [])[1]
  const marks = [...meta.matchAll(/\/([^/]+)\//g)].map((match) => match[1]).filter(Boolean) as string[]

  return {
    marks: marks.length ? marks : undefined,
    title,
  }
}
