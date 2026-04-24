/**
 * A single scalar value that can appear in attribute maps and condition values.
 *
 * Scalars are the leaf values of the duck-iam type system. They cover every
 * JSON-compatible primitive that the condition engine can compare.
 */
export type Scalar = string | number | boolean | null

/**
 * Any value that can be stored in an attribute map or used as a condition operand.
 *
 * An `AttributeValue` is either a single {@link Scalar} or an array of scalars.
 * Arrays are used with set operators like `in`, `nin`, `subset_of`, and `superset_of`.
 */
export type AttributeValue = Scalar | Scalar[]

/**
 * A string-keyed record of {@link AttributeValue} entries.
 *
 * Used throughout duck-iam for subject attributes, resource attributes,
 * environment properties, and role/rule metadata.
 */
export type Attributes = Record<string, AttributeValue>
