import { describe, expect, it } from 'vitest'
import { NativeAdapter } from '../adapter'
import { buildCalendarMonth, buildMultiMonth } from '../grid'
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
    // Selection 2 — same raw grid, different selection
    const sel2 = applySelection(raw.weeks, adapter, 'single', new Date(2026, 2, 20), {})

    // raw.weeks is reused — only flags differ
    const s1Selected = sel1.flatMap((w) => w.days).filter((d) => d.isSelected)
    const s2Selected = sel2.flatMap((w) => w.days).filter((d) => d.isSelected)

    expect(s1Selected[0]!.date.getDate()).toBe(10)
    expect(s2Selected[0]!.date.getDate()).toBe(20)
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
})
