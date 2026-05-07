import { defineSidebar } from './types'

export type DuckIamHref =
  | '/duck-iam/advanced/config'
  | '/duck-iam/advanced/config/access-config'
  | '/duck-iam/advanced/config/comparison'
  | '/duck-iam/advanced/config/context'
  | '/duck-iam/advanced/config/dollar-paths'
  | '/duck-iam/advanced/config/methods'
  | '/duck-iam/advanced/engine'
  | '/duck-iam/advanced/engine/admin'
  | '/duck-iam/advanced/engine/caching'
  | '/duck-iam/advanced/engine/hooks'
  | '/duck-iam/advanced/engine/methods'
  | '/duck-iam/advanced/engine/modes'
  | '/duck-iam/advanced/explain'
  | '/duck-iam/advanced/utilities'
  | '/duck-iam/benchmarks'
  | '/duck-iam/changelog'
  | '/duck-iam/core'
  | '/duck-iam/core/cross-policy'
  | '/duck-iam/core/evaluation'
  | '/duck-iam/core/policies'
  | '/duck-iam/core/policies/building'
  | '/duck-iam/core/policies/combining-algorithms'
  | '/duck-iam/core/policies/conditions'
  | '/duck-iam/core/policies/dollar-variables'
  | '/duck-iam/core/policies/example-layered'
  | '/duck-iam/core/policies/nesting'
  | '/duck-iam/core/policies/rules'
  | '/duck-iam/core/policies/targets'
  | '/duck-iam/core/primitives'
  | '/duck-iam/core/roles'
  | '/duck-iam/core/roles/conditional'
  | '/duck-iam/core/roles/definition'
  | '/duck-iam/core/roles/inheritance'
  | '/duck-iam/core/roles/roles-to-policy'
  | '/duck-iam/core/roles/scoped'
  | '/duck-iam/core/roles/type-safe'
  | '/duck-iam/core/rule-matching'
  | '/duck-iam/course'
  | '/duck-iam/course/chapter-1'
  | '/duck-iam/course/chapter-2'
  | '/duck-iam/course/chapter-3'
  | '/duck-iam/course/chapter-4'
  | '/duck-iam/course/chapter-5'
  | '/duck-iam/course/chapter-6'
  | '/duck-iam/course/chapter-7'
  | '/duck-iam/course/chapter-8'
  | '/duck-iam/guides'
  | '/duck-iam/installation'
  | '/duck-iam/integrations/adapters'
  | '/duck-iam/integrations/adapters/comparison'
  | '/duck-iam/integrations/adapters/custom'
  | '/duck-iam/integrations/adapters/drizzle'
  | '/duck-iam/integrations/adapters/http'
  | '/duck-iam/integrations/adapters/memory'
  | '/duck-iam/integrations/adapters/prisma'
  | '/duck-iam/integrations/adapters/redis'
  | '/duck-iam/integrations/client'
  | '/duck-iam/integrations/client/permission-map'
  | '/duck-iam/integrations/client/react'
  | '/duck-iam/integrations/client/vanilla'
  | '/duck-iam/integrations/client/vue'
  | '/duck-iam/integrations/server'
  | '/duck-iam/integrations/server/express'
  | '/duck-iam/integrations/server/generic'
  | '/duck-iam/integrations/server/hono'
  | '/duck-iam/integrations/server/nest'
  | '/duck-iam/integrations/server/next'
  | '/duck-iam/introduction'

export const duckIamSidebar = defineSidebar<DuckIamHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-iam/introduction' },
      { title: 'installation', href: '/duck-iam/installation' },
    ],
  },
  {
    title: 'Core',
    items: [
      { title: '$-variable references', href: '/duck-iam/core/policies/dollar-variables' },
      { title: 'building policies', href: '/duck-iam/core/policies/building' },
      { title: 'combining algorithms', href: '/duck-iam/core/policies/combining-algorithms' },
      { title: 'conditional permissions', href: '/duck-iam/core/roles/conditional' },
      { title: 'conditions', href: '/duck-iam/core/policies/conditions' },
      { title: 'core overview', href: '/duck-iam/core' },
      { title: 'cross-policy combination', href: '/duck-iam/core/cross-policy' },
      { title: 'defining roles', href: '/duck-iam/core/roles/definition' },
      { title: 'evaluation pipeline', href: '/duck-iam/core/evaluation' },
      { title: 'inheritance', href: '/duck-iam/core/roles/inheritance' },
      { title: 'layered example', href: '/duck-iam/core/policies/example-layered' },
      { title: 'nesting (and / or / not)', href: '/duck-iam/core/policies/nesting' },
      { title: 'policies overview', href: '/duck-iam/core/policies' },
      { title: 'policy targets', href: '/duck-iam/core/policies/targets' },
      { title: 'primitives', href: '/duck-iam/core/primitives' },
      { title: 'roles overview', href: '/duck-iam/core/roles' },
      { title: 'rolesToPolicy (under the hood)', href: '/duck-iam/core/roles/roles-to-policy' },
      { title: 'rule matching', href: '/duck-iam/core/rule-matching' },
      { title: 'rules', href: '/duck-iam/core/policies/rules' },
      { title: 'scoped roles (multi-tenancy)', href: '/duck-iam/core/roles/scoped' },
      { title: 'type-safe roles', href: '/duck-iam/core/roles/type-safe' },
    ],
  },
  {
    title: 'Guides',
    items: [{ title: 'quick start', href: '/duck-iam/guides' }],
  },
  {
    title: 'Course',
    items: [
      { title: 'chapter 1: your first permission check', href: '/duck-iam/course/chapter-1' },
      { title: 'chapter 2: role hierarchies', href: '/duck-iam/course/chapter-2' },
      { title: 'chapter 3: policies, rules, and conditions', href: '/duck-iam/course/chapter-3' },
      { title: 'chapter 4: the engine in depth', href: '/duck-iam/course/chapter-4' },
      { title: 'chapter 5: multi-tenant scoping', href: '/duck-iam/course/chapter-5' },
      { title: 'chapter 6: server integration', href: '/duck-iam/course/chapter-6' },
      { title: 'chapter 7: client libraries', href: '/duck-iam/course/chapter-7' },
      { title: 'chapter 8: production readiness', href: '/duck-iam/course/chapter-8' },
      { title: 'build an app with duck-iam', href: '/duck-iam/course' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'admin API', href: '/duck-iam/advanced/engine/admin' },
      { title: 'caching', href: '/duck-iam/advanced/engine/caching' },
      { title: 'createAccessConfig()', href: '/duck-iam/advanced/config/access-config' },
      { title: 'development vs production mode', href: '/duck-iam/advanced/engine/modes' },
      { title: 'engine overview', href: '/duck-iam/advanced/engine' },
      { title: 'explain and debug', href: '/duck-iam/advanced/explain' },
      { title: 'hooks', href: '/duck-iam/advanced/engine/hooks' },
      { title: 'methods', href: '/duck-iam/advanced/engine/methods' },
      { title: 'methods reference', href: '/duck-iam/advanced/config/methods' },
      { title: 'type-safe config overview', href: '/duck-iam/advanced/config' },
      { title: 'typed $-references', href: '/duck-iam/advanced/config/dollar-paths' },
      { title: 'typed context', href: '/duck-iam/advanced/config/context' },
      { title: 'typed vs untyped comparison', href: '/duck-iam/advanced/config/comparison' },
      { title: 'utilities', href: '/duck-iam/advanced/utilities' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { title: 'adapters overview', href: '/duck-iam/integrations/adapters' },
      { title: 'choosing & FAQ', href: '/duck-iam/integrations/adapters/comparison' },
      { title: 'client overview', href: '/duck-iam/integrations/client' },
      { title: 'custom adapter', href: '/duck-iam/integrations/adapters/custom' },
      { title: 'drizzle adapter', href: '/duck-iam/integrations/adapters/drizzle' },
      { title: 'express', href: '/duck-iam/integrations/server/express' },
      { title: 'generic helpers', href: '/duck-iam/integrations/server/generic' },
      { title: 'hono', href: '/duck-iam/integrations/server/hono' },
      { title: 'http adapter', href: '/duck-iam/integrations/adapters/http' },
      { title: 'memory adapter', href: '/duck-iam/integrations/adapters/memory' },
      { title: 'nestjs', href: '/duck-iam/integrations/server/nest' },
      { title: 'next.js app router', href: '/duck-iam/integrations/server/next' },
      { title: 'PermissionMap reference', href: '/duck-iam/integrations/client/permission-map' },
      { title: 'prisma adapter', href: '/duck-iam/integrations/adapters/prisma' },
      { title: 'react', href: '/duck-iam/integrations/client/react' },
      { title: 'redis adapter', href: '/duck-iam/integrations/adapters/redis' },
      { title: 'server middleware overview', href: '/duck-iam/integrations/server' },
      { title: 'vanilla js', href: '/duck-iam/integrations/client/vanilla' },
      { title: 'vue', href: '/duck-iam/integrations/client/vue' },
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
