import { describe, expect, it } from 'vitest'
import type { DefaultContext } from '../../types'
import { defineRole, defineRule, PolicyBuilder, policy, RoleBuilder, RuleBuilder, When, when } from '..'

interface TypedBuilderContext {
  action: 'read' | 'update'
  subject: {
    id: string
    roles: string[]
    attributes: {
      email: string
      status: 'active' | 'banned'
    }
  }
  resource: {
    type: 'post'
    id?: string
    attributes: {
      ownerId: string
      status: 'draft' | 'published'
    }
  }
  environment: {
    ip: string
    region: 'us' | 'eu'
  }
  scope: 'org-1'
}

describe('When (condition builder)', () => {
  it('builds an all-group from chained conditions', () => {
    const group = new When<string, string, string, string, DefaultContext>()
      .eq('action', 'read')
      .contains('subject.roles', 'editor')
      .buildAll()
    expect(group).toEqual({
      all: [
        { field: 'action', operator: 'eq', value: 'read' },
        { field: 'subject.roles', operator: 'contains', value: 'editor' },
      ],
    })
  })

  it('builds an any-group', () => {
    const group = new When<string, string, string, string, DefaultContext>()
      .eq('action', 'read')
      .eq('action', 'write')
      .buildAny()
    expect('any' in group).toBe(true)
  })

  it('builds a none-group', () => {
    const group = new When<string, string, string, string, DefaultContext>().eq('action', 'delete').buildNone()
    expect('none' in group).toBe(true)
  })

  it('shorthand operators work', () => {
    // biome-ignore lint/suspicious/noExplicitAny: testing arbitrary field names
    const w = new When<string, string, string, string, any>()
    w.neq('a', 1).in('b', [1, 2]).gt('c', 0).gte('d', 1).lt('e', 10).lte('f', 5).matches('g', '^x').exists('h')
    const group = w.buildAll()
    expect(group.all).toHaveLength(8)
    const operators = group.all.map((c) => ('operator' in c ? c.operator : null))
    expect(operators).toEqual(['neq', 'in', 'gt', 'gte', 'lt', 'lte', 'matches', 'exists'])
  })

  it('isOwner adds $subject.id condition', () => {
    const group = new When<string, string, string, string, DefaultContext>().isOwner().buildAll()
    expect(group.all[0]).toEqual({
      field: 'resource.attributes.ownerId',
      operator: 'eq',
      value: '$subject.id',
    })
  })

  it('isOwner accepts custom field', () => {
    const group = new When<string, string, string, string, DefaultContext>()
      .isOwner('resource.attributes.authorId')
      .buildAll()
    expect(group.all[0]).toMatchObject({ field: 'resource.attributes.authorId', operator: 'eq' })
  })

  it('role() adds contains condition on subject.roles', () => {
    const group = new When<string, string, string, string>().role('admin').buildAll()
    expect(group.all[0]).toEqual({ field: 'subject.roles', operator: 'contains', value: 'admin' })
  })

  it('scope() adds eq condition on scope', () => {
    const group = new When<string, string, string, string>().scope('org-1').buildAll()
    expect(group.all[0]).toEqual({ field: 'scope', operator: 'eq', value: 'org-1' })
  })

  it('attr() prefixes with subject.attributes', () => {
    const group = new When<string, string, string, string, DefaultContext>().attr('level', 'gte', 5).buildAll()
    expect(group.all[0]).toMatchObject({ field: 'subject.attributes.level', operator: 'gte', value: 5 })
  })

  it('resourceAttr() prefixes with resource.attributes', () => {
    const group = new When<string, string, string, string, DefaultContext>()
      .resourceAttr('status', 'eq', 'published')
      .buildAll()
    expect(group.all[0]).toMatchObject({ field: 'resource.attributes.status', operator: 'eq', value: 'published' })
  })

  it('env() prefixes with environment', () => {
    const group = new When<string, string, string, string, DefaultContext>().env('ip', 'eq', '127.0.0.1').buildAll()
    expect(group.all[0]).toMatchObject({ field: 'environment.ip', operator: 'eq', value: '127.0.0.1' })
  })

  it('accepts $ references across typed value helpers', () => {
    const group = new When<string, string, string, string, TypedBuilderContext>()
      .check('subject.attributes.email', 'eq', '$resource.attributes.ownerId')
      .eq('resource.attributes.ownerId', '$subject.id')
      .neq('subject.attributes.status', '$resource.attributes.status')
      .attr('email', 'eq', '$resource.attributes.ownerId')
      .resourceAttr('ownerId', 'eq', '$subject.id')
      .env('ip', 'eq', '$resource.attributes.ownerId')
      .buildAll()

    expect(group.all).toEqual([
      { field: 'subject.attributes.email', operator: 'eq', value: '$resource.attributes.ownerId' },
      { field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' },
      { field: 'subject.attributes.status', operator: 'neq', value: '$resource.attributes.status' },
      { field: 'subject.attributes.email', operator: 'eq', value: '$resource.attributes.ownerId' },
      { field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' },
      { field: 'environment.ip', operator: 'eq', value: '$resource.attributes.ownerId' },
    ])
  })

  it('keeps narrow literal values on typed helpers', () => {
    const group = new When<string, string, string, string, TypedBuilderContext>()
      .eq('subject.attributes.status', 'active')
      .attr('status', 'eq', 'banned')
      .resourceAttr('status', 'eq', 'published')
      .env('region', 'eq', 'us')
      .buildAll()

    expect(group.all).toEqual([
      { field: 'subject.attributes.status', operator: 'eq', value: 'active' },
      { field: 'subject.attributes.status', operator: 'eq', value: 'banned' },
      { field: 'resource.attributes.status', operator: 'eq', value: 'published' },
      { field: 'environment.region', operator: 'eq', value: 'us' },
    ])
  })

  it('nested and/or/not groups', () => {
    const group = new When<string, string, string, string, DefaultContext>()
      .eq('action', 'read')
      .or((w) => w.eq('subject.id', 'admin').role('super-admin'))
      .buildAll()

    expect(group.all).toHaveLength(2)
    expect('any' in group.all[1]!).toBe(true)
  })

  it('nested not group', () => {
    const group = new When<string, string, string, string, DefaultContext>()
      .not((w) => w.eq('action', 'delete'))
      .buildAll()

    expect('none' in group.all[0]!).toBe(true)
  })
})

describe('RuleBuilder', () => {
  it('builds a rule with defaults', () => {
    const rule = new RuleBuilder('r1').build()
    expect(rule.id).toBe('r1')
    expect(rule.effect).toBe('allow')
    expect(rule.priority).toBe(10)
    expect(rule.actions).toEqual(['*'])
    expect(rule.resources).toEqual(['*'])
  })

  it('deny() sets effect to deny', () => {
    const rule = new RuleBuilder('r1').deny().build()
    expect(rule.effect).toBe('deny')
  })

  it('on() sets actions', () => {
    const rule = new RuleBuilder('r1').on('read', 'write').build()
    expect(rule.actions).toEqual(['read', 'write'])
  })

  it('of() sets resources', () => {
    const rule = new RuleBuilder('r1').of('post', 'comment').build()
    expect(rule.resources).toEqual(['post', 'comment'])
  })

  it('priority() sets priority', () => {
    const rule = new RuleBuilder('r1').priority(100).build()
    expect(rule.priority).toBe(100)
  })

  it('desc() sets description', () => {
    const rule = new RuleBuilder('r1').desc('My rule').build()
    expect(rule.description).toBe('My rule')
  })

  it('meta() sets metadata', () => {
    const rule = new RuleBuilder('r1').meta({ source: 'test' }).build()
    expect(rule.metadata).toEqual({ source: 'test' })
  })

  it('when() adds all-group conditions', () => {
    const rule = new RuleBuilder('r1').when((w) => w.eq('action', 'read')).build()
    expect('all' in rule.conditions).toBe(true)
  })

  it('whenAny() adds any-group conditions', () => {
    const rule = new RuleBuilder('r1').whenAny((w) => w.eq('action', 'read')).build()
    expect('any' in rule.conditions).toBe(true)
  })

  it('forScope() adds scope condition', () => {
    const rule = new RuleBuilder<string, string, string>('r1').forScope('org-1').build()
    const conditions = 'all' in rule.conditions ? rule.conditions.all : []
    expect(conditions.some((c) => 'field' in c && c.field === 'scope' && c.operator === 'eq')).toBe(true)
  })

  it('forScope() with multiple scopes uses in operator', () => {
    const rule = new RuleBuilder<string, string, string>('r1').forScope('org-1', 'org-2').build()
    const conditions = 'all' in rule.conditions ? rule.conditions.all : []
    expect(conditions.some((c) => 'field' in c && c.field === 'scope' && c.operator === 'in')).toBe(true)
  })

  it('forScope("*") is a no-op', () => {
    const rule = new RuleBuilder<string, string, string>('r1').forScope('*').build()
    const conditions = 'all' in rule.conditions ? rule.conditions.all : []
    expect(conditions.some((c) => 'field' in c && c.field === 'scope')).toBe(false)
  })

  it('forScope + when compose correctly', () => {
    const rule = new RuleBuilder<string, string, string>('r1')
      .forScope('org-1')
      .when((w) => w.eq('action', 'read'))
      .build()
    const conditions = 'all' in rule.conditions ? rule.conditions.all : []
    expect(conditions.length).toBe(2) // scope + action
  })
})

describe('PolicyBuilder', () => {
  it('builds a policy with defaults', () => {
    const p = new PolicyBuilder('p1').build()
    expect(p.id).toBe('p1')
    expect(p.name).toBe('p1')
    expect(p.algorithm).toBe('deny-overrides')
    expect(p.rules).toEqual([])
  })

  it('name() sets name', () => {
    const p = new PolicyBuilder('p1').name('My Policy').build()
    expect(p.name).toBe('My Policy')
  })

  it('algorithm() sets combining algorithm', () => {
    const p = new PolicyBuilder('p1').algorithm('allow-overrides').build()
    expect(p.algorithm).toBe('allow-overrides')
  })

  it('version() sets version', () => {
    const p = new PolicyBuilder('p1').version(2).build()
    expect(p.version).toBe(2)
  })

  it('desc() sets description', () => {
    const p = new PolicyBuilder('p1').desc('Description').build()
    expect(p.description).toBe('Description')
  })

  it('target() sets policy targets', () => {
    const p = new PolicyBuilder('p1').target({ actions: ['read'], resources: ['post'] }).build()
    expect(p.targets).toEqual({ actions: ['read'], resources: ['post'] })
  })

  it('rule() adds rules via builder callback', () => {
    const p = new PolicyBuilder('p1').rule('r1', (r) => r.allow().on('read').of('post')).build()
    expect(p.rules).toHaveLength(1)
    expect(p.rules[0]!.id).toBe('r1')
  })

  it('addRule() adds a pre-built rule', () => {
    const rule = new RuleBuilder('r1').build()
    const p = new PolicyBuilder('p1').addRule(rule).build()
    expect(p.rules).toHaveLength(1)
  })
})

describe('RoleBuilder', () => {
  it('builds a role with defaults', () => {
    const r = new RoleBuilder('viewer').build()
    expect(r.id).toBe('viewer')
    expect(r.name).toBe('viewer')
    expect(r.permissions).toEqual([])
    expect(r.inherits).toBeUndefined()
  })

  it('name() sets name', () => {
    const r = new RoleBuilder('viewer').name('Viewer').build()
    expect(r.name).toBe('Viewer')
  })

  it('desc() sets description', () => {
    const r = new RoleBuilder('viewer').desc('Can view things').build()
    expect(r.description).toBe('Can view things')
  })

  it('inherits() sets parent roles', () => {
    const r = new RoleBuilder('editor').inherits('viewer').build()
    expect(r.inherits).toEqual(['viewer'])
  })

  it('scope() sets role scope', () => {
    const r = new RoleBuilder<string, string, string, string>('editor').scope('org-1').build()
    expect(r.scope).toBe('org-1')
  })

  it('grant() adds a permission', () => {
    const r = new RoleBuilder('viewer').grant('read', 'post').build()
    expect(r.permissions).toEqual([{ action: 'read', resource: 'post' }])
  })

  it('grantScoped() adds a scoped permission', () => {
    const r = new RoleBuilder<string, string, string, string>('editor').grantScoped('org-1', 'write', 'post').build()
    expect(r.permissions).toEqual([{ action: 'write', resource: 'post', scope: 'org-1' }])
  })

  it('grantWhen() adds a permission with conditions', () => {
    const r = new RoleBuilder('editor').grantWhen('update', 'post', (w) => w.isOwner()).build()
    expect(r.permissions).toHaveLength(1)
    expect(r.permissions[0]!.action).toBe('update')
    expect(r.permissions[0]!.resource).toBe('post')
    expect(r.permissions[0]!.conditions).toMatchObject({
      all: [{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }],
    })
  })

  it('grantAll() grants wildcard action', () => {
    const r = new RoleBuilder('admin').grantAll('post').build()
    expect(r.permissions).toEqual([{ action: '*', resource: 'post' }])
  })

  it('grantRead() grants read on multiple resources', () => {
    const r = new RoleBuilder('viewer').grantRead('post', 'comment').build()
    expect(r.permissions).toHaveLength(2)
  })

  it('grantCRUD() grants all CRUD actions', () => {
    const r = new RoleBuilder('editor').grantCRUD('post').build()
    expect(r.permissions).toHaveLength(4)
    const actions = r.permissions.map((p) => p.action)
    expect(actions).toEqual(['create', 'read', 'update', 'delete'])
  })

  it('meta() sets metadata', () => {
    const r = new RoleBuilder('viewer').meta({ level: 1 }).build()
    expect(r.metadata).toEqual({ level: 1 })
  })
})

describe('factory functions', () => {
  it('policy() creates a PolicyBuilder', () => {
    const p = policy('test').build()
    expect(p.id).toBe('test')
  })

  it('defineRole() creates a RoleBuilder', () => {
    const r = defineRole('viewer').build()
    expect(r.id).toBe('viewer')
  })

  it('defineRule() creates a RuleBuilder', () => {
    const r = defineRule('r1').build()
    expect(r.id).toBe('r1')
  })

  it('when() creates a When builder', () => {
    const w = when()
    const group = w.eq('action', 'read').buildAll()
    expect(group.all).toHaveLength(1)
  })
})
