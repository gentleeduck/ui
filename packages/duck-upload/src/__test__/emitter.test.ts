import { describe, expect, test, vi } from 'vitest'
import { createTypedEmitter } from '../core/utils/emitter'

type Events = { foo: { x: number }; bar: { y: string } }

describe('createTypedEmitter', () => {
  test('emits to subscribers', () => {
    const e = createTypedEmitter<Events>()
    const fn = vi.fn()
    e.on('foo', fn)
    e.emit('foo', { x: 1 })
    e.emit('foo', { x: 2 })
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenNthCalledWith(1, { x: 1 })
    expect(fn).toHaveBeenNthCalledWith(2, { x: 2 })
  })

  test('does not invoke unrelated handlers', () => {
    const e = createTypedEmitter<Events>()
    const fooFn = vi.fn()
    const barFn = vi.fn()
    e.on('foo', fooFn)
    e.on('bar', barFn)
    e.emit('bar', { y: 'z' })
    expect(fooFn).not.toHaveBeenCalled()
    expect(barFn).toHaveBeenCalledOnce()
  })

  test('on returns unsubscriber', () => {
    const e = createTypedEmitter<Events>()
    const fn = vi.fn()
    const off = e.on('foo', fn)
    off()
    e.emit('foo', { x: 1 })
    expect(fn).not.toHaveBeenCalled()
  })

  test('off detaches listener', () => {
    const e = createTypedEmitter<Events>()
    const fn = vi.fn()
    e.on('foo', fn)
    e.off('foo', fn)
    e.emit('foo', { x: 1 })
    expect(fn).not.toHaveBeenCalled()
  })

  test('isolates throwing listeners', () => {
    const e = createTypedEmitter<Events>()
    const ok = vi.fn()
    e.on('foo', () => {
      throw new Error('boom')
    })
    e.on('foo', ok)
    expect(() => e.emit('foo', { x: 1 })).not.toThrow()
    expect(ok).toHaveBeenCalledOnce()
  })

  test('subsequent on() adds the listener for future emits', () => {
    const e = createTypedEmitter<Events>()
    const a: number[] = []
    const b: number[] = []
    e.on('foo', (p) => a.push(p.x))
    e.on('foo', (p) => b.push(p.x))

    for (let i = 0; i < 5; i++) e.emit('foo', { x: i })
    expect(a).toEqual([0, 1, 2, 3, 4])
    expect(b).toEqual([0, 1, 2, 3, 4])

    const c: number[] = []
    e.on('foo', (p) => c.push(p.x))
    e.emit('foo', { x: 99 })
    expect(c).toEqual([99])
    expect(a).toEqual([0, 1, 2, 3, 4, 99])
  })

  test('off() with a non-subscribed callback is a no-op', () => {
    const e = createTypedEmitter<Events>()
    const tracker: number[] = []
    e.on('foo', (p) => tracker.push(p.x))
    const unrelated = (p: { x: number }) => tracker.push(-p.x)
    expect(() => e.off('foo', unrelated)).not.toThrow()
    e.emit('foo', { x: 7 })
    expect(tracker).toEqual([7])
  })
})
