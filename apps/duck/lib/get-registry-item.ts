import fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { registryEntrySchema, type registryItemFileSchema } from '@gentleduck/registers'
import { Project, ScriptKind } from 'ts-morph'
import type { z } from 'zod'
import { getRegistryIndex } from '~/lib/registry-index.server'

const memoizedIndex = getRegistryIndex()

function getSourceDir(fileType: string): string {
  if (fileType.includes('ui')) return 'packages/registry-ui/src/'
  if (fileType.includes('example')) return 'packages/registry-examples/src/'
  if (fileType.includes('internal')) return 'packages/registry-internals/src/'
  return 'packages/registry-blocks/src/'
}

export function getRegistryComponent(name: string) {
  return (memoizedIndex[name] as Record<string, unknown> | undefined)?.component
}

export async function getRegistryItem(name: string) {
  const item = memoizedIndex[name]

  if (!item) {
    return null
  }

  // Fail early before doing expensive file operations.
  const result = registryEntrySchema.safeParse(item)
  if (!result.success) {
    return null
  }

  let files: typeof result.data.files = []
  for (const file of item.files ?? []) {
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
  let meta = {}
  try {
    const firstFilePath = files[0]?.path
    if (!firstFilePath) throw new Error('No file path found')
    meta = await getFileMeta(firstFilePath, item.type)
  } catch {
    // Meta extraction is optional -- don't fail the whole item.
  }

  // Fix file paths.
  files = fixFilePaths(files)

  const parsed = registryEntrySchema.safeParse({
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
  const cwd = process.cwd().replaceAll('\\', '/')
  const raw = await fs.readFile(cwd.replace(/apps\/duck(-ui-docs)?/, getSourceDir(file.type)) + file.path, 'utf-8')

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

async function getFileMeta(filePath: string, fileType: string) {
  const cwd = process.cwd().replaceAll('\\', '/')
  const raw = await fs.readFile(cwd.replace(/apps\/duck(-ui-docs)?/, getSourceDir(fileType)) + filePath, 'utf-8')

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

function getFileTarget(file: z.infer<typeof registryItemFileSchema>) {
  let target = file.target

  if (!target || target === '') {
    const fileName = file.path.split('/').slice(-2).join('/')
    if (file.type === 'registry:block' || file.type === 'registry:example' || file.type === 'registry:internal') {
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

function fixFilePaths(files: z.infer<typeof registryEntrySchema>['files']) {
  if (!files) {
    return []
  }

  // Resolve all paths relative to the first file's directory.
  const firstFilePath = files[0]?.path ?? ''
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

export function createFileTreeForRegistryItemFiles(files: Array<{ path: string; target?: string | undefined }>) {
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
          if (!existingNode.children) {
            existingNode.children = []
          }
          currentLevel = existingNode.children
        }
      } else {
        if (!part) continue
        const newNode: FileTree = isFile ? { name: part, path } : { children: [], name: part }

        currentLevel.push(newNode)

        if (!isFile) {
          currentLevel = newNode.children ?? []
        }
      }
    }
  }

  return root
}
