/** Barrel exports for the Menu primitive. */

export type { MenuAnchorProps } from './anchor'
export { MenuAnchor } from './anchor'
export type { MenuArrowProps } from './arrow'
export { MenuArrow } from './arrow'
export type { MenuCheckboxItemProps } from './checkbox-item'
export { MenuCheckboxItem } from './checkbox-item'
export type { MenuContentProps } from './content'
export { MenuContent } from './content'
export type { MenuGroupProps } from './group'
export { MenuGroup } from './group'
export type { MenuItemProps } from './item'
export { MenuItem } from './item'
export type { MenuItemIndicatorProps } from './item-indicator'
export { MenuItemIndicator } from './item-indicator'
export type { MenuLabelProps } from './label'
export { MenuLabel } from './label'

export type { MenuProps } from './menu'
export { createMenuScope, Menu } from './menu'
export type { MenuPortalProps } from './portal'
export { MenuPortal } from './portal'
export type { MenuRadioGroupProps } from './radio-group'
export { MenuRadioGroup } from './radio-group'
export type { MenuRadioItemProps } from './radio-item'
export { MenuRadioItem } from './radio-item'
export type { MenuSeparatorProps } from './separator'
export { MenuSeparator } from './separator'
export type { MenuSubProps } from './sub'
export { MenuSub } from './sub'
export type { MenuSubContentProps } from './sub-content'
export { MenuSubContent } from './sub-content'
export type { MenuSubTriggerProps } from './sub-trigger'
export { MenuSubTrigger } from './sub-trigger'

import { MenuAnchor } from './anchor'
import { MenuArrow } from './arrow'
import { MenuCheckboxItem } from './checkbox-item'
import { MenuContent } from './content'
import { MenuGroup } from './group'
import { MenuItem } from './item'
import { MenuItemIndicator } from './item-indicator'
import { MenuLabel } from './label'
import { Menu } from './menu'
import { MenuPortal } from './portal'
import { MenuRadioGroup } from './radio-group'
import { MenuRadioItem } from './radio-item'
import { MenuSeparator } from './separator'
import { MenuSub } from './sub'
import { MenuSubContent } from './sub-content'
import { MenuSubTrigger } from './sub-trigger'

const Root = Menu
const Anchor = MenuAnchor
const Portal = MenuPortal
const Content = MenuContent
const Group = MenuGroup
const Label = MenuLabel
const Item = MenuItem
const CheckboxItem = MenuCheckboxItem
const RadioGroup = MenuRadioGroup
const RadioItem = MenuRadioItem
const ItemIndicator = MenuItemIndicator
const Separator = MenuSeparator
const Arrow = MenuArrow
const Sub = MenuSub
const SubTrigger = MenuSubTrigger
const SubContent = MenuSubContent

export {
  Anchor,
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
}
