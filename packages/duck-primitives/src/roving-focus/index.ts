export type { IRovingFocusGroupItemProps } from './item'
export { RovingFocusGroupItem, RovingFocusGroupItem as Item } from './item'
export type { IRovingFocusGroupProps, ScopedProps } from './roving-focus'
/* Short aliases for namespace-style imports: import * as RovingFocusGroup from '...' */
export {
  Collection,
  createCollectionScope,
  createRovingFocusGroupScope,
  RovingFocusGroup,
  RovingFocusGroup as Root,
  RovingFocusProvider,
  useCollection,
  useRovingFocusContext,
} from './roving-focus'
export type { FocusIntent, IDirection, Orientation } from './roving-focus.libs'
export { focusFirst, getFocusIntent, wrapArray } from './roving-focus.libs'
