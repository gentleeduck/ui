import type { IMdxCodeNodeProperties, IUnistNode, IUnistTree } from '@duck-docs/types'
import { visit } from 'unist-util-visit'
import { readNodeProperties } from './hast-properties'

export function rehypeNpmCommand() {
  return (tree: IUnistTree) => {
    visit(tree, (node: IUnistNode) => {
      if (node.type !== 'element' || node?.tagName !== 'pre') {
        return
      }

      const props = readNodeProperties<IMdxCodeNodeProperties>(node)
      const raw = props.__rawString__

      if (!raw) {
        return
      }

      // npm install.
      if (raw.startsWith('npm install')) {
        props.__npmCommand__ = raw
        props.__yarnCommand__ = raw.replace('npm install', 'yarn add')
        props.__pnpmCommand__ = raw.replace('npm install', 'pnpm add')
        props.__bunCommand__ = raw.replace('npm install', 'bun add')
      }

      // npx create.
      if (raw.startsWith('npx create-')) {
        props.__npmCommand__ = raw
        props.__yarnCommand__ = raw.replace('npx create-', 'yarn create ')
        props.__pnpmCommand__ = raw.replace('npx create-', 'pnpm create ')
        props.__bunCommand__ = raw.replace('npx', 'bunx --bun')
      }

      // npx.
      if (raw.startsWith('npx') && !raw.startsWith('npx create-')) {
        props.__npmCommand__ = raw
        props.__yarnCommand__ = raw.replace('npx', 'yarn dlx')
        props.__pnpmCommand__ = raw.replace('npx', 'pnpm dlx')
        props.__bunCommand__ = raw.replace('npx', 'bunx --bun')
      }
    })
  }
}
