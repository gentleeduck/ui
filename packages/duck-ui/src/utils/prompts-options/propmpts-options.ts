import { highlighter } from '../text-styling'

export const minimal_options = (styles, baseColors, cssVariables, style) => [
  {
    type: 'select',
    name: 'style',
    message: `Which ${highlighter.info('style')} would you like to use?`,
    choices: styles.map(style => ({
      title: style.label,
      value: style.name,
    })),
    initial: styles.findIndex(s => s.name === style),
  },
  {
    type: 'select',
    name: 'tailwindBaseColor',
    message: `Which color would you like to use as the ${highlighter.info('base color')}?`,
    choices: baseColors.map(color => ({
      title: color.label,
      value: color.name,
    })),
  },
  {
    type: 'toggle',
    name: 'tailwindCssVariables',
    message: `Would you like to use ${highlighter.info('CSS variables')} for theming?`,
    initial: cssVariables,
    active: 'yes',
    inactive: 'no',
  },
]
