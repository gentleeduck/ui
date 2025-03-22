import { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'
import { DuckuiPrompts } from './preflight-duckui.dto'

export const duckui_prompts: PromptObject<'duckui'>[] = [
  {
    type: 'confirm',
    name: 'duckui',
    message: `Would you like to init ${highlighter.info('duck-ui')}`,
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
]

export const duckui_config_prompts: PromptObject[] = [
  {
    type: 'select',
    name: 'project_type',
    message: `${highlighter.info('Select your project type')}`,
    choices: [
      { title: 'Next.js', value: 'NEXT_JS' },
      { title: 'React', value: 'REACT' },
    ],
    initial: 0,
  },
  {
    type: 'select',
    name: 'base_color',
    message: `${highlighter.info('Select a base color for your project')}`,
    choices: [
      { title: 'Zinc', value: 'zinc' },
      { title: 'Slate', value: 'slate' },
      { title: 'Gray', value: 'gray' },
      { title: 'Neutral', value: 'neutral' },
      { title: 'Red', value: 'red' },
      { title: 'Rose', value: 'rose' },
      { title: 'Orange', value: 'orange' },
      { title: 'Green', value: 'green' },
      { title: 'Blue', value: 'blue' },
    ],
    initial: 0,
  },
  {
    type: 'text',
    name: 'alias',
    message: `${highlighter.info('Type your import alias')}`,
    initial: '~',
  },
  {
    type: 'confirm',
    name: 'monorepo',
    message: `${highlighter.info('Do you have a monorepo?')}`,
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'text',
    name: 'css',
    message: `${highlighter.info("Type where's your css file?")}`,
    initial: './src/styles.css',
  },
  {
    type: 'confirm',
    name: 'css_variables',
    message: `${highlighter.info('You want to se CSS variables?')}`,
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'text',
    name: 'prefix',
    message: `${highlighter.info('Type your prefix?')}`,
    initial: '',
  },
]

export const default_duckui_config = ({
  project_type,
  monorepo,
  css,
  prefix,
  alias,
  base_color,
  css_variables,
}: DuckuiPrompts) => {
  return `{
  "schema": "https://duckui.vercel.app/schema.json",
  "rsc": "${['NEXT_JS'].includes(project_type)}",
  "monorepo": ${monorepo},
  "tailwind": {
    "baseColor": "${base_color}",
    "css": "${css}",
    "cssVariables": ${css_variables},
    "prefix": "${prefix}"
  },
  "aliases": {
    "ui": "${alias}/ui",
    "libs": "${alias}/libs",
    "hooks": "${alias}/hooks",
    "pages": "${alias}/pages",
    "layouts": "${alias}/layouts"
  }
}`
}

export const PROJECT_TYPE = [
  'NEXT_JS',
  'VITE',
  'CREATE_REACT_APP',
  'UNKNOWN',
] as const
