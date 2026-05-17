import { describe, expect, it } from 'vitest'
import type { AccessControl } from '../../types'
import type { MAX_INHERITANCE_DEPTH } from '../rbac'
import { resolveEffectiveRoles, rolesToPolicy } from '../rbac'

const viewer: AccessControl.IRole = {
  id: 'viewer',
  name: 'Viewer',
  permissions: [
    { action: 'read', resource: 'post' },
    { action: 'read', resource: 'comment' },
  ],
}

const editor: AccessControl.IRole = {
  id: 'editor',
  name: 'Editor',
  inherits: ['viewer'],
  permissions: [
    { action: 'create', resource: 'post' },
    { action: 'update', resource: 'post' },
  ],
}

const admin: AccessControl.IRole = {
  id: 'admin',
  name: 'Admin',
  inherits: ['editor'],
  permissions: [{ action: 'manage', resource: '*' }],
}

const scopedEditor: AccessControl.IRole = {
  id: 'org-editor',
  name: 'Org Editor',
  scope: 'org-1',
  permissions: [{ action: 'update', resource: 'post' }],
}

describe('resolveEffectiveRoles()', () => {
  const allRoles = [viewer, editor, admin]

  it('returns the assigned role itself', () => {
    expect(resolveEffectiveRoles(['viewer'], allRoles)).toContain('viewer')
  })

  it('includes inherited roles', () => {
    const effective = resolveEffectiveRoles(['editor'], allRoles)
    expect(effective).toContain('editor')
    expect(effective).toContain('viewer')
  })

  it('resolves deeply nested inheritance', () => {
    const effective = resolveEffectiveRoles(['admin'], allRoles)
    expect(effective).toContain('admin')
    expect(effective).toContain('editor')
    expect(effective).toContain('viewer')
  })

  it('handles unknown roles gracefully', () => {
    const effective = resolveEffectiveRoles(['nonexistent'], allRoles)
    expect(effective).toContain('nonexistent')
    expect(effective).toHaveLength(1)
  })

  it('handles circular inheritance', () => {
    const circA: AccessControl.IRole = { id: 'a', name: 'A', inherits: ['b'], permissions: [] }
    const circB: AccessControl.IRole = { id: 'b', name: 'B', inherits: ['a'], permissions: [] }
    const effective = resolveEffectiveRoles(['a'], [circA, circB])
    expect(effective).toContain('a')
    expect(effective).toContain('b')
    // should not hang or throw
  })

  it('deduplicates roles', () => {
    const effective = resolveEffectiveRoles(['admin', 'editor'], allRoles)
    const unique = [...new Set(effective)]
    expect(effective.length).toBe(unique.length)
  })
})

describe('rolesToPolicy()', () => {
  it('converts roles into a policy with rules', () => {
    const policy = rolesToPolicy([viewer])
    expect(policy.id).toBe('__rbac__')
    expect(policy.algorithm).toBe('allow-overrides')
    expect(policy.rules).toHaveLength(2) // viewer has 2 permissions: read post, read comment
  })

  it('each permission becomes a rule with role membership condition', () => {
    const policy = rolesToPolicy([viewer])
    for (const rule of policy.rules) {
      expect(rule.effect).toBe('allow')
      // Each rule should require subject.roles contains the role id
      const conditions = 'all' in rule.conditions ? rule.conditions.all : []
      const hasRoleCheck = conditions.some(
        (c) => 'field' in c && c.field === 'subject.roles' && c.operator === 'contains',
      )
      expect(hasRoleCheck).toBe(true)
    }
  })

  it('inherits parent permissions', () => {
    const policy = rolesToPolicy([viewer, editor])
    // Editor's emitted rules carry "Editor:" in their description; inherited
    // viewer perms are emitted as separate rules under "Editor" because
    // collectPermissions flattens parent-first.
    const editorRules = policy.rules.filter((r) => r.description?.startsWith('Editor:'))
    // Editor should have: inherited viewer (read post, read comment) + own (create post, update post)
    expect(editorRules).toHaveLength(4)
    const editorActions = editorRules.map((r) => r.actions[0])
    expect(editorActions).toEqual(expect.arrayContaining(['read', 'read', 'create', 'update']))
  })

  it('adds scope condition for scoped roles', () => {
    const policy = rolesToPolicy([scopedEditor])
    const rules = policy.rules.filter((r) => r.description?.startsWith('Org Editor:'))
    expect(rules.length).toBe(1)

    const conditions = 'all' in rules[0]!.conditions ? rules[0]!.conditions.all : []
    const hasScopeCheck = conditions.some(
      (c) => 'field' in c && c.field === 'scope' && c.operator === 'eq' && c.value === 'org-1',
    )
    expect(hasScopeCheck).toBe(true)
  })

  it('wildcard scope does not add scope condition', () => {
    const globalRole: AccessControl.IRole = {
      id: 'global',
      name: 'Global',
      scope: '*',
      permissions: [{ action: 'read', resource: 'post' }],
    }
    const policy = rolesToPolicy([globalRole])
    const conditions = 'all' in policy.rules[0]!.conditions ? policy.rules[0]!.conditions.all : []
    const hasScopeCheck = conditions.some((c) => 'field' in c && c.field === 'scope')
    expect(hasScopeCheck).toBe(false)
  })

  it('permission-level conditions are merged into the rule', () => {
    const condRole: AccessControl.IRole = {
      id: 'cond-role',
      name: 'Conditional',
      permissions: [
        {
          action: 'update',
          resource: 'post',
          conditions: {
            all: [{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }],
          },
        },
      ],
    }
    const policy = rolesToPolicy([condRole])
    const rule = policy.rules[0]!
    const conditions = 'all' in rule.conditions ? rule.conditions.all : []
    // Should have role condition + owner condition
    expect(conditions).toHaveLength(2)
    expect(conditions.some((c) => 'field' in c && c.field === 'subject.roles')).toBe(true)
    expect(conditions.some((c) => 'field' in c && c.field === 'resource.attributes.ownerId')).toBe(true)
  })
})

describe('rule id stability', () => {
  // Adapter ETags and external caches key on `rule.id`. Lock the format so
  // any change is intentional and shows up as a failing test.
  it('emits ids in the `__rbac__#N` shape', () => {
    const policy = rolesToPolicy([viewer])
    expect(policy.rules.map((r) => r.id)).toEqual(['__rbac__#0', '__rbac__#1'])
  })

  it('produces identical id sequence for identical input on repeated calls', () => {
    const a = rolesToPolicy([viewer, editor]).rules.map((r) => r.id)
    const b = rolesToPolicy([viewer, editor]).rules.map((r) => r.id)
    expect(a).toEqual(b)
  })

  it('emits unique ids even when role / action / resource names contain dots', () => {
    const dotted: AccessControl.IRole = {
      id: 'org.admin',
      name: 'Org Admin',
      permissions: [
        { action: 'post.update', resource: 'dashboard.users' },
        { action: 'post.delete', resource: 'dashboard.users' },
      ],
    }
    const ids = rolesToPolicy([dotted]).rules.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('inheritance-depth bound', () => {
  it('resolveEffectiveRoles returns without throwing on a 1000-deep linear chain', () => {
    // Bound at 32 means traversal stops cleanly; we only assert no stack overflow / no hang.
    const roles: AccessControl.IRole[] = []
    for (let i = 0; i < 1000; i++) {
      roles.push({
        id: `r${i}`,
        name: `R${i}`,
        permissions: [],
        ...(i > 0 ? { inherits: [`r${i - 1}`] } : {}),
      })
    }
    const effective = resolveEffectiveRoles(['r999'], roles)
    // Walk stops at MAX_INHERITANCE_DEPTH=32 deep from the start role.
    expect(effective.length).toBeLessThanOrEqual(34)
    expect(effective.length).toBeGreaterThan(1)
  })
})
