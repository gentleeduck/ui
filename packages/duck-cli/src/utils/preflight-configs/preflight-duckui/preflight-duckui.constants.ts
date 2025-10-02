import type { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'

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
    active: 'yes',
    inactive: 'no',
    initial: false,
    message: `Would you like to init ${highlighter.info('@gentleduck/cli')}`,
    name: 'duckui',
    type: 'confirm',
  },
]

export const duckui_config_prompts: PromptObject[] = [
  {
    choices: PROJECT_TYPE.map((project) => ({
      title: project,
      value: project,
    })),

    initial: 0,
    message: `Select your ${highlighter.info('project type')}`,
    name: 'project_type',
    type: 'select',
  },
  {
    choices: BASE_COLORS.map((color) => ({
      title: `${color}`,
      value: color,
    })),
    initial: 0,
    message: `Select a ${highlighter.info('base color')} for your project`,
    name: 'base_color',
    type: 'select',
  },
  {
    initial: '~',
    message: `Type your import ${highlighter.info('alias')}`,
    name: 'alias',
    type: 'text',
  },
  {
    active: 'yes',
    inactive: 'no',
    initial: false,
    message: `Do you have a ${highlighter.info('monorepo?')}`,
    name: 'monorepo',
    type: 'confirm',
  },
  {
    initial: './src/styles.css',
    message: `Type where's your ${highlighter.info('CSS')} file?`,
    name: 'css',
    type: 'text',
  },
  {
    active: 'yes',
    inactive: 'no',
    initial: true,
    message: `You want to se ${highlighter.info('CSS')} variables?`,
    name: 'css_variables',
    type: 'confirm',
  },
  {
    initial: '',
    message: `Type your Tailwind ${highlighter.info('prefix?')} (Enter for none)`,
    name: 'prefix',
    type: 'text',
  },
]
