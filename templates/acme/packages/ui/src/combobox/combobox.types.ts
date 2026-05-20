import type { Button } from '../button'
import type { Checkbox } from '../checkbox'
import type { Command, CommandInput, CommandItem } from '../command'
import type { Popover, PopoverContent } from '../popover'

/** A single combobox option with a display label and underlying value. */
export interface IComboboxItemType {
  label: string
  value: string
}

/**
 * Props for the Combobox component.
 *
 * @template TData - The tuple of combobox items.
 * @template TType - Selection mode: `'single'` (default) or `'multiple'`.
 */
export interface IComboboxProps<
  TData extends readonly IComboboxItemType[],
  TType extends 'single' | 'multiple' = 'single',
> {
  /** List of items to display in the combobox. */
  items: TData
  /** Callback fired when the selected value(s) change. */
  onValueChange?: TType extends 'single'
    ? (value: TData[number]['value']) => void
    : (value: TData[number]['value'][]) => void
  /** Whether to show a search input inside the popover. */
  withSearch?: boolean
  /** Whether to display the selected value(s) in the trigger button. */
  showSelected?: boolean
  /** Initial value(s) for uncontrolled usage. */
  defaultValue?: TType extends 'single' ? TData[number]['value'] : TData[number]['value'][]
  /** Controlled value(s). */
  value?: TType extends 'single' ? TData[number]['value'] : TData[number]['value'][]
  /** Props forwarded to the Popover root. */
  popover?: React.ComponentPropsWithoutRef<typeof Popover>
  /** Props forwarded to the trigger Button. */
  popoverTrigger?: React.ComponentPropsWithoutRef<typeof Button>
  /** Props forwarded to PopoverContent. */
  popoverContent?: React.ComponentPropsWithoutRef<typeof PopoverContent>
  /** Props forwarded to the Command root. */
  command?: React.ComponentPropsWithoutRef<typeof Command>
  /** Props forwarded to CommandInput. */
  commandInput?: React.ComponentPropsWithoutRef<typeof CommandInput>
  /** Placeholder text for the search input. */
  commandTriggerPlaceholder?: string
  /** Message shown when no items match the search query. */
  commandEmpty?: string
  /** Render function for each item in the list. */
  children: (item: TData) => React.ReactNode
}

/**
 * Props for an individual combobox item (CommandItem wrapper).
 *
 * @template T - The item type extending `IComboboxItemType`.
 */
export interface IComboboxItemProps<T extends IComboboxItemType>
  extends Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, 'onSelect'> {
  /** The combobox item data. */
  item: T
  /** Callback fired when this item is selected. */
  onSelect?: (value: T['value']) => void
  /** Whether the item is checked (for multiple selection). */
  checked?: React.ComponentPropsWithoutRef<typeof Checkbox>['checked']
}
