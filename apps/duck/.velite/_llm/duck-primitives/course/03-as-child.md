}>

**Lesson 3 of 10**: `asChild` is the key to integrating primitives with your design-system components.

## Why `asChild` matters

Without `asChild`, you either accept default HTML nodes or add wrappers that hurt semantics and styling.

With `asChild`, primitives attach behavior to your element directly.

```tsx
,
)
ActionButton.displayName = 'ActionButton'
```

Then:

```tsx

}
```

This aligns your custom components with library conventions.

---

## Lab

1. Convert `Dialog.Trigger` and `Dialog.Close` to design-system buttons via `asChild`.
2. Replace trigger with a link and verify ARIA/data attributes still apply.
3. Intentionally break ref forwarding and observe behavior, then fix it.

}>

Next: [Lesson 4 - Popover and Positioning](/duck-primitives/course/04-popover)