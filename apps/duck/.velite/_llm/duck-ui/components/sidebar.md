## About

Sidebars are one of the most complex components to build. They are central
to any application and often contain a lot of moving parts.

We now have a solid foundation to build on top of. Composable. Themeable.
Customizable.

[Browse the Blocks Library](/blocks).

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add sidebar
```

## Usage

```tsx showLineNumbers title="app/layout.tsx"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    
      
        {children}

  )
}
```

```tsx showLineNumbers title="components/app-sidebar.tsx"

  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (

  )
}
```

## Examples
### sidebar variant

Use the default `sidebar` variant for a standard sidebar layout.

### floating variant

Use the `floating` variant for a sidebar with rounded borders and a drop shadow.

### inset variant

Use the `inset` variant for a sidebar that sits inside the page layout.

}>
  If you use the `inset` variant, remember to wrap your main content
  in a `SidebarInset` component.

```tsx showLineNumbers

  )
}
```

## Component Composition

A `Sidebar` component is composed of the following parts:

- `SidebarProvider` - Handles collapsible state.
- `Sidebar` - The sidebar container.
- `SidebarHeader` and `SidebarFooter` - Sticky at the top and bottom of the sidebar.
- `SidebarContent` - Scrollable content.
- `SidebarGroup` - Section within the `SidebarContent`.
- `SidebarTrigger` - Trigger for the `Sidebar`.

## SidebarProvider

The `SidebarProvider` component is used to provide the sidebar context to the `Sidebar` component. You should always wrap your application in a `SidebarProvider` component.

| Name           | Type                      | Description                                  |
| -------------- | ------------------------- | -------------------------------------------- |
| `defaultOpen`  | `boolean`                 | Default open state of the sidebar.           |
| `open`         | `boolean`                 | Open state of the sidebar (controlled).      |
| `onOpenChange` | `(open: boolean) => void` | Sets open state of the sidebar (controlled). |

### Width

If you have a single sidebar in your application, you can use the `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` variables in `sidebar.tsx` to set the width of the sidebar.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
```

For multiple sidebars in your application, you can use the `--sidebar-width` and `--sidebar-width-mobile` CSS variables in the `style` prop.

```tsx showLineNumbers

```

### Keyboard Shortcut

To trigger the sidebar, you use the `cmd+b` keyboard shortcut on Mac and `ctrl+b` on Windows.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
```

## Sidebar

The main `Sidebar` component used to render a collapsible sidebar.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'left' \| 'right'` | `'left'` | The side of the sidebar. |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | The variant of the sidebar. |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` | Collapsible state of the sidebar. |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection`. |
| `mobileTitle` | `string` | `'Sidebar'` | Title for the mobile sheet dialog. |
| `mobileDescription` | `string` | `'Displays the mobile sidebar.'` | Description for the mobile sheet dialog. |

| Prop        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `offcanvas` | A collapsible sidebar that slides in from the left or right. |
| `icon`      | A sidebar that collapses to icons.                           |
| `none`      | A non-collapsible sidebar.                                   |
## useSidebar

The `useSidebar` hook is used to control the sidebar.

```tsx showLineNumbers

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar()
}
```

| Property        | Type                      | Description                                   |
| --------------- | ------------------------- | --------------------------------------------- |
| `state`         | `expanded` or `collapsed` | The current state of the sidebar.             |
| `open`          | `boolean`                 | Whether the sidebar is open.                  |
| `setOpen`       | `(open: boolean) => void` | Sets the open state of the sidebar.           |
| `openMobile`    | `boolean`                 | Whether the sidebar is open on mobile.        |
| `setOpenMobile` | `(open: boolean) => void` | Sets the open state of the sidebar on mobile. |
| `isMobile`      | `boolean`                 | Whether the sidebar is on mobile.             |
| `toggleSidebar` | `() => void`              | Toggles the sidebar. Desktop and mobile.      |
| `dir`           | `'ltr' \| 'rtl'`          | The resolved text direction.                  |

## SidebarHeader

Use the `SidebarHeader` component to add a sticky header to the sidebar.

```tsx showLineNumbers title="components/app-sidebar.tsx"

           Username

```

## SidebarContent

The `SidebarContent` component is used to wrap the content of the sidebar. This is where you add your `SidebarGroup` components. It is scrollable.

| Name       | Type      | Default | Description                                       |
| ---------- | --------- | ------- | ------------------------------------------------- |
| `noScroll` | `boolean` | `true`  | Hides the scrollbar while keeping scroll behavior. |

```tsx showLineNumbers

```

To show the scrollbar, set `noScroll` to `false`:

```tsx showLineNumbers

```

## SidebarGroup

Use the `SidebarGroup` component to create a section within the sidebar.

A `SidebarGroup` has a `SidebarGroupLabel`, a `SidebarGroupContent` and an optional `SidebarGroupAction`.

```tsx showLineNumbers

```

## SidebarMenu

The `SidebarMenu` component is used for building a menu within a `SidebarGroup`.

```tsx showLineNumbers

  ))}

```

## SidebarTrigger

Use the `SidebarTrigger` component to render a button that toggles the sidebar. It extends the `Button` component and accepts all its props.

```tsx showLineNumbers

```

You can also build a custom trigger using the `useSidebar` hook:

```tsx showLineNumbers

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()

  return 

```

## Notes

### Data Attributes

All sidebar components expose `data-slot` attributes for precise CSS targeting.

| Component              | `data-slot`              |
| ---------------------- | ------------------------ |
| `SidebarProvider`      | `sidebar-wrapper`        |
| `Sidebar`              | `sidebar`                |
| `SidebarTrigger`       | `sidebar-trigger`        |
| `SidebarRail`          | `sidebar-rail`           |
| `SidebarInset`         | `sidebar-inset`          |
| `SidebarInput`         | `sidebar-input`          |
| `SidebarHeader`        | `sidebar-header`         |
| `SidebarFooter`        | `sidebar-footer`         |
| `SidebarSeparator`     | `sidebar-separator`      |
| `SidebarContent`       | `sidebar-content`        |
| `SidebarGroup`         | `sidebar-group`          |
| `SidebarGroupLabel`    | `sidebar-group-label`    |
| `SidebarGroupAction`   | `sidebar-group-action`   |
| `SidebarGroupContent`  | `sidebar-group-content`  |
| `SidebarMenu`          | `sidebar-menu`           |
| `SidebarMenuItem`      | `sidebar-menu-item`      |
| `SidebarMenuButton`    | `sidebar-menu-button`    |
| `SidebarMenuAction`    | `sidebar-menu-action`    |
| `SidebarMenuBadge`     | `sidebar-menu-badge`     |
| `SidebarMenuSkeleton`  | `sidebar-menu-skeleton`  |
| `SidebarMenuSub`       | `sidebar-menu-sub`       |
| `SidebarMenuSubItem`   | `sidebar-menu-sub-item`  |
| `SidebarMenuSubButton` | `sidebar-menu-sub-button`|

### Theming

We use the following CSS variables to theme the sidebar.

```css
@layer base {
  :root {
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 0 0% 98%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}
```

### Styling

Here are some tips for styling the sidebar based on different states.

Hide a group when the sidebar collapses to icons:

```tsx

```

Show an action when the menu button is active:

```tsx

```

## RTL Support

Set `dir="rtl"` on `Sidebar` for a local override, or set `DirectionProvider` once at app/root level for global direction. Trigger icon and rail positioning adjust automatically.

```tsx

  {/* ... */}

```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionSidebar` for smooth width animations powered by [motion](https://motion.dev). The sidebar width animates with expo-out easing when collapsing and expanding.

}>
Requires the `motion` package. Use `MotionSidebar` instead of `Sidebar`. All other sub-components (`SidebarProvider`, `SidebarContent`, `SidebarTrigger`, etc.) stay the same.

### MotionSidebar

Same props as `Sidebar`. Replaces CSS width transition with motion `m.div animate` using contentTransition (250ms expo-out). Handles icon collapse, offcanvas slide, and floating/inset variants. Requires the `motion` package.