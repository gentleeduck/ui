A quiet first month of the year. Most of the work landed in private branches; the public-facing change was a first documentation pass for the foundational components carried over from late-2024.

## Documentation <Badge variant="outline">docs</Badge>

### Button

Documented the styled `Button` component:

- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
- Sizes: `default`, `sm`, `lg`, `icon`.
- `asChild` slot pattern for rendering the trigger as a Next.js `Link` or any custom element.
- Accessibility notes — focus ring tokens, keyboard activation, disabled semantics.

### Badge

Documented the `Badge` component:

- Variants matching the button surface palette.
- Inline usage inside headings, list items, and table cells.
- Pairing badges with iconography for status surfaces.

---

## Behind the scenes

Work continued offline on the next-generation table system and the early benchmark harness. Both surface in [February 2025](/www/changelog/february-2025).