```tsx

```

## Anatomy

```tsx
const { SvgIndicator, inputStyle, indicatorReady, checkedIndicatorReady } = Checkers.useSvgIndicator({
  indicator: ,
  checkedIndicator: ,
})
```

---

## Exports

- `Checkers.useSvgIndicator`

---

## Example

```tsx

function CustomIndicatorInput() {
  const { SvgIndicator, inputStyle } = useSvgIndicator({
    indicator: </svg>,
    checkedIndicator: </svg>,
  })

  return (
    <>
      
      
    </>
  )
}
```

---

## API

### `useSvgIndicator(options)`

Builds mini SVG data URIs for unchecked/checked indicators and returns CSS custom-property styles plus hidden render nodes.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `indicator` | `React.ReactNode` | - | SVG-like node for unchecked state |
| `checkedIndicator` | `React.ReactNode` | - | SVG-like node for checked state |

Returns:

- `inputStyle`: `React.CSSProperties` with `--svg-off` / `--svg-on` CSS variables
- `SvgIndicator`: hidden renderer component that captures SVG markup for conversion
- `indicatorReady`: `boolean`
- `checkedIndicatorReady`: `boolean`

---

## Styling contract

The hook emits CSS variables so you can style one input with two indicator states.

```css
.checkbox {
  background-image: var(--svg-off);
}

.checkbox[data-state='checked'] {
  background-image: var(--svg-on);
}
```

}>

This utility is intentionally low-level. It is best used inside design-system wrappers where input visuals are custom and behavior comes from primitives such as checkbox/radio components.