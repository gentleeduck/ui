'use server'

import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { BlockChunk, block_schema, registry_entry_schema, Style } from '@gentleduck/registers'
import { Project, ScriptKind, SourceFile, SyntaxKind } from 'ts-morph'
import { z } from 'zod'
import { Index } from '~/__ui_registry__'
import { highlightCode } from '~/lib/highlight-code'

const DEFAULT_BLOCKS_STYLE = 'default' satisfies Style['name']

const project = new Project({
  compilerOptions: {},
})

export async function getAllBlockIds(style: Style['name'] = DEFAULT_BLOCKS_STYLE) {
  const blocks = await _getAllBlocks(style)
  return blocks.map((block) => block.name)
}

export async function getBlock(name: string, style: Style['name'] = DEFAULT_BLOCKS_STYLE) {
  const entry = Index[name]

  const content = await _getBlockContent(name, style)

  const chunks = await Promise.all(
    entry.chunks?.map(async (chunk: BlockChunk) => {
      const code = await readFile(chunk.file)

      const tempFile = await createTempSourceFile(`${chunk.name}.tsx`)
      const sourceFile = project.createSourceFile(tempFile, code, {
        scriptKind: ScriptKind.TSX,
      })

      sourceFile
        .getDescendantsOfKind(SyntaxKind.JsxOpeningElement)
        .filter((node) => {
          return node.getAttribute('x-chunk') !== undefined
        })
        ?.map((component) => {
          component.getAttribute('x-chunk')?.asKind(SyntaxKind.JsxAttribute)?.remove()
        })

      return {
        ...chunk,
        code: sourceFile.getText().replaceAll(`@/registry/${style}/`, '@/components/'),
      }
    }),
  )

  return block_schema.parse({
    style,
    highlightedCode: content.code ? await highlightCode(content.code) : '',
    ...entry,
    ...content,
    chunks,
    description: content.description || '',
    type: 'registry:block',
  })
}

async function _getAllBlocks(style: Style['name'] = DEFAULT_BLOCKS_STYLE) {
  const index = z.record(registry_entry_schema).parse(Index[style])

  return Object.values(index).filter((block) => block.type === 'registry:example')
}

async function _getBlockCode(name: string) {
  const entry = Index[name]
  if (!entry) {
    console.error(`Block ${name} not found`)
    return ''
  }
  const block = registry_entry_schema.parse(entry)

  if (!block.source) {
    return ''
  }

  return await readFile(block.files![0]!.path)
}

async function readFile(_path: string) {
  const filepath = path.join(process.cwd().replace('apps/docs', 'packages/registry-examples-duckui/src') + '/' + _path)
  return await fs.readFile(filepath, 'utf-8')
}

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'codex-'))
  return path.join(dir, filename)
}

async function _getBlockContent(name: string, style: Style['name']) {
  const raw = await _getBlockCode(name)

  const tempFile = await createTempSourceFile(`${name}.tsx`)
  const sourceFile = project.createSourceFile(tempFile, raw, {
    scriptKind: ScriptKind.TSX,
  })

  // Extract meta.
  const description = _extractVariable(sourceFile, 'description')
  const iframeHeight = _extractVariable(sourceFile, 'iframeHeight')
  const containerClassName = _extractVariable(sourceFile, 'containerClassName')

  // Format the code.
  let code = sourceFile.getText()
  code = code.replaceAll(`@/registry/${style}/`, '@/components/')
  code = code.replaceAll('export default', 'export')

  return {
    description,
    code,
    container: {
      height: iframeHeight,
      className: containerClassName,
    },
  }
}

function _extractVariable(sourceFile: SourceFile, name: string) {
  const variable = sourceFile.getVariableDeclaration(name)
  if (!variable) {
    return null
  }

  const value = variable.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue()

  variable.remove()

  return value
}
