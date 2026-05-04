## Philosophy

Accordions solve the progressive disclosure problem  -  show the outline, hide the details until requested. We use a compound component pattern (Accordion -> AccordionItem -> AccordionTrigger + AccordionContent) because each piece needs independent control while sharing open/close state. The `type="single"` vs `type="multiple"` distinction maps directly to whether sections are mutually exclusive.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add accordion
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

  
    Is it accessible?
    Yes. It adheres to the WAI-ARIA design pattern.
  

```

## Examples

### Default

### ChevronDown Icon

### multiple

### Active Trigger on Open

Style the trigger to appear highlighted when its section is expanded using `data-[state=open]`:

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionAccordionItem`, `MotionAccordionTrigger`, and `MotionAccordionContent` for smooth height animations powered by [motion](https://motion.dev). The content animates from height 0 to auto with a fade, using a 200ms ease-out curve.

}>
Requires the `motion` package. Replace `AccordionItem` with `MotionAccordionItem`, `AccordionTrigger` with `MotionAccordionTrigger`, and `AccordionContent` with `MotionAccordionContent`. The `Accordion` root stays the same.

## API Reference

### Accordion

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'single' \| 'multiple'` | `'single'` | Defines accordion behavior. `'single'` allows only one open item; `'multiple'` allows multiple open items |
| `defaultValue` | `string \| string[]` | - | Sets initial open state(s); string for single type, array for multiple |
| `value` | `string \| string[]` | - | Controlled open state(s); requires `onValueChange` for updates |
| `onValueChange` | `(value: string \| string[]) => void` | - | Callback fired when open state changes |
| `collapsible` | `boolean` | `true` | Allows collapsing the currently open item by clicking again (single type only) |
| `renderOnce` | `boolean` | `false` | Mounts content only on first expand and preserves it afterward |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes applied to the root div |
| `children` | `React.ReactNode` | - | AccordionItem elements to render inside the accordion |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### AccordionItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | Unique identifier tying trigger to content |
| `children` | `[trigger: ReactNode, content: ReactNode]` | (required) | Two nodes: first the `AccordionTrigger`, second the `AccordionContent` |
| `className` | `string` | - | Additional CSS classes applied to the details element |
| `...props` | `React.HTMLProps<HTMLDetailsElement>` | - | Additional props to spread to the details element |

### AccordionTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | - | Custom icon component; defaults to a rotating ChevronDown |
| `className` | `string` | - | Additional CSS classes applied to the summary element |
| `children` | `React.ReactNode` | - | Content rendered as the trigger label |
| `...props` | `React.HTMLProps<HTMLElement>` | - | Additional props to spread to the summary element |

### AccordionContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the content div |
| `children` | `React.ReactNode` | - | Content to reveal when the accordion item is expanded |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionAccordion

Wraps `Accordion` and auto-injects a stagger `index` into each `MotionAccordionItem` child, creating a cascading entrance. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AccordionProps` | - | All props from `Accordion` are supported |

### MotionAccordionItem

Replaces `AccordionItem`. Keeps the `<details>` element open for motion height animation, and renders with a staggered `scaleIn` entrance (50ms per index). Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation. Auto-injected when used inside `MotionAccordion`. |
| `...props` | `AccordionItemProps` | - | All props from `AccordionItem` are supported |

### MotionAccordionTrigger

Replaces `AccordionTrigger`. Chevron rotation driven by motion instead of CSS `group-open`. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AccordionTriggerProps` | - | All props from `AccordionTrigger` are supported |

### MotionAccordionContent

Replaces `AccordionContent`. Animates height from 0 to auto with staggered blur and opacity fade using the `heightAuto` preset. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AccordionContentProps` | - | All props from `AccordionContent` are supported |