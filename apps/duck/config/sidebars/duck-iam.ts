import { defineSidebar } from './types'

export const duckIamSidebar = defineSidebar([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-iam/introduction' },
      { title: 'Installation', href: '/duck-iam/installation' },
    ],
  },
  {
    title: 'Core',
    href: '/duck-iam/core',
    items: [
      { title: 'Primitives', href: '/duck-iam/core/primitives' },
      { title: 'Evaluation pipeline', href: '/duck-iam/core/evaluation' },
      { title: 'Rule matching', href: '/duck-iam/core/rule-matching' },
      { title: 'Cross-policy combination', href: '/duck-iam/core/cross-policy' },
      {
        title: 'Policies',
        href: '/duck-iam/core/policies',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'Building policies', href: '/duck-iam/core/policies/building' },
          { title: 'Rules', href: '/duck-iam/core/policies/rules' },
          { title: 'Targets', href: '/duck-iam/core/policies/targets' },
          { title: 'Conditions', href: '/duck-iam/core/policies/conditions' },
          { title: 'Nesting (and / or / not)', href: '/duck-iam/core/policies/nesting' },
          { title: 'Combining algorithms', href: '/duck-iam/core/policies/combining-algorithms' },
          { title: '$-variable references', href: '/duck-iam/core/policies/dollar-variables' },
          { title: 'Layered example', href: '/duck-iam/core/policies/example-layered' },
        ],
      },
      {
        title: 'Roles',
        href: '/duck-iam/core/roles',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'Defining roles', href: '/duck-iam/core/roles/definition' },
          { title: 'Inheritance', href: '/duck-iam/core/roles/inheritance' },
          { title: 'Type-safe roles', href: '/duck-iam/core/roles/type-safe' },
          { title: 'Scoped roles (multi-tenancy)', href: '/duck-iam/core/roles/scoped' },
          { title: 'Conditional permissions', href: '/duck-iam/core/roles/conditional' },
          { title: 'rolesToPolicy (under the hood)', href: '/duck-iam/core/roles/roles-to-policy' },
        ],
      },
    ],
  },
  {
    title: 'Guides',
    items: [{ title: 'Quick start', href: '/duck-iam/guides' }],
  },
  {
    title: 'Course',
    href: '/duck-iam/course',
    items: [
      { title: 'Chapter 1: your first permission check', href: '/duck-iam/course/chapter-1' },
      { title: 'Chapter 2: role hierarchies', href: '/duck-iam/course/chapter-2' },
      { title: 'Chapter 3: policies, rules, and conditions', href: '/duck-iam/course/chapter-3' },
      { title: 'Chapter 4: the engine in depth', href: '/duck-iam/course/chapter-4' },
      { title: 'Chapter 5: multi-tenant scoping', href: '/duck-iam/course/chapter-5' },
      { title: 'Chapter 6: server integration', href: '/duck-iam/course/chapter-6' },
      { title: 'Chapter 7: client libraries', href: '/duck-iam/course/chapter-7' },
      { title: 'Chapter 8: production readiness', href: '/duck-iam/course/chapter-8' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'Explain and debug', href: '/duck-iam/advanced/explain' },
      { title: 'Utilities', href: '/duck-iam/advanced/utilities' },
      {
        title: 'Config',
        href: '/duck-iam/advanced/config',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'createAccessConfig()', href: '/duck-iam/advanced/config/access-config' },
          { title: 'Methods reference', href: '/duck-iam/advanced/config/methods' },
          { title: 'Typed context', href: '/duck-iam/advanced/config/context' },
          { title: 'Typed $-references', href: '/duck-iam/advanced/config/dollar-paths' },
          { title: 'Typed vs untyped comparison', href: '/duck-iam/advanced/config/comparison' },
        ],
      },
      {
        title: 'Engine',
        href: '/duck-iam/advanced/engine',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'Methods', href: '/duck-iam/advanced/engine/methods' },
          { title: 'Caching', href: '/duck-iam/advanced/engine/caching' },
          { title: 'Hooks', href: '/duck-iam/advanced/engine/hooks' },
          { title: 'Development vs production mode', href: '/duck-iam/advanced/engine/modes' },
          { title: 'Admin API', href: '/duck-iam/advanced/engine/admin' },
        ],
      },
    ],
  },
  {
    title: 'Integrations',
    items: [
      {
        title: 'Adapters',
        href: '/duck-iam/integrations/adapters',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'Choosing & FAQ', href: '/duck-iam/integrations/adapters/comparison' },
          { title: 'Memory adapter', href: '/duck-iam/integrations/adapters/memory' },
          { title: 'Drizzle adapter', href: '/duck-iam/integrations/adapters/drizzle' },
          { title: 'Prisma adapter', href: '/duck-iam/integrations/adapters/prisma' },
          { title: 'Redis adapter', href: '/duck-iam/integrations/adapters/redis' },
          { title: 'HTTP adapter', href: '/duck-iam/integrations/adapters/http' },
          { title: 'Custom adapter', href: '/duck-iam/integrations/adapters/custom' },
        ],
      },
      {
        title: 'Client',
        href: '/duck-iam/integrations/client',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'PermissionMap reference', href: '/duck-iam/integrations/client/permission-map' },
          { title: 'Vanilla JS', href: '/duck-iam/integrations/client/vanilla' },
          { title: 'React', href: '/duck-iam/integrations/client/react' },
          { title: 'Vue', href: '/duck-iam/integrations/client/vue' },
        ],
      },
      {
        title: 'Server',
        href: '/duck-iam/integrations/server',
        collapsible: true,
        defaultOpen: false,
        items: [
          { title: 'Generic helpers', href: '/duck-iam/integrations/server/generic' },
          { title: 'Next.js app router', href: '/duck-iam/integrations/server/next' },
          { title: 'Express', href: '/duck-iam/integrations/server/express' },
          { title: 'Hono', href: '/duck-iam/integrations/server/hono' },
          { title: 'NestJS', href: '/duck-iam/integrations/server/nest' },
        ],
      },
    ],
  },
  {
    title: 'Benchmarks',
    items: [{ title: 'Benchmarks', href: '/duck-iam/benchmarks' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-iam/changelog' }],
  },
])
