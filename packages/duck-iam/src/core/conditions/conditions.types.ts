import type { AttributeValue } from '../types'

/** Function signature for a single operator implementation. */
export type OpFn = (field: AttributeValue, value: AttributeValue) => boolean
