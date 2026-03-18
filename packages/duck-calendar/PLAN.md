# duck-calendar: Accessibility Audit and ARIA Compliance

Issue #308. Ensure the calendar meets WCAG 2.1 AA and follows the WAI-ARIA APG date picker pattern.

> Depends on: #304 (adapter), #305 (core), #306 (hooks), #307 (compound components) — all complete.

## Changes Made

### Announcer — removed portal
- `AnnouncerPortal` no longer uses `createPortal` from `react-dom`
- Renders inline `<div aria-live="polite">` inside the calendar tree
- Eliminates `react-dom` peer dependency from `@gentleduck/calendar`

### Day buttons — full aria-label
- Each day button now has `aria-label="Saturday, March 14, 2026"` (localized)
- Previously screen readers only heard the number "14"

### data-disabled consistency
- Changed from empty string `""` to `"true"` to match all other data attributes

### Grid — aria-roledescription
- Grid has `aria-roledescription="calendar"` per WAI-ARIA APG recommendation

### Weekday headers — role="columnheader"
- `<abbr>` elements have `role="columnheader"` per WAI-ARIA grid pattern

### Nav labels — localizable
- `buildNavProps` accepts optional `prevLabel`/`nextLabel` for i18n
- Defaults: "Go to previous month" / "Go to next month"

## ARIA Compliance Summary

| Element | role | aria-* | Notes |
|---------|------|--------|-------|
| Calendar root | `application` | `aria-label="Calendar"` | |
| Grid container | `grid` | `aria-labelledby`, `aria-roledescription="calendar"` | |
| Weekday headers | `columnheader` | `title` on `<abbr>` | |
| Day cells | `gridcell` | `aria-label` (full date), `aria-selected`, `aria-disabled`, `aria-current="date"` | |
| Nav wrapper | `navigation` | `aria-label="Calendar navigation"` | |
| Nav buttons | button | `aria-label` (localizable) | |
| Header | — | `aria-live="polite"`, `id` | |
| Month buttons | `gridcell` | `aria-label`, `aria-current` | |
| Year buttons | `gridcell` | `aria-label`, `aria-current` | |
| Announcer | `status` | `aria-live="polite"`, `aria-atomic`, `aria-relevant` | |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| ArrowLeft/Right | ±1 day |
| ArrowUp/Down | ±7 days |
| PageUp/PageDown | ±1 month |
| Shift+PageUp/PageDown | ±1 year |
| Home/End | Week start/end |
| Enter/Space | Select focused date |
| Escape | Dismiss |

Focus auto-advances the displayed month when crossing boundaries.
Roving tabIndex: focused date has `tabIndex=0`, all others `-1`.

## Checklist

- [x] Remove announcer portal (render inline)
- [x] Add aria-label to day buttons (full localized date)
- [x] Fix data-disabled consistency
- [x] Add aria-roledescription to grid
- [x] Restore role="columnheader" on weekday headers
- [x] Localizable nav labels
- [ ] Axe-core automated tests
- [x] Build passes
- [x] All tests pass
