}>

The `asChild` pattern is the key to composing primitives with your own design system. No wrapper divs, no prop drilling  -  just clean composition.

## The problem

You want a Dialog trigger, but it should be a link, not a button. Or you want a Popover trigger that's a custom component from your design system. Without composition, you'd need wrapper divs or forked components.

## The solution: `asChild`

Every primitive element supports `asChild`. When true, the primitive doesn't render its own element. Instead, it passes all its props (ARIA attributes, event handlers, refs, data attributes) to the child element.

```tsx
// Instead of wrapping:

```

---

## Rules

} className="[&_ol]:my-0">
Keep these rules in mind when using `asChild`:
1. `asChild` requires **exactly one** child element.
2. The child must accept a `ref` (use `React.forwardRef` for custom components).
3. Event handlers compose (both the primitive's and the child's handlers fire).
4. The child's props take precedence for non-handler, non-style props.

---

## Building reusable styled components

A common pattern is to create styled wrappers around primitives:

```tsx

export const Dialog = DialogPrimitive.Root

export const DialogContent = React.forwardRef<
  React.ComponentRef

      {children}

))
```

}>

This gives you a styled component that still accepts all primitive props and supports `asChild`.