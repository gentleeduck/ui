# Component Registry

## All Components by Category

### Layout: accordion, breadcrumb, carousel, collapsible, menubar, navigation-menu, pagination, sidebar, tabs
### Overlay: alert-dialog, dialog*, drawer, dropdown-menu, context-menu, hover-card, popover, sheet, tooltip
### Form: button, button-group, checkbox, combobox, command, input, input-group, input-otp, label, radio-group, select, slider, switch, textarea, toggle, toggle-group
### Display: avatar, badge, calendar, card, chart, empty, kbd, preview-panel, progress, separator, skeleton, table, field
### Feedback: alert, sonner
### Utility: aspect-ratio, resizable, scroll-area, upload, audio, direction, item, json-editor

`*` = has a responsive variant file (`{name}-responsive.tsx`) that switches between desktop/mobile layouts. Currently only `dialog` has one.

## Component Architecture

Components follow one of two patterns:

- **Variant-based** (have `.constants.ts`): alert, badge, button, button-group, empty, field, item, sidebar, toggle
- **Primitive wrapper** (no `.constants.ts`): wrap `@gentleduck/primitives/{name}` with Tailwind classes directly
- **Custom implementation** (no primitive): tabs  -  implements its own React context and state without a primitives layer

## Adding a New Variant to an Existing Component

1. Open `{name}.constants.ts` and add the new value to the relevant union type (e.g., add `'success'` to `ButtonVariant`).
2. Add the same value to the `variants` object inside `cva()` with its Tailwind classes.
3. Add the new value to the `VariantOptions` interface array type.
4. The component picks it up automatically  -  no changes needed in `{name}.tsx`.

## Overriding Component Styles

- **Variant-based components**: Pass `className`  -  it is forwarded into `buttonVariants({ ..., className })` inside the `cva()` call, which merges your classes with variant classes via Tailwind's cascade.
- **Primitive wrappers**: Pass `className`  -  it is appended via `cn(defaultClasses, className)`.
- To use variant classes outside the component (e.g., on an `<a>` tag), import the variant function directly: `buttonVariants({ variant: 'outline', size: 'sm' })`.

## Next.js App Router and React Server Components

- All registry-ui components that use hooks, context, or event handlers have `'use client'` at the top of their file. They are client components.
- In App Router server components, import and use them directly  -  Next.js handles the client boundary automatically at the `'use client'` marker.
- Components without `'use client'` (pure markup wrappers like Card sub-parts) can render in server components.
- If you compose multiple client components into a layout, wrap them in a single `'use client'` file to avoid unnecessary boundaries.
