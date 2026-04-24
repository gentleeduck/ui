import { describe, expect, it } from 'vitest'
import type { Role } from '../../types'
import { resolveEffectiveRoles, rolesToPolicy } from '../rbac'

const viewer: Role = {
  id: 'viewer',
  name: 'Viewer',
  permissions: [
    { action: 'read', resource: 'post' },
    { action: 'read', resource: 'comment' },
  ],
}

const editor: Role = {
  id: 'editor',
  name: 'Editor',
  inherits: ['viewer'],
  permissions: [
    { action: 'create', resource: 'post' },
    { action: 'update', resource: 'post' },
  ],
}

const admin: Role = {
  id: 'admin',
  name: 'Admin',
  inherits: ['editor'],
  permissions: [{ action: 'manage', resource: '*' }],
}

const scopedEditor: Role = {
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
    const circA: Role = { id: 'a', name: 'A', inherits: ['b'], permissions: [] }
    const circB: Role = { id: 'b', name: 'B', inherits: ['a'], permissions: [] }
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
  it('converts roles into a Policy with rules', () => {
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
    const editorRules = policy.rules.filter((r) => r.id.startsWith('rbac.editor.'))
    // Editor should have: inherited viewer (read post, read comment) + own (create post, update post)
    expect(editorRules).toHaveLength(4)
    const editorActions = editorRules.map((r) => r.actions[0])
    expect(editorActions).toEqual(expect.arrayContaining(['read', 'read', 'create', 'update']))
  })

  it('adds scope condition for scoped roles', () => {
    const policy = rolesToPolicy([scopedEditor])
    const rules = policy.rules.filter((r) => r.id.startsWith('rbac.org-editor.'))
    expect(rules.length).toBe(1)

    const conditions = 'all' in rules[0]!.conditions ? rules[0]!.conditions.all : []
    const hasScopeCheck = conditions.some(
      (c) => 'field' in c && c.field === 'scope' && c.operator === 'eq' && c.value === 'org-1',
    )
    expect(hasScopeCheck).toBe(true)
  })

  it('wildcard scope does not add scope condition', () => {
    const globalRole: Role = {
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
    const condRole: Role = {
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
