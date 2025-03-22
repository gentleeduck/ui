import { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'

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
    name: 'baseColor',
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
    initial: 1,
  },
]

export const default_duckui_config = (
  project_type: string,
  ts_config_alias_prefix: string,
  monorepo: boolean,
  baseColor: string,
  prefix: string,
  css: string,
  cssVariables: boolean,
) => ({
  rsc: ['NEXT_JS'].includes(project_type),
  monorepo,
  tailwind: {
    baseColor,
    css,
    cssVariables,
    prefix,
  },
  aliases: {
    ui: `${ts_config_alias_prefix}/ui`,
    libs: `${ts_config_alias_prefix}/libs`,
    hooks: `${ts_config_alias_prefix}/hooks`,
    pages: `${ts_config_alias_prefix}/pages`,
    layouts: `${ts_config_alias_prefix}/layouts`,
  },
})
