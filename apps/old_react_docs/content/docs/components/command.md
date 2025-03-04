---
title: Command
description: A fast, composable, unstyled command menu for React applications.
component: true
links:
  doc: https://cmdk.paco.me
---

<ComponentPreview
  name="CommandMainDemo"
  align="start"
  className="[&_.preview>div]:max-w-[450px]"
  description="A command menu"
  showSettings={false}
/>

## Features

- **Searchable Command Dialog:** Command palette with search functionality.
- **Groupable Command List:** Organize commands into groups with optional headings.
- **Selectable Items:** Items support actions, selection, and checkmarks.
- **Keyboard Navigation:** Navigate and select commands via keyboard.
- **Responsive Design:** Adapts to various screen sizes.

## About

The `<Command />` component uses the [`cmdk`](https://cmdk.paco.me) component by [pacocoursey](https://twitter.com/pacocoursey).

## Installation

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx duck-ui@latest add command
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install cmdk
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="command" />

<Step>
  The Combobox is built using a composition of the `<Button />
  `, `<Dialog />
  `, `<ScrollArea />` and the `<Tooltip />` component.
</Step>

<Step>
  You also will need to install the [`Button`](/docs/components/Command#installation),
  [`Tooltip`](/docs/components/Tooltip#installation), [`Dialog`](/docs/components/Dialog#installation) and
  [`ScrollArea`](/docs/components/ScrollArea#installation) components because some dependencies are inherited from them.
</Step>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</Tabs>

## Usage

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  TooltipProvider,
} from '@/components/ui'
```

```tsx
<TooltipProvider>
  <Command>
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>Search GitHub</CommandItem>
        <CommandItem>Search Twitter</CommandItem>
        <CommandItem>Search Discord</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>General</CommandItem>
        <CommandItem>Profile</CommandItem>
        <CommandItem>Notifications</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</TooltipProvider>
```

---

Here’s the documentation for the `CommandListGroup` component, formatted similarly to the previous examples:

---

### CommandListGroup

`CommandListGroup` is a React component that renders a list of commands organized into groups. It
provides options for grouping data, selecting items, and customizing the appearance and behavior of
the list. This component is designed to support interactive lists with selectable items and optional
grouping. For detailed information, refer to the API reference for [`CommandListGroupProps`](#commandlistgroupprops).

#### Example Usage:

```tsx
import { CommandListGroup } from '@/components/ui'

const MyCommandList = () => {
  return (
    <CommandListGroup
      data={myData}
      onSelect={handleSelect}
      selected={selectedItems}
      group={groupSizes}
      groupheading={true}
      className="custom-class"
      checkabble={true}
      type="customType"
    />
  )
}
```

#### Description:

The `CommandListGroup` component is designed to display a list of items grouped by specified sizes. It supports item selection, custom grouping, and various display options. This component is ideal for creating interactive lists where users can select items and view them organized in groups.

#### Key Features:

- **Grouping**: Supports grouping items based on specified sizes, making it easy to organize and navigate through large lists.

- **Item Selection**: Provides functionality for selecting items, with options for checkable items and callback handling.

- **Customizable Appearance**: Allows for custom styling and additional features through props like `className`, `checkabble`, and `type`.

- **Dynamic Grouping**: Adjusts grouping dynamically based on the provided group sizes, accommodating different data sets and requirements.

- **Interactive List**: Enables interactive features such as selection and grouping, enhancing user experience with structured data.

## Examples

### List Group

<ComponentPreview
  name="CommandGroupDemo"
  description="A component dialog."
  showSettings={false}
/>

### Dialog

<ComponentPreview
  name="CommandDialogDemo"
  description="A component dialog."
  showSettings={false}
/>

To show the command menu in a dialog, use the `<CommandDialog />` component, or use the `<Button/>` component with the `command` variant.

```tsx
export function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Settings</CommandItem>
          <CommandItem>Messages</CommandItem>
          <CommandItem>Search</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

## API Reference

### CommandListGroupDataType

`CommandListGroupDataType` defines the structure of data used for each item in a command list group.

**_Key Properties_**

- **`label`** (`T`, optional): Optional label for the item, where `T` extends `keyof Record<string, unknown>`. Provides a textual representation of the item.

- **`element`** ([`ListItemElementType`](#listitemelementtype), optional): Optional element to render for the item, allowing for custom content or styling.

- **`onSelect`** ([`OnSelectType`](#onselecttype), optional): Optional callback functions for selection events. Defines methods to handle item selection and clearing.

### OnSelectType

`OnSelectType` defines the callback functions for handling item selection and clearing in a command list.

**_Key Properties_**

- **`key?`** (`<T extends string>(arg?: T) => void`): Callback function triggered when an item is selected. Takes an optional argument `arg` of type `T` (a string) to specify the selected item.

- **`clear?`** (`<T extends string>(arg?: T) => void`): Callback function triggered when an item is cleared or deselected. Takes an optional argument `arg` of type `T` (a string) to specify the cleared item.

### ListItemElementType

`ListItemElementType` extends the properties for rendering list items, combining features from `CommandItem` and `Button`.

**_Key Properties_**

- Inherits all optional properties from `React.ComponentPropsWithoutRef<typeof CommandItem>` and
  `React.CustomComponentPropsWithRef<typeof`[`Button>`](/docs/components/button#buttonprops)). Provides a flexible type for custom list item elements with button-like behavior or additional components.

### CommandListGroupType

`CommandListGroupType` defines the configuration for a command list group, including types, data, and selection behavior.

**_Key Properties_**

- **`type`** (`'combobox' | 'listbox'`, optional): Specifies the type of list group, where `'combobox'` is a combo box and `'listbox'` is a list box. Determines the interaction model.

- **`data`** ([`CommandListGroupDataType[]`](#commandlistgroupdatatype)): Array of data items for the command list group. Defines the list items and their properties.

- **`group`** (`number[]`, optional): Optional array of indices representing groups within the list. Allows for organizing items into sub-groups.

- **`groupheading`** (`string[]`, optional): Optional array of headings for each group, providing titles or labels for grouped items.

- **`onSelect`** ([`OnSelectType`](#onselecttype), optional): Optional callback functions for handling selection events in the list group.

- **`selected`** (`string[]`): Array of selected item identifiers. Manages the state of selected items within the list group.

- **`className`** (`string`, optional): Optional CSS class name for styling the list group component.

- **`checkabble`** (`boolean`, optional): When `true`, enables checkbox-like behavior for items in the list group, allowing multiple selections.

---

**`Command` Component**

The `Command` component wraps around `CommandPrimitive`, adding default styling.

- **`className`** (`string`, optional): Custom CSS class names to apply to the `Command` component.
- **`ref`** (`React.Ref<React.ElementRef<typeof CommandPrimitive>>`): Ref to the `CommandPrimitive` component.
- **`...props`** (`React.ComponentPropsWithoutRef<typeof CommandPrimitive>`): Additional properties passed to `CommandPrimitive`.

---

**`CommandDialogProps` Interface**

The `CommandDialogProps` interface extends the `DialogProps` for the `CommandDialog` component.

- **`children`** (`React.ReactNode`): The content rendered inside the `CommandDialog`.
- **`...props`** (`DialogProps`): Additional properties passed to the `Dialog` component.

---

**`CommandInput` Component**

The `CommandInput` component provides an input field for searching within the command dialog.

- **`className`** (`string`, optional): Custom CSS class names to apply to the `CommandInput` component.
- **`ref`** (`React.Ref<React.ElementRef<typeof CommandPrimitive.Input>>`): Ref to the `CommandPrimitive.Input` component.
- **`...props`** (`React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>`): Additional properties passed to `CommandPrimitive.Input`.

---

**`CommandList` Component**

The `CommandList` component displays a list of command items.

- **`className`** (`string`, optional): Custom CSS class names to apply to the `CommandList` component.
- **`ref`** (`React.Ref<React.ElementRef<typeof CommandPrimitive.List>>`): Ref to the `CommandPrimitive.List` component.
- **`...props`** (`React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>`): Additional properties passed to `CommandPrimitive.List`.

---

**`CommandEmpty` Component**

The `CommandEmpty` component displays a message when there are no items to show in the command list.

- **`ref`** (`React.Ref<React.ElementRef<typeof CommandPrimitive.Empty>>`): Ref to the `CommandPrimitive.Empty` component.
- **`...props`** (`React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>`): Additional properties passed to `CommandPrimitive.Empty`.

---

**`CommandGroup` Component**

The `CommandGroup` component groups related command items together.

- **`className`** (`string`, optional): Custom CSS class names to apply to the `CommandGroup` component.
- **`ref`** (`React.Ref<React.ElementRef<typeof CommandPrimitive.Group>>`): Ref to the `CommandPrimitive.Group` component.
- **`...props`** (`React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>`): Additional properties passed to `CommandPrimitive.Group`.

---

**`CommandSeparator` Component**

The `CommandSeparator` component provides a visual separator between command items.

- **`className`** (`string`, optional): Custom CSS class names to apply to the `CommandSeparator` component.
- **`ref`** (`React.Ref<React.ElementRef<typeof CommandPrimitive.Separator>>`): Ref to the `CommandPrimitive.Separator` component.
- **`...props`** (`React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>`): Additional properties passed to `CommandPrimitive.Separator`.

---

**`CommandItem` Component**

The `CommandItem` component represents an individual command item.

- **`className`** (`string`, optional): Custom CSS class names to apply to the `CommandItem` component.
- **`ref`** (`React.Ref<React.ElementRef<typeof CommandPrimitive.Item>>`): Ref to the `CommandPrimitive.Item` component.
- **`...props`** (`React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>`): Additional properties passed to `CommandPrimitive.Item`.
