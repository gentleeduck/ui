import { THEME_NAMES } from '@gentleduck/registers'
import type { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'

export const BASE_COLORS = THEME_NAMES

export const PROJECT_TYPE = ['NEXT_JS', 'TANSTACK_START', 'VITE', 'UNKNOWN'] as const

export const duckuiPrompts: PromptObject<'duckui'>[] = [
  {
    active: 'yes',
    inactive: 'no',
    initial: false,
    message: `Would you like to init ${highlighter.info('@gentleduck/cli')}`,
    name: 'duckui',
    type: 'confirm',
  },
]

export function makeDuckuiMonorepoPrompt(detectedLabel: string | null): PromptObject<'monorepo'> {
  const message = detectedLabel
    ? `Looks like a monorepo (${highlighter.info(detectedLabel)}). Treat this as a monorepo?`
    : `Are you working inside a ${highlighter.info('monorepo')}?`

  return {
    active: 'yes',
    inactive: 'no',
    initial: detectedLabel !== null,
    message,
    name: 'monorepo',
    type: 'confirm',
  }
}

export const duckuiRestPrompts: PromptObject[] = [
  {
    choices: PROJECT_TYPE.map((project) => ({
      title: project,
      value: project,
    })),

    initial: 0,
    message: `Select your ${highlighter.info('project type')}`,
    name: 'projectType',
    type: 'select',
  },
  {
    choices: BASE_COLORS.map((color) => ({
      title: `${color}`,
      value: color,
    })),
    initial: 0,
    message: `Select a ${highlighter.info('base color')} for your project`,
    name: 'baseColor',
    type: 'select',
  },
  {
    initial: '~',
    message: `Type your import ${highlighter.info('alias')}`,
    name: 'alias',
    type: 'text',
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
    message: `Do you want to use ${highlighter.info('CSS')} variables?`,
    name: 'cssVariables',
    type: 'confirm',
  },
  {
    initial: '',
    message: `Type your Tailwind ${highlighter.info('prefix?')} (Enter for none)`,
    name: 'prefix',
    type: 'text',
  },
]
