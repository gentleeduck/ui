import type { UnistTree } from '../../../src/types'
import { rehypePreBlockSource } from '../../../src/velite/plugins/rehype-pre-block-source'

function createTree(raw: string): UnistTree {
  return {
    children: [
      {
        children: [
          {
            children: [{ type: 'text', value: raw }],
            properties: { __title__: 'Demo title' },
            tagName: 'pre',
            type: 'element',
          },
        ],
        properties: { 'data-rehype-pretty-code-fragment': true },
        tagName: 'div',
        type: 'element',
      },
    ],
    type: 'root',
  }
}

describe('rehypePreBlockSource', () => {
  it('adds __rawString__ to pre nodes in pretty-code fragments', () => {
    const tree = createTree('npm install @gentleduck/ui')
    rehypePreBlockSource()(tree)

    const preProps = tree.children[0]?.children?.[0]?.properties
    expect(preProps?.__rawString__).toBe('npm install @gentleduck/ui')
  })

  it('preserves existing pre metadata', () => {
    const tree = createTree('bun add @gentleduck/ui')
    rehypePreBlockSource()(tree)

    const preProps = tree.children[0]?.children?.[0]?.properties
    expect(preProps?.__title__).toBe('Demo title')
  })
})
