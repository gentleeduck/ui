import { beforeEach, describe, expect, it } from 'vitest'
import { NativeAdapter } from '../../adapter'
import { canNavigate, goToMonth, goToNextMonth, goToPrevMonth, goToYear, navigate } from '../navigation'

describe('navigation', () => {
  let adapter: NativeAdapter

  beforeEach(() => {
    adapter = new NativeAdapter()
  })

  // ---------------------------------------------------------------------------
  // navigate
  // ---------------------------------------------------------------------------
  describe('navigate', () => {
    describe('month', () => {
      it('next month advances by 1', () => {
        const result = navigate(adapter, adapter.create(2026, 2, 1), 'next', 'month')
        expect(result.getMonth()).toBe(3)
        expect(result.getFullYear()).toBe(2026)
      })

      it('prev month goes back by 1', () => {
        const result = navigate(adapter, adapter.create(2026, 2, 1), 'prev', 'month')
        expect(result.getMonth()).toBe(1)
        expect(result.getFullYear()).toBe(2026)
      })

      it('Dec → next → Jan of next year', () => {
        const result = navigate(adapter, adapter.create(2026, 11, 1), 'next', 'month')
        expect(result.getMonth()).toBe(0)
        expect(result.getFullYear()).toBe(2027)
      })

      it('Jan → prev → Dec of prev year', () => {
        const result = navigate(adapter, adapter.create(2026, 0, 1), 'prev', 'month')
        expect(result.getMonth()).toBe(11)
        expect(result.getFullYear()).toBe(2025)
      })
    })

    describe('year', () => {
      it('next year advances by 1', () => {
        const result = navigate(adapter, adapter.create(2026, 2, 1), 'next', 'year')
        expect(result.getFullYear()).toBe(2027)
        expect(result.getMonth()).toBe(2)
      })

      it('prev year goes back by 1', () => {
        const result = navigate(adapter, adapter.create(2026, 2, 1), 'prev', 'year')
        expect(result.getFullYear()).toBe(2025)
      })
    })

    describe('decade', () => {
      it('next decade advances by 10 years', () => {
        const result = navigate(adapter, adapter.create(2026, 0, 1), 'next', 'decade')
        expect(result.getFullYear()).toBe(2036)
      })

      it('prev decade goes back by 10 years', () => {
        const result = navigate(adapter, adapter.create(2026, 0, 1), 'prev', 'decade')
        expect(result.getFullYear()).toBe(2016)
      })
    })
  })

  // ---------------------------------------------------------------------------
  // canNavigate
  // ---------------------------------------------------------------------------
  describe('canNavigate', () => {
    it('returns true with no constraints', () => {
      expect(canNavigate(adapter, adapter.create(2026, 2, 1), 'prev', 'month')).toBe(true)
      expect(canNavigate(adapter, adapter.create(2026, 2, 1), 'next', 'month')).toBe(true)
    })

    it('returns true when going prev and only toDate is set', () => {
      expect(
        canNavigate(adapter, adapter.create(2026, 2, 1), 'prev', 'month', {
          toDate: adapter.create(2026, 5, 1),
        }),
      ).toBe(true)
    })

    it('returns true when going next and only fromDate is set', () => {
      expect(
        canNavigate(adapter, adapter.create(2026, 2, 1), 'next', 'month', {
          fromDate: adapter.create(2026, 0, 1),
        }),
      ).toBe(true)
    })

    describe('fromDate constraint (prev direction)', () => {
      it('can navigate prev when target month still has days >= fromDate', () => {
        // current: March 2026, fromDate: Feb 15 — going to Feb is fine (Feb has days after the 15th)
        const result = canNavigate(adapter, adapter.create(2026, 2, 1), 'prev', 'month', {
          fromDate: adapter.create(2026, 1, 15),
        })
        expect(result).toBe(true)
      })

      it('cannot navigate prev when target month ends before fromDate', () => {
        // current: March 2026, fromDate: March 1 — going to Feb, but Feb ends Feb 28 < March 1
        const result = canNavigate(adapter, adapter.create(2026, 2, 1), 'prev', 'month', {
          fromDate: adapter.create(2026, 2, 1),
        })
        expect(result).toBe(false)
      })

      it('blocks year navigation when prev year is fully before fromDate', () => {
        const result = canNavigate(adapter, adapter.create(2026, 2, 1), 'prev', 'year', {
          fromDate: adapter.create(2026, 0, 1),
        })
        // going to 2025, Dec 31 2025 < Jan 1 2026
        expect(result).toBe(false)
      })

      it('allows year navigation when prev year has days after fromDate', () => {
        const result = canNavigate(adapter, adapter.create(2026, 6, 1), 'prev', 'year', {
          fromDate: adapter.create(2025, 6, 1),
        })
        // going to July 2025, July 31 >= July 1 2025
        expect(result).toBe(true)
      })
    })

    describe('toDate constraint (next direction)', () => {
      it('can navigate next when target month starts before toDate', () => {
        const result = canNavigate(adapter, adapter.create(2026, 2, 1), 'next', 'month', {
          toDate: adapter.create(2026, 3, 15),
        })
        expect(result).toBe(true)
      })

      it('cannot navigate next when target month starts after toDate', () => {
        // current: March 2026, toDate: March 31 — going to April, Apr 1 > Mar 31
        const result = canNavigate(adapter, adapter.create(2026, 2, 1), 'next', 'month', {
          toDate: adapter.create(2026, 2, 31),
        })
        expect(result).toBe(false)
      })

      it('blocks year navigation when next year is fully after toDate', () => {
        const result = canNavigate(adapter, adapter.create(2026, 2, 1), 'next', 'year', {
          toDate: adapter.create(2026, 11, 31),
        })
        // going to 2027, Jan 1 2027 > Dec 31 2026
        expect(result).toBe(false)
      })

      it('allows year navigation when next year has days before toDate', () => {
        const result = canNavigate(adapter, adapter.create(2026, 2, 1), 'next', 'year', {
          toDate: adapter.create(2027, 6, 1),
        })
        expect(result).toBe(true)
      })
    })
  })

  // ---------------------------------------------------------------------------
  // convenience wrappers
  // ---------------------------------------------------------------------------
  describe('goToNextMonth', () => {
    it('advances by 1 month', () => {
      const result = goToNextMonth(adapter, adapter.create(2026, 2, 1))
      expect(result.getMonth()).toBe(3)
    })

    it('wraps Dec → Jan', () => {
      const result = goToNextMonth(adapter, adapter.create(2026, 11, 1))
      expect(result.getMonth()).toBe(0)
      expect(result.getFullYear()).toBe(2027)
    })
  })

  describe('goToPrevMonth', () => {
    it('goes back 1 month', () => {
      const result = goToPrevMonth(adapter, adapter.create(2026, 2, 1))
      expect(result.getMonth()).toBe(1)
    })

    it('wraps Jan → Dec', () => {
      const result = goToPrevMonth(adapter, adapter.create(2026, 0, 1))
      expect(result.getMonth()).toBe(11)
      expect(result.getFullYear()).toBe(2025)
    })
  })

  describe('goToMonth', () => {
    it('changes the month, keeps the year', () => {
      const result = goToMonth(adapter, adapter.create(2026, 2, 1), 8) // September
      expect(result.getMonth()).toBe(8)
      expect(result.getFullYear()).toBe(2026)
    })

    it('always returns the 1st of the target month', () => {
      const result = goToMonth(adapter, adapter.create(2026, 2, 17), 0)
      expect(result.getDate()).toBe(1)
    })

    it('handles January (0)', () => {
      expect(goToMonth(adapter, adapter.create(2026, 6, 1), 0).getMonth()).toBe(0)
    })

    it('handles December (11)', () => {
      expect(goToMonth(adapter, adapter.create(2026, 6, 1), 11).getMonth()).toBe(11)
    })
  })

  describe('goToYear', () => {
    it('changes the year, keeps the month', () => {
      const result = goToYear(adapter, adapter.create(2026, 2, 1), 2030)
      expect(result.getFullYear()).toBe(2030)
      expect(result.getMonth()).toBe(2)
    })

    it('always returns the 1st of the month', () => {
      const result = goToYear(adapter, adapter.create(2026, 2, 17), 2030)
      expect(result.getDate()).toBe(1)
    })

    it('handles going backward in years', () => {
      const result = goToYear(adapter, adapter.create(2026, 5, 1), 2000)
      expect(result.getFullYear()).toBe(2000)
      expect(result.getMonth()).toBe(5)
    })
  })
})
