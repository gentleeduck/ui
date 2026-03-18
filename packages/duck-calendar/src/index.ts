// Adapter
export type { DateAdapter, WeekStartDay } from './adapter'
export { NativeAdapter } from './adapter'
export type { CalendarDay, CalendarMonth, CalendarWeek, DecadeEntry, YearEntry } from './grid'
// Grid
export {
  buildCalendarMonth,
  buildCalendarYear,
  buildDecadeView,
  getLocalizedMonthNames,
  getLocalizedWeekdays,
  getWeekNumber,
} from './grid'
// Top-level config
export type { CalendarConfig, CalendarLocaleConfig, ViewMode } from './index.types'
export type { NavigationDirection, NavigationUnit } from './navigation'

// Navigation
export { canNavigate, goToMonth, goToNextMonth, goToPrevMonth, goToYear, navigate } from './navigation'
export type { CalendarValue, DateRange, SelectionConstraints, SelectionMode } from './selection'
// Selection
export { applySelection, isDateDisabled, isInRange, selectDay } from './selection'

// React hooks (requires react peer dep)
export { useCalendar, useKeyboard, useAnnouncer } from './react'
export type {
  AnnouncerReturn,
  DayProps,
  GridProps,
  HeaderProps,
  KeyboardConfig,
  KeyboardReturn,
  NavProps,
  UseCalendarConfig,
  UseCalendarReturn,
} from './react'
