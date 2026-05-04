## 0.3.0

### Minor Changes

- 7d6fb7b: Namespace refactors: calendar react namespaces renamed to match hook names, hooks/lazy types moved into namespaces, libs utils extracted into own modules, vim react types collapsed into single Vim namespace.

## 0.2.1

### Patch Changes

- 32d0136: fix: update React peer dependency to >=18.0.0 (was ^19.2.4)

## 0.2.0

### Minor Changes

- 58d1c61: feat: showOutsideDays, variable month support, adapter and hook fixes

  - Implement showOutsideDays with isHidden/isDisabled flags on outside days
  - Add isHidden to CalendarDay type and data-hidden to getDayProps
  - Add optional getMonthsInYear() to DateAdapter (Hebrew 13-month support)
  - Add exhaustiveness check to navigate() switch
  - Fix applySelection preserving isDisabled from grid
  - Fix dayjs startOfWeek time stripping
  - Fix ARIA range min>max guard in useTimePicker
  - Fix messageRef.current useEffect dependency
  - Fix useControllableState onChange ref for stable callbacks
  - Export clearFormatterCache/getCachedFormatter from main entry
  - Add multi-range, isHidden, getMonthsInYear test coverage