import fs from 'fs-extra'
import { Ora } from 'ora'
import { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'
import { PROJECT_TYPE } from '../preflight-duckui'

export const tailwindcss_prompts: PromptObject<string>[] = [
  {
    type: 'confirm',
    name: 'tailwind',
    message: `Would you like to install ${highlighter.info('TailwindCSS')}`,
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
]

export const tailwindcss_install_prompts: PromptObject<string>[] = [
  {
    type: 'select',
    name: 'project_type',
    message: `Select your ${highlighter.info('project type')} to install TailwindCSS correctly`,
    choices: PROJECT_TYPE.map((project) => ({
      title: project,
      value: project,
    })),
    initial: 0,
  },
  {
    type: 'text',
    name: 'css',
    message: `Type where's your ${highlighter.info('CSS')} file? (Enter for default)`,
    initial: './src/',
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

export const tailwindcss_poiler = `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));
`
