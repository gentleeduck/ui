```tsx

```

## Usage

```tsx

    
    <button>Submit</button>

```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trapped` | `boolean` | `false` | Trap focus inside the scope |
| `loop` | `boolean` | `false` | <Kbd>Tab</Kbd> wraps from last to first element |
| `asChild` | `boolean` | `false` | Render as child element |
| `onMountAutoFocus` | `(event) => void` | - | Called when focus moves in on mount. Prevent default to skip auto-focus. |
| `onUnmountAutoFocus` | `(event) => void` | - | Called when focus restores on unmount |

}>

Used internally by Dialog.Content for modal focus trapping. You typically don't need to use it directly unless building your own overlay components.