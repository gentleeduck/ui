import type { AccessControl } from '../types'
/**
 * JSON Schema (Draft 2020-12) for a duck-iam {@link AccessControl.IPolicy}.
 *
 * Useful for:
 *  - non-TypeScript consumers validating policies at the wire boundary
 *  - editor tooling (VS Code / IntelliJ schema-driven JSON completion)
 *  - admin dashboards generating policy forms
 *
 * Schema is hand-authored to mirror `core/types/access-control.ts` instead of
 * derived from the TS types - the type system uses generic type parameters
 * (`TAction`, `TResource`) which can't be reflected at runtime. The shape here
 * uses `string` for those slots; tighten via `$ref` or `enum` in your own
 * downstream schema if you know the closed sets.
 *
 * Updates: when adding a field to {@link AccessControl.IPolicy} / {@link AccessControl.IRule} / {@link AccessControl.ICondition}, add it
 * here AND ensure {@link validatePolicy} covers it. The two are intentionally
 * separate - JSON Schema is for external boundaries, `validatePolicy` is for
 * internal call sites that also need semantic checks (resolvable paths,
 * cartesian limits, etc.).
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const POLICY_JSON_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://gentleduck.dev/duck-iam/policy.schema.json',
  title: 'duck-iam Policy',
  type: 'object',
  required: ['id', 'name', 'algorithm', 'rules'],
  additionalProperties: false,
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    version: { type: 'number' },
    algorithm: {
      enum: ['deny-overrides', 'allow-overrides', 'first-match', 'highest-priority'],
    },
    rules: {
      type: 'array',
      items: { $ref: '#/$defs/rule' },
    },
    targets: {
      type: 'object',
      additionalProperties: false,
      properties: {
        actions: { type: 'array', items: { type: 'string' } },
        resources: { type: 'array', items: { type: 'string' } },
        roles: { type: 'array', items: { type: 'string' } },
      },
    },
  },
  $defs: {
    rule: {
      type: 'object',
      required: ['id', 'effect', 'priority', 'actions', 'resources', 'conditions'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', minLength: 1 },
        effect: { enum: ['allow', 'deny'] },
        description: { type: 'string' },
        priority: { type: 'number' },
        actions: { type: 'array', minItems: 1, items: { type: 'string' } },
        resources: { type: 'array', minItems: 1, items: { type: 'string' } },
        conditions: { $ref: '#/$defs/conditionGroup' },
        metadata: { type: 'object', additionalProperties: true },
      },
    },
    conditionGroup: {
      oneOf: [
        { type: 'object', required: ['all'], properties: { all: { $ref: '#/$defs/conditionList' } } },
        { type: 'object', required: ['any'], properties: { any: { $ref: '#/$defs/conditionList' } } },
        { type: 'object', required: ['none'], properties: { none: { $ref: '#/$defs/conditionList' } } },
      ],
    },
    conditionList: {
      type: 'array',
      items: {
        oneOf: [{ $ref: '#/$defs/condition' }, { $ref: '#/$defs/conditionGroup' }],
      },
    },
    condition: {
      type: 'object',
      required: ['field', 'operator'],
      additionalProperties: false,
      properties: {
        field: { type: 'string', minLength: 1 },
        operator: {
          enum: [
            'eq',
            'neq',
            'gt',
            'gte',
            'lt',
            'lte',
            'in',
            'nin',
            'contains',
            'not_contains',
            'starts_with',
            'ends_with',
            'matches',
            'exists',
            'not_exists',
            'subset_of',
            'superset_of',
          ],
        },
        value: {},
      },
    },
  },
} as const
