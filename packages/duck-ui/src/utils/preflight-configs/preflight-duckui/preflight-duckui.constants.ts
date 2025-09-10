import { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'
import { DuckuiPrompts } from './preflight-duckui.dto'

export const BASE_COLORS = [
  'zinc',
  'slate',
  'stone',
  'gray',
  'neutral',
  'red',
  'rose',
  'orange',
  'green',
  'blue',
  'yellow',
  'violet',
] as const

export const PROJECT_TYPE = ['NEXT_JS', 'TANSTACK_START', 'VITE', 'UNKNOWN'] as const

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
    message: `Select your ${highlighter.info('project type')}`,
    choices: PROJECT_TYPE.map((project) => ({
      title: project,
      value: project,
    })),

    initial: 0,
  },
  {
    type: 'select',
    name: 'base_color',
    message: `Select a ${highlighter.info('base color')} for your project`,
    choices: BASE_COLORS.map((color) => ({
      title: `${color}`,
      value: color,
    })),
    initial: 0,
  },
  {
    type: 'text',
    name: 'alias',
    message: `Type your import ${highlighter.info('alias')}`,
    initial: '~',
  },
  {
    type: 'confirm',
    name: 'monorepo',
    message: `Do you have a ${highlighter.info('monorepo?')}`,
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'text',
    name: 'css',
    message: `Type where's your ${highlighter.info('CSS')} file?`,
    initial: './src/styles.css',
  },
  {
    type: 'confirm',
    name: 'css_variables',
    message: `You want to se ${highlighter.info('CSS')} variables?`,
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'text',
    name: 'prefix',
    message: `Type your Tailwind ${highlighter.info('prefix?')} (Enter for none)`,
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
