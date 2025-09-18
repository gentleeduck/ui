import path from 'node:path'
import { styleText } from 'node:util'
import { RegistryEntry } from '@gentleduck/registers'
import fg from 'fast-glob'
import { ENV } from '../main'
import { GetComponentFilesArgs } from './build-registry-index.types'

// ----------------------------------------------------------------------------

/**
 * Retrieves a list of component files from the registry based on the specified item type.
 *
 * This function scans the component's root folder for TypeScript (`.ts`) and TypeScript JSX (`.tsx`) files
 * and returns an updated registry item containing these files.
 */

type FileNode = {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

export async function get_component_files({
  item,
  type,
  spinner,
  idx,
  registry_count,
}: GetComponentFilesArgs): Promise<RegistryEntry & { tree: FileNode[] }> {
  try {
    // Determine the base path depending on the type of registry item
    const basePath = `..${
      type.includes('ui')
        ? ENV.REGISTRY_UI_PATH
        : type.includes('example')
          ? ENV.REGISTRY_EXAMPLES_PATH
          : ENV.REGISTRY_BLOCKS_PATH
    }${item.root_folder}`
    const cwdPath = path.join(process.cwd(), basePath)

    // Get ALL files recursively (ts, tsx, and folders)
    const files = await fg('**/*.{ts,tsx}', { cwd: cwdPath, onlyFiles: true })

    if (files.length === 0) {
      spinner.warn(`No TypeScript or TSX files found in: ${cwdPath}`)
    } else {
      spinner.text = `🧭 Retrieving ${styleText(
        'green',
        type,
      )} component files... (${styleText('yellow', idx.toString())}/${styleText('yellow', registry_count.toString())})`
    }

    // Helper: build nested tree from paths
    function buildTree(paths: string[]): FileNode[] {
      const root: FileNode[] = []

      for (const filePath of paths) {
        const parts = filePath.split(path.sep)
        let currentLevel = root

        parts.forEach((part, i) => {
          const existing = currentLevel.find((node) => node.name === part)

          if (existing) {
            if (existing.type === 'folder' && existing.children) {
              currentLevel = existing.children
            }
          } else {
            const isFile = i === parts.length - 1
            const newNode: FileNode = {
              name: part,
              path: path.join(item.root_folder, parts.slice(0, i + 1).join(path.sep)),
              type: isFile ? 'file' : 'folder',
              ...(isFile ? {} : { children: [] }),
            }
            currentLevel.push(newNode)

            if (!isFile) {
              currentLevel = newNode.children!
            }
          }
        })
      }

      return root
    }

    const tree = buildTree(files)

    return {
      ...item,
      files: files.map((file) => ({
        path: `${item.root_folder}/${file}`,
        type: item.type,
      })),
      source: `${type.includes('ui') ? ENV.REGISTRY_UI_PATH : ENV.REGISTRY_EXAMPLES_PATH}${item.root_folder}`,
      tree,
    }
  } catch (error) {
    spinner.fail(`Failed to retrieve component files: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
