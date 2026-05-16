import { describe, expectTypeOf, it } from 'vitest'
import type { IDateAdapter, WeekStartDay } from '../adapter'
import { NativeAdapter } from '../adapter'
import type { Grid } from '../grid'
import { buildCalendarMonth, buildMultiMonth } from '../grid'
import type { Calendar } from '../index.types'
import type { Navigation } from '../navigation'
import { canNavigate, navigate } from '../navigation'
import type { UseCalendar } from '../react/use-calendar/use-calendar.types'
import type { UseDateTime } from '../react/use-datetime/use-datetime.types'
import type { UseTimePicker } from '../react/use-time-picker/use-time-picker.types'
import type { Selection } from '../selection'
import { applySelection, selectDay } from '../selection'
import type { Time } from '../time'
import { clampTime, incrementField, parseTimeInput } from '../time'

describe('Selection.CalendarValue conditional type', () => {
  it('resolves to TDate | null for single mode', () => {
    expectTypeOf<Selection.CalendarValue<Date, 'single'>>().toEqualTypeOf<Date | null>()
  })

  it('resolves to Selection.DateRange<TDate> | null for range mode', () => {
    expectTypeOf<Selection.CalendarValue<Date, 'range'>>().toEqualTypeOf<Selection.DateRange<Date> | null>()
  })

  it('resolves to TDate[] for multi mode', () => {
    expectTypeOf<Selection.CalendarValue<Date, 'multi'>>().toEqualTypeOf<Date[]>()
  })

  it('resolves to Selection.DateRange<TDate>[] for multi-range mode', () => {
    expectTypeOf<Selection.CalendarValue<Date, 'multi-range'>>().toEqualTypeOf<Selection.DateRange<Date>[]>()
  })

  it('works with custom TDate types', () => {
    type CustomDate = { _brand: 'custom'; value: number }
    expectTypeOf<Selection.CalendarValue<CustomDate, 'single'>>().toEqualTypeOf<CustomDate | null>()
    expectTypeOf<Selection.CalendarValue<CustomDate, 'range'>>().toEqualTypeOf<Selection.DateRange<CustomDate> | null>()
    expectTypeOf<Selection.CalendarValue<CustomDate, 'multi'>>().toEqualTypeOf<CustomDate[]>()
    expectTypeOf<Selection.CalendarValue<CustomDate, 'multi-range'>>().toEqualTypeOf<
      Selection.DateRange<CustomDate>[]
    >()
  })

  it('resolves to never for invalid mode', () => {
    // @ts-expect-error - 'invalid' is not a valid Selection.SelectionMode
    type _Invalid = Selection.CalendarValue<Date, 'invalid'>
  })
})

describe('Selection.DateRange type', () => {
  it('has from (required) and to (nullable)', () => {
    expectTypeOf<Selection.DateRange<Date>>().toHaveProperty('from')
    expectTypeOf<Selection.DateRange<Date>>().toHaveProperty('to')
    expectTypeOf<Selection.DateRange<Date>['from']>().toEqualTypeOf<Date>()
    expectTypeOf<Selection.DateRange<Date>['to']>().toEqualTypeOf<Date | null>()
  })
})

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

describe('CalendarConfig type', () => {
  it('selected type matches mode', () => {
    type SingleConfig = Calendar.ICalendarConfig<Date, 'single'>
    type RangeConfig = Calendar.ICalendarConfig<Date, 'range'>
    type MultiConfig = Calendar.ICalendarConfig<Date, 'multi'>

    expectTypeOf<SingleConfig['selected']>().toEqualTypeOf<Date | null | undefined>()
    expectTypeOf<RangeConfig['selected']>().toEqualTypeOf<Selection.DateRange<Date> | null | undefined>()
    expectTypeOf<MultiConfig['selected']>().toEqualTypeOf<Date[] | undefined>()
  })

  it('onSelect callback parameter matches mode', () => {
    type SingleConfig = Calendar.ICalendarConfig<Date, 'single'>
    type RangeConfig = Calendar.ICalendarConfig<Date, 'range'>

    // onSelect for single should accept (Date | null) => void
    type SingleOnSelect = NonNullable<SingleConfig['onSelect']>
    expectTypeOf<SingleOnSelect>().parameter(0).toEqualTypeOf<Date | null>()

    type RangeOnSelect = NonNullable<RangeConfig['onSelect']>
    expectTypeOf<RangeOnSelect>().parameter(0).toEqualTypeOf<Selection.DateRange<Date> | null>()
  })

  it('disabled accepts array or predicate', () => {
    type Config = Calendar.ICalendarConfig<Date, 'single'>
    expectTypeOf<Config['disabled']>().toEqualTypeOf<Date[] | ((date: Date) => boolean) | undefined>()
  })

  it('fromDate and toDate are optional TDate', () => {
    type Config = Calendar.ICalendarConfig<Date, 'single'>
    expectTypeOf<Config['fromDate']>().toEqualTypeOf<Date | undefined>()
    expectTypeOf<Config['toDate']>().toEqualTypeOf<Date | undefined>()
  })
})

describe('UseCalendarReturn type', () => {
  it('state.value type matches mode', () => {
    type SingleReturn = UseCalendar.IUseCalendarReturn<Date, 'single'>
    type RangeReturn = UseCalendar.IUseCalendarReturn<Date, 'range'>
    type MultiReturn = UseCalendar.IUseCalendarReturn<Date, 'multi'>

    expectTypeOf<SingleReturn['state']['value']>().toEqualTypeOf<Date | null>()
    expectTypeOf<RangeReturn['state']['value']>().toEqualTypeOf<Selection.DateRange<Date> | null>()
    expectTypeOf<MultiReturn['state']['value']>().toEqualTypeOf<Date[]>()
  })

  it('state has correct shape', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['state']['month']>().toEqualTypeOf<Date>()
    expectTypeOf<Return['state']['focusedDate']>().toEqualTypeOf<Date>()
    expectTypeOf<Return['state']['viewMode']>().toEqualTypeOf<Calendar.ViewMode>()
    expectTypeOf<Return['state']['weeks']>().toEqualTypeOf<Grid.ICalendarWeek<Date>[]>()
    expectTypeOf<Return['state']['months']>().toEqualTypeOf<Grid.ICalendarMonth<Date>[]>()
    expectTypeOf<Return['state']['weekdays']>().toEqualTypeOf<string[]>()
    expectTypeOf<Return['state']['canGoNext']>().toEqualTypeOf<boolean>()
    expectTypeOf<Return['state']['canGoPrevious']>().toEqualTypeOf<boolean>()
  })

  it('actions have correct signatures', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['setMonth']>().toBeFunction()
    expectTypeOf<Return['actions']['setViewMode']>().toBeFunction()
    expectTypeOf<Return['actions']['goToNext']>().toBeFunction()
    expectTypeOf<Return['actions']['goToPrevious']>().toBeFunction()
    expectTypeOf<Return['actions']['selectDate']>().toBeFunction()
    expectTypeOf<Return['actions']['focusDate']>().toBeFunction()
  })

  it('prop getters return correct types', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['getDayProps']>().returns.toEqualTypeOf<UseCalendar.IDayProps>()
    expectTypeOf<Return['getGridProps']>().returns.toEqualTypeOf<UseCalendar.IGridProps>()
    expectTypeOf<Return['getNavProps']>().returns.toEqualTypeOf<UseCalendar.INavProps>()
    expectTypeOf<Return['getHeaderProps']>().returns.toEqualTypeOf<UseCalendar.IHeaderProps>()
  })

  it('getDayProps accepts CalendarDay<TDate>', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['getDayProps']>().parameter(0).toEqualTypeOf<Grid.ICalendarDay<Date>>()
  })
})

describe('DayProps type', () => {
  it('has correct ARIA attributes', () => {
    expectTypeOf<UseCalendar.IDayProps['role']>().toEqualTypeOf<'gridcell'>()
    expectTypeOf<UseCalendar.IDayProps['aria-label']>().toEqualTypeOf<string>()
    expectTypeOf<UseCalendar.IDayProps['aria-selected']>().toEqualTypeOf<boolean>()
    expectTypeOf<UseCalendar.IDayProps['aria-disabled']>().toEqualTypeOf<boolean>()
    expectTypeOf<UseCalendar.IDayProps['aria-current']>().toEqualTypeOf<'date' | undefined>()
    expectTypeOf<UseCalendar.IDayProps['tabIndex']>().toEqualTypeOf<0 | -1>()
  })

  it('has data attributes with correct types', () => {
    expectTypeOf<UseCalendar.IDayProps['data-calendar-day']>().toEqualTypeOf<''>()
    expectTypeOf<UseCalendar.IDayProps['data-selected']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<UseCalendar.IDayProps['data-disabled']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<UseCalendar.IDayProps['data-today']>().toEqualTypeOf<'true' | undefined>()
    expectTypeOf<UseCalendar.IDayProps['data-focused']>().toEqualTypeOf<'true' | undefined>()
  })

  it('has event handlers', () => {
    expectTypeOf<UseCalendar.IDayProps['onClick']>().toBeFunction()
    expectTypeOf<UseCalendar.IDayProps['onMouseEnter']>().toBeFunction()
    expectTypeOf<UseCalendar.IDayProps['onKeyDown']>().toBeFunction()
  })
})

describe('GridProps type', () => {
  it('has correct ARIA attributes', () => {
    expectTypeOf<UseCalendar.IGridProps['role']>().toEqualTypeOf<'grid'>()
    expectTypeOf<UseCalendar.IGridProps['aria-labelledby']>().toEqualTypeOf<string>()
    expectTypeOf<UseCalendar.IGridProps['aria-roledescription']>().toEqualTypeOf<string>()
  })
})

describe('TimeValue type', () => {
  it('has hour and minute required, second optional', () => {
    expectTypeOf<Time.ITimeValue['hour']>().toEqualTypeOf<number>()
    expectTypeOf<Time.ITimeValue['minute']>().toEqualTypeOf<number>()
    expectTypeOf<Time.ITimeValue['second']>().toEqualTypeOf<number | undefined>()
  })
})

describe('Time.TimeField type', () => {
  it('is a union of field names', () => {
    expectTypeOf<'hour'>().toMatchTypeOf<Time.TimeField>()
    expectTypeOf<'minute'>().toMatchTypeOf<Time.TimeField>()
    expectTypeOf<'second'>().toMatchTypeOf<Time.TimeField>()
    expectTypeOf<'ampm'>().toMatchTypeOf<Time.TimeField>()
  })
})

describe('Time.HourCycle type', () => {
  it('is 12 or 24', () => {
    expectTypeOf<'12'>().toMatchTypeOf<Time.HourCycle>()
    expectTypeOf<'24'>().toMatchTypeOf<Time.HourCycle>()
  })
})

describe('Pure function return types', () => {
  it('selectDay returns Selection.CalendarValue matching mode', () => {
    const adapter = new NativeAdapter()
    const result = selectDay(adapter, 'single', null, new Date())
    expectTypeOf(result).toEqualTypeOf<Date | null>()
  })

  it('buildCalendarMonth returns CalendarMonth<TDate>', () => {
    const adapter = new NativeAdapter()
    const result = buildCalendarMonth(adapter, new Date(), { showOutsideDays: true, fixedWeeks: false })
    expectTypeOf(result).toEqualTypeOf<Grid.ICalendarMonth<Date>>()
  })

  it('buildMultiMonth returns CalendarMonth<TDate>[]', () => {
    const adapter = new NativeAdapter()
    const result = buildMultiMonth(adapter, new Date(), 2, { showOutsideDays: true, fixedWeeks: false })
    expectTypeOf(result).toEqualTypeOf<Grid.ICalendarMonth<Date>[]>()
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
    expectTypeOf(result).toEqualTypeOf<Time.ITimeValue>()
  })

  it('parseTimeInput returns number | null', () => {
    const result = parseTimeInput('14', 'hour', '24')
    expectTypeOf(result).toEqualTypeOf<number | null>()
  })
})

describe('UseTimePickerReturn type', () => {
  it('state has correct shape', () => {
    type Return = UseTimePicker.IUseTimePickerReturn
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<Time.ITimeValue>()
    expectTypeOf<Return['state']['focusedField']>().toEqualTypeOf<Time.TimeField>()
    expectTypeOf<Return['state']['hourCycle']>().toEqualTypeOf<Time.HourCycle>()
    expectTypeOf<Return['state']['displayHour']>().toEqualTypeOf<number>()
    expectTypeOf<Return['state']['displayAmPm']>().toEqualTypeOf<'AM' | 'PM'>()
  })

  it('getFieldProps returns TimeFieldProps', () => {
    type Return = UseTimePicker.IUseTimePickerReturn
    expectTypeOf<Return['getFieldProps']>().returns.toEqualTypeOf<UseTimePicker.ITimeFieldProps>()
  })

  it('TimeFieldProps has spinbutton role', () => {
    expectTypeOf<UseTimePicker.ITimeFieldProps['role']>().toEqualTypeOf<'spinbutton'>()
  })
})

describe('UseDateTimeReturn type', () => {
  it('has calendar and timePicker sub-returns', () => {
    type Return = UseDateTime.IUseDateTimeReturn<Date>
    expectTypeOf<Return['calendar']>().toMatchTypeOf<UseCalendar.IUseCalendarReturn<Date, 'single'>>()
    expectTypeOf<Return['timePicker']>().toMatchTypeOf<UseTimePicker.IUseTimePickerReturn>()
  })

  it('state.value is TDate | null', () => {
    type Return = UseDateTime.IUseDateTimeReturn<Date>
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<Date | null>()
  })

  it('actions.setValue accepts TDate', () => {
    type Return = UseDateTime.IUseDateTimeReturn<Date>
    expectTypeOf<Return['actions']['setValue']>().parameter(0).toEqualTypeOf<Date>()
  })
})

describe('CalendarDay type', () => {
  it('date is generic TDate', () => {
    expectTypeOf<Grid.ICalendarDay<Date>['date']>().toEqualTypeOf<Date>()
  })

  it('boolean flags are boolean', () => {
    expectTypeOf<Grid.ICalendarDay<Date>['isToday']>().toEqualTypeOf<boolean>()
    expectTypeOf<Grid.ICalendarDay<Date>['isSelected']>().toEqualTypeOf<boolean>()
    expectTypeOf<Grid.ICalendarDay<Date>['isDisabled']>().toEqualTypeOf<boolean>()
    expectTypeOf<Grid.ICalendarDay<Date>['isOutside']>().toEqualTypeOf<boolean>()
    expectTypeOf<Grid.ICalendarDay<Date>['isWeekend']>().toEqualTypeOf<boolean>()
    expectTypeOf<Grid.ICalendarDay<Date>['isRangeStart']>().toEqualTypeOf<boolean>()
    expectTypeOf<Grid.ICalendarDay<Date>['isRangeEnd']>().toEqualTypeOf<boolean>()
    expectTypeOf<Grid.ICalendarDay<Date>['isRangeMiddle']>().toEqualTypeOf<boolean>()
    expectTypeOf<Grid.ICalendarDay<Date>['isHidden']>().toEqualTypeOf<boolean>()
  })

  it('preserves generic TDate through CalendarWeek and CalendarMonth', () => {
    type CustomDate = { _brand: 'custom'; value: number }
    expectTypeOf<Grid.ICalendarDay<CustomDate>['date']>().toEqualTypeOf<CustomDate>()
    expectTypeOf<Grid.ICalendarWeek<CustomDate>['days']>().toEqualTypeOf<Grid.ICalendarDay<CustomDate>[]>()
    expectTypeOf<Grid.ICalendarMonth<CustomDate>['month']>().toEqualTypeOf<CustomDate>()
    expectTypeOf<Grid.ICalendarMonth<CustomDate>['weeks']>().toEqualTypeOf<Grid.ICalendarWeek<CustomDate>[]>()
  })
})

describe('Mode-narrowed callback types', () => {
  it('onSelect for single mode accepts Date | null', () => {
    type SingleConfig = Calendar.ICalendarConfig<Date, 'single'>
    type OnSelect = NonNullable<SingleConfig['onSelect']>
    expectTypeOf<OnSelect>().parameter(0).toEqualTypeOf<Date | null>()
    expectTypeOf<OnSelect>().returns.toEqualTypeOf<void>()
  })

  it('onSelect for range mode accepts Selection.DateRange<Date> | null', () => {
    type RangeConfig = Calendar.ICalendarConfig<Date, 'range'>
    type OnSelect = NonNullable<RangeConfig['onSelect']>
    expectTypeOf<OnSelect>().parameter(0).toEqualTypeOf<Selection.DateRange<Date> | null>()
    expectTypeOf<OnSelect>().returns.toEqualTypeOf<void>()
  })

  it('onSelect for multi mode accepts Date[]', () => {
    type MultiConfig = Calendar.ICalendarConfig<Date, 'multi'>
    type OnSelect = NonNullable<MultiConfig['onSelect']>
    expectTypeOf<OnSelect>().parameter(0).toEqualTypeOf<Date[]>()
    expectTypeOf<OnSelect>().returns.toEqualTypeOf<void>()
  })

  it('onSelect for multi-range mode accepts Selection.DateRange<Date>[]', () => {
    type MultiRangeConfig = Calendar.ICalendarConfig<Date, 'multi-range'>
    type OnSelect = NonNullable<MultiRangeConfig['onSelect']>
    expectTypeOf<OnSelect>().parameter(0).toEqualTypeOf<Selection.DateRange<Date>[]>()
    expectTypeOf<OnSelect>().returns.toEqualTypeOf<void>()
  })

  it('selectDay return type narrows per mode', () => {
    const adapter = new NativeAdapter()
    const singleResult = selectDay(adapter, 'single', null, new Date())
    expectTypeOf(singleResult).toEqualTypeOf<Date | null>()

    const rangeResult = selectDay(adapter, 'range', null, new Date())
    expectTypeOf(rangeResult).toEqualTypeOf<Selection.DateRange<Date> | null>()

    const multiResult = selectDay(adapter, 'multi', [], new Date())
    expectTypeOf(multiResult).toEqualTypeOf<Date[]>()

    const multiRangeResult = selectDay(adapter, 'multi-range', [], new Date())
    expectTypeOf(multiRangeResult).toEqualTypeOf<Selection.DateRange<Date>[]>()
  })

  it('onMonthChange receives TDate', () => {
    type Config = Calendar.ICalendarConfig<Date, 'single'>
    type OnMonthChange = NonNullable<Config['onMonthChange']>
    expectTypeOf<OnMonthChange>().parameter(0).toEqualTypeOf<Date>()
    expectTypeOf<OnMonthChange>().returns.toEqualTypeOf<void>()
  })
})

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

describe('UseCalendarReturn exhaustive type assertions', () => {
  it('actions.selectDate accepts TDate and optional options', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['selectDate']>().parameter(0).toEqualTypeOf<Date>()
  })

  it('actions.setMonth accepts TDate', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['setMonth']>().parameter(0).toEqualTypeOf<Date>()
  })

  it('actions.setViewMode accepts Calendar.ViewMode', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['setViewMode']>().parameter(0).toEqualTypeOf<Calendar.ViewMode>()
  })

  it('actions.focusDate accepts TDate', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['actions']['focusDate']>().parameter(0).toEqualTypeOf<Date>()
  })

  it('getNavProps accepts direction parameter', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'single'>
    expectTypeOf<Return['getNavProps']>().parameter(0).toEqualTypeOf<'prev' | 'next'>()
  })

  it('getNavProps returns NavProps with correct shape', () => {
    expectTypeOf<UseCalendar.INavProps['aria-label']>().toEqualTypeOf<string>()
    expectTypeOf<UseCalendar.INavProps['disabled']>().toEqualTypeOf<boolean>()
    expectTypeOf<UseCalendar.INavProps['onClick']>().toBeFunction()
  })

  it('getHeaderProps returns HeaderProps with correct shape', () => {
    expectTypeOf<UseCalendar.IHeaderProps['id']>().toEqualTypeOf<string>()
    expectTypeOf<UseCalendar.IHeaderProps['aria-live']>().toEqualTypeOf<'polite'>()
  })

  it('multi-range mode has correct state.value type', () => {
    type Return = UseCalendar.IUseCalendarReturn<Date, 'multi-range'>
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<Selection.DateRange<Date>[]>()
  })

  it('return type preserves custom TDate through all fields', () => {
    type CustomDate = { _brand: 'dayjs' }
    type Return = UseCalendar.IUseCalendarReturn<CustomDate, 'single'>
    expectTypeOf<Return['state']['month']>().toEqualTypeOf<CustomDate>()
    expectTypeOf<Return['state']['focusedDate']>().toEqualTypeOf<CustomDate>()
    expectTypeOf<Return['state']['value']>().toEqualTypeOf<CustomDate | null>()
    expectTypeOf<Return['state']['weeks']>().toEqualTypeOf<Grid.ICalendarWeek<CustomDate>[]>()
    expectTypeOf<Return['state']['months']>().toEqualTypeOf<Grid.ICalendarMonth<CustomDate>[]>()
    expectTypeOf<Return['getDayProps']>().parameter(0).toEqualTypeOf<Grid.ICalendarDay<CustomDate>>()
  })
})

describe('UseTimePickerReturn exhaustive type assertions', () => {
  it('actions.setValue accepts TimeValue', () => {
    type Return = UseTimePicker.IUseTimePickerReturn
    expectTypeOf<Return['actions']['setValue']>().parameter(0).toEqualTypeOf<Time.ITimeValue>()
  })

  it('actions.setField accepts Time.TimeField and number', () => {
    type Return = UseTimePicker.IUseTimePickerReturn
    expectTypeOf<Return['actions']['setField']>().parameter(0).toEqualTypeOf<Time.TimeField>()
    expectTypeOf<Return['actions']['setField']>().parameter(1).toEqualTypeOf<number>()
  })

  it('actions.increment and decrement accept Time.TimeField', () => {
    type Return = UseTimePicker.IUseTimePickerReturn
    expectTypeOf<Return['actions']['increment']>().parameter(0).toEqualTypeOf<Time.TimeField>()
    expectTypeOf<Return['actions']['decrement']>().parameter(0).toEqualTypeOf<Time.TimeField>()
  })

  it('actions.toggleAmPm returns void', () => {
    type Return = UseTimePicker.IUseTimePickerReturn
    expectTypeOf<Return['actions']['toggleAmPm']>().returns.toEqualTypeOf<void>()
  })

  it('actions.focusField accepts Time.TimeField', () => {
    type Return = UseTimePicker.IUseTimePickerReturn
    expectTypeOf<Return['actions']['focusField']>().parameter(0).toEqualTypeOf<Time.TimeField>()
  })

  it('getFieldProps accepts Time.TimeField parameter', () => {
    type Return = UseTimePicker.IUseTimePickerReturn
    expectTypeOf<Return['getFieldProps']>().parameter(0).toEqualTypeOf<Time.TimeField>()
  })

  it('TimeFieldProps has correct ARIA spinbutton attributes', () => {
    expectTypeOf<UseTimePicker.ITimeFieldProps['aria-label']>().toEqualTypeOf<string>()
    expectTypeOf<UseTimePicker.ITimeFieldProps['aria-valuemin']>().toEqualTypeOf<number>()
    expectTypeOf<UseTimePicker.ITimeFieldProps['aria-valuemax']>().toEqualTypeOf<number>()
    expectTypeOf<UseTimePicker.ITimeFieldProps['aria-valuenow']>().toEqualTypeOf<number>()
    expectTypeOf<UseTimePicker.ITimeFieldProps['aria-valuetext']>().toEqualTypeOf<string>()
    expectTypeOf<UseTimePicker.ITimeFieldProps['tabIndex']>().toEqualTypeOf<0 | -1>()
    expectTypeOf<UseTimePicker.ITimeFieldProps['data-focused']>().toEqualTypeOf<'true' | undefined>()
  })
})

describe('Invalid mode type errors', () => {
  it('CalendarConfig rejects invalid mode', () => {
    // @ts-expect-error - 'weekly' is not a valid Selection.SelectionMode
    type _InvalidConfig = Calendar.ICalendarConfig<Date, 'weekly'>
  })

  it('selectDay rejects invalid mode at the type level', () => {
    const adapter = new NativeAdapter()
    // @ts-expect-error - 'toggle' is not a valid Selection.SelectionMode
    selectDay(adapter, 'toggle', null, new Date())
  })

  it('Selection.CalendarValue resolves to never for unsupported mode', () => {
    // @ts-expect-error - 'week' is not a valid Selection.SelectionMode
    type _WeekValue = Selection.CalendarValue<Date, 'week'>
  })

  it('UseCalendarReturn rejects invalid mode', () => {
    // @ts-expect-error - 'custom' is not a valid Selection.SelectionMode
    type _InvalidReturn = UseCalendar.IUseCalendarReturn<Date, 'custom'>
  })
})

describe('Navigation types', () => {
  it('Navigation.Direction is prev | next', () => {
    expectTypeOf<'prev'>().toMatchTypeOf<Navigation.Direction>()
    expectTypeOf<'next'>().toMatchTypeOf<Navigation.Direction>()
  })

  it('Navigation.Unit is month | year | decade', () => {
    expectTypeOf<'month'>().toMatchTypeOf<Navigation.Unit>()
    expectTypeOf<'year'>().toMatchTypeOf<Navigation.Unit>()
    expectTypeOf<'decade'>().toMatchTypeOf<Navigation.Unit>()
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

describe('SelectionConstraints type', () => {
  it('all fields are optional', () => {
    expectTypeOf<Selection.ISelectionConstraints<Date>>().toMatchTypeOf<{}>()
  })

  it('disabled accepts array or predicate', () => {
    expectTypeOf<Selection.ISelectionConstraints<Date>['disabled']>().toEqualTypeOf<
      Date[] | ((date: Date) => boolean) | undefined
    >()
  })

  it('fromDate and toDate are optional TDate', () => {
    expectTypeOf<Selection.ISelectionConstraints<Date>['fromDate']>().toEqualTypeOf<Date | undefined>()
    expectTypeOf<Selection.ISelectionConstraints<Date>['toDate']>().toEqualTypeOf<Date | undefined>()
  })

  it('preserves generic TDate', () => {
    type CustomDate = { _brand: 'custom' }
    expectTypeOf<Selection.ISelectionConstraints<CustomDate>['fromDate']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Selection.ISelectionConstraints<CustomDate>['toDate']>().toEqualTypeOf<CustomDate | undefined>()
  })
})

describe('CalendarLocaleConfig type', () => {
  it('locale is optional string', () => {
    expectTypeOf<Calendar.ICalendarLocaleConfig['locale']>().toEqualTypeOf<string | undefined>()
  })

  it('weekStartDay is optional WeekStartDay', () => {
    expectTypeOf<Calendar.ICalendarLocaleConfig['weekStartDay']>().toEqualTypeOf<WeekStartDay | undefined>()
  })

  it('direction is optional ltr | rtl', () => {
    expectTypeOf<Calendar.ICalendarLocaleConfig['direction']>().toEqualTypeOf<'ltr' | 'rtl' | undefined>()
  })
})

describe('UseCalendarConfig type', () => {
  it('extends CalendarConfig with defaultSelected', () => {
    type Config = UseCalendar.IUseCalendarConfig<Date, 'single'>
    expectTypeOf<Config['defaultSelected']>().toEqualTypeOf<Date | null | undefined>()
  })

  it('inherits adapter field from CalendarConfig', () => {
    type Config = UseCalendar.IUseCalendarConfig<Date, 'range'>
    expectTypeOf<Config['adapter']>().toEqualTypeOf<IDateAdapter<Date>>()
  })

  it('inherits mode field from CalendarConfig', () => {
    type Config = UseCalendar.IUseCalendarConfig<Date, 'multi'>
    expectTypeOf<Config['mode']>().toEqualTypeOf<'multi'>()
  })
})

describe('TimePickerConfig type', () => {
  it('value and defaultValue are optional TimeValue', () => {
    expectTypeOf<Time.ITimePickerConfig['value']>().toEqualTypeOf<Time.ITimeValue | undefined>()
    expectTypeOf<Time.ITimePickerConfig['defaultValue']>().toEqualTypeOf<Time.ITimeValue | undefined>()
  })

  it('onChange receives TimeValue', () => {
    type OnChange = NonNullable<Time.ITimePickerConfig['onChange']>
    expectTypeOf<OnChange>().parameter(0).toEqualTypeOf<Time.ITimeValue>()
  })

  it('hourCycle is optional Time.HourCycle', () => {
    expectTypeOf<Time.ITimePickerConfig['hourCycle']>().toEqualTypeOf<Time.HourCycle | undefined>()
  })

  it('minTime and maxTime are optional TimeValue', () => {
    expectTypeOf<Time.ITimePickerConfig['minTime']>().toEqualTypeOf<Time.ITimeValue | undefined>()
    expectTypeOf<Time.ITimePickerConfig['maxTime']>().toEqualTypeOf<Time.ITimeValue | undefined>()
  })

  it('step options are optional numbers', () => {
    expectTypeOf<Time.ITimePickerConfig['minuteStep']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<Time.ITimePickerConfig['secondStep']>().toEqualTypeOf<number | undefined>()
  })
})

describe('UseDateTimeConfig type', () => {
  it('adapter is DateAdapter<TDate>', () => {
    type Config = UseDateTime.IUseDateTimeConfig<Date>
    expectTypeOf<Config['adapter']>().toEqualTypeOf<IDateAdapter<Date>>()
  })

  it('onChange receives TDate', () => {
    type Config = UseDateTime.IUseDateTimeConfig<Date>
    type OnChange = NonNullable<Config['onChange']>
    expectTypeOf<OnChange>().parameter(0).toEqualTypeOf<Date>()
  })

  it('preserves custom TDate through all fields', () => {
    type CustomDate = { _brand: 'temporal' }
    type Config = UseDateTime.IUseDateTimeConfig<CustomDate>
    expectTypeOf<Config['adapter']>().toEqualTypeOf<IDateAdapter<CustomDate>>()
    expectTypeOf<Config['value']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Config['defaultValue']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Config['month']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Config['fromDate']>().toEqualTypeOf<CustomDate | undefined>()
    expectTypeOf<Config['toDate']>().toEqualTypeOf<CustomDate | undefined>()
  })
})
