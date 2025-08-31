---
title: Header
description: A flexible header component that can include navigation, switcher, and footer elements.
component: true
---

<ComponentPreview
  name="HeaderMainDemo"
  description="A Header"
  showSettings={true}
/>

## Features

- **Header Component**: Provides a flexible header layout that can be customized with navigation, logos, and footer elements.
- **Collapsible Navigation**: Supports both collapsible and non-collapsible navigation sections, adaptable to different layouts like side or top positions.

- **Customizable Positioning**: Allows the header to be positioned at the top or side of the page, with appropriate layout adjustments.

- **Dynamic Footer Integration**: Includes an optional footer section where custom buttons or elements can be added.

- **Logo Placement**: Supports the inclusion of a logo, which can be placed dynamically based on the header's position.

- **Seamless Integration**: Designed to work seamlessly with other UI components, such as `NavGroup`, `Separator`, and custom utilities like `cn` and `filteredObject`.

- **TypeScript Support**: Strongly typed with TypeScript, ensuring type safety and autocompletion benefits during development.

## Installation

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx duck-ui@latest add header
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="header" />

<Step>
  The Combobox is built using a composition of the `<NavGroup />` component.
</Step>

<Step>
  You also will need to install the [`NavGroup`](/docs/components/nav-group#installation) components because some
  dependencies are inherited from them.
</Step>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</Tabs>

## Usage

```tsx
import { Header, Button, TooltipProvider } from '@/components/ui'
import { ArrowRightFromLine, Home, Calendar } from 'lucide-react'
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

const emails = [
  { email: 'wildduck@gentleduck.org', icon: Mail, label: 'mail' },
  { email: 'mona@gmail.com', icon: Cloudy, label: 'cloud' },
  { email: 'hannan@gentleduck.du', icon: ServerCog, label: 'server' },
]

export default function HeaderMainDemo() {
  const open = true

  return (
    <div>
      <TooltipProvider>
        <Header<typeof open>
          header={{
            isCollabsed: open,
            className: 'border-r-border border-r-solid border-r h-[300px] justify-center',
          }}
          switcher={{
            accounts: emails,
          }}
          nav={{
            navigationKeys: data,
            nav: {
              group: [1, 1],
              router: {},// use your router instance
              pathname: '',
            },
          }}
          footer={{
            buttons: [
              <Button
                isCollapsed={open}
                icon={<ArrowRightFromLine />}
                className={cn('my-1 mx-2 justify-between', !open && 'w-[250px]', open && 'justify-center')}
                title={'Collapse'}
                variant={'secondary'}
                size={open ? 'icon' : 'default'}
                  //some actions
                }
              />,
            ],
          }}
        />
      </TooltipProvider>
    </div>
  )
}
```

## Examples

### Top Header

<ComponentPreview
  name="HeaderTopDemo"
  description="A Header"
  showSettings={true}
/>

## API Reference

### HeaderProps

`HeaderProps` defines the properties for the header component, including navigation, logo, and footer elements.

**_Key Properties_**

- **`header`** ([`HeaderType`](#headertype)): Properties related to the header component, including any HTML attributes.

- **`nav`** ([`NavGroupProps<T>`](/docs/components/nav-group#navgroupprops)): Navigation group properties that control the behavior and structure of the navigation menu.

- **`logo`** (`React.ReactElement`, optional): An optional React element to display as the logo in the header.

- **`footer`** ([`FooterType`](#footertype), optional): Footer buttons to be displayed in the header.

---

### HeaderType

`HeaderType` defines the properties for the header component's behavior and appearance.

**_Key Properties_**

- **`isCollapsed`** (`boolean`, optional): Determines if the header or related components are collapsed.

- **`position`** (`'side'` or `'top'`): The position of the navigation group.

- **`...props`** (`React.HtmlHTMLAttributes<HTMLDivElement>`): Additional HTML attributes for the header.

---

### FooterType

`FooterType` defines the properties for the footer section of the header component.

**_Key Properties_**

- **`buttons`** (`React.ReactNode[]`): An array of React nodes representing footer buttons.
