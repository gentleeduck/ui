---
title: Badge
description: A versatile component for displaying small pieces of information or status indicators.
component: true
---

<ComponentPreview
  name="BadgeMainDemo"
  description="A badge"
/>

## Features

- **Customizable Variants**: Easily switch between different visual styles such as `default`, `info`, `warning`, `success`, and `outline`.
- **Resizable**: Adjust the badge size with options like `sm`, `md`, and `lg`.
- **Interactive**: Includes built-in hover effects and focus states for better user interaction.
- **Transition Effects**: Smooth transition effects for hover states.

## Installation

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx duck-ui@latest add badge
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="badge" />

<Step>
  The Combobox is built using a composition of the `<Button />
  `, the `<Tooltip />` component.
</Step>

<Step>
  You also will need to install the [`Button`](/docs/components/Command#installation) and
  [`Tooltip`](/docs/components/Tooltip#installation) components because some dependencies are inherited from them.
</Step>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</Tabs>

## Usage

```tsx
import { Badge, TooltipProvider } from '@/components/ui'
```

```tsx
<TooltipProvider>
  <Badge variant="outline"> Badge</Badge>
</TooltipProvider>
```

### Link

You can use the `badgeVariants` helper to create a link that looks like a badge.

```tsx
import { badgeVariants } from '@/components/ui'
```

```tsx
<Link className={badgeVariants({ variant: 'outline' })}> Badge</Link>
```

### Badge Component

`Badge` represents a small, rounded element used to display status or counts.

**_Key Properties_**

- **`className`** (`string`, optional): Additional classes to apply to the badge.

- **`variant`** ([`Variant`](#variant), optional): Defines the visual style of the badge (e.g., `default`, `secondary`, `destructive`, `outline`).

- **`size`** ([`Size`](#size), optional): Defines the size of the badge (e.g., `default`, `sm`, `lg`, `icon`).

- **`label`** ([`LabelType`](#labeltype), optional): Label text or tooltip content to display with the badge.

- **`...props`** (`React.HTMLAttributes<HTMLDivElement>`): Additional HTML attributes to apply to the badge element.

---

### Variant

The `variant` property determines the visual style of the badge.

**_Variants_**

- **`default`**: The primary style of the badge, with a background color defined by the primary theme.

- **`secondary`**: A secondary style using the secondary color scheme.

- **`destructive`**: A style intended for actions that might have irreversible effects, using the destructive color scheme.

- **`outline`**: A minimal style with just an outline and no background color.

---

### Size

The `size` property determines the size of the badge.

**_Sizes_**

- **`default`**: The default badge size, balanced for most use cases.

- **`sm`**: A smaller badge with reduced padding and font size.

- **`lg`**: A larger badge with increased padding and font size, for emphasis.

- **`icon`**: A badge designed to only contain an icon, with equal height and width.

---

### LabelType

`LabelType` defines the properties for label or tooltip content associated with the badge.

**_Key Properties_**

- **`children`** (`React.ReactNode`, optional): The content to display inside the tooltip.

- **`className`** (`string`, optional): Additional classes to apply to the tooltip content.
