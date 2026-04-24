import type { AccessRequest, AttributeValue, Condition, ConditionGroup, Operator } from '../types'
import { evalCondition, isCondition, MAX_CONDITION_DEPTH, ops, resolveValue } from './conditions.libs'

/** Evaluate a single operator. Exposed for explain/trace functionality. */
export function evaluateOperator(op: Operator, fieldValue: AttributeValue, condValue: AttributeValue): boolean {
  return ops[op](fieldValue, condValue)
}

/** Resolve $-variable references in condition values against a request. */
export function resolveConditionValue(req: AccessRequest, value: AttributeValue): AttributeValue {
  return resolveValue(req, value)
}

/** Evaluate a single condition or condition group item, dispatching to the appropriate handler. */
function evalItem(req: AccessRequest, item: Condition | ConditionGroup, depth: number): boolean {
  return isCondition(item) ? evalCondition(req, item) : evalConditionGroup(req, item, depth)
}

/**
 * Evaluates a condition group tree against an access request.
 *
 * Handles `all` (AND), `any` (OR), and `none` (NOT/NOR) groups recursively.
 * Fails closed (returns `false`) when nesting exceeds `MAX_CONDITION_DEPTH`.
 *
 * @param req   - The access request providing field values
 * @param group - The condition group to evaluate
 * @param depth - Current recursion depth (internal, do not set)
 * @returns Whether the condition group is satisfied
 */
export function evalConditionGroup(req: AccessRequest, group: ConditionGroup, depth = 0): boolean {
  if (depth >= MAX_CONDITION_DEPTH) {
    return false // Deny when nesting is too deep -- fail closed
  }

  if ('all' in group) {
    return group.all.every((item) => evalItem(req, item, depth + 1))
  }

  if ('any' in group) {
    return group.any.some((item) => evalItem(req, item, depth + 1))
  }

  if ('none' in group) {
    return !group.none.some((item) => evalItem(req, item, depth + 1))
  }

  // Empty object {} = no conditions = unconditionally true
  return true
}
