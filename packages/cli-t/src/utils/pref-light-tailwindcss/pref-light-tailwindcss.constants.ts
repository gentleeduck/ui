import { PromptObject } from 'prompts'
import { highlighter } from '../text-styling'

export const tailwindcss_prompts: PromptObject<string>[] = [
  {
    type: 'confirm',
    name: 'tailwind',
    message: `Would you like to use ${highlighter.info('TailwindCSS')}`,
    initial: false,
    active: 'yes',
    inactive: 'no'
  }
]

//NOTE: willing to support more when we have more frameworks to support with duck-ui
export const tailwindcss_dependencies = [
  'tailwindcss',
  'postcss',
  'autoprefixer'
]

export const tailwindcss_init = ['tailwindcss', 'init', '-p']

export const default_config = `/** @type {import('tailwindcss').Config} */
    export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };`
