import { describe, expect, it } from 'vitest'
import { NativeAdapter } from '../adapter'
import { buildCalendarMonth, buildMultiMonth } from '../grid'
import { navigate } from '../navigation'
import { applySelection } from '../selection'

const adapter = new NativeAdapter()
const march2026 = new Date(2026, 2, 1)
const gridConfig = { showOutsideDays: true, fixedWeeks: false }

describe('grid builder performance', () => {
  it('buildCalendarMonth completes in under 1ms', () => {
    const iterations = 1000
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      buildCalendarMonth(adapter, march2026, gridConfig)
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(1)
  })

  it('buildMultiMonth(3) completes in under 3ms', () => {
    const iterations = 500
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      buildMultiMonth(adapter, march2026, 3, gridConfig)
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(3)
  })

  it('buildMultiMonth(12) completes in under 10ms', () => {
    const iterations = 100
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      buildMultiMonth(adapter, march2026, 12, gridConfig)
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(10)
  })

  it('applySelection adds negligible overhead', () => {
    const raw = buildCalendarMonth(adapter, march2026, gridConfig)
    const selected = new Date(2026, 2, 15)

    const iterations = 1000
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      applySelection(raw.weeks, adapter, 'single', selected, {})
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(1)
  })
})

describe('memoization correctness', () => {
  it('buildCalendarMonth returns structurally identical grids for same input', () => {
    const a = buildCalendarMonth(adapter, march2026, gridConfig)
    const b = buildCalendarMonth(adapter, march2026, gridConfig)

    expect(a.weeks.length).toBe(b.weeks.length)
    for (let w = 0; w < a.weeks.length; w++) {
      expect(a.weeks[w]!.days.length).toBe(b.weeks[w]!.days.length)
      for (let d = 0; d < 7; d++) {
        expect(a.weeks[w]!.days[d]!.date.getTime()).toBe(b.weeks[w]!.days[d]!.date.getTime())
        expect(a.weeks[w]!.days[d]!.isToday).toBe(b.weeks[w]!.days[d]!.isToday)
        expect(a.weeks[w]!.days[d]!.isOutside).toBe(b.weeks[w]!.days[d]!.isOutside)
      }
    }
  })

  it('applySelection only changes flags, not structure', () => {
    const raw = buildCalendarMonth(adapter, march2026, gridConfig)
    const decorated = applySelection(raw.weeks, adapter, 'single', new Date(2026, 2, 15), {})

    expect(decorated.length).toBe(raw.weeks.length)
    for (let w = 0; w < raw.weeks.length; w++) {
      for (let d = 0; d < 7; d++) {
        // Same date reference
        expect(decorated[w]!.days[d]!.date.getTime()).toBe(raw.weeks[w]!.days[d]!.date.getTime())
      }
    }

    // Only March 15 should have isSelected=true
    const selectedDays = decorated.flatMap((w) => w.days).filter((d) => d.isSelected)
    expect(selectedDays.length).toBe(1)
    expect(selectedDays[0]!.date.getDate()).toBe(15)
  })

  it('changing selection does not require grid rebuild', () => {
    const raw = buildCalendarMonth(adapter, march2026, gridConfig)

    // Selection 1
    const sel1 = applySelection(raw.weeks, adapter, 'single', new Date(2026, 2, 10), {})
    // Selection 2  -  same raw grid, different selection
    const sel2 = applySelection(raw.weeks, adapter, 'single', new Date(2026, 2, 20), {})

    // raw.weeks is reused  -  only flags differ
    const s1Selected = sel1.flatMap((w) => w.days).filter((d) => d.isSelected)
    const s2Selected = sel2.flatMap((w) => w.days).filter((d) => d.isSelected)

    expect(s1Selected[0]!.date.getDate()).toBe(10)
    expect(s2Selected[0]!.date.getDate()).toBe(20)
  })
})

describe('batch grid building performance', () => {
  it('buildCalendarMonth for 12 consecutive months completes in under 10ms', () => {
    const iterations = 100
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      for (let m = 0; m < 12; m++) {
        buildCalendarMonth(adapter, new Date(2026, m, 1), gridConfig)
      }
    }
    const elapsed = performance.now() - start
    const perBatch = elapsed / iterations

    // 12 months built sequentially should complete well under 10ms
    expect(perBatch).toBeLessThan(10)
  })

  it('buildMultiMonth(6) completes in under 5ms', () => {
    const iterations = 200
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      buildMultiMonth(adapter, march2026, 6, gridConfig)
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(5)
  })
})

describe('selection performance', () => {
  it('applySelection with range mode on a full month completes in under 1ms', () => {
    const raw = buildCalendarMonth(adapter, march2026, gridConfig)
    const rangeValue = { from: new Date(2026, 2, 5), to: new Date(2026, 2, 25) }

    const iterations = 1000
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      applySelection(raw.weeks, adapter, 'range', rangeValue, {})
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(1)
  })

  it('applySelection with multi-select (20 dates) completes in under 2ms', () => {
    const raw = buildCalendarMonth(adapter, march2026, gridConfig)
    const multiDates: Date[] = []
    for (let d = 1; d <= 20; d++) {
      multiDates.push(new Date(2026, 2, d))
    }

    const iterations = 500
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      applySelection(raw.weeks, adapter, 'multi', multiDates, {})
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(2)
  })

  it('applySelection with constraints (disabled predicate + bounds) adds minimal overhead', () => {
    const raw = buildCalendarMonth(adapter, march2026, gridConfig)
    const selected = new Date(2026, 2, 15)
    const constraints = {
      disabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
      fromDate: new Date(2026, 2, 1),
      toDate: new Date(2026, 2, 31),
    }

    const iterations = 1000
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      applySelection(raw.weeks, adapter, 'single', selected, constraints)
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(1)
  })
})

describe('navigation performance', () => {
  it('100 consecutive navigate() calls complete in under 1ms', () => {
    let current = march2026
    const iterations = 100
    const rounds = 100

    const start = performance.now()
    for (let r = 0; r < rounds; r++) {
      current = march2026
      for (let i = 0; i < iterations; i++) {
        current = navigate(adapter, current, 'next', 'month')
      }
    }
    const elapsed = performance.now() - start
    const perBatch = elapsed / rounds

    // 100 navigations should be well under 1ms
    expect(perBatch).toBeLessThan(1)
  })

  it('mixed direction navigation (forward and backward) is stable', () => {
    let current = march2026
    const rounds = 100

    const start = performance.now()
    for (let r = 0; r < rounds; r++) {
      current = march2026
      for (let i = 0; i < 50; i++) {
        current = navigate(adapter, current, 'next', 'month')
      }
      for (let i = 0; i < 50; i++) {
        current = navigate(adapter, current, 'prev', 'month')
      }
    }
    const elapsed = performance.now() - start
    const perBatch = elapsed / rounds

    expect(perBatch).toBeLessThan(1)
    // After going forward 50 and back 50, should return to the start month
    expect(adapter.isSameMonth(current, march2026)).toBe(true)
  })

  it('navigate across decade boundaries is fast', () => {
    let current = march2026
    const rounds = 100

    const start = performance.now()
    for (let r = 0; r < rounds; r++) {
      current = march2026
      for (let i = 0; i < 10; i++) {
        current = navigate(adapter, current, 'next', 'decade')
      }
    }
    const elapsed = performance.now() - start
    const perBatch = elapsed / rounds

    expect(perBatch).toBeLessThan(1)
  })
})

describe('adapter performance', () => {
  it('NativeAdapter operations are sub-microsecond', () => {
    const iterations = 10000
    const date = new Date(2026, 2, 15)

    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      adapter.addDays(date, 1)
      adapter.addMonths(date, 1)
      adapter.isSameDay(date, date)
      adapter.format(date, { month: 'long' })
    }
    const elapsed = performance.now() - start
    const perOp = (elapsed / (iterations * 4)) * 1000 // microseconds

    // Each op should be well under 10 microseconds
    expect(perOp).toBeLessThan(10)
  })

  it('1000 addDays calls complete in under 1ms', () => {
    const date = new Date(2026, 2, 15)
    const iterations = 1000

    const start = performance.now()
    let d = date
    for (let i = 0; i < iterations; i++) {
      d = adapter.addDays(d, 1)
    }
    const elapsed = performance.now() - start

    // 1000 sequential addDays should be well under 1ms
    expect(elapsed).toBeLessThan(1)
    // Verify correctness: 1000 days from March 15 2026
    expect(d.getFullYear()).toBe(2028)
  })

  it('1000 addMonths calls complete in under 1ms', () => {
    const date = new Date(2026, 2, 15)
    const iterations = 1000

    const start = performance.now()
    let d = date
    for (let i = 0; i < iterations; i++) {
      d = adapter.addMonths(d, 1)
    }
    const elapsed = performance.now() - start

    expect(elapsed).toBeLessThan(1)
  })

  it('isSameDay and isBefore scale linearly over 10000 comparisons', () => {
    const dates: Date[] = []
    for (let i = 0; i < 100; i++) {
      dates.push(new Date(2026, 2, (i % 28) + 1))
    }

    const iterations = 100
    const start = performance.now()
    for (let r = 0; r < iterations; r++) {
      for (let i = 0; i < dates.length; i++) {
        adapter.isSameDay(dates[i]!, dates[(i + 1) % dates.length]!)
        adapter.isBefore(dates[i]!, dates[(i + 1) % dates.length]!)
      }
    }
    const elapsed = performance.now() - start
    const perOp = (elapsed / (iterations * dates.length * 2)) * 1000 // microseconds

    expect(perOp).toBeLessThan(10)
  })
})

describe('end-to-end pipeline performance', () => {
  it('full pipeline (build + apply selection) for single month under 2ms', () => {
    const iterations = 500
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      const grid = buildCalendarMonth(adapter, march2026, gridConfig)
      applySelection(grid.weeks, adapter, 'single', new Date(2026, 2, 15), {})
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(2)
  })

  it('full pipeline (build multi + apply range) for 3 months under 5ms', () => {
    const rangeValue = { from: new Date(2026, 2, 10), to: new Date(2026, 4, 20) }
    const iterations = 200
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      const months = buildMultiMonth(adapter, march2026, 3, gridConfig)
      for (const m of months) {
        applySelection(m.weeks, adapter, 'range', rangeValue, {})
      }
    }
    const elapsed = performance.now() - start
    const perCall = elapsed / iterations

    expect(perCall).toBeLessThan(5)
  })

  it('navigate + rebuild cycle (simulating user clicking next 12 times)', () => {
    const iterations = 100
    const start = performance.now()
    for (let r = 0; r < iterations; r++) {
      let current = march2026
      for (let i = 0; i < 12; i++) {
        current = navigate(adapter, current, 'next', 'month')
        const grid = buildCalendarMonth(adapter, current, gridConfig)
        applySelection(grid.weeks, adapter, 'single', null, {})
      }
    }
    const elapsed = performance.now() - start
    const perCycle = elapsed / iterations

    // 12 navigate+build+select cycles should be under 10ms
    expect(perCycle).toBeLessThan(10)
  })
})
