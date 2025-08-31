---
title: Combobox
description: An enhanced input field with dropdown capabilities, allowing users to select from a list of options.
component: true
---

<ComponentPreview name="ComboboxMainDemo" />

## Features

1. **State Management**: Handles local state for value and open status.
2. **Popover Integration**: Uses `Popover` to display a dropdown list.
3. **Customizable**: Supports custom classes for wrapper, trigger, and content.
4. **Searchable Input**: Includes a search input to filter options.
5. **Command List**: Renders a list of options with group headings.
6. **Selection Handling**: Updates selected value and closes the popover on selection.

## Installation

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
npx duck-ui@latest add combobox
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy the following component code into your project.</Step>

<ComponentSource name="combobox" />

<Step>
  The Combobox is built using a composition of the `<Popover />
  `, `Label`, `Button` and the `<Command />` component.
</Step>

<Step>
  You also will need to install the [`Button`](/docs/components/Button#installation),
  [`Popover`](/docs/components/Popover#installation), [`Command`](/docs/components/Command#installation) and
  [`Label`](/docs/components/Label#installation) components because some dependencies are inherited from them.
</Step>

<Step>Ensure the import paths align with your project's structure.</Step>

</Steps>

</TabsContent>

</Tabs>

## Usage

```tsx
'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TooltipProvider,
} from '@/components/ui'

import { cn } from '@/lib/utils'

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <TooltipProvider>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value ? frameworks.find(framework => framework.value === value)?.label : 'Select framework...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map(framework => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={currentValue => {
                      setValue(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
```

---

### Combobox

`Combobox` is a generic React component designed to create a combobox (or dropdown) UI element. It allows users to select from a list of options and supports various customization features to fit different use cases. The component is flexible and can be tailored to handle different types of data and interactions.

#### Example Usage:

```tsx
import { Combobox } from '@/components/ui'

const MyCombobox = () => {
  return (
    <Combobox
      wrapper={<div className="wrapper-class" />}
      title="Select an option"
      trigger={<button className="trigger-button">Open Menu</button>}
      content={
        <ul>
          {myOptions.map(option => (
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      }
      onSelect={handleSelect}
      type="customType"
    />
  )
}
```

#### Description:

The `Combobox` component provides a customizable dropdown list that allows users to select an option
from a menu. It supports various types of triggers and content and can be configured to handle
selection events. For detailed information, refer to the API reference for
[`ComboboxProps`](#comboboxprops).

#### Key Features:

- **Customizable Trigger**: Allows for various trigger elements, such as buttons or inputs, to open the combobox menu.

- **Flexible Content**: Supports different types of content, such as lists or custom components, to display options in the dropdown.

- **Selection Handling**: Provides a callback to handle selection events, making it easy to integrate with application logic.

- **Wrapper Customization**: Allows for custom styling and layout through the `wrapper` prop, enabling integration with various design systems.

- **Type Specification**: Optionally specifies the type of combobox, facilitating different configurations and behaviors.

## Examples

### Combobox

<ComponentPreview name="ComboboxMainDemo" />

### Listbox

<ComponentPreview name="ComboboxListboxDemo" />

### Dropdown menu

<ComponentPreview name="ComboboxDropdownDemo" />

### Responsive

You can create a responsive combobox by using the `<Popover />` on desktop and the `<Drawer />` components on mobile.

<ComponentPreview name="ComboboxResponsiveDemo" />

## API Reference

### OnSelectType

`OnSelectType<T>` defines the structure for handling selection and value management in a list or combobox component.

**_Key Properties_**

- **`value`** (`T[]`): Array of currently selected values of type `T`. Represents the selected items in the component.

- **`setValue`** (`React.Dispatch<React.SetStateAction<T[]>>`): Function to update the `value` state. Allows for adding or removing selected items in the array.

### ComboboxProps

`ComboboxProps<T, Y>` defines the configuration for a combobox or listbox component, including how to handle selections and render different parts of the component.

**_Key Properties_**

- **`type`** (`'combobox' | 'listbox'`): Specifies the type of component. `'combobox'` allows for selecting from a list and typing in a value, while `'listbox'` only allows for selection from a list.

- **`onSelect`** ([`OnSelectType<Y>`](#onselecttype), optional): Callback for managing selection changes. Provides the selected values and a function to update them.

- **`wrapper`** (`React.HTMLProps<HTMLDivElement> & {}`, optional): Optional props for customizing the wrapper `div` element around the component.

- **`title`**
  (`Partial<React.ComponentPropsWithoutRef<typeof`[`Label>>`](/docs/components/label#labelprops) & {}`, optional): Optional props for customizing the title element, typically a label, including partial properties of `Label` component.

- **`trigger`**
  (`Partial<React.ComponentPropsWithoutRef<typeof`[`Button>`](/docs/components/button#buttonprops) `& {
children?: T }>`): Optional props for the trigger button, including partial properties of `Button` and an optional `children` prop of type `T`.

- **`content`**
  (`Partial<React.ComponentPropsWithoutRef<typeof`[`PopoverContent>>`](/docs/components/popover#popovercontent)
  `& { data: `[`CommandListGroupDataType<Y>[]`](/docs/components/command/#commandlistgroupdatatype)`; showSearchInput?: boolean; groupheading?: string[] }`): Optional props for the content section, including:
  - **`data`** ([`CommandListGroupDataType<Y>[]`](/docs/components/command/#commandlistgroupdatatype)): Array of data items for the list or combobox content.
  - **`showSearchInput`** (`boolean`, optional): Determines whether a search input should be shown in the content.
  - **`groupheading`** (`string[]`, optional): Optional array of group headings to organize items within the content.
