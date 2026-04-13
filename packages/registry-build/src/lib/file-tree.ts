import { joinPosix, normalizeSlashes } from './path'

/** Represents a file or folder node in a registry file tree. */
export interface IRegistryFileTreeNode {
  children?: IRegistryFileTreeNode[]
  name: string
  path: string
  type: 'file' | 'folder'
}

/** Builds a hierarchical file tree from a flat list of file paths. */
export function createRegistryFileTree(paths: string[], options?: { basePath?: string }) {
  const root: IRegistryFileTreeNode[] = []
  const basePath = options?.basePath ? normalizeSlashes(options.basePath).replace(/\/$/, '') : ''

  for (const filePath of paths.map((value) => normalizeSlashes(value))) {
    const relativePath =
      basePath && filePath.startsWith(`${basePath}/`) ? filePath.slice(basePath.length + 1) : filePath
    const parts = relativePath.split('/').filter(Boolean)
    let currentLevel = root

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index]
      if (!part) {
        continue
      }

      const isFile = index === parts.length - 1
      const nextPath = basePath
        ? joinPosix(basePath, ...parts.slice(0, index + 1))
        : joinPosix(...parts.slice(0, index + 1))
      const existingNode = currentLevel.find((node) => node.name === part)

      if (existingNode) {
        if (!isFile) {
          if (!existingNode.children) {
            existingNode.children = []
          }

          currentLevel = existingNode.children
        }

        continue
      }

      const createdNode: IRegistryFileTreeNode = {
        ...(isFile ? {} : { children: [] }),
        name: part,
        path: nextPath,
        type: isFile ? 'file' : 'folder',
      }
      currentLevel.push(createdNode)

      if (!isFile) {
        currentLevel = createdNode.children ?? []
      }
    }
  }

  return root
}
