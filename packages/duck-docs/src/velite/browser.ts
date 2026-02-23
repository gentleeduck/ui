const serverOnly = () => {
  throw new Error('@gentleduck/docs/velite is server-only.')
}

export const docsVeliteConfig = {} as never
export const createDocsVeliteConfig = serverOnly as unknown as () => never
export const rehypeNpmCommand = serverOnly as unknown as () => never
export const cleanTocItems = serverOnly as unknown as () => never
export const rehypePreBlockSource = serverOnly as unknown as () => never
export const rehypeTitle = serverOnly as unknown as () => never
export const rhypeMetadataPlugin = serverOnly as unknown as () => never
