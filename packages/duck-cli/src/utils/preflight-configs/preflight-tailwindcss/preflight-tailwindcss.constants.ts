import type { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'
import { PROJECT_TYPE } from '../preflight-duckui/preflight-duckui.constants'

export const tailwindcss_prompts: PromptObject<string>[] = [
  {
    active: 'yes',
    inactive: 'no',
    initial: false,
    message: `Would you like to install ${highlighter.info('TailwindCSS')}`,
    name: 'tailwind',
    type: 'confirm',
  },
]

export const tailwindcss_install_prompts: PromptObject<string>[] = [
  {
    choices: PROJECT_TYPE.map((project) => ({
      title: project,
      value: project,
    })),
    initial: 0,
    message: `Select your ${highlighter.info('project type')} to install TailwindCSS correctly`,
    name: 'project_type',
    type: 'select',
  },
  {
    initial: './src/',
    message: `Type where's your ${highlighter.info('CSS')} file? (Enter for default)`,
    name: 'css',
    type: 'text',
  },
]

export const post_css_nextjs = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;`

export const tailwindcss_vite = `import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})`

export const tailwindcss_boilerplate = `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-delay: 0ms !important;
    transition-duration: 1ms !important;
  }
}
`
