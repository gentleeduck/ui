The `Item` component is a straightforward flex container that can house nearly any type of content. Use it to display a title, description, and actions. Group it with the `ItemGroup` component to create a list of items.

You can pretty much achieve the same result with the `div` element and some classes, but **I've built this so many times** that I decided to create a component for it. Now I use it all the time.

## Philosophy

The Item component is a universal list entry primitive. Rather than building separate list-item variants for every context (settings, menus, selections), Item provides a flexible container with consistent spacing, alignment, and interactive states. It's the atoms-level building block that higher-level components compose upon.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add item
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives @gentleduck/variants
```

The `item` component depends on the [`label`](/duck-ui/components/label) and [`separator`](/duck-ui/components/separator) components.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
```

```tsx showLineNumbers

```

### Dropdown

## Notes

### Item vs Field

Use `Field` if you need to display a form input such as a checkbox, input, radio, or select.

If you only need to display content such as a title, description, and actions, use `Item`.

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionItem` and `MotionItemGroup` for staggered fade-up entrance animations powered by [motion](https://motion.dev). Pass `index` to `MotionItem` for stagger delay.

}>
Requires the `motion` package. Use `MotionItem` instead of `Item` and `MotionItemGroup` instead of `ItemGroup`. All other sub-components stay the same.

## API Reference

### Item

The main component for displaying content with media, title, description, and actions.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the item container |
| `variant` | `"default" \| "muted" \| "outline"` | `"default"` | Visual variant of the item |
| `size` | `"default" \| "sm"` | `"default"` | Size of the item |
| `asChild` | `boolean` | `false` | Render as a child element using `Slot` |
| `children` | `React.ReactNode` | - | Item content (media, content, actions, etc.) |
| `...props` | `React.HTMLProps

          <ItemTitle>Dashboard</ItemTitle>

            Overview of your account and activity.

  )
}
```

### ItemGroup

A container that groups related items together with consistent styling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the group container |
| `children` | `React.ReactNode` | - | Item elements to group together |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### ItemSeparator

A horizontal separator between items in a group.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the separator |
| `...props` | `React.ComponentPropsWithoutRef<typeof Separator>` | - | Additional props inherited from `Separator`. |

### ItemMedia

Displays media content such as icons, images, or avatars.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the media container |
| `variant` | `"default" \| "icon" \| "image"` | `"default"` | Visual variant of the media container |
| `children` | `React.ReactNode` | - | Media content (icon, image, avatar, etc.) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### ItemContent

Wraps the title and description of the item.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the content wrapper |
| `children` | `React.ReactNode` | - | Title and description elements |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### ItemTitle

Displays the title of the item.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the title |
| `children` | `React.ReactNode` | - | Title text or elements |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### ItemDescription

Displays the description of the item.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the description |
| `children` | `React.ReactNode` | - | Description text or elements |
| `...props` | `React.HTMLProps<HTMLParagraphElement>` | - | Additional props to spread to the p element |

### ItemActions

Displays action buttons or other interactive elements.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the actions container |
| `children` | `React.ReactNode` | - | Action buttons or interactive elements |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### ItemHeader

Displays a header spanning the full width of the item.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the header |
| `children` | `React.ReactNode` | - | Header content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### ItemFooter

Displays a footer spanning the full width of the item.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the footer |
| `children` | `React.ReactNode` | - | Footer content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionItem

Same props as `Item` plus an optional `index` prop for stagger delay (40ms per index). Adds fadeUp entrance animation. Requires the `motion` package.

### MotionItemGroup

Same props as `ItemGroup`. Adds fadeUp entrance animation. Requires the `motion` package.