import { describe, expect, it } from 'vitest'
import type { AccessRequest, ConditionGroup } from '../../types'
import { evalConditionGroup } from '../conditions'

function makeReq(overrides: Partial<AccessRequest> = {}): AccessRequest {
  return {
    subject: {
      id: 'user-1',
      roles: ['editor'],
      attributes: { department: 'engineering', level: 5 },
    },
    action: 'read',
    resource: {
      type: 'post',
      id: 'post-42',
      attributes: { ownerId: 'user-1', published: true, tags: ['tech', 'news'] },
    },
    ...overrides,
  }
}

describe('condition operators', () => {
  const req = makeReq()

  describe('eq / neq', () => {
    it('eq matches equal values', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'action', operator: 'eq', value: 'read' }] })).toBe(true)
    })

    it('eq rejects unequal values', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'action', operator: 'eq', value: 'write' }] })).toBe(false)
    })

    it('neq matches unequal values', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'action', operator: 'neq', value: 'write' }] })).toBe(true)
    })
  })

  describe('gt / gte / lt / lte', () => {
    it('gt compares numbers', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'subject.attributes.level', operator: 'gt', value: 3 }] })).toBe(
        true,
      )
      expect(evalConditionGroup(req, { all: [{ field: 'subject.attributes.level', operator: 'gt', value: 5 }] })).toBe(
        false,
      )
    })

    it('gte includes equal', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'subject.attributes.level', operator: 'gte', value: 5 }] })).toBe(
        true,
      )
    })

    it('lt compares numbers', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'subject.attributes.level', operator: 'lt', value: 10 }] })).toBe(
        true,
      )
      expect(evalConditionGroup(req, { all: [{ field: 'subject.attributes.level', operator: 'lt', value: 5 }] })).toBe(
        false,
      )
    })

    it('lte includes equal', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'subject.attributes.level', operator: 'lte', value: 5 }] })).toBe(
        true,
      )
    })

    it('numeric ops return false for non-number fields', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'action', operator: 'gt', value: 3 }] })).toBe(false)
    })
  })

  describe('in / nin', () => {
    it('in checks if value is in array', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'action', operator: 'in', value: ['read', 'write'] }] })).toBe(
        true,
      )
      expect(evalConditionGroup(req, { all: [{ field: 'action', operator: 'in', value: ['write', 'delete'] }] })).toBe(
        false,
      )
    })

    it('in with array field checks intersection', () => {
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'resource.attributes.tags', operator: 'in', value: ['tech', 'sports'] }],
        }),
      ).toBe(true)
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'resource.attributes.tags', operator: 'in', value: ['sports', 'music'] }],
        }),
      ).toBe(false)
    })

    it('nin is the negation of in', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'action', operator: 'nin', value: ['write', 'delete'] }] })).toBe(
        true,
      )
      expect(evalConditionGroup(req, { all: [{ field: 'action', operator: 'nin', value: ['read', 'write'] }] })).toBe(
        false,
      )
    })
  })

  describe('contains / not_contains', () => {
    it('array contains scalar', () => {
      expect(
        evalConditionGroup(req, { all: [{ field: 'subject.roles', operator: 'contains', value: 'editor' }] }),
      ).toBe(true)
      expect(evalConditionGroup(req, { all: [{ field: 'subject.roles', operator: 'contains', value: 'admin' }] })).toBe(
        false,
      )
    })

    it('string contains substring', () => {
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'subject.attributes.department', operator: 'contains', value: 'engine' }],
        }),
      ).toBe(true)
    })

    it('not_contains is the negation', () => {
      expect(
        evalConditionGroup(req, { all: [{ field: 'subject.roles', operator: 'not_contains', value: 'admin' }] }),
      ).toBe(true)
      expect(
        evalConditionGroup(req, { all: [{ field: 'subject.roles', operator: 'not_contains', value: 'editor' }] }),
      ).toBe(false)
    })
  })

  describe('starts_with / ends_with', () => {
    it('starts_with checks string prefix', () => {
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'subject.attributes.department', operator: 'starts_with', value: 'eng' }],
        }),
      ).toBe(true)
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'subject.attributes.department', operator: 'starts_with', value: 'mark' }],
        }),
      ).toBe(false)
    })

    it('ends_with checks string suffix', () => {
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'subject.attributes.department', operator: 'ends_with', value: 'ing' }],
        }),
      ).toBe(true)
    })

    it('returns false for non-strings', () => {
      expect(
        evalConditionGroup(req, { all: [{ field: 'subject.attributes.level', operator: 'starts_with', value: '5' }] }),
      ).toBe(false)
    })
  })

  describe('matches', () => {
    it('tests regex patterns', () => {
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'subject.attributes.department', operator: 'matches', value: '^eng.*ing$' }],
        }),
      ).toBe(true)
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'subject.attributes.department', operator: 'matches', value: '^marketing$' }],
        }),
      ).toBe(false)
    })

    it('rejects invalid regex gracefully', () => {
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'subject.attributes.department', operator: 'matches', value: '[invalid' }],
        }),
      ).toBe(false)
    })

    it('rejects overly long patterns (ReDoS protection)', () => {
      const longPattern = 'a'.repeat(600)
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'subject.attributes.department', operator: 'matches', value: longPattern }],
        }),
      ).toBe(false)
    })
  })

  describe('exists / not_exists', () => {
    it('exists returns true for present fields', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'subject.id', operator: 'exists' }] })).toBe(true)
    })

    it('exists returns false for null/undefined fields', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'subject.attributes.missing', operator: 'exists' }] })).toBe(
        false,
      )
    })

    it('not_exists returns true for missing fields', () => {
      expect(evalConditionGroup(req, { all: [{ field: 'subject.attributes.missing', operator: 'not_exists' }] })).toBe(
        true,
      )
    })
  })

  describe('subset_of / superset_of', () => {
    it('subset_of checks if all field items are in value array', () => {
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'resource.attributes.tags', operator: 'subset_of', value: ['tech', 'news', 'sports'] }],
        }),
      ).toBe(true)
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'resource.attributes.tags', operator: 'subset_of', value: ['tech'] }],
        }),
      ).toBe(false)
    })

    it('superset_of checks if field array contains all value items', () => {
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'resource.attributes.tags', operator: 'superset_of', value: ['tech'] }],
        }),
      ).toBe(true)
      expect(
        evalConditionGroup(req, {
          all: [{ field: 'resource.attributes.tags', operator: 'superset_of', value: ['tech', 'sports'] }],
        }),
      ).toBe(false)
    })
  })
})

describe('condition groups', () => {
  const req = makeReq()

  it('all: requires every condition to pass', () => {
    const group: ConditionGroup = {
      all: [
        { field: 'action', operator: 'eq', value: 'read' },
        { field: 'subject.id', operator: 'eq', value: 'user-1' },
      ],
    }
    expect(evalConditionGroup(req, group)).toBe(true)
  })

  it('all: fails if any condition fails', () => {
    const group: ConditionGroup = {
      all: [
        { field: 'action', operator: 'eq', value: 'read' },
        { field: 'subject.id', operator: 'eq', value: 'user-999' },
      ],
    }
    expect(evalConditionGroup(req, group)).toBe(false)
  })

  it('any: passes if at least one condition passes', () => {
    const group: ConditionGroup = {
      any: [
        { field: 'action', operator: 'eq', value: 'write' },
        { field: 'action', operator: 'eq', value: 'read' },
      ],
    }
    expect(evalConditionGroup(req, group)).toBe(true)
  })

  it('any: fails if all conditions fail', () => {
    const group: ConditionGroup = {
      any: [
        { field: 'action', operator: 'eq', value: 'write' },
        { field: 'action', operator: 'eq', value: 'delete' },
      ],
    }
    expect(evalConditionGroup(req, group)).toBe(false)
  })

  it('none: passes if no conditions pass', () => {
    const group: ConditionGroup = {
      none: [
        { field: 'action', operator: 'eq', value: 'write' },
        { field: 'action', operator: 'eq', value: 'delete' },
      ],
    }
    expect(evalConditionGroup(req, group)).toBe(true)
  })

  it('none: fails if any condition passes', () => {
    const group: ConditionGroup = {
      none: [
        { field: 'action', operator: 'eq', value: 'read' },
        { field: 'action', operator: 'eq', value: 'delete' },
      ],
    }
    expect(evalConditionGroup(req, group)).toBe(false)
  })

  it('nested groups work', () => {
    const group: ConditionGroup = {
      all: [
        { field: 'action', operator: 'eq', value: 'read' },
        {
          any: [
            { field: 'subject.id', operator: 'eq', value: 'user-999' },
            { field: 'subject.roles', operator: 'contains', value: 'editor' },
          ],
        },
      ],
    }
    expect(evalConditionGroup(req, group)).toBe(true)
  })
})

describe('$-variable resolution in condition values', () => {
  it('resolves $subject.id to the actual subject id', () => {
    const req = makeReq()
    // isOwner check: resource.attributes.ownerId eq $subject.id
    const group: ConditionGroup = {
      all: [{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }],
    }
    expect(evalConditionGroup(req, group)).toBe(true)
  })

  it('fails when $subject.id does not match', () => {
    const req = makeReq({
      resource: {
        type: 'post',
        id: 'post-42',
        attributes: { ownerId: 'user-other', published: true },
      },
    })
    const group: ConditionGroup = {
      all: [{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }],
    }
    expect(evalConditionGroup(req, group)).toBe(false)
  })

  it('resolves $ references for other paths', () => {
    const req = makeReq()
    // Check if resource.attributes.ownerId is in subject.roles (nonsensical but tests resolution)
    const group: ConditionGroup = {
      all: [{ field: 'subject.id', operator: 'eq', value: '$resource.attributes.ownerId' }],
    }
    expect(evalConditionGroup(req, group)).toBe(true)
  })

  it('non-$ values are used literally', () => {
    const req = makeReq()
    const group: ConditionGroup = {
      all: [{ field: 'action', operator: 'eq', value: 'read' }],
    }
    expect(evalConditionGroup(req, group)).toBe(true)
  })
})
