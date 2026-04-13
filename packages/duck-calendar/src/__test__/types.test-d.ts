import { describe, expectTypeOf, it } from 'vitest'
import type { IDateAdapter, WeekStartDay } from '../adapter'
import { NativeAdapter } from '../adapter'
import type { ICalendarDay, ICalendarMonth, ICalendarWeek } from '../grid'
import { buildCalendarMonth, buildMultiMonth } from '../grid'
import type { ICalendarConfig, ICalendarLocaleConfig, ViewMode } from '../index.types'
import type { NavigationDirection, NavigationUnit } from '../navigation'
import { canNavigate, navigate } from '../navigation'
import type {
  IDayProps,
  IGridProps,
  IHeaderProps,
  INavProps,
  IUseCalendarConfig,
  IUseCalendarReturn,
} from '../react/use-calendar/use-calendar.types'
import type { IUseDateTimeConfig, IUseDateTimeReturn } from '../react/use-datetime/use-datetime.types'
import type { ITimeFieldProps, IUseTimePickerReturn } from '../react/use-time-picker/use-time-picker.types'
import type { CalendarValue, DateRange, ISelectionConstraints, SelectionMode } from '../selection'
import { applySelection, selectDay } from '../selection'
import type { HourCycle, TimeField, ITimePickerConfig, ITimeValue } from '../time'
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
    expectTypeOf<NativeAdapter>().toMatchTypeOf<IDateAdapter<Date>>()
  })

  it('adapter methods accept and return the correct TDate', () => {
    type Adapter = IDateAdapter<Date>
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
    type Adapter = IDateAdapter<Date>
    expectTypeOf<Adapter['getHours']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getMinutes']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getSeconds']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getYear']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getMonth']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Adapter['getDate']>().returns.toEqualTypeOf<number>()
  })

  it('getDayOfWeek returns WeekStartDay', () => {
    type Adapter = IDateAdapter<Date>
    expectTypeOf<Adapter['getDayOfWeek']>().returns.toEqualTypeOf<WeekStartDay>()
  })

  it('format returns string', () => {
    type Adapter = IDateAdapter<Date>
    expectTypeOf<Adapter['format']>().returns.toEqualTypeOf<string>()
  })

  it('boolean methods return boolean', () => {
    type Adapter = IDateAdapter<Date>
    expectTypeOf<Adapter['isSameDay']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Adapter['isSameMonth']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Adapter['isBefore']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Adapter['isAfter']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Adapter['isValid']>().returns.toEqualTypeOf<boolean>()
  })

  it('works with a custom date type', () => {
    type DayjsDate = { _brand: 'dayjs' }
    type DayjsAdapter = IDateAdapter<DayjsDate>
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
    type SingleConfig = ICalendarConfig<Date, 'single'>
    type RangeConfig = ICalendarConfig<Date, 'range'>
    type MultiConfig = ICalendarConfig<Date, 'multi'>

    expectTypeOf<SingleConfig['selected']>().toEqualTypeOf<Date | null | undefined>()
    expectTypeOf<RangeConfig['selected']>().toEqualTypeOf<DateRange<Date> | null | undefined>()
    expectTypeOf<MultiConfig['selected']>().toEqualTypeOf<Date[] | undefined>()
  })

  it('onSelect callback parameter matches mode', () => {
    type SingleConfig = ICalendarConfig<Date, 'single'>
    type RangeConfig = ICalendarConfig<Date, 'range'>

    // onSelect for single should accept (Date | null) => void
    type SingleOnSelect = NonNullable<SingleConfig['onSelect']>
    expectTypeOf<SingleOnSelect>().parameter(0).toEqualTypeOf<Date | null>()

    type RangeOnSelect = NonNullable<RangeConfig['onSelect']>
    expectTypeOf<RangeOnSelect>().parameter(0).toEqualTypeOf<DateRange<Date> | null>()
  })

  it('disabled accepts array or predicate', () => {
    type Config = ICalendarConfig<Date, 'single'>
    expectTypeOf<Config['disabled']>().toEqualTypeOf<Date[] | ((date: Date) => boolean) | undefined>()
  })

  it('fromDate and toDate are optional TDate', () => {
    type Config = ICalendarConfig<Date, 'single'>
    expectTypeOf<Config['fromDate']>().toEqualTypeOf<Date | undefined>()
    expectTypeOf<Config['toDate']>().toEqualTypeOf<Date | undefined>()
  })
})

// ---------------------------------------------------------------------------
// UseCalendarReturn type
// ---------------------------------------------------------------------------
describe('UseCalendarReturn type', () => {
  it('state.value type matches mode', () => {
    type SingleReturn = IUseCalendarReturn<Date, 'single'>
    type RangeReturn = IUseCalendarReturn<Date, 'range'>
    type MultiReturn = IUseCalendarReturn<Date, 'multi'>

    expectTypeOf<SingleReturn['state']['value']>().toEqualTypeOf<Date | null>()
    expectTypeOf<RangeReturn['state']['value']>().toEqualTypeOf<DateRange<Date> | null>()
    expectTypeOf<MultiReturn['state']['value']>().toEqualTypeOf<Date[]>()
  })

  it('state has correct shape', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['state']['month']>().toEqualTypeOf<Date>()
    expectTypeOf<Return['state']['focusedDate']>().toEqualTypeOf<Date>()
    expectTypeOf<Return['state']['viewMode']>().toEqualTypeOf<ViewMode>()
    expectTypeOf<Return['state']['weeks']>().toEqualTypeOf<ICalendarWeek<Date>[]>()
    expectTypeOf<Return['state']['months']>().toEqualTypeOf<ICalendarMonth<Date>[]>()
    expectTypeOf<Return['state']['weekdays']>().toEqualTypeOf<string[]>()
    expectTypeOf<Return['state']['canGoNext']>().toEqualTypeOf<boolean>()
    expectTypeOf<Return['state']['canGoPrevious']>().toEqualTypeOf<boolean>()
  })

  it('actions have correct signatures', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['setMonth']>().toBeFunction()
    expectTypeOf<Return['actions']['setViewMode']>().toBeFunction()
    expectTypeOf<Return['actions']['goToNext']>().toBeFunction()
    expectTypeOf<Return['actions']['goToPrevious']>().toBeFunction()
    expectTypeOf<Return['actions']['selectDate']>().toBeFunction()
    expectTypeOf<Return['actions']['focusDate']>().toBeFunction()
  })

  it('prop getters return correct types', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['getDayProps']>().returns.toEqualTypeOf<IDayProps>()
    expectTypeOf<Return['getGridProps']>().returns.toEqualTypeOf<IGridProps>()
    expectTypeOf<Return['getNavProps']>().returns.toEqualTypeOf<INavProps>()
    expectTypeOf<Return['getHeaderProps']>().returns.toEqualTypeOf<IHeaderProps>()
  })

  it('getDayProps accepts CalendarDay<TDate>', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['getDayProps']>().parameter(0).toEqualTypeOf<ICalendarDay<Date>>()
  })
})

// ---------------------------------------------------------------------------
// DayProps type
// ---------------------------------------------------------------------------
describe('DayProps type', () => {
  it('has correct ARIA attributes', () => {
    expectTypeOf<IDayProps['role']>().toEqualTypeOf<'gridcell'>()
    expectTypeOf<IDayProps['aria-label']>().toEqualTypeOf<string>()
    expectTypeOf<IDayProps['aria-selected']>().toEqualTypeOf<boolean>()
    expectTypeOf<IDayProps['aria-disabled']>().toEqualTypeOf<boolean>()
    expectTypeOf<IDayProps['aria-current']>().toEqualTypeOf<'date' | undefined>()
    expectTypeOf<IDayProps['tabIndex']>().toEqualTypeOf<0 | -1>()
  })

  it('has data attributes with correct types', () => {
    expectTypeOf<IDayProps['data-calendar-day']>().toEqualTypeOf<''>()
    expectTypeOf<IDayProps['data-selected']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<IDayProps['data-disabled']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<IDayProps['data-today']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<IDayProps['data-focused']>().toEqualTypeOf<'true' | undefined>()
  })

  it('has event handlers', () => {
    expectTypeOf<IDayProps['onClick']>().toBeFunction()
    expectTypeOf<IDayProps['onMouseEnter']>().toBeFunction()
    expectTypeOf<IDayProps['onKeyDown']>().toBeFunction()
  })
})

// ---------------------------------------------------------------------------
// GridProps type
// ---------------------------------------------------------------------------
describe('GridProps type', () => {
  it('has correct ARIA attributes', () => {
    expectTypeOf<IGridProps['role']>().toEqualTypeOf<'grid'>()
    expectTypeOf<IGridProps['aria-labelledby']>().toEqualTypeOf<string>()
    expectTypeOf<IGridProps['aria-roledescription']>().toEqualTypeOf<string>()
  })
})

// ---------------------------------------------------------------------------
// TimeValue type
// ---------------------------------------------------------------------------
describe('TimeValue type', () => {
  it('has hour and minute required, second optional', () => {
    expectTypeOf<ITimeValue['hour']>().toEqualTypeOf<number>()
    expectTypeOf<ITimeValue['minute']>().toEqualTypeOf<number>()
    expectTypeOf<ITimeValue['second']>().toEqualTypeOf<number | undefined>()
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
    expectTypeOf(result).toEqualTypeOf<ICalendarMonth<Date>>()
  })

  it('buildMultiMonth returns CalendarMonth<TDate>[]', () => {
    const adapter = new NativeAdapter()
    const result = buildMultiMonth(adapter, new Date(), 2, { showOutsideDays: true, fixedWeeks: false })
    expectTypeOf(result).toEqualTypeOf<ICalendarMonth<Date>[]>()
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
    expectTypeOf(result).toEqualTypeOf<ITimeValue>()
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
    type Return = IUseTimePickerReturn
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<ITimeValue>()
    expectTypeOf<Return['state']['focusedField']>().toEqualTypeOf<TimeField>()
    expectTypeOf<Return['state']['hourCycle']>().toEqualTypeOf<HourCycle>()
    expectTypeOf<Return['state']['displayHour']>().toEqualTypeOf<number>()
    expectTypeOf<Return['state']['displayAmPm']>().toEqualTypeOf<'AM' | 'PM'>()
  })

  it('getFieldProps returns TimeFieldProps', () => {
    type Return = IUseTimePickerReturn
    expectTypeOf<Return['getFieldProps']>().returns.toEqualTypeOf<ITimeFieldProps>()
  })

  it('TimeFieldProps has spinbutton role', () => {
    expectTypeOf<ITimeFieldProps['role']>().toEqualTypeOf<'spinbutton'>()
  })
})

// ---------------------------------------------------------------------------
// UseDateTimeReturn type
// ---------------------------------------------------------------------------
describe('UseDateTimeReturn type', () => {
  it('has calendar and timePicker sub-returns', () => {
    type Return = IUseDateTimeReturn<Date>
    expectTypeOf<Return['calendar']>().toMatchTypeOf<IUseCalendarReturn<Date, 'single'>>()
    expectTypeOf<Return['timePicker']>().toMatchTypeOf<IUseTimePickerReturn>()
  })

  it('state.value is TDate | null', () => {
    type Return = IUseDateTimeReturn<Date>
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<Date | null>()
  })

  it('actions.setValue accepts TDate', () => {
    type Return = IUseDateTimeReturn<Date>
    expectTypeOf<Return['actions']['setValue']>().parameter(0).toEqualTypeOf<Date>()
  })
})

// ---------------------------------------------------------------------------
// CalendarDay type
// ---------------------------------------------------------------------------
describe('CalendarDay type', () => {
  it('date is generic TDate', () => {
    expectTypeOf<ICalendarDay<Date>['date']>().toEqualTypeOf<Date>()
  })

  it('boolean flags are boolean', () => {
    expectTypeOf<ICalendarDay<Date>['isToday']>().toEqualTypeOf<boolean>()
    expectTypeOf<ICalendarDay<Date>['isSelected']>().toEqualTypeOf<boolean>()
    expectTypeOf<ICalendarDay<Date>['isDisabled']>().toEqualTypeOf<boolean>()
    expectTypeOf<ICalendarDay<Date>['isOutside']>().toEqualTypeOf<boolean>()
    expectTypeOf<ICalendarDay<Date>['isWeekend']>().toEqualTypeOf<boolean>()
    expectTypeOf<ICalendarDay<Date>['isRangeStart']>().toEqualTypeOf<boolean>()
    expectTypeOf<ICalendarDay<Date>['isRangeEnd']>().toEqualTypeOf<boolean>()
    expectTypeOf<ICalendarDay<Date>['isRangeMiddle']>().toEqualTypeOf<boolean>()
    expectTypeOf<ICalendarDay<Date>['isHidden']>().toEqualTypeOf<boolean>()
  })

  it('preserves generic TDate through CalendarWeek and CalendarMonth', () => {
    type CustomDate = { _brand: 'custom'; value: number }
    expectTypeOf<ICalendarDay<CustomDate>['date']>().toEqualTypeOf<CustomDate>()
    expectTypeOf<ICalendarWeek<CustomDate>['days']>().toEqualTypeOf<ICalendarDay<CustomDate>[]>()
    expectTypeOf<ICalendarMonth<CustomDate>['month']>().toEqualTypeOf<CustomDate>()
    expectTypeOf<ICalendarMonth<CustomDate>['weeks']>().toEqualTypeOf<ICalendarWeek<CustomDate>[]>()
  })
})

// ---------------------------------------------------------------------------
// Mode-narrowed callback types
// ---------------------------------------------------------------------------
describe('Mode-narrowed callback types', () => {
  it('onSelect for single mode accepts Date | null', () => {
    type SingleConfig = ICalendarConfig<Date, 'single'>
    type OnSelect = NonNullable<SingleConfig['onSelect']>
    expectTypeOf<OnSelect>().parameter(0).toEqualTypeOf<Date | null>()
    expectTypeOf<OnSelect>().returns.toEqualTypeOf<void>()
  })

  it('onSelect for range mode accepts DateRange<Date> | null', () => {
    type RangeConfig = ICalendarConfig<Date, 'range'>
    type OnSelect = NonNullable<RangeConfig['onSelect']>
    expectTypeOf<OnSelect>().parameter(0).toEqualTypeOf<DateRange<Date> | null>()
    expectTypeOf<OnSelect>().returns.toEqualTypeOf<void>()
  })

  it('onSelect for multi mode accepts Date[]', () => {
    type MultiConfig = ICalendarConfig<Date, 'multi'>
    type OnSelect = NonNullable<MultiConfig['onSelect']>
    expectTypeOf<OnSelect>().parameter(0).toEqualTypeOf<Date[]>()
    expectTypeOf<OnSelect>().returns.toEqualTypeOf<void>()
  })

  it('onSelect for multi-range mode accepts DateRange<Date>[]', () => {
    type MultiRangeConfig = ICalendarConfig<Date, 'multi-range'>
    type OnSelect = NonNullable<MultiRangeConfig['onSelect']>
    expectTypeOf<OnSelect>().parameter(0).toEqualTypeOf<DateRange<Date>[]>()
    expectTypeOf<OnSelect>().returns.toEqualTypeOf<void>()
  })

  it('selectDay return type narrows per mode', () => {
    const adapter = new NativeAdapter()
    const singleResult = selectDay(adapter, 'single', null, new Date())
    expectTypeOf(singleResult).toEqualTypeOf<Date | null>()

    const rangeResult = selectDay(adapter, 'range', null, new Date())
    expectTypeOf(rangeResult).toEqualTypeOf<DateRange<Date> | null>()

    const multiResult = selectDay(adapter, 'multi', [], new Date())
    expectTypeOf(multiResult).toEqualTypeOf<Date[]>()

    const multiRangeResult = selectDay(adapter, 'multi-range', [], new Date())
    expectTypeOf(multiRangeResult).toEqualTypeOf<DateRange<Date>[]>()
  })

  it('onMonthChange receives TDate', () => {
    type Config = ICalendarConfig<Date, 'single'>
    type OnMonthChange = NonNullable<Config['onMonthChange']>
    expectTypeOf<OnMonthChange>().parameter(0).toEqualTypeOf<Date>()
    expectTypeOf<OnMonthChange>().returns.toEqualTypeOf<void>()
  })
})

// ---------------------------------------------------------------------------
// Adapter generic constraints
// ---------------------------------------------------------------------------
describe('Adapter generic constraints', () => {
  it('DateAdapter methods are constrained to TDate', () => {
    type BrandedDate = { _brand: 'branded'; ts: number }
    type BA = IDateAdapter<BrandedDate>

    // Creation and manipulation return TDate
    expectTypeOf<BA['today']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['create']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['addDays']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['addMonths']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['addYears']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['startOfMonth']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['endOfMonth']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['startOfWeek']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['fromDate']>().returns.toEqualTypeOf<BrandedDate>()
    expectTypeOf<BA['setTime']>().returns.toEqualTypeOf<BrandedDate>()
  })

  it('toDate always returns native Date regardless of TDate', () => {
    type BrandedDate = { _brand: 'branded'; ts: number }
    type BA = IDateAdapter<BrandedDate>
    expectTypeOf<BA['toDate']>().returns.toEqualTypeOf<Date>()
  })

  it('fromDate always accepts native Date regardless of TDate', () => {
    type BrandedDate = { _brand: 'branded'; ts: number }
    type BA = IDateAdapter<BrandedDate>
    expectTypeOf<BA['fromDate']>().parameter(0).toEqualTypeOf<Date>()
  })

  it('NativeAdapter satisfies DateAdapter<Date> assignment', () => {
    const adapter: IDateAdapter<Date> = new NativeAdapter()
    expectTypeOf(adapter).toMatchTypeOf<IDateAdapter<Date>>()
  })

  it('getMonthsInYear is optional', () => {
    type Adapter = IDateAdapter<Date>
    expectTypeOf<Adapter['getMonthsInYear']>().toEqualTypeOf<((date: Date) => number) | undefined>()
  })
})

// ---------------------------------------------------------------------------
// UseCalendarReturn exhaustive type assertions
// ---------------------------------------------------------------------------
describe('UseCalendarReturn exhaustive type assertions', () => {
  it('actions.selectDate accepts TDate and optional options', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['selectDate']>().parameter(0).toEqualTypeOf<Date>()
  })

  it('actions.setMonth accepts TDate', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['setMonth']>().parameter(0).toEqualTypeOf<Date>()
  })

  it('actions.setViewMode accepts ViewMode', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['setViewMode']>().parameter(0).toEqualTypeOf<ViewMode>()
  })

  it('actions.focusDate accepts TDate', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['focusDate']>().parameter(0).toEqualTypeOf<Date>()
  })

  it('getNavProps accepts direction parameter', () => {
    type Return = IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['getNavProps']>().parameter(0).toEqualTypeOf<'prev' | 'next'>()
  })

  it('getNavProps returns NavProps with correct shape', () => {
    expectTypeOf<INavProps['aria-label']>().toEqualTypeOf<string>()
    expectTypeOf<INavProps['disabled']>().toEqualTypeOf<boolean>()
    expectTypeOf<INavProps['onClick']>().toBeFunction()
  })

  it('getHeaderProps returns HeaderProps with correct shape', () => {
    expectTypeOf<IHeaderProps['id']>().toEqualTypeOf<string>()
    expectTypeOf<IHeaderProps['aria-live']>().toEqualTypeOf<'polite'>()
  })

  it('multi-range mode has correct state.value type', () => {
    type Return = IUseCalendarReturn<Date, 'multi-range'>
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<DateRange<Date>[]>()
  })

  it('return type preserves custom TDate through all fields', () => {
    type CustomDate = { _brand: 'dayjs' }
    type Return = IUseCalendarReturn<CustomDate, 'single'>
    expectTypeOf<Return['state']['month']>().toEqualTypeOf<CustomDate>()
    expectTypeOf<Return['state']['focusedDate']>().toEqualTypeOf<CustomDate>()
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<CustomDate | null>()
    expectTypeOf<Return['state']['weeks']>().toEqualTypeOf<ICalendarWeek<CustomDate>[]>()
    expectTypeOf<Return['state']['months']>().toEqualTypeOf<ICalendarMonth<CustomDate>[]>()
    expectTypeOf<Return['getDayProps']>().parameter(0).toEqualTypeOf<ICalendarDay<CustomDate>>()
  })
})

// ---------------------------------------------------------------------------
// UseTimePickerReturn exhaustive type assertions
// ---------------------------------------------------------------------------
describe('UseTimePickerReturn exhaustive type assertions', () => {
  it('actions.setValue accepts TimeValue', () => {
    type Return = IUseTimePickerReturn
    expectTypeOf<Return['actions']['setValue']>().parameter(0).toEqualTypeOf<ITimeValue>()
  })

  it('actions.setField accepts TimeField and number', () => {
    type Return = IUseTimePickerReturn
    expectTypeOf<Return['actions']['setField']>().parameter(0).toEqualTypeOf<TimeField>()
    expectTypeOf<Return['actions']['setField']>().parameter(1).toEqualTypeOf<number>()
  })

  it('actions.increment and decrement accept TimeField', () => {
    type Return = IUseTimePickerReturn
    expectTypeOf<Return['actions']['increment']>().parameter(0).toEqualTypeOf<TimeField>()
    expectTypeOf<Return['actions']['decrement']>().parameter(0).toEqualTypeOf<TimeField>()
  })

  it('actions.toggleAmPm returns void', () => {
    type Return = IUseTimePickerReturn
    expectTypeOf<Return['actions']['toggleAmPm']>().returns.toEqualTypeOf<void>()
  })

  it('actions.focusField accepts TimeField', () => {
    type Return = IUseTimePickerReturn
    expectTypeOf<Return['actions']['focusField']>().parameter(0).toEqualTypeOf<TimeField>()
  })

  it('getFieldProps accepts TimeField parameter', () => {
    type Return = IUseTimePickerReturn
    expectTypeOf<Return['getFieldProps']>().parameter(0).toEqualTypeOf<TimeField>()
  })

  it('TimeFieldProps has correct ARIA spinbutton attributes', () => {
    expectTypeOf<ITimeFieldProps['aria-label']>().toEqualTypeOf<string>()
    expectTypeOf<ITimeFieldProps['aria-valuemin']>().toEqualTypeOf<number>()
    expectTypeOf<ITimeFieldProps['aria-valuemax']>().toEqualTypeOf<number>()
    expectTypeOf<ITimeFieldProps['aria-valuenow']>().toEqualTypeOf<number>()
    expectTypeOf<ITimeFieldProps['aria-valuetext']>().toEqualTypeOf<string>()
    expectTypeOf<ITimeFieldProps['tabIndex']>().toEqualTypeOf<0 | -1>()
    expectTypeOf<ITimeFieldProps['data-focused']>().toEqualTypeOf<'true' | undefined>()
  })
})

// ---------------------------------------------------------------------------
// Invalid mode type errors
// ---------------------------------------------------------------------------
describe('Invalid mode type errors', () => {
  it('CalendarConfig rejects invalid mode', () => {
    // @ts-expect-error - 'weekly' is not a valid SelectionMode
    type _InvalidConfig = ICalendarConfig<Date, 'weekly'>
  })

  it('selectDay rejects invalid mode at the type level', () => {
    const adapter = new NativeAdapter()
    // @ts-expect-error - 'toggle' is not a valid SelectionMode
    selectDay(adapter, 'toggle', null, new Date())
  })

  it('CalendarValue resolves to never for unsupported mode', () => {
    // @ts-expect-error - 'week' is not a valid SelectionMode
    type _WeekValue = CalendarValue<Date, 'week'>
  })

  it('UseCalendarReturn rejects invalid mode', () => {
    // @ts-expect-error - 'custom' is not a valid SelectionMode
    type _InvalidReturn = IUseCalendarReturn<Date, 'custom'>
  })
})

// ---------------------------------------------------------------------------
// Navigation types
// ---------------------------------------------------------------------------
describe('Navigation types', () => {
  it('NavigationDirection is prev | next', () => {
    expectTypeOf<'prev'>().toMatchTypeOf<NavigationDirection>()
    expectTypeOf<'next'>().toMatchTypeOf<NavigationDirection>()
  })

  it('NavigationUnit is month | year | decade', () => {
    expectTypeOf<'month'>().toMatchTypeOf<NavigationUnit>()
    expectTypeOf<'year'>().toMatchTypeOf<NavigationUnit>()
    expectTypeOf<'decade'>().toMatchTypeOf<NavigationUnit>()
  })

  it('navigate returns TDate matching the adapter', () => {
    type CustomDate = { _brand: 'custom' }
    type Result = ReturnType<typeof navigate<CustomDate>>
    expectTypeOf<Result>().toEqualTypeOf<CustomDate>()
  })

  it('canNavigate returns boolean', () => {
    type Result = ReturnType<typeof canNavigate<Date>>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
})

// ---------------------------------------------------------------------------
// SelectionConstraints type
// ---------------------------------------------------------------------------
describe('SelectionConstraints type', () => {
  it('all fields are optional', () => {
    expectTypeOf<ISelectionConstraints<Date>>().toMatchTypeOf<{}>()
  })

  it('disabled accepts array or predicate', () => {
    expectTypeOf<ISelectionConstraints<Date>['disabled']>().toEqualTypeOf<
      Date[] | ((date: Date) => boolean) | undefined
    >()
  })

  it('fromDate and toDate are optional TDate', () => {
    expectTypeOf<ISelectionConstraints<Date>['fromDate']>().toEqualTypeOf<Date | undefined>()
    expectTypeOf<ISelectionConstraints<Date>['toDate']>().toEqualTypeOf<Date | undefined>()
  })

  it('preserves generic TDate', () => {
    type CustomDate = { _brand: 'custom' }
    expectTypeOf<ISelectionConstraints<CustomDate>['fromDate']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<ISelectionConstraints<CustomDate>['toDate']>().toEqualTypeOf<CustomDate | undefined>()
  })
})

// ---------------------------------------------------------------------------
// CalendarLocaleConfig type
// ---------------------------------------------------------------------------
describe('CalendarLocaleConfig type', () => {
  it('locale is optional string', () => {
    expectTypeOf<ICalendarLocaleConfig['locale']>().toEqualTypeOf<string | undefined>()
  })

  it('weekStartDay is optional WeekStartDay', () => {
    expectTypeOf<ICalendarLocaleConfig['weekStartDay']>().toEqualTypeOf<WeekStartDay | undefined>()
  })

  it('direction is optional ltr | rtl', () => {
    expectTypeOf<ICalendarLocaleConfig['direction']>().toEqualTypeOf<'ltr' | 'rtl' | undefined>()
  })
})

// ---------------------------------------------------------------------------
// UseCalendarConfig extends CalendarConfig
// ---------------------------------------------------------------------------
describe('UseCalendarConfig type', () => {
  it('extends CalendarConfig with defaultSelected', () => {
    type Config = IUseCalendarConfig<Date, 'single'>
    expectTypeOf<Config['defaultSelected']>().toEqualTypeOf<Date | null | undefined>()
  })

  it('inherits adapter field from CalendarConfig', () => {
    type Config = IUseCalendarConfig<Date, 'range'>
    expectTypeOf<Config['adapter']>().toEqualTypeOf<IDateAdapter<Date>>()
  })

  it('inherits mode field from CalendarConfig', () => {
    type Config = IUseCalendarConfig<Date, 'multi'>
    expectTypeOf<Config['mode']>().toEqualTypeOf<'multi'>()
  })
})

// ---------------------------------------------------------------------------
// TimePickerConfig type
// ---------------------------------------------------------------------------
describe('TimePickerConfig type', () => {
  it('value and defaultValue are optional TimeValue', () => {
    expectTypeOf<ITimePickerConfig['value']>().toEqualTypeOf<ITimeValue | undefined>()
    expectTypeOf<ITimePickerConfig['defaultValue']>().toEqualTypeOf<ITimeValue | undefined>()
  })

  it('onChange receives TimeValue', () => {
    type OnChange = NonNullable<ITimePickerConfig['onChange']>
    expectTypeOf<OnChange>().parameter(0).toEqualTypeOf<ITimeValue>()
  })

  it('hourCycle is optional HourCycle', () => {
    expectTypeOf<ITimePickerConfig['hourCycle']>().toEqualTypeOf<HourCycle | undefined>()
  })

  it('minTime and maxTime are optional TimeValue', () => {
    expectTypeOf<ITimePickerConfig['minTime']>().toEqualTypeOf<ITimeValue | undefined>()
    expectTypeOf<ITimePickerConfig['maxTime']>().toEqualTypeOf<ITimeValue | undefined>()
  })

  it('step options are optional numbers', () => {
    expectTypeOf<ITimePickerConfig['minuteStep']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<ITimePickerConfig['secondStep']>().toEqualTypeOf<number | undefined>()
  })
})

// ---------------------------------------------------------------------------
// UseDateTimeConfig type
// ---------------------------------------------------------------------------
describe('UseDateTimeConfig type', () => {
  it('adapter is DateAdapter<TDate>', () => {
    type Config = IUseDateTimeConfig<Date>
    expectTypeOf<Config['adapter']>().toEqualTypeOf<IDateAdapter<Date>>()
  })

  it('onChange receives TDate', () => {
    type Config = IUseDateTimeConfig<Date>
    type OnChange = NonNullable<Config['onChange']>
    expectTypeOf<OnChange>().parameter(0).toEqualTypeOf<Date>()
  })

  it('preserves custom TDate through all fields', () => {
    type CustomDate = { _brand: 'temporal' }
    type Config = IUseDateTimeConfig<CustomDate>
    expectTypeOf<Config['adapter']>().toEqualTypeOf<IDateAdapter<CustomDate>>()
    expectTypeOf<Config['value']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Config['defaultValue']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Config['month']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Config['fromDate']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Config['toDate']>().toEqualTypeOf<CustomDate | undefined>()
  })
})
