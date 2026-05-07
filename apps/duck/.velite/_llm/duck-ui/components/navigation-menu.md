## Philosophy

Navigation menus serve a different purpose than dropdown menus  -  they're for wayfinding, not actions. The distinction matters for accessibility: navigation menus use `

## Link

You can use the `asChild` prop to make another component look like a navigation menu trigger. Here's an example of a link that looks like a navigation menu trigger.

```tsx showLineNumbers title="components/example-navigation-menu.tsx"

export function NavigationMenuDemo() {
  return (
    

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionNavigationMenu` for a spring-powered entrance animation with blur powered by [motion](https://motion.dev).

}>
Requires the `motion` package. Use `MotionNavigationMenu` instead of `NavigationMenu`. All other sub-components stay the same.

## API Reference

### NavigationMenu

Root container that wraps the navigation menu and optionally renders the viewport.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled value of the active menu item |
| `defaultValue` | `string` | - | Default active value for uncontrolled usage |
| `onValueChange` | `(value: string) => void` | - | Callback when the active value changes |
| `viewport` | `boolean` | `true` | Whether to render the `NavigationMenuViewport` automatically |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`) and inherited by descendants. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the menu |
| `delayDuration` | `number` | `200` | Duration in ms from when the pointer enters a trigger until the content opens |
| `skipDelayDuration` | `number` | `300` | Duration in ms a user has to enter another trigger without incurring a delay again |
| `className` | `string` | - | Additional CSS classes for the root element |
| `children` | `React.ReactNode` | - | Navigation menu list and other elements |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>` | - | Additional props inherited from `NavigationMenu.Root`. |

### NavigationMenuList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the list element |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>` | - | Additional props inherited from `NavigationMenu.List`. |

### NavigationMenuItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the menu item |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>` | - | Additional props inherited from `NavigationMenu.Item`. |

### NavigationMenuTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the trigger |
| `children` | `React.ReactNode` | `--` | Trigger label content. A chevron icon is appended automatically |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>` | - | Additional props inherited from `NavigationMenu.Trigger`. |

### NavigationMenuContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the content panel |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>` | - | Additional props inherited from `NavigationMenu.Content`. |

### NavigationMenuLink

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the link |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>` | - | Additional props inherited from `NavigationMenu.Link`. |

### NavigationMenuViewport

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the viewport |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>` | - | Additional props inherited from `NavigationMenu.Viewport`. |

### NavigationMenuIndicator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes for the indicator |
| `...props` | `React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>` | - | Additional props inherited from `NavigationMenu.Indicator`. |

### navigationMenuTriggerStyle

A `cva` variant function that returns the default trigger styling classes. Use it to style non-trigger elements (e.g. plain links) to match the trigger appearance.

```tsx

  Documentation

```

### MotionNavigationMenu

Same props as `NavigationMenu`. Adds spring scaleIn+blur entrance animation via motion. Requires the `motion` package.