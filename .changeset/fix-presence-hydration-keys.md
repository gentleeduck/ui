---
'@gentleduck/primitives': patch
'@gentleduck/docs': patch
'@gentleduck/registry-examples': patch
---

fix: presence animation interrupt, breadcrumb keys, theme hydration, nested buttons

- Presence: cancel in-flight exit animation on re-mount to prevent stale animationend from unmounting re-opened content
- Breadcrumb: move key from BreadcrumbItem to Fragment (React key warning)
- ModeSwitcher: use stable aria-label until mounted to prevent hydration mismatch
- PopoverTrigger: add asChild to calendar-7 and combobox-7 to prevent nested buttons
