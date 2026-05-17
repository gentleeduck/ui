export namespace Client {
  /**
   * Compound string key uniquely identifying a permission check result. Used
   * as keys in {@link PermissionMap}; formats:
   *  - `action:resource`
   *  - `action:resource:resourceId`
   *  - `scope:action:resource`
   *  - `scope:action:resource:resourceId`
   *
   * Segments containing `:` are escaped (`:` -> `\:`); see `buildPermissionKey`.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type PermissionKey<
    TAction extends string = string,
    TResource extends string = string,
    TScope extends string = string,
  > =
    | `${TAction}:${TResource}`
    | `${TAction}:${TResource}:${string}`
    | `${TScope}:${TAction}:${TResource}`
    | `${TScope}:${TAction}:${TResource}:${string}`

  /**
   * Map from {@link PermissionKey} strings to boolean results. Returned by
   * `engine.permissions()` after batch-checking permissions for one subject.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type PermissionMap<
    TAction extends string = string,
    TResource extends string = string,
    TScope extends string = string,
  > = Record<PermissionKey<TAction, TResource, TScope>, boolean>

  /**
   * Permission check descriptor for batch evaluation. Pass an array of these to
   * `engine.permissions()` or `access.checks()`.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IPermissionCheck<
    TAction extends string = string,
    TResource extends string = string,
    TScope extends string = string,
  > {
    /** The action to check. */
    readonly action: TAction
    /** The resource type to check. */
    readonly resource: TResource
    /** Optional specific resource instance ID. */
    readonly resourceId?: string
    /** Optional scope for multi-tenant checks. */
    readonly scope?: TScope
  }
}
