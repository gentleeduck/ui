import { registry_entry_schema, registry_item_file_schema } from '@gentleduck/registers'
import fs from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'
import { Project, ScriptKind, SourceFile } from 'ts-morph'
import { z } from 'zod'
import { Index } from '~/__ui_registry__'

const memoizedIndex: typeof Index = Object.fromEntries(
  Object.entries(Index).map(([style, items]) => [style, { ...items }]),
)

export function getRegistryComponent(name: string) {
  return memoizedIndex[name]?.component
}

export async function getRegistryItem(name: string) {
  const item = memoizedIndex[name]

  if (!item) {
    return null
  }

  // Fail early before doing expensive file operations.
  const result = registry_entry_schema.safeParse(item)
  if (!result.success) {
    return null
  }

  let files: typeof result.data.files = []
  for (const file of item.files) {
    const content = await getFileContent(file)
    const relativePath = path.relative(process.cwd(), file.path)

    files.push({
      ...file,
      content,
      path: relativePath,
    })
  }

  // Get meta.
  // Assume the first file is the main file.
  // TODO: Get meta from registry.
  const meta = await getFileMeta(files[0]?.path as string)

  // Fix file paths.
  files = fixFilePaths(files)

  const parsed = registry_entry_schema.safeParse({
    ...result.data,
    files,
    meta,
  })

  if (!parsed.success) {
    console.error(parsed.error.message)
    return null
  }

  return parsed.data
}

async function getFileContent(file: { path: string; type: string }) {
  const raw = await fs.readFile(
    process.cwd().replace('apps/docs', 'packages/registry-blocks-duckui/src/') + file.path,
    'utf-8',
  )

  const project = new Project({
    compilerOptions: {},
  })

  const tempFile = await createTempSourceFile(file.path)
  const sourceFile = project.createSourceFile(tempFile, raw, {
    scriptKind: ScriptKind.TSX,
  })

  let code = sourceFile.getFullText()

  // Some registry items uses default export.
  // We want to use named export instead.
  // TODO: do we really need this?
  if (file.type !== 'registry:page') {
    code = code.replaceAll('export default', 'export')
  }

  // Fix imports.
  code = fixImport(code)

  return code
}

async function getFileMeta(filePath: string) {
  const raw = await fs.readFile(
    process.cwd().replace('apps/docs', 'packages/registry-blocks-duckui/src/') + filePath,
    'utf-8',
  )

  const project = new Project({
    compilerOptions: {},
  })

  const tempFile = await createTempSourceFile(filePath)
  const sourceFile = project.createSourceFile(tempFile, raw, {
    scriptKind: ScriptKind.TSX,
  })

  // const iframeHeight = extractVariable(sourceFile, 'iframeHeight')
  // const containerClassName = extractVariable(sourceFile, 'containerClassName')
  // const description = extractVariable(sourceFile, 'description')

  return {
    code: sourceFile.getFullText(),
    // sourceFile,
    // iframeHeight,
    // containerClassName,
    // description,
  }
}

function getFileTarget(file: z.infer<typeof registry_item_file_schema>) {
  let target = file.target

  if (!target || target === '') {
    const fileName = file.path.split('/').splice(-2).join('/')
    if (file.type === 'registry:block' || file.type === 'registry:example') {
      target = `components/${fileName}`
    }

    if (file.type === 'registry:ui') {
      target = `components/ui/${fileName}`
    }

    if (file.type === 'registry:hook') {
      target = `hooks/${fileName}`
    }

    if (file.type === 'registry:lib') {
      target = `lib/${fileName}`
    }
  }

  return target ?? ''
}

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'wildduck-'))
  return path.join(dir, filename)
}

function fixFilePaths(files: z.infer<typeof registry_entry_schema>['files']) {
  if (!files) {
    return []
  }

  // Resolve all paths relative to the first file's directory.
  const firstFilePath = files[0]!.path
  const firstFilePathDir = path.dirname(firstFilePath)

  return files.map((file) => {
    return {
      ...file,
      path: path.relative(firstFilePathDir, file.path),
      target: getFileTarget(file),
    }
  })
}

export function fixImport(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g

  const replacement = (match: string, type: string, component: string) => {
    if (type.endsWith('components')) {
      return `@/components/${component}`
    } else if (type.endsWith('ui')) {
      return `@/components/ui/${component}`
    } else if (type.endsWith('hooks')) {
      return `@/hooks/${component}`
    } else if (type.endsWith('lib')) {
      return `@/lib/${component}`
    }

    return match
  }

  return content.replace(regex, replacement)
}

export type FileTree = {
  name: string
  path?: string
  children?: FileTree[]
}

export function createFileTreeForRegistryItemFiles(files: Array<{ path: string; target?: string }>) {
  const root: FileTree[] = []

  for (const file of files) {
    const path = file.target ?? file.path
    const parts = path.split('/')
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      const existingNode = currentLevel.find((node) => node.name === part)

      if (existingNode) {
        if (isFile) {
          // Update existing file node with full path
          existingNode.path = path
        } else {
          // Move to next level in the tree
          currentLevel = existingNode.children!
        }
      } else {
        // @ts-expect-error
        const newNode: FileTree = isFile ? { name: part, path } : { children: [], name: part }

        currentLevel.push(newNode)

        if (!isFile) {
          currentLevel = newNode.children!
        }
      }
    }
  }

  return root
}
