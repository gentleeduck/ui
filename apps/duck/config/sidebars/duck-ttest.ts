import { defineSidebar } from './types'

export const duckTtestSidebar = defineSidebar([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-ttest/introduction' },
      { title: 'Installation', href: '/duck-ttest/installation' },
      { title: 'Getting started', href: '/duck-ttest/getting-started' },
      { title: 'How it compares', href: '/duck-ttest/comparison' },
      { title: 'Migration', href: '/duck-ttest/migration' },
    ],
  },
  {
    title: 'Core',
    href: '/duck-ttest/core',
    items: [
      { title: 'Assertions', href: '/duck-ttest/core/assertions' },
      { title: 'Type-level testing', href: '/duck-ttest/core/type-level-testing' },
      { title: 'Composing tests', href: '/duck-ttest/core/composing-tests' },
    ],
  },
  {
    title: 'API reference',
    href: '/duck-ttest/api',
    items: [
      {
        title: 'Type system',
        href: '/duck-ttest/api/any',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'any', href: '/duck-ttest/api/any' },
          { title: 'assert', href: '/duck-ttest/api/assert' },
          { title: 'boolean', href: '/duck-ttest/api/boolean' },
          { title: 'conditional', href: '/duck-ttest/api/conditional' },
          { title: 'equality', href: '/duck-ttest/api/equality' },
          { title: 'guard', href: '/duck-ttest/api/guard' },
          { title: 'literal', href: '/duck-ttest/api/literal' },
          { title: 'predicates', href: '/duck-ttest/api/predicates' },
          { title: 'primitive', href: '/duck-ttest/api/primitive' },
        ],
      },
      {
        title: 'Data shape',
        href: '/duck-ttest/api/object',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'object', href: '/duck-ttest/api/object' },
          { title: 'tuple', href: '/duck-ttest/api/tuple' },
          { title: 'union', href: '/duck-ttest/api/union' },
          { title: 'extraction', href: '/duck-ttest/api/extraction' },
          { title: 'discriminated', href: '/duck-ttest/api/discriminated' },
          { title: 'brand', href: '/duck-ttest/api/brand' },
        ],
      },
      {
        title: 'Functions',
        href: '/duck-ttest/api/function',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'function', href: '/duck-ttest/api/function' },
          { title: 'class', href: '/duck-ttest/api/class' },
          { title: 'fp', href: '/duck-ttest/api/fp' },
          { title: 'async', href: '/duck-ttest/api/async' },
          { title: 'promise', href: '/duck-ttest/api/promise' },
          { title: 'emitter', href: '/duck-ttest/api/emitter' },
          { title: 'result', href: '/duck-ttest/api/result' },
        ],
      },
      {
        title: 'Numbers and bits',
        href: '/duck-ttest/api/number',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'number', href: '/duck-ttest/api/number' },
          { title: 'bit', href: '/duck-ttest/api/bit' },
          { title: 'geometry', href: '/duck-ttest/api/geometry' },
        ],
      },
      {
        title: 'Strings',
        href: '/duck-ttest/api/template',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'template', href: '/duck-ttest/api/template' },
          { title: 'pattern', href: '/duck-ttest/api/pattern' },
          { title: 'format', href: '/duck-ttest/api/format' },
        ],
      },
      {
        title: 'Domain',
        href: '/duck-ttest/api/http',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'http', href: '/duck-ttest/api/http' },
          { title: 'router', href: '/duck-ttest/api/router' },
          { title: 'json', href: '/duck-ttest/api/json' },
          { title: 'sql', href: '/duck-ttest/api/sql' },
          { title: 'css', href: '/duck-ttest/api/css' },
          { title: 'aria', href: '/duck-ttest/api/aria' },
          { title: 'date', href: '/duck-ttest/api/date' },
          { title: 'locale', href: '/duck-ttest/api/locale' },
          { title: 'fs', href: '/duck-ttest/api/fs' },
        ],
      },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Cookbook', href: '/duck-ttest/guides' },
      { title: 'Branded types', href: '/duck-ttest/guides/branded-types' },
      { title: 'Discriminated unions', href: '/duck-ttest/guides/discriminated-unions' },
      { title: 'Schema builders', href: '/duck-ttest/guides/schema-builders' },
      { title: 'Catching regressions', href: '/duck-ttest/guides/catching-regressions' },
    ],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-ttest/changelog' }],
  },
])
