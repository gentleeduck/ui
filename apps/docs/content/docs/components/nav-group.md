---
title: NavGroup
description: A component for grouping and managing navigation elements, supporting collapsibility.
component: true
---

<ComponentPreview
  name="NavGroupMainDemo"
  description="A NavGroup"
  showSettings={true}
/>

## Features

- **Dynamic Navigation Rendering:** Renders navigation items based on the `navigationKeys` array, allowing flexible navigation structures.
- **Collapsible Navigation:** Supports a collapsible mode with the `isCollabsed` prop, ideal for sidebars or top navigation.
- **Flexible Positioning:** Can be positioned on the side or top using the `position` prop for versatile layout options.
- **Custom Button Styling:** Utilizes the `Button` component with custom styling based on the `variant`, current route, or collapse state.
- **Grouping Navigation Items:** Groups navigation items into arrays using the `group` prop, simplifying management of complex structures.
- **Automatic Route Matching:** Automatically applies styles based on the current route to highlight active navigation items.

## Installation

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx duck-ui@latest add nav-group
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="nav-group" />

<Step>
  The Combobox is built using a composition of the `<Button />` component.
</Step>

<Step>
  You also will need to install the [`Button`](/docs/components/Command#installation) components because some
  dependencies are inherited from them.
</Step>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</Tabs>

## Usage

```tsx
import { NavGroup, TooltipProvider } from '@/components/ui'
```

```tsx
const data = [
  {
    title: 'Home',
    route: '/home',
    children: 'Home',
    icon: <Home />,
    label: {
      children: '21',
    },
  },
  {
    title: 'Calendar',
    route: '/calendar',
    children: 'Calendar',
    icon: <Calendar />,
    label: {
      children: '20',
    },
  },
]

export default function App() {
  return (
    <>
      <TooltipProvider>
        <NavGroup<true>
          nav={{
            pathname: '',
            group: group as number[],
            router: {},
            location: {},
            isCollabsed: open,
          }}
          navigationKeys={data}
        />
      </TooltipProvider>
    </>
  )
}
```

## API Reference

### NavGroupProps

The `NavGroupProps` interface defines the properties that can be passed to the `NavGroup` component.

**_Key Properties_**

- **`navigationKeys`** ([`ButtonProps[]`](/docs/components/Button#buttonprops)): An array of button configurations for rendering the
  navigation buttons.
- **`nav`** ([`NavType<T>`](/docs/components/NavGroup#navtype)): An object containing navigation configuration, including groupings,
  router, pathname, and more.
- **`position`** (`side` or `top`): The position of the navigation group.

---

### NavType

The `NavType` interface defines the configuration for navigation, including whether it is collapsible.

**_Key Properties_**

- **`group`** (`number[]`): An array defining how many buttons should be grouped together.
- **`router`** (`any`): Router instance for handling navigation.
- **`pathname`** (`string`): Current path to highlight active buttons.
- **`className`** (`string` _optional_): Optional additional class names for styling the navigation group container.
- **`isCollabsed`** (`boolean` _optional_): Indicates if the navigation section is collapsible.

---

### NavCollabsableType

The `NavCollabsableType` type defines whether the navigation can be collapsible or not.

**_Key Properties_**

- **`isCollabsed`** (`boolean` _optional_): Indicates if the navigation section is collapsible.

---

### NavCollabsedType

The `NavCollabsedType` interface is used when the navigation section is collapsible.

**_Key Properties_**

- **`isCollabsed`** (`boolean` _optional_): Optional property to control collapsing behavior of navigation.

---

### NavNotCollabsedType

The `NavNotCollabsedType` interface is used when the navigation section is not collapsible.

**_Key Properties_**

- **N/A** (`N/A`): This type has no specific properties; used when `isCollabsed` is not needed.
