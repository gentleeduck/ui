import { describe, expectTypeOf, it } from 'vitest'
import type { DateAdapter, WeekStartDay } from '../adapter'
import { NativeAdapter } from '../adapter'
import type { CalendarDay, CalendarMonth, CalendarWeek } from '../grid'
import { buildCalendarMonth, buildMultiMonth } from '../grid'
import type { CalendarConfig, CalendarLocaleConfig, ViewMode } from '../index.types'
import { canNavigate, navigate } from '../navigation'
import type {
  DayProps,
  GridProps,
  HeaderProps,
  NavProps,
  UseCalendarReturn,
} from '../react/use-calendar/use-calendar.types'
import type { UseDateTimeReturn } from '../react/use-datetime/use-datetime.types'
import type { TimeFieldProps, UseTimePickerReturn } from '../react/use-time-picker/use-time-picker.types'
import type { CalendarValue, DateRange, SelectionConstraints, SelectionMode } from '../selection'
import { applySelection, selectDay } from '../selection'
import type { HourCycle, TimeField, TimeValue } from '../time'
import { clampTime, incrementField, parseTimeInput } from '../time'

// ---------------------------------------------------------------------------
// CalendarValue conditional type
// ---------------------------------------------------------------------------
describe('CalendarValue conditional type', () => {
  it('resolves to TDate | null for single mode', () => {
    expectTypeOf<CalendarValue<Date, 'single'>>().toEqualTypeOf<Date | null>()
  })

  it('resolves to DateRange<TDate> | null for range mode', () => {
    expectTypeOf<CalendarValue<Date, 'range'>>().toEqualTypeOf<DateRange<Date> | null>()
  })

  it('resolves to TDate[] for multi mode', () => {
    expectTypeOf<CalendarValue<Date, 'multi'>>().toEqualTypeOf<Date[]>()
  })

  it('resolves to DateRange<TDate>[] for multi-range mode', () => {
    expectTypeOf<CalendarValue<Date, 'multi-range'>>().toEqualTypeOf<DateRange<Date>[]>()
  })

  it('works with custom TDate types', () => {
    type CustomDate = { _brand: 'custom'; value: number }
    expectTypeOf<CalendarValue<CustomDate, 'single'>>().toEqualTypeOf<CustomDate | null>()
    expectTypeOf<CalendarValue<CustomDate, 'range'>>().toEqualTypeOf<DateRange<CustomDate> | null>()
    expectTypeOf<CalendarValue<CustomDate, 'multi'>>().toEqualTypeOf<CustomDate[]>()
    expectTypeOf<CalendarValue<CustomDate, 'multi-range'>>().toEqualTypeOf<DateRange<CustomDate>[]>()
  })

  it('resolves to never for invalid mode', () => {
    // @ts-expect-error - 'invalid' is not a valid SelectionMode
    type _Invalid = CalendarValue<Date, 'invalid'>
  })
})

// ---------------------------------------------------------------------------
// DateRange type
// ---------------------------------------------------------------------------
describe('DateRange type', () => {
  it('has from (required) and to (nullable)', () => {
    expectTypeOf<DateRange<Date>>().toHaveProperty('from')
    expectTypeOf<DateRange<Date>>().toHaveProperty('to')
    expectTypeOf<DateRange<Date>['from']>().toEqualTypeOf<Date>()
    expectTypeOf<DateRange<Date>['to']>().toEqualTypeOf<Date | null>()
  })
})

// ---------------------------------------------------------------------------
// DateAdapter generic flow
// ---------------------------------------------------------------------------
describe('DateAdapter generic flow', () => {
  it('NativeAdapter implements DateAdapter<Date>', () => {
    expectTypeOf<NativeAdapter>().toMatchTypeOf<DateAdapter<Date>>()
  })

  it('adapter methods accept and return the correct TDate', () => {
    type Adapter = DateAdapter<Date>
    expectTypeOf<Adapter['today']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['create']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['addDays']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['addMonths']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['addYears']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['startOfMonth']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['endOfMonth']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['startOfWeek']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['fromDate']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Adapter['setTime']>().returns.toEqualTypeOf<Date>()
  })

  it('time accessor methods return numbers', () => {
    type Adapter = DateAdapter<Date>
    expectTypeOf<Adapter['getHours']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getMinutes']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getSeconds']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getYear']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getMonth']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getDate']>().returns.toEqualTypeOf<number>()
  })

  it('getDayOfWeek returns WeekStartDay', () => {
    type Adapter = DateAdapter<Date>
    expectTypeOf<Adapter['getDayOfWeek']>().returns.toEqualTypeOf<WeekStartDay>()
  })

  it('format returns string', () => {
    type Adapter = DateAdapter<Date>
    expectTypeOf<Adapter['format']>().returns.toEqualTypeOf<string>()
  })

  it('boolean methods return boolean', () => {
    type Adapter = DateAdapter<Date>
    expectTypeOf<Adapter['isSameDay']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Adapter['isSameMonth']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Adapter['isBefore']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Adapter['isAfter']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Adapter['isValid']>().returns.toEqualTypeOf<boolean>()
  })

  it('works with a custom date type', () => {
    type DayjsDate = { _brand: 'dayjs' }
    type DayjsAdapter = DateAdapter<DayjsDate>
    expectTypeOf<DayjsAdapter['today']>().returns.toEqualTypeOf<DayjsDate>()
    expectTypeOf<DayjsAdapter['addDays']>().returns.toEqualTypeOf<DayjsDate>()
    expectTypeOf<DayjsAdapter['setTime']>().returns.toEqualTypeOf<DayjsDate>()
  })
})

// ---------------------------------------------------------------------------
// CalendarConfig type
// ---------------------------------------------------------------------------
describe('CalendarConfig type', () => {
  it('selected type matches mode', () => {
    type SingleConfig = CalendarConfig<Date, 'single'>
    type RangeConfig = CalendarConfig<Date, 'range'>
    type MultiConfig = CalendarConfig<Date, 'multi'>

    expectTypeOf<SingleConfig['selected']>().toEqualTypeOf<Date | null | undefined>()
    expectTypeOf<RangeConfig['selected']>().toEqualTypeOf<DateRange<Date> | null | undefined>()
    expectTypeOf<MultiConfig['selected']>().toEqualTypeOf<Date[] | undefined>()
  })

  it('onSelect callback parameter matches mode', () => {
    type SingleConfig = CalendarConfig<Date, 'single'>
    type RangeConfig = CalendarConfig<Date, 'range'>

    // onSelect for single should accept (Date | null) => void
    type SingleOnSelect = NonNullable<SingleConfig['onSelect']>
    expectTypeOf<SingleOnSelect>().parameter(0).toEqualTypeOf<Date | null>()

    type RangeOnSelect = NonNullable<RangeConfig['onSelect']>
    expectTypeOf<RangeOnSelect>().parameter(0).toEqualTypeOf<DateRange<Date> | null>()
  })

  it('disabled accepts array or predicate', () => {
    type Config = CalendarConfig<Date, 'single'>
    expectTypeOf<Config['disabled']>().toEqualTypeOf<Date[] | ((date: Date) => boolean) | undefined>()
  })

  it('fromDate and toDate are optional TDate', () => {
    type Config = CalendarConfig<Date, 'single'>
    expectTypeOf<Config['fromDate']>().toEqualTypeOf<Date | undefined>()
    expectTypeOf<Config['toDate']>().toEqualTypeOf<Date | undefined>()
  })
})

// ---------------------------------------------------------------------------
// UseCalendarReturn type
// ---------------------------------------------------------------------------
describe('UseCalendarReturn type', () => {
  it('state.value type matches mode', () => {
    type SingleReturn = UseCalendarReturn<Date, 'single'>
    type RangeReturn = UseCalendarReturn<Date, 'range'>
    type MultiReturn = UseCalendarReturn<Date, 'multi'>

    expectTypeOf<SingleReturn['state']['value']>().toEqualTypeOf<Date | null>()
    expectTypeOf<RangeReturn['state']['value']>().toEqualTypeOf<DateRange<Date> | null>()
    expectTypeOf<MultiReturn['state']['value']>().toEqualTypeOf<Date[]>()
  })

  it('state has correct shape', () => {
    type Return = UseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['state']['month']>().toEqualTypeOf<Date>()
    expectTypeOf<Return['state']['focusedDate']>().toEqualTypeOf<Date>()
    expectTypeOf<Return['state']['viewMode']>().toEqualTypeOf<ViewMode>()
    expectTypeOf<Return['state']['weeks']>().toEqualTypeOf<CalendarWeek<Date>[]>()
    expectTypeOf<Return['state']['months']>().toEqualTypeOf<CalendarMonth<Date>[]>()
    expectTypeOf<Return['state']['weekdays']>().toEqualTypeOf<string[]>()
    expectTypeOf<Return['state']['canGoNext']>().toEqualTypeOf<boolean>()
    expectTypeOf<Return['state']['canGoPrevious']>().toEqualTypeOf<boolean>()
  })

  it('actions have correct signatures', () => {
    type Return = UseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['setMonth']>().toBeFunction()
    expectTypeOf<Return['actions']['setViewMode']>().toBeFunction()
    expectTypeOf<Return['actions']['goToNext']>().toBeFunction()
    expectTypeOf<Return['actions']['goToPrevious']>().toBeFunction()
    expectTypeOf<Return['actions']['selectDate']>().toBeFunction()
    expectTypeOf<Return['actions']['focusDate']>().toBeFunction()
  })

  it('prop getters return correct types', () => {
    type Return = UseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['getDayProps']>().returns.toEqualTypeOf<DayProps>()
    expectTypeOf<Return['getGridProps']>().returns.toEqualTypeOf<GridProps>()
    expectTypeOf<Return['getNavProps']>().returns.toEqualTypeOf<NavProps>()
    expectTypeOf<Return['getHeaderProps']>().returns.toEqualTypeOf<HeaderProps>()
  })

  it('getDayProps accepts CalendarDay<TDate>', () => {
    type Return = UseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['getDayProps']>().parameter(0).toEqualTypeOf<CalendarDay<Date>>()
  })
})

// ---------------------------------------------------------------------------
// DayProps type
// ---------------------------------------------------------------------------
describe('DayProps type', () => {
  it('has correct ARIA attributes', () => {
    expectTypeOf<DayProps['role']>().toEqualTypeOf<'gridcell'>()
    expectTypeOf<DayProps['aria-label']>().toEqualTypeOf<string>()
    expectTypeOf<DayProps['aria-selected']>().toEqualTypeOf<boolean>()
    expectTypeOf<DayProps['aria-disabled']>().toEqualTypeOf<boolean>()
    expectTypeOf<DayProps['aria-current']>().toEqualTypeOf<'date' | undefined>()
    expectTypeOf<DayProps['tabIndex']>().toEqualTypeOf<0 | -1>()
  })

  it('has data attributes with correct types', () => {
    expectTypeOf<DayProps['data-calendar-day']>().toEqualTypeOf<''>()
    expectTypeOf<DayProps['data-selected']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<DayProps['data-disabled']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<DayProps['data-today']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<DayProps['data-focused']>().toEqualTypeOf<'true' | undefined>()
  })

  it('has event handlers', () => {
    expectTypeOf<DayProps['onClick']>().toBeFunction()
    expectTypeOf<DayProps['onMouseEnter']>().toBeFunction()
    expectTypeOf<DayProps['onKeyDown']>().toBeFunction()
  })
})

// ---------------------------------------------------------------------------
// GridProps type
// ---------------------------------------------------------------------------
describe('GridProps type', () => {
  it('has correct ARIA attributes', () => {
    expectTypeOf<GridProps['role']>().toEqualTypeOf<'grid'>()
    expectTypeOf<GridProps['aria-labelledby']>().toEqualTypeOf<string>()
    expectTypeOf<GridProps['aria-roledescription']>().toEqualTypeOf<string>()
  })
})

// ---------------------------------------------------------------------------
// TimeValue type
// ---------------------------------------------------------------------------
describe('TimeValue type', () => {
  it('has hour and minute required, second optional', () => {
    expectTypeOf<TimeValue['hour']>().toEqualTypeOf<number>()
    expectTypeOf<TimeValue['minute']>().toEqualTypeOf<number>()
    expectTypeOf<TimeValue['second']>().toEqualTypeOf<number | undefined>()
  })
})

// ---------------------------------------------------------------------------
// TimeField type
// ---------------------------------------------------------------------------
describe('TimeField type', () => {
  it('is a union of field names', () => {
    expectTypeOf<'hour'>().toMatchTypeOf<TimeField>()
    expectTypeOf<'minute'>().toMatchTypeOf<TimeField>()
    expectTypeOf<'second'>().toMatchTypeOf<TimeField>()
    expectTypeOf<'ampm'>().toMatchTypeOf<TimeField>()
  })
})

// ---------------------------------------------------------------------------
// HourCycle type
// ---------------------------------------------------------------------------
describe('HourCycle type', () => {
  it('is 12 or 24', () => {
    expectTypeOf<'12'>().toMatchTypeOf<HourCycle>()
    expectTypeOf<'24'>().toMatchTypeOf<HourCycle>()
  })
})

// ---------------------------------------------------------------------------
// Pure function return types
// ---------------------------------------------------------------------------
describe('Pure function return types', () => {
  it('selectDay returns CalendarValue matching mode', () => {
    const adapter = new NativeAdapter()
    const result = selectDay(adapter, 'single', null, new Date())
    expectTypeOf(result).toEqualTypeOf<Date | null>()
  })

  it('buildCalendarMonth returns CalendarMonth<TDate>', () => {
    const adapter = new NativeAdapter()
    const result = buildCalendarMonth(adapter, new Date(), { showOutsideDays: true, fixedWeeks: false })
    expectTypeOf(result).toEqualTypeOf<CalendarMonth<Date>>()
  })

  it('buildMultiMonth returns CalendarMonth<TDate>[]', () => {
    const adapter = new NativeAdapter()
    const result = buildMultiMonth(adapter, new Date(), 2, { showOutsideDays: true, fixedWeeks: false })
    expectTypeOf(result).toEqualTypeOf<CalendarMonth<Date>[]>()
  })

  it('navigate returns TDate', () => {
    const adapter = new NativeAdapter()
    const result = navigate(adapter, new Date(), 'next', 'month')
    expectTypeOf(result).toEqualTypeOf<Date>()
  })

  it('canNavigate returns boolean', () => {
    const adapter = new NativeAdapter()
    const result = canNavigate(adapter, new Date(), 'next', 'month')
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('clampTime returns TimeValue', () => {
    const result = clampTime({ hour: 14, minute: 30 })
    expectTypeOf(result).toEqualTypeOf<TimeValue>()
  })

  it('parseTimeInput returns number | null', () => {
    const result = parseTimeInput('14', 'hour', '24')
    expectTypeOf(result).toEqualTypeOf<number | null>()
  })
})

// ---------------------------------------------------------------------------
// UseTimePickerReturn type
// ---------------------------------------------------------------------------
describe('UseTimePickerReturn type', () => {
  it('state has correct shape', () => {
    type Return = UseTimePickerReturn
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<TimeValue>()
    expectTypeOf<Return['state']['focusedField']>().toEqualTypeOf<TimeField>()
    expectTypeOf<Return['state']['hourCycle']>().toEqualTypeOf<HourCycle>()
    expectTypeOf<Return['state']['displayHour']>().toEqualTypeOf<number>()
    expectTypeOf<Return['state']['displayAmPm']>().toEqualTypeOf<'AM' | 'PM'>()
  })

  it('getFieldProps returns TimeFieldProps', () => {
    type Return = UseTimePickerReturn
    expectTypeOf<Return['getFieldProps']>().returns.toEqualTypeOf<TimeFieldProps>()
  })

  it('TimeFieldProps has spinbutton role', () => {
    expectTypeOf<TimeFieldProps['role']>().toEqualTypeOf<'spinbutton'>()
  })
})

// ---------------------------------------------------------------------------
// UseDateTimeReturn type
// ---------------------------------------------------------------------------
describe('UseDateTimeReturn type', () => {
  it('has calendar and timePicker sub-returns', () => {
    type Return = UseDateTimeReturn<Date>
    expectTypeOf<Return['calendar']>().toMatchTypeOf<UseCalendarReturn<Date, 'single'>>()
    expectTypeOf<Return['timePicker']>().toMatchTypeOf<UseTimePickerReturn>()
  })

  it('state.value is TDate | null', () => {
    type Return = UseDateTimeReturn<Date>
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<Date | null>()
  })

  it('actions.setValue accepts TDate', () => {
    type Return = UseDateTimeReturn<Date>
    expectTypeOf<Return['actions']['setValue']>().parameter(0).toEqualTypeOf<Date>()
  })
})

// ---------------------------------------------------------------------------
// CalendarDay type
// ---------------------------------------------------------------------------
describe('CalendarDay type', () => {
  it('date is generic TDate', () => {
    expectTypeOf<CalendarDay<Date>['date']>().toEqualTypeOf<Date>()
  })

  it('boolean flags are boolean', () => {
    expectTypeOf<CalendarDay<Date>['isToday']>().toEqualTypeOf<boolean>()
    expectTypeOf<CalendarDay<Date>['isSelected']>().toEqualTypeOf<boolean>()
    expectTypeOf<CalendarDay<Date>['isDisabled']>().toEqualTypeOf<boolean>()
    expectTypeOf<CalendarDay<Date>['isOutside']>().toEqualTypeOf<boolean>()
    expectTypeOf<CalendarDay<Date>['isWeekend']>().toEqualTypeOf<boolean>()
    expectTypeOf<CalendarDay<Date>['isRangeStart']>().toEqualTypeOf<boolean>()
    expectTypeOf<CalendarDay<Date>['isRangeEnd']>().toEqualTypeOf<boolean>()
    expectTypeOf<CalendarDay<Date>['isRangeMiddle']>().toEqualTypeOf<boolean>()
    expectTypeOf<CalendarDay<Date>['isHidden']>().toEqualTypeOf<boolean>()
  })
})
