import type { UnistTree } from '../../../src/types'
import { rehypeNpmCommand } from '../../../src/velite/plugins/rehype-npm-command'

function createPreTree(raw: string): UnistTree {
  return {
    children: [
      {
        children: [],
        properties: {
          __rawString__: raw,
        },
        tagName: 'pre',
        type: 'element',
      },
    ],
    type: 'root',
  }
}

describe('rehypeNpmCommand', () => {
  it('maps npm install commands to yarn/pnpm/bun variants', () => {
    const tree = createPreTree('npm install @gentleduck/ui')
    rehypeNpmCommand()(tree)

    const props = tree.children[0]?.properties
    expect(props?.__npmCommand__).toBe('npm install @gentleduck/ui')
    expect(props?.__yarnCommand__).toBe('yarn add @gentleduck/ui')
    expect(props?.__pnpmCommand__).toBe('pnpm add @gentleduck/ui')
    expect(props?.__bunCommand__).toBe('bun add @gentleduck/ui')
  })

  it('maps npx create commands to create variants', () => {
    const tree = createPreTree('npx create-next-app demo')
    rehypeNpmCommand()(tree)

    const props = tree.children[0]?.properties
    expect(props?.__npmCommand__).toBe('npx create-next-app demo')
    expect(props?.__yarnCommand__).toBe('yarn create next-app demo')
    expect(props?.__pnpmCommand__).toBe('pnpm create next-app demo')
    expect(props?.__bunCommand__).toBe('bunx --bun create-next-app demo')
  })
})
