'use server'

import { codeToHtml } from 'shiki'

export async function highlightCode(code: string) {
  const html = await codeToHtml(code, {
    lang: 'tsx',
    themes: {
      dark: 'catppuccin-macchiato',
      light: 'github-light',
    },
    transformers: [
      {
        code(node) {
          node.properties['data-line-numbers'] = ''
        },
        line(node) {
          node.properties['data-line'] = ''
        },
        pre(node) {
          node.properties['class'] =
            'no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[duck-tabs]]:p-0 !bg-transparent'
        },
      },
    ],
  })

  return html
}
