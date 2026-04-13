/** Barrel exports for the ContextMenu primitive. */

export type { IContextMenuArrowProps } from './arrow'
export { ContextMenuArrow } from './arrow'
export type { IContextMenuCheckboxItemProps } from './checkbox-item'
export { ContextMenuCheckboxItem } from './checkbox-item'
export type { IContextMenuContentProps } from './content'
export { ContextMenuContent } from './content'
export type { IContextMenuProps } from './context-menu'
export { ContextMenu, createContextMenuScope } from './context-menu'
export type { IContextMenuGroupProps } from './group'
export { ContextMenuGroup } from './group'
export type { IContextMenuItemProps } from './item'
export { ContextMenuItem } from './item'
export type { IContextMenuItemIndicatorProps } from './item-indicator'
export { ContextMenuItemIndicator } from './item-indicator'
export type { IContextMenuLabelProps } from './label'
export { ContextMenuLabel } from './label'
export type { IContextMenuPortalProps } from './portal'
export { ContextMenuPortal } from './portal'
export type { IContextMenuRadioGroupProps } from './radio-group'
export { ContextMenuRadioGroup } from './radio-group'
export type { IContextMenuRadioItemProps } from './radio-item'
export { ContextMenuRadioItem } from './radio-item'
export type { IContextMenuSeparatorProps } from './separator'
export { ContextMenuSeparator } from './separator'
export type { IContextMenuSubProps } from './sub'
export { ContextMenuSub } from './sub'
export type { IContextMenuSubContentProps } from './sub-content'
export { ContextMenuSubContent } from './sub-content'
export type { IContextMenuSubTriggerProps } from './sub-trigger'
export { ContextMenuSubTrigger } from './sub-trigger'
export type { IContextMenuTriggerProps } from './trigger'
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
