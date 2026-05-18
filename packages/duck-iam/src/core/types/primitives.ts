export namespace Primitives {
  /**
   * Single scalar value: every JSON-compatible primitive the condition engine
   * can compare. Leaf of the duck-iam type system.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Scalar = string | number | boolean | null

  /**
   * Any value storable in an attribute map or usable as a condition operand  -
   * a single {@link Scalar} or an array of scalars. Arrays drive set operators
   * (`in`, `nin`, `subset_of`, `superset_of`).
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type AttributeValue = Scalar | Scalar[] | Record<string, Scalar>

  /**
   * String-keyed record of {@link AttributeValue} entries. Used for subject
   * attributes, resource attributes, environment, and metadata bags.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Attributes = Record<string, AttributeValue>
}
