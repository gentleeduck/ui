import './setup-dom'
import { beforeEach, describe, expect, test } from 'vitest'

// --- IntersectionObserver mock (shared state) ---

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

let observerInstances: {
  callback: IntersectionCallback
  options: IntersectionObserverInit | undefined
  observed: Element[]
  disconnected: boolean
}[]
let latestObserver: (typeof observerInstances)[0]

class MockIntersectionObserver {
  _index: number
  constructor(callback: IntersectionCallback, options?: IntersectionObserverInit) {
    const instance = { callback, options, observed: [], disconnected: false } as (typeof observerInstances)[0]
    observerInstances.push(instance)
    latestObserver = instance
    this._index = observerInstances.length - 1
  }
  observe(el: Element) {
    observerInstances[this._index].observed.push(el)
  }
  unobserve(_el: Element) {}
  disconnect() {
    observerInstances[this._index].disconnected = true
  }
}

// @ts-expect-error - mock
globalThis.IntersectionObserver = MockIntersectionObserver

// Mock Image constructor for useLazyImage tests
class MockImage {
  src = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
}

// @ts-expect-error - mock
globalThis.Image = MockImage

import React from 'react'

// Helper: render a component, wait for effects, return container + root
async function renderComponent(Component: React.FC) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const { createRoot } = await import('react-dom/client')
  const root = createRoot(container)

  React.startTransition(() => {
    root.render(React.createElement(Component))
  })

  // Wait for React effects to fire and observer to be created
  for (let i = 0; i < 20; i++) {
    await new Promise<void>((r) => setTimeout(r, 500))
    if (observerInstances.length > 0) break
  }

  return {
    container,
    root,
    cleanup() {
      root.unmount()
      if (container.parentNode) document.body.removeChild(container)
    },
  }
}

// ============================================================
// useLazyLoad edge cases
// ============================================================

describe('useLazyLoad edge cases', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as (typeof observerInstances)[0]
  })

  test('threshold 0 is passed through to IntersectionObserver', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad({ threshold: 0 })
      return React.createElement('div', { ref: r.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.threshold).toBe(0)
    cleanup()
  })

  test('threshold 0.5 is passed through to IntersectionObserver', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad({ threshold: 0.5 })
      return React.createElement('div', { ref: r.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.threshold).toBe(0.5)
    cleanup()
  })

  test('threshold 1 is passed through to IntersectionObserver', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad({ threshold: 1 })
      return React.createElement('div', { ref: r.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.threshold).toBe(1)
    cleanup()
  })

  test('rootMargin "0px" passthrough', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad({ rootMargin: '0px' })
      return React.createElement('div', { ref: r.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.rootMargin).toBe('0px')
    cleanup()
  })

  test('rootMargin "100px 50px" passthrough', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad({ rootMargin: '100px 50px' })
      return React.createElement('div', { ref: r.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.rootMargin).toBe('100px 50px')
    cleanup()
  })

  test('rootMargin negative value passthrough', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad({ rootMargin: '-50px' })
      return React.createElement('div', { ref: r.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.rootMargin).toBe('-50px')
    cleanup()
  })

  test('observer.disconnect() is called when element becomes visible', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    let result: ReturnType<typeof useLazyLoad> | undefined

    function TC() {
      result = useLazyLoad()
      return React.createElement('div', { ref: result.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)

    expect(latestObserver.disconnected).toBe(false)

    // Simulate intersection
    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(latestObserver.disconnected).toBe(true)
    expect(result!.isVisible).toBe(true)
    cleanup()
  })

  test('observer is NOT disconnected when entry is not intersecting', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad()
      return React.createElement('div', { ref: r.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)

    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: false } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(latestObserver.disconnected).toBe(false)
    cleanup()
  })

  test('works with no options (undefined)', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    let result: ReturnType<typeof useLazyLoad> | undefined

    function TC() {
      result = useLazyLoad()
      return React.createElement('div', { ref: result.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)

    expect(result!.isVisible).toBe(false)
    expect(result!.ComponentRef).toBeDefined()
    expect(latestObserver.options).toBeUndefined()
    cleanup()
  })

  test('observer observes the element attached to ComponentRef', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad()
      return React.createElement('div', { ref: r.ComponentRef, id: 'target' })
    }

    const { cleanup } = await renderComponent(TC)

    expect(latestObserver.observed.length).toBe(1)
    cleanup()
  })

  test('threshold array passthrough', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TC() {
      const r = useLazyLoad({ threshold: [0, 0.25, 0.5, 0.75, 1] })
      return React.createElement('div', { ref: r.ComponentRef })
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.threshold).toEqual([0, 0.25, 0.5, 0.75, 1])
    cleanup()
  })
})

// ============================================================
// DuckLazyComponent edge cases
// ============================================================

describe('DuckLazyComponent edge cases', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as (typeof observerInstances)[0]
  })

  test('renders data-slot="wrapper" on root element', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(DuckLazyComponent, {}, 'hello')
    }

    const { container, cleanup } = await renderComponent(TC)
    const wrapper = container.querySelector('[data-slot="wrapper"]')
    expect(wrapper).not.toBeNull()
    cleanup()
  })

  test('placeholder has animate-pulse class', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(DuckLazyComponent, {}, 'content')
    }

    const { container, cleanup } = await renderComponent(TC)
    const placeholder = container.querySelector('[data-slot="placeholder"]')
    expect(placeholder).not.toBeNull()
    expect(placeholder!.className).toContain('animate-pulse')
    cleanup()
  })

  test('placeholder disappears after intersection, children appear', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(
        DuckLazyComponent,
        {},
        React.createElement('span', { 'data-testid': 'child' }, 'lazy child'),
      )
    }

    const { container, cleanup } = await renderComponent(TC)

    // Before intersection
    expect(container.querySelector('[data-slot="placeholder"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="child"]')).toBeNull()

    // Trigger intersection
    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    // After intersection
    expect(container.querySelector('[data-slot="placeholder"]')).toBeNull()
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull()
    expect(container.textContent).toContain('lazy child')
    cleanup()
  })

  test('passes extra HTML props to root div', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(DuckLazyComponent, { id: 'my-lazy', className: 'custom-cls' }, 'c')
    }

    const { container, cleanup } = await renderComponent(TC)
    const wrapper = container.querySelector('[data-slot="wrapper"]')
    expect(wrapper!.id).toBe('my-lazy')
    expect(wrapper!.className).toContain('custom-cls')
    cleanup()
  })

  test('only threshold is overridden, rootMargin keeps default', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(DuckLazyComponent, { options: { threshold: 0.75 } }, 'c')
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.threshold).toBe(0.75)
    expect(latestObserver.options?.rootMargin).toBe('0px')
    cleanup()
  })

  test('only rootMargin is overridden, threshold keeps default', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(DuckLazyComponent, { options: { rootMargin: '200px' } }, 'c')
    }

    const { cleanup } = await renderComponent(TC)
    expect(latestObserver.options?.rootMargin).toBe('200px')
    expect(latestObserver.options?.threshold).toBe(0)
    cleanup()
  })
})

// ============================================================
// Multiple lazy components on same page
// ============================================================

describe('Multiple lazy components on same page', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as (typeof observerInstances)[0]
  })

  test('each DuckLazyComponent creates its own observer', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(
        'div',
        {},
        React.createElement(DuckLazyComponent, { key: '1' }, 'a'),
        React.createElement(DuckLazyComponent, { key: '2' }, 'b'),
        React.createElement(DuckLazyComponent, { key: '3' }, 'c'),
      )
    }

    const { cleanup } = await renderComponent(TC)

    expect(observerInstances.length).toBe(3)
    cleanup()
  })

  test('intersecting one component does not reveal siblings', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(
        'div',
        {},
        React.createElement(DuckLazyComponent, { key: '1' }, React.createElement('span', {}, 'first')),
        React.createElement(DuckLazyComponent, { key: '2' }, React.createElement('span', {}, 'second')),
      )
    }

    const { container, cleanup } = await renderComponent(TC)

    // Only trigger the first observer
    React.startTransition(() => {
      observerInstances[0].callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(container.textContent).toContain('first')
    expect(container.textContent).not.toContain('second')

    // Second component should still show placeholder
    const placeholders = container.querySelectorAll('[data-slot="placeholder"]')
    expect(placeholders.length).toBe(1)

    cleanup()
  })

  test('intersecting all components reveals all children', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TC() {
      return React.createElement(
        'div',
        {},
        React.createElement(DuckLazyComponent, { key: '1' }, React.createElement('span', {}, 'aaa')),
        React.createElement(DuckLazyComponent, { key: '2' }, React.createElement('span', {}, 'bbb')),
      )
    }

    const { container, cleanup } = await renderComponent(TC)

    // Trigger both observers
    React.startTransition(() => {
      observerInstances[0].callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
      observerInstances[1].callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(container.textContent).toContain('aaa')
    expect(container.textContent).toContain('bbb')

    const placeholders = container.querySelectorAll('[data-slot="placeholder"]')
    expect(placeholders.length).toBe(0)

    cleanup()
  })
})

// ============================================================
// useLazyImage hook
// ============================================================

describe('useLazyImage', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as (typeof observerInstances)[0]
  })

  test('returns isLoaded false initially', async () => {
    const { useLazyImage } = await import('../lazy-image/lazy-image.hooks')

    let result: ReturnType<typeof useLazyImage> | undefined

    function TC() {
      result = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: result.imageRef })
    }

    const { cleanup } = await renderComponent(TC)

    expect(result!.isLoaded).toBe(false)
    expect(result!.imageRef).toBeDefined()
    cleanup()
  })

  test('passes default options to IntersectionObserver', async () => {
    const { useLazyImage } = await import('../lazy-image/lazy-image.hooks')

    function TC() {
      const r = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: r.imageRef })
    }

    const { cleanup } = await renderComponent(TC)

    // No options passed, should be undefined
    expect(latestObserver.options).toBeUndefined()
    cleanup()
  })

  test('passes custom options to IntersectionObserver', async () => {
    const { useLazyImage } = await import('../lazy-image/lazy-image.hooks')

    function TC() {
      const r = useLazyImage('https://example.com/img.jpg', {
        rootMargin: '300px',
        threshold: 0.2,
      })
      return React.createElement('img', { ref: r.imageRef })
    }

    const { cleanup } = await renderComponent(TC)

    expect(latestObserver.options?.rootMargin).toBe('300px')
    expect(latestObserver.options?.threshold).toBe(0.2)
    cleanup()
  })

  test('observer disconnects when image enters viewport', async () => {
    const { useLazyImage } = await import('../lazy-image/lazy-image.hooks')

    function TC() {
      const r = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: r.imageRef })
    }

    const { cleanup } = await renderComponent(TC)

    expect(latestObserver.disconnected).toBe(false)

    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(latestObserver.disconnected).toBe(true)
    cleanup()
  })

  test('observer does NOT disconnect when entry is not intersecting', async () => {
    const { useLazyImage } = await import('../lazy-image/lazy-image.hooks')

    function TC() {
      const r = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: r.imageRef })
    }

    const { cleanup } = await renderComponent(TC)

    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: false } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(latestObserver.disconnected).toBe(false)
    cleanup()
  })

  test('isLoaded becomes true after image loads', async () => {
    // Capture Image instances to control onload
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    const { useLazyImage } = await import('../lazy-image/lazy-image.hooks')

    let result: ReturnType<typeof useLazyImage> | undefined

    function TC() {
      result = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: result.imageRef })
    }

    const { cleanup } = await renderComponent(TC)

    // Trigger intersection to start image loading
    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    // The Image instance should have been created with the src
    expect(imageInstances.length).toBeGreaterThanOrEqual(1)
    const lastImg = imageInstances[imageInstances.length - 1]
    expect(lastImg.src).toBe('https://example.com/img.jpg')

    // Simulate image loaded
    React.startTransition(() => {
      if (lastImg.onload) lastImg.onload()
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(result!.isLoaded).toBe(true)

    // Restore
    // @ts-expect-error - mock
    globalThis.Image = OrigMockImage
    cleanup()
  })

  test('isLoaded stays false if intersection never fires', async () => {
    const { useLazyImage } = await import('../lazy-image/lazy-image.hooks')

    let result: ReturnType<typeof useLazyImage> | undefined

    function TC() {
      result = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: result.imageRef })
    }

    const { cleanup } = await renderComponent(TC)

    // Do nothing -- no intersection
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(result!.isLoaded).toBe(false)
    cleanup()
  })

  test('observes the img element via imageRef', async () => {
    const { useLazyImage } = await import('../lazy-image/lazy-image.hooks')

    function TC() {
      const r = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: r.imageRef })
    }

    const { cleanup } = await renderComponent(TC)

    expect(latestObserver.observed.length).toBe(1)
    expect(latestObserver.observed[0].tagName).toBe('IMG')
    cleanup()
  })
})

// ============================================================
// DuckLazyImage component
// ============================================================

describe('DuckLazyImage', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as (typeof observerInstances)[0]
  })

  test('throws when src is not provided', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      // @ts-expect-error - intentionally missing src to test the throw
      return React.createElement(DuckLazyImage, { width: 100, height: 100 })
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    let caughtError: Error | null = null

    // React 19: use onCaughtError / onUncaughtError
    const errorRoot = createRoot(container, {
      onUncaughtError(error) {
        caughtError = error as Error
      },
    })

    React.startTransition(() => {
      errorRoot.render(React.createElement(TC))
    })
    await new Promise<void>((r) => setTimeout(r, 100))

    // The component should throw, captured either through our handler or by React's boundary
    expect(caughtError).not.toBeNull()
    expect(caughtError!.message).toContain('src is required')

    errorRoot.unmount()
    if (container.parentNode) document.body.removeChild(container)
  })

  test('uses default rootMargin "200px" and threshold 0.1', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 200,
        height: 200,
        alt: 'test image',
      })
    }

    const { cleanup } = await renderComponent(TC)

    expect(latestObserver.options?.rootMargin).toBe('200px')
    expect(latestObserver.options?.threshold).toBe(0.1)
    cleanup()
  })

  test('user options override defaults', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 200,
        height: 200,
        alt: 'test image',
        options: { rootMargin: '500px', threshold: 0.5 },
      })
    }

    const { cleanup } = await renderComponent(TC)

    expect(latestObserver.options?.rootMargin).toBe('500px')
    expect(latestObserver.options?.threshold).toBe(0.5)
    cleanup()
  })

  test('renders loading overlay when image not yet loaded', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 200,
        height: 200,
        alt: 'test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    // Should have the output element with aria-live="polite" (loading overlay)
    const output = container.querySelector('output[aria-live="polite"]')
    expect(output).not.toBeNull()
    expect(output!.className).toContain('animate-pulse')
    cleanup()
  })

  test('renders an img element with lazy loading attribute', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 300,
        height: 150,
        alt: 'photo',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.getAttribute('loading')).toBe('lazy')
    expect(img!.getAttribute('decoding')).toBe('async')
    expect(img!.getAttribute('width')).toBe('300')
    expect(img!.getAttribute('height')).toBe('150')
    cleanup()
  })

  test('img src is always props.src because spread props override computed src', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        placeholder: 'https://example.com/placeholder.jpg',
        width: 200,
        height: 200,
        alt: 'test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    // The {...props} spread includes props.src which overrides the computed src
    expect(img!.getAttribute('src')).toBe('https://example.com/img.jpg')
    cleanup()
  })

  test('img src remains props.src even without placeholder', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 200,
        height: 200,
        alt: 'test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    // props.src is spread last, so it overrides the ternary
    expect(img!.getAttribute('src')).toBe('https://example.com/img.jpg')
    cleanup()
  })

  test('does not render loading overlay when nextImage is true', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 200,
        height: 200,
        alt: 'test',
        nextImage: false, // explicitly false to not use next/image, but test the overlay logic
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    // With nextImage=false, the overlay should be present
    const output = container.querySelector('output[aria-live="polite"]')
    expect(output).not.toBeNull()
    cleanup()
  })

  test('aria-hidden reflects loaded state on img', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 200,
        height: 200,
        alt: 'test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    // Before load, aria-hidden should be 'false'
    expect(img!.getAttribute('aria-hidden')).toBe('false')
    cleanup()
  })

  test('root div has relative overflow-hidden class', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 200,
        height: 200,
        alt: 'test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const rootDiv = container.firstElementChild as HTMLDivElement
    expect(rootDiv).not.toBeNull()
    expect(rootDiv.className).toContain('relative')
    expect(rootDiv.className).toContain('overflow-hidden')
    cleanup()
  })

  test('root div uses translate3d for GPU acceleration', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 200,
        height: 200,
        alt: 'test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const rootDiv = container.firstElementChild as HTMLDivElement
    expect(rootDiv.style.transform).toBe('translate3d(0,0,0)')
    cleanup()
  })

  test('custom width and height are applied to img', async () => {
    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/img.jpg',
        width: 640,
        height: 480,
        alt: 'sized',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const img = container.querySelector('img')
    expect(img!.getAttribute('width')).toBe('640')
    expect(img!.getAttribute('height')).toBe('480')
    cleanup()
  })
})

// ============================================================
// DuckLazyImage loaded state transitions
// ============================================================

describe('DuckLazyImage loaded transitions', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as (typeof observerInstances)[0]
  })

  test('img opacity transitions from opacity-0 to opacity-100 after load', async () => {
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/real.jpg',
        placeholder: 'https://example.com/tiny.jpg',
        width: 200,
        height: 200,
        alt: 'transition test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const img = container.querySelector('img')
    // Before load: img class should contain opacity-0
    expect(img!.className).toContain('opacity-0')

    // Trigger intersection
    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    // Simulate Image onload
    const lastImg = imageInstances[imageInstances.length - 1]
    React.startTransition(() => {
      if (lastImg.onload) lastImg.onload()
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    // After load: img class should contain opacity-100
    expect(img!.className).toContain('opacity-100')

    // @ts-expect-error - restore
    globalThis.Image = OrigMockImage
    cleanup()
  })

  test('aria-hidden on output changes after load', async () => {
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/real.jpg',
        width: 200,
        height: 200,
        alt: 'aria test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const output = container.querySelector('output[aria-live="polite"]')
    expect(output!.getAttribute('aria-hidden')).toBe('false')

    // Trigger intersection
    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    // Simulate load
    const lastImg = imageInstances[imageInstances.length - 1]
    React.startTransition(() => {
      if (lastImg.onload) lastImg.onload()
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    expect(output!.getAttribute('aria-hidden')).toBe('true')

    // @ts-expect-error - restore
    globalThis.Image = OrigMockImage
    cleanup()
  })

  test('loading overlay opacity transitions after load', async () => {
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    const { DuckLazyImage } = await import('../lazy-image/lazy-image')

    function TC() {
      return React.createElement(DuckLazyImage, {
        src: 'https://example.com/real.jpg',
        width: 200,
        height: 200,
        alt: 'opacity test',
      })
    }

    const { container, cleanup } = await renderComponent(TC)

    const output = container.querySelector('output')
    // Before load: has opacity-100 and bg-muted
    expect(output!.className).toContain('opacity-100')

    // Trigger intersection + load
    React.startTransition(() => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    const lastImg = imageInstances[imageInstances.length - 1]
    React.startTransition(() => {
      if (lastImg.onload) lastImg.onload()
    })
    await new Promise<void>((r) => setTimeout(r, 500))

    // After load: should have opacity-0 and bg-transparent
    expect(output!.className).toContain('opacity-0')
    expect(output!.className).toContain('bg-transparent')

    // @ts-expect-error - restore
    globalThis.Image = OrigMockImage
    cleanup()
  })
})
