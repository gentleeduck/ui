/** Barrel exports for the ContextMenu primitive. */

export type { ContextMenuArrowProps } from './arrow'
export { ContextMenuArrow } from './arrow'
export type { ContextMenuCheckboxItemProps } from './checkbox-item'
export { ContextMenuCheckboxItem } from './checkbox-item'
export type { ContextMenuContentProps } from './content'
export { ContextMenuContent } from './content'
export type { ContextMenuProps } from './context-menu'
export { ContextMenu, createContextMenuScope } from './context-menu'
export type { ContextMenuGroupProps } from './group'
export { ContextMenuGroup } from './group'
export type { ContextMenuItemProps } from './item'
export { ContextMenuItem } from './item'
export type { ContextMenuItemIndicatorProps } from './item-indicator'
export { ContextMenuItemIndicator } from './item-indicator'
export type { ContextMenuLabelProps } from './label'
export { ContextMenuLabel } from './label'
export type { ContextMenuPortalProps } from './portal'
export { ContextMenuPortal } from './portal'
export type { ContextMenuRadioGroupProps } from './radio-group'
export { ContextMenuRadioGroup } from './radio-group'
export type { ContextMenuRadioItemProps } from './radio-item'
export { ContextMenuRadioItem } from './radio-item'
export type { ContextMenuSeparatorProps } from './separator'
export { ContextMenuSeparator } from './separator'
export type { ContextMenuSubProps } from './sub'
export { ContextMenuSub } from './sub'
export type { ContextMenuSubContentProps } from './sub-content'
export { ContextMenuSubContent } from './sub-content'
export type { ContextMenuSubTriggerProps } from './sub-trigger'
export { ContextMenuSubTrigger } from './sub-trigger'
export type { ContextMenuTriggerProps } from './trigger'
export { ContextMenuTrigger } from './trigger'

import { ContextMenuArrow } from './arrow'
import { ContextMenuCheckboxItem } from './checkbox-item'
import { ContextMenuContent } from './content'
import { ContextMenu } from './context-menu'
import { ContextMenuGroup } from './group'
import { ContextMenuItem } from './item'
import { ContextMenuItemIndicator } from './item-indicator'
import { ContextMenuLabel } from './label'
import { ContextMenuPortal } from './portal'
import { ContextMenuRadioGroup } from './radio-group'
import { ContextMenuRadioItem } from './radio-item'
import { ContextMenuSeparator } from './separator'
import { ContextMenuSub } from './sub'
import { ContextMenuSubContent } from './sub-content'
import { ContextMenuSubTrigger } from './sub-trigger'
import { ContextMenuTrigger } from './trigger'

const Root = ContextMenu
const Trigger = ContextMenuTrigger
const Portal = ContextMenuPortal
const Content = ContextMenuContent
const Group = ContextMenuGroup
const Label = ContextMenuLabel
const Item = ContextMenuItem
const CheckboxItem = ContextMenuCheckboxItem
const RadioGroup = ContextMenuRadioGroup
const RadioItem = ContextMenuRadioItem
const ItemIndicator = ContextMenuItemIndicator
const Separator = ContextMenuSeparator
const Arrow = ContextMenuArrow
const Sub = ContextMenuSub
const SubTrigger = ContextMenuSubTrigger
const SubContent = ContextMenuSubContent

export {
  Arrow,
  CheckboxItem,
  Content,
  Group,
  Item,
  ItemIndicator,
  Label,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
}
