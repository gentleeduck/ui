import type { IDocsConfig } from '@gentleduck/docs'

export const DuckIamConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-iam/introduction',
      title: '',
      items: [
        { href: '/duck-iam/introduction', title: 'Introduction', items: [] },
        { href: '/duck-iam/installation', title: 'Installation', items: [] },
        { href: '/duck-iam/guides', title: 'Quick Start', items: [] },
      ],
    },
    {
      title: 'Course',
      collapsible: true,
      items: [
        { href: '/duck-iam/course', title: 'Overview', items: [] },
        { href: '/duck-iam/course/chapter-1', title: 'Chapter 1: Your First Permission Check', items: [] },
        { href: '/duck-iam/course/chapter-2', title: 'Chapter 2: Role Hierarchies', items: [] },
        { href: '/duck-iam/course/chapter-3', title: 'Chapter 3: Policies, Rules, and Conditions', items: [] },
        { href: '/duck-iam/course/chapter-4', title: 'Chapter 4: The Engine in Depth', items: [] },
        { href: '/duck-iam/course/chapter-5', title: 'Chapter 5: Multi-Tenant Scoping', items: [] },
        { href: '/duck-iam/course/chapter-6', title: 'Chapter 6: Server Integration', items: [] },
        { href: '/duck-iam/course/chapter-7', title: 'Chapter 7: Client Libraries', items: [] },
        { href: '/duck-iam/course/chapter-8', title: 'Chapter 8: Production Readiness', items: [] },
      ],
    },
    {
      title: 'Core',
      items: [
        { href: '/duck-iam/core', title: 'Overview', items: [] },
        { href: '/duck-iam/core/policies', title: 'Policies and Rules', items: [] },
        { href: '/duck-iam/core/roles', title: 'Roles and Permissions', items: [] },
      ],
    },
    {
      title: 'Advanced',
      items: [
        { href: '/duck-iam/advanced/config', title: 'Type-Safe Config', items: [] },
        { href: '/duck-iam/advanced/engine', title: 'Engine API', items: [] },
        { href: '/duck-iam/advanced/explain', title: 'Explain and Debug', items: [] },
        { href: '/duck-iam/advanced/utilities', title: 'Utilities', items: [] },
      ],
    },
    {
      title: 'Integrations',
      items: [
        { href: '/duck-iam/integrations/adapters', title: 'Database Adapters', items: [] },
        { href: '/duck-iam/integrations/client', title: 'Client Libraries', items: [] },
        { href: '/duck-iam/integrations/server', title: 'Server Middleware', items: [] },
      ],
    },
    {
      title: 'Misc',
      items: [{ href: '/duck-iam/benchmarks', title: 'Benchmarks', items: [] }],
    },
  ],
}
