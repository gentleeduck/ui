import type { Primitives } from './primitives'

/**
 * Dot-path type machinery for typed attribute access and `$`-resolved references.
 *
 * Two parallel families of types live in this namespace:
 *
 * 1. **Context-wide paths**: `DotPaths`, `PathValue`, `DollarPaths` walk an entire
 *    evaluation context (`{ subject, resource, environment, ... }`) producing
 *    string unions like `'subject.attributes.status'` and `'$subject.id'`.
 *
 * 2. **Attribute-bag paths**: `SubjectAttrs`, `ResourceAttrs`, `EnvAttrs` walk
 *    only the inner attribute objects of a context. Returns dot-path string
 *    unions used by `When.attr()`, `When.resourceAttr()`, `When.env()` so a
 *    nested attribute bag can be addressed as `'profile.tier'` without the
 *    consumer wiring `keyof` themselves.
 *
 * Pair each attribute path with its shape extractor (`SubjectAttrShape`,
 * `ResourceAttrShape`, `EnvAttrShape`) and `AttrValueAt` / `AttrValue` to
 * resolve the value type at a chosen path.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace DotPath {
  // ============================================================
  // Section 1: Context-wide dot-path machinery
  // ============================================================

  /**
   * Recursively expands every dot-separated path through `T`.
   *
   * Returns a string-literal union of every reachable property path. Arrays
   * are treated as leaves (no `length`, `push`, ...). Function-valued
   * properties are skipped.
   *
   * Bails out to `never` when `T` has a string index signature
   * (`Record<string, ...>`) to prevent infinite recursion and union pollution.
   * Use {@link FlexibleDotPaths} when the bail-out should accept arbitrary
   * strings while preserving autocomplete for known paths.
   *
   * @template T      - The object type to extract paths from.
   * @template Prefix - Internal accumulator for the current path prefix (do not set manually).
   * @example
   * ```ts
   * type Ctx = { subject: { id: string; attributes: { status: string } } }
   * type Paths = DotPath.DotPaths<Ctx>
   * // = 'subject' | 'subject.id' | 'subject.attributes' | 'subject.attributes.status'
   * ```
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type DotPaths<T, Prefix extends string = ''> = string extends keyof T
    ? never
    : {
        // biome-ignore lint/suspicious/noExplicitAny: array/function guards require any for correct variance
        [K in keyof T & string]: T[K] extends readonly any[]
          ? `${Prefix}${K}`
          : // biome-ignore lint/suspicious/noExplicitAny: contravariance prevents unknown here
            T[K] extends (...args: any[]) => any
            ? never
            : T[K] extends object
              ? `${Prefix}${K}` | DotPaths<T[K], `${Prefix}${K}.`>
              : `${Prefix}${K}`
      }[keyof T & string]

  /**
   * Resolves the value type at a context-wide dot-separated path within `T`.
   *
   * Returns `never` when the path doesn't exist.
   *
   * @template T - The object type to resolve within.
   * @template P - A dot-separated path string (e.g. `'subject.attributes.status'`).
   * @example
   * ```ts
   * type Ctx = { subject: { attributes: { status: 'active' | 'banned' } } }
   * type V = DotPath.PathValue<Ctx, 'subject.attributes.status'>
   * // = 'active' | 'banned'
   * ```
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? PathValue<T[K], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never

  /**
   * Smart context-wide path type. Preserves autocomplete for known paths and
   * accepts arbitrary strings when the context has open-ended attribute bags.
   *
   * - Typed context (no string index signatures): only specific literal paths
   *   compile; typos are errors.
   * - {@link IDefaultContext} / open attribute bags: known structural paths
   *   plus `(string & {})` so the IDE suggests `subject.id`, `resource.type`,
   *   etc. while still allowing arbitrary attribute paths.
   *
   * @template T - The context type to extract paths from.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type FlexibleDotPaths<T> = true extends HasOpenIndex<T> ? DotPaths<T> | (string & {}) : DotPaths<T>

  /**
   * `$`-prefixed context-wide paths. Used in condition value parameters so the
   * IDE autocompletes cross-references like `'$subject.id'`.
   *
   * @template TContext - The full evaluation context type.
   * @example
   * ```ts
   * type Ctx = { subject: { id: string; roles: string[] } }
   * type Refs = DotPath.DollarPaths<Ctx>
   * // = '$subject' | '$subject.id' | '$subject.roles'
   * ```
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type DollarPaths<TContext> = `$${DotPaths<TContext>}`

  /**
   * Smart `$`-prefixed path. Preserves known-path autocomplete plus accepts
   * arbitrary `$`-strings. Must be used at the method-signature site (not
   * nested in computed types) so the IDE renders the literal suggestions.
   *
   * @template TContext - The full evaluation context type.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type FlexibleDollarPaths<TContext> = DollarPaths<TContext> | (string & {})

  // ============================================================
  // Section 2: Condition value adapters
  // ============================================================

  /**
   * Adapts an attribute value type for builder inputs while preserving `$`
   * references. Non-string values pass through unchanged; string-capable
   * values gain {@link DollarPaths} so a comparison can reference another
   * request field.
   *
   * @template TContext - The full evaluation context type.
   * @template TValue   - The attribute-compatible value type accepted by the builder.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type ConditionValue<TContext, TValue extends Primitives.AttributeValue> =
    | Exclude<TValue, string>
    | (Extract<TValue, string> extends never ? never : StringConditionValue<TContext, Extract<TValue, string>>)

  /**
   * Resolves the value type at any context-wide dot-path, falling back to
   * {@link Primitives.AttributeValue} when the resolved type doesn't match.
   *
   * Used by `When.check()` to constrain its `value` parameter to the type at
   * the requested path.
   *
   * @template TContext - The full evaluation context type.
   * @template P        - A dot-separated path string.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type FieldValue<TContext, P extends string> =
    PathValue<TContext, P> extends Primitives.AttributeValue
      ? ConditionValue<TContext, PathValue<TContext, P>>
      : ConditionValue<TContext, Primitives.AttributeValue>

  // ============================================================
  // Section 3: Attribute bag shape extractors
  // ============================================================

  /**
   * Extracts the raw subject attribute bag object from a context. Returns
   * `never` when the context lacks the `subject.attributes` shape.
   *
   * Pair with {@link AttrValue} to resolve the value type at a dot-path.
   *
   * @template TContext - The full evaluation context type.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type SubjectAttrShape<TContext> = TContext extends { subject: { attributes: infer A } } ? A : never

  /**
   * Extracts the raw resource attribute bag object from a context. Returns
   * `never` when the context lacks the `resource.attributes` shape.
   *
   * Pair with {@link AttrValue} to resolve the value type at a dot-path.
   *
   * @template TContext - The full evaluation context type.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type ResourceAttrShape<TContext> = TContext extends { resource: { attributes: infer A } } ? A : never

  /**
   * Extracts the raw environment object from a context. Returns `never` when
   * the context lacks the `environment` shape.
   *
   * Pair with {@link AttrValue} to resolve the value type at a dot-path.
   *
   * @template TContext - The full evaluation context type.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type EnvAttrShape<TContext> = TContext extends { environment: infer E } ? E : never

  // ============================================================
  // Section 4: Attribute-bag dot-path key extractors
  // ============================================================

  /**
   * Dot-paths into the subject's attribute bag. Used as the typed `key`
   * parameter on `When.attr()`. Returns a string-literal union covering every
   * leaf and intermediate object path inside `TContext.subject.attributes`.
   *
   * @template TContext - The full evaluation context type.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type SubjectAttrs<TContext> = AttrPaths<SubjectAttrShape<TContext>>

  /**
   * Dot-paths into the resource's attribute bag. Used as the typed `key`
   * parameter on `When.resourceAttr()`. Per-resource narrowing is handled by
   * {@link ResolvedResourceAttrPaths}; this type covers the simple, single-shape case.
   *
   * @template TContext - The full evaluation context type.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type ResourceAttrs<TContext> = AttrPaths<ResourceAttrShape<TContext>>

  /**
   * Dot-paths into the environment object. Used as the typed `key` parameter
   * on `When.env()`.
   *
   * @template TContext - The full evaluation context type.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type EnvAttrs<TContext> = AttrPaths<EnvAttrShape<TContext>>

  // ============================================================
  // Section 5: Per-resource attribute narrowing
  // ============================================================

  /**
   * Extracts the per-resource attribute map from a context when one is
   * declared via the `resourceAttributes` field. Returns `never` otherwise.
   *
   * @template TContext - The full evaluation context type.
   * @example
   * ```ts
   * interface AppContext {
   *   resourceAttributes: {
   *     post: { ownerId: string; status: 'draft' | 'published' }
   *     comment: { ownerId: string; body: string }
   *   }
   * }
   * type Map = DotPath.ResourceAttrMap<AppContext>
   * // = { post: { ownerId: string; status: ... }; comment: { ownerId: string; body: string } }
   * ```
   * @author wildduck2 <https://github.com/wildduck2>
   */
  // biome-ignore lint/suspicious/noExplicitAny: infer constraint needs any for broad matching
  export type ResourceAttrMap<TContext> = TContext extends { resourceAttributes: infer M extends Record<string, any> }
    ? M
    : never

  /**
   * Resolves the resource attribute SHAPE for one resource, a union of
   * resources, or the `'*'` wildcard.
   *
   * 1. If `resourceAttributes` is declared, look up by resource type and
   *    return that object. `'*'` or unknown keys union all per-resource
   *    attribute objects via {@link MergedResourceAttrs}.
   * 2. Otherwise fall back to {@link ResourceAttrShape}.
   *
   * @template TContext  - The full evaluation context type.
   * @template TResource - The resource type string (or `'*'` for all resources).
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type ResolvedResourceAttrs<TContext, TResource extends string> =
    ResourceAttrMap<TContext> extends never
      ? ResourceAttrShape<TContext>
      : TResource extends keyof ResourceAttrMap<TContext>
        ? ResourceAttrMap<TContext>[TResource]
        : MergedResourceAttrs<ResourceAttrMap<TContext>>

  /**
   * Dot-paths into the resolved per-resource attribute shape. Used as the
   * typed `key` parameter on `When.resourceAttr()` when per-resource
   * narrowing is in effect.
   *
   * @template TContext  - The full evaluation context type.
   * @template TResource - The resource type string (or `'*'` for all resources).
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type ResolvedResourceAttrPaths<TContext, TResource extends string> = AttrPaths<
    ResolvedResourceAttrs<TContext, TResource>
  >

  // ============================================================
  // Section 6: Attribute-bag value resolution
  // ============================================================

  /**
   * Walks a dot-path inside an attribute-bag object and returns the value type
   * at the leaf. Returns `never` when the path is invalid.
   *
   * @template T - The attribute-bag object type.
   * @template P - The dot-separated path string.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type AttrValueAt<T, P extends string> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? AttrValueAt<T[K], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never

  /**
   * Constrained dot-path value lookup with {@link Primitives.AttributeValue}
   * fallback. Used by `When.attr()`, `When.resourceAttr()`, and `When.env()`
   * to type the `value` parameter against the chosen key.
   *
   * - When `T` is a typed Record and `P` resolves to an attribute-compatible
   *   leaf, returns the leaf type (undefined stripped).
   * - Otherwise falls back to `Primitives.AttributeValue`.
   *
   * @template T - The attribute-bag object type.
   * @template P - The dot-separated path string.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type AttrValue<T, P extends string> =
    T extends Record<string, unknown>
      ? AttrValueAt<T, P> extends Primitives.AttributeValue
        ? Exclude<AttrValueAt<T, P>, undefined>
        : Primitives.AttributeValue
      : Primitives.AttributeValue

  // ============================================================
  // Section 7: Default attribute bag + context shapes
  // ============================================================

  /**
   * Marker interface for open-ended attribute bags.
   *
   * Using an interface with a string index (instead of `Record<string, ...>`)
   * gives `keyof IAnyAttributes = string` while preventing {@link DotPaths}
   * from recursing into every possible string key. The index signature
   * returns {@link Primitives.AttributeValue} so `.attr()` / `.env()` infer
   * the correct value type.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAnyAttributes {
    [key: string]: Primitives.AttributeValue
  }

  /**
   * Default evaluation context shape used when no custom context type is
   * provided. Attribute bags use {@link IAnyAttributes} so any string key is
   * accepted without compile-time narrowing.
   *
   * Extend this interface with your application's attribute shapes and pass
   * it to `createAccessConfig({ context: {} as unknown as YourContext })` for
   * full type-safe IntelliSense.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IDefaultContext {
    /** The action being performed (e.g. `'read'`, `'update'`). */
    action: string
    /** The authenticated subject making the request. */
    subject: {
      /** Unique subject identifier. */
      id: string
      /** Flat list of effective role IDs. */
      roles: string[]
      /** Subject attribute bag (e.g. `{ department: 'engineering', status: 'active' }`). */
      attributes: IAnyAttributes
    }
    /** The target resource being accessed. */
    resource: {
      /** Resource type string (e.g. `'post'`, `'comment'`). */
      type: string
      /** Optional resource instance ID. */
      id?: string
      /** Resource attribute bag (e.g. `{ ownerId: 'user-1', status: 'published' }`). */
      attributes: IAnyAttributes
    }
    /** Environment attribute bag (e.g. `{ hour: 14, maintenanceMode: false }`). */
    environment: IAnyAttributes
    /** Authorization scope for multi-tenant applications (e.g. `'org-acme'`). */
    scope: string
  }

  // ============================================================
  // Section 8: Internal helpers
  // ============================================================

  /**
   * Builds a dot-path string union into an attribute-bag object `T`. Leaves
   * become bare keys; plain-object branches expand to `K | K.<inner>` so
   * `{ profile: { tier: string } }` yields `'profile' | 'profile.tier'`.
   *
   * Open bags ({@link IAnyAttributes} via the `string` index signature)
   * widen to `string` so any key is accepted - matches the legacy
   * `keyof IAnyAttributes` behaviour and keeps autocomplete neutral.
   * Returns `never` when `T` isn't an object at all.
   */
  type AttrPaths<T> =
    T extends Record<string, unknown>
      ? string extends keyof T
        ? string
        : {
            [K in keyof T & string]: IsPlainObject<T[K]> extends true ? K | `${K}.${AttrPaths<T[K]>}` : K
          }[keyof T & string]
      : never

  /**
   * Detects whether `T` is a plain user-defined object (and therefore worth
   * recursing into for dot-paths). Arrays, functions, `Date`, `Map`, and
   * `Set` are treated as leaves.
   */
  type IsPlainObject<T> = T extends object
    ? T extends readonly unknown[]
      ? false
      : T extends (...args: unknown[]) => unknown
        ? false
        : T extends Date
          ? false
          : T extends Map<unknown, unknown>
            ? false
            : T extends Set<unknown>
              ? false
              : true
    : false

  /**
   * Detects whether any branch of `T` contains a string index signature.
   * Used by {@link FlexibleDotPaths} to decide whether to add the
   * `(string & {})` fallback for loose path acceptance.
   */
  type HasOpenIndex<T> = string extends keyof T
    ? true
    : true extends {
          [K in keyof T & string]: T[K] extends object ? HasOpenIndex<T[K]> : false
        }[keyof T & string]
      ? true
      : false

  /**
   * Keeps string-based condition inputs `$`-aware without widening narrow
   * string unions. If `TValue` is already `string`, only `$`-paths are added;
   * if `TValue` is a literal union, both the literals and `$`-paths are accepted.
   */
  type StringConditionValue<TContext, TValue extends string> = string extends TValue
    ? DollarPaths<TContext>
    : TValue | DollarPaths<TContext>

  /**
   * Collects every attribute key declared across the per-resource map values.
   * Internal helper for {@link MergedResourceAttrs}.
   */
  type AllResourceKeys<M> = M[keyof M] extends infer U
    ? // biome-ignore lint/suspicious/noExplicitAny: must match broad record shapes
      U extends Record<string, any>
      ? keyof U & string
      : never
    : never

  /**
   * For a given attribute key, unions the value type from every resource that
   * declares it. Internal helper for {@link MergedResourceAttrs}.
   */
  type ResourceKeyValue<M, K extends string> = { [R in keyof M]: K extends keyof M[R] ? M[R][K] : never }[keyof M]

  /**
   * Merges every per-resource attribute object into a single shape so the
   * `'*'` wildcard case in {@link ResolvedResourceAttrs} accepts any
   * attribute defined on any resource.
   */
  type MergedResourceAttrs<M> = { [K in AllResourceKeys<M>]: ResourceKeyValue<M, K> }
}
