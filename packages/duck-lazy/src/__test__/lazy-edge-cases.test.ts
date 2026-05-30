import './setup-dom'
import React, { act } from 'react'
import { beforeEach, describe, expect, test } from 'vitest'
import { DuckLazyComponent } from '../lazy-component/lazy-component'
import { useLazyLoad } from '../lazy-component/lazy-component.hooks'
import { DuckLazyImage } from '../lazy-image/lazy-image'
import { useLazyImage } from '../lazy-image/lazy-image.hooks'

// --- IntersectionObserver mock (multi-instance, with disconnect tracking) ---

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

interface ObserverInstance {
  callback: IntersectionCallback
  options: IntersectionObserverInit | undefined
  observed: Element[]
  disconnected: boolean
}

let observerInstances: ObserverInstance[]
let latestObserver: ObserverInstance

class MockIntersectionObserver {
  _index: number
  constructor(callback: IntersectionCallback, options?: IntersectionObserverInit) {
    const instance: ObserverInstance = { callback, disconnected: false, observed: [], options }
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

// --- Image mock ---

class MockImage {
  src = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
}

// @ts-expect-error - mock
globalThis.Image = MockImage

// --- mount helper using act() (matches lazy-component.test.ts) ---

async function mount(node: React.ReactElement) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const { createRoot } = await import('react-dom/client')
  const root = createRoot(container)
  await act(async () => {
    root.render(node)
  })
  return {
    container,
    root,
    cleanup() {
      act(() => root.unmount())
      if (container.parentNode) document.body.removeChild(container)
    },
  }
}

// =====================================================================
// useLazyLoad edge cases
// =====================================================================

describe('useLazyLoad edge cases', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as ObserverInstance
  })

  test('threshold 0 is passed through to IntersectionObserver', async () => {
    function TC() {
      const r = useLazyLoad({ threshold: 0 })
      return React.createElement('div', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.threshold).toBe(0)
    cleanup()
  })

  test('threshold 0.5 is passed through to IntersectionObserver', async () => {
    function TC() {
      const r = useLazyLoad({ threshold: 0.5 })
      return React.createElement('div', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.threshold).toBe(0.5)
    cleanup()
  })

  test('threshold 1 is passed through to IntersectionObserver', async () => {
    function TC() {
      const r = useLazyLoad({ threshold: 1 })
      return React.createElement('div', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.threshold).toBe(1)
    cleanup()
  })

  test('rootMargin "0px" passthrough', async () => {
    function TC() {
      const r = useLazyLoad({ rootMargin: '0px' })
      return React.createElement('div', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.rootMargin).toBe('0px')
    cleanup()
  })

  test('rootMargin "100px 50px" passthrough', async () => {
    function TC() {
      const r = useLazyLoad({ rootMargin: '100px 50px' })
      return React.createElement('div', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.rootMargin).toBe('100px 50px')
    cleanup()
  })

  test('rootMargin negative value passthrough', async () => {
    function TC() {
      const r = useLazyLoad({ rootMargin: '-50px' })
      return React.createElement('div', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.rootMargin).toBe('-50px')
    cleanup()
  })

  test('observer.disconnect() is called when element becomes visible', async () => {
    let result: ReturnType<typeof useLazyLoad> | undefined

    function TC() {
      result = useLazyLoad()
      return React.createElement('div', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(latestObserver.disconnected).toBe(false)

    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    expect(latestObserver.disconnected).toBe(true)
    expect(result!.isVisible).toBe(true)
    cleanup()
  })

  test('observer is NOT disconnected when entry is not intersecting', async () => {
    function TC() {
      const r = useLazyLoad()
      return React.createElement('div', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    await act(async () => {
      latestObserver.callback([{ isIntersecting: false } as Partial<IntersectionObserverEntry>])
    })

    expect(latestObserver.disconnected).toBe(false)
    cleanup()
  })

  test('works with no options (undefined)', async () => {
    let result: ReturnType<typeof useLazyLoad> | undefined

    function TC() {
      result = useLazyLoad()
      return React.createElement('div', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(result!.isVisible).toBe(false)
    expect(result!.ref).toBeDefined()
    // No options -> all observer init fields are undefined (rootMargin / threshold)
    expect(latestObserver.options?.rootMargin).toBeUndefined()
    expect(latestObserver.options?.threshold).toBeUndefined()
    cleanup()
  })

  test('observer observes the element attached to ref', async () => {
    function TC() {
      const r = useLazyLoad()
      return React.createElement('div', { id: 'target', ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(latestObserver.observed.length).toBe(1)
    cleanup()
  })

  test('threshold array passthrough', async () => {
    function TC() {
      const r = useLazyLoad({ threshold: [0, 0.25, 0.5, 0.75, 1] })
      return React.createElement('div', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.threshold).toEqual([0, 0.25, 0.5, 0.75, 1])
    cleanup()
  })
})

// =====================================================================
// DuckLazyComponent edge cases
// =====================================================================

describe('DuckLazyComponent edge cases', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as ObserverInstance
  })

  test('renders data-slot="wrapper" on root element', async () => {
    function TC() {
      return React.createElement(DuckLazyComponent, {}, 'hello')
    }

    const { container, cleanup } = await mount(React.createElement(TC))
    const wrapper = container.querySelector('[data-slot="wrapper"]')
    expect(wrapper).not.toBeNull()
    cleanup()
  })

  test('placeholder has animate-pulse class', async () => {
    function TC() {
      return React.createElement(DuckLazyComponent, {}, 'content')
    }

    const { container, cleanup } = await mount(React.createElement(TC))
    const placeholder = container.querySelector('[data-slot="placeholder"]')
    expect(placeholder).not.toBeNull()
    expect(placeholder!.className).toContain('animate-pulse')
    cleanup()
  })

  test('placeholder disappears after intersection, children appear', async () => {
    function TC() {
      return React.createElement(
        DuckLazyComponent,
        {},
        React.createElement('span', { 'data-testid': 'child' }, 'lazy child'),
      )
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    expect(container.querySelector('[data-slot="placeholder"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="child"]')).toBeNull()

    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    expect(container.querySelector('[data-slot="placeholder"]')).toBeNull()
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull()
    expect(container.textContent).toContain('lazy child')
    cleanup()
  })

  test('passes extra HTML props to root div', async () => {
    function TC() {
      return React.createElement(DuckLazyComponent, { className: 'custom-cls', id: 'my-lazy' }, 'c')
    }

    const { container, cleanup } = await mount(React.createElement(TC))
    const wrapper = container.querySelector('[data-slot="wrapper"]')
    expect(wrapper!.id).toBe('my-lazy')
    expect(wrapper!.className).toContain('custom-cls')
    cleanup()
  })

  test('only threshold is overridden, rootMargin keeps default', async () => {
    function TC() {
      return React.createElement(DuckLazyComponent, { options: { threshold: 0.75 } }, 'c')
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.threshold).toBe(0.75)
    expect(latestObserver.options?.rootMargin).toBe('0px')
    cleanup()
  })

  test('only rootMargin is overridden, threshold keeps default', async () => {
    function TC() {
      return React.createElement(DuckLazyComponent, { options: { rootMargin: '200px' } }, 'c')
    }

    const { cleanup } = await mount(React.createElement(TC))
    expect(latestObserver.options?.rootMargin).toBe('200px')
    expect(latestObserver.options?.threshold).toBe(0)
    cleanup()
  })
})

// =====================================================================
// Multiple lazy components on same page
// =====================================================================

describe('Multiple lazy components on same page', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as ObserverInstance
  })

  test('each DuckLazyComponent creates its own observer', async () => {
    function TC() {
      return React.createElement(
        'div',
        {},
        React.createElement(DuckLazyComponent, { key: '1' }, 'a'),
        React.createElement(DuckLazyComponent, { key: '2' }, 'b'),
        React.createElement(DuckLazyComponent, { key: '3' }, 'c'),
      )
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(observerInstances.length).toBe(3)
    cleanup()
  })

  test('intersecting one component does not reveal siblings', async () => {
    function TC() {
      return React.createElement(
        'div',
        {},
        React.createElement(DuckLazyComponent, { key: '1' }, React.createElement('span', {}, 'first')),
        React.createElement(DuckLazyComponent, { key: '2' }, React.createElement('span', {}, 'second')),
      )
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    await act(async () => {
      observerInstances[0].callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    expect(container.textContent).toContain('first')
    expect(container.textContent).not.toContain('second')

    const placeholders = container.querySelectorAll('[data-slot="placeholder"]')
    expect(placeholders.length).toBe(1)

    cleanup()
  })

  test('intersecting all components reveals all children', async () => {
    function TC() {
      return React.createElement(
        'div',
        {},
        React.createElement(DuckLazyComponent, { key: '1' }, React.createElement('span', {}, 'aaa')),
        React.createElement(DuckLazyComponent, { key: '2' }, React.createElement('span', {}, 'bbb')),
      )
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    await act(async () => {
      observerInstances[0].callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
      observerInstances[1].callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    expect(container.textContent).toContain('aaa')
    expect(container.textContent).toContain('bbb')

    const placeholders = container.querySelectorAll('[data-slot="placeholder"]')
    expect(placeholders.length).toBe(0)

    cleanup()
  })
})

// =====================================================================
// useLazyImage
// =====================================================================

describe('useLazyImage', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as ObserverInstance
  })

  test('returns isLoaded false initially', async () => {
    let result: ReturnType<typeof useLazyImage> | undefined

    function TC() {
      result = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(result!.isLoaded).toBe(false)
    expect(result!.ref).toBeDefined()
    cleanup()
  })

  test('passes default options to IntersectionObserver', async () => {
    function TC() {
      const r = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    // No options passed; rootMargin / threshold should be undefined
    expect(latestObserver.options?.rootMargin).toBeUndefined()
    expect(latestObserver.options?.threshold).toBeUndefined()
    cleanup()
  })

  test('passes custom options to IntersectionObserver', async () => {
    function TC() {
      const r = useLazyImage('https://example.com/img.jpg', {
        rootMargin: '300px',
        threshold: 0.2,
      })
      return React.createElement('img', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(latestObserver.options?.rootMargin).toBe('300px')
    expect(latestObserver.options?.threshold).toBe(0.2)
    cleanup()
  })

  test('observer disconnects when image enters viewport', async () => {
    function TC() {
      const r = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(latestObserver.disconnected).toBe(false)

    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    expect(latestObserver.disconnected).toBe(true)
    cleanup()
  })

  test('observer does NOT disconnect when entry is not intersecting', async () => {
    function TC() {
      const r = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    await act(async () => {
      latestObserver.callback([{ isIntersecting: false } as Partial<IntersectionObserverEntry>])
    })

    expect(latestObserver.disconnected).toBe(false)
    cleanup()
  })

  test('isLoaded becomes true after image loads', async () => {
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    let result: ReturnType<typeof useLazyImage> | undefined

    function TC() {
      result = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    // Trigger intersection to start image loading
    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    expect(imageInstances.length).toBeGreaterThanOrEqual(1)
    const lastImg = imageInstances[imageInstances.length - 1]
    expect(lastImg.src).toBe('https://example.com/img.jpg')

    // Simulate image loaded
    await act(async () => {
      if (lastImg.onload) lastImg.onload()
    })

    expect(result!.isLoaded).toBe(true)

    // Restore
    // @ts-expect-error - mock
    globalThis.Image = OrigMockImage
    cleanup()
  })

  test('isLoaded becomes true on image error (so consumers can fall back)', async () => {
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    let result: ReturnType<typeof useLazyImage> | undefined

    function TC() {
      result = useLazyImage('https://example.com/broken.jpg')
      return React.createElement('img', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    const lastImg = imageInstances[imageInstances.length - 1]
    expect(lastImg.onerror).not.toBeNull()

    await act(async () => {
      if (lastImg.onerror) lastImg.onerror()
    })

    expect(result!.isLoaded).toBe(true)

    // @ts-expect-error - mock
    globalThis.Image = OrigMockImage
    cleanup()
  })

  test('isLoaded stays false if intersection never fires', async () => {
    let result: ReturnType<typeof useLazyImage> | undefined

    function TC() {
      result = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(result!.isLoaded).toBe(false)
    cleanup()
  })

  test('observes the img element via ref', async () => {
    function TC() {
      const r = useLazyImage('https://example.com/img.jpg')
      return React.createElement('img', { ref: r.ref })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(latestObserver.observed.length).toBe(1)
    expect(latestObserver.observed[0].tagName).toBe('IMG')
    cleanup()
  })
})

// =====================================================================
// DuckLazyImage
// =====================================================================

describe('DuckLazyImage', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as ObserverInstance
  })

  test('uses default rootMargin "200px" and threshold 0.1', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test image',
        height: 200,
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(latestObserver.options?.rootMargin).toBe('200px')
    expect(latestObserver.options?.threshold).toBe(0.1)
    cleanup()
  })

  test('user options override defaults', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test image',
        height: 200,
        options: { rootMargin: '500px', threshold: 0.5 },
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { cleanup } = await mount(React.createElement(TC))

    expect(latestObserver.options?.rootMargin).toBe('500px')
    expect(latestObserver.options?.threshold).toBe(0.5)
    cleanup()
  })

  test('renders the placeholder overlay span when image not yet loaded', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test',
        height: 200,
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    // The placeholder overlay is now a <span data-slot="placeholder"> with animate-pulse
    const placeholder = container.querySelector('span[data-slot="placeholder"]')
    expect(placeholder).not.toBeNull()
    expect(placeholder!.className).toContain('animate-pulse')
    // Pre-load: opacity-100 + bg-muted
    expect(placeholder!.className).toContain('opacity-100')
    expect(placeholder!.className).toContain('bg-muted')
    cleanup()
  })

  test('renders an img element with lazy loading attribute', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'photo',
        height: 150,
        src: 'https://example.com/img.jpg',
        width: 300,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.getAttribute('loading')).toBe('lazy')
    expect(img!.getAttribute('decoding')).toBe('async')
    expect(img!.getAttribute('width')).toBe('300')
    expect(img!.getAttribute('height')).toBe('150')
    cleanup()
  })

  // ---------------------------------------------------------------
  // CORRECT lazy-swap behavior: placeholder URL renders pre-load,
  // real src renders post-load. The old broken behavior (props.src
  // spread last wins) is now fixed by destructuring src out before
  // {...props} spread.
  // ---------------------------------------------------------------
  test('img src renders the placeholder URL before load when placeholder is provided', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test',
        height: 200,
        placeholder: 'https://example.com/placeholder.jpg',
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    // Before intersection / load, displaySrc should be the placeholder
    expect(img!.getAttribute('src')).toBe('https://example.com/placeholder.jpg')
    cleanup()
  })

  test('img src falls back to the real src when no placeholder is provided', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test',
        height: 200,
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    // No placeholder -> displaySrc collapses to the real src on first paint
    expect(img!.getAttribute('src')).toBe('https://example.com/img.jpg')
    cleanup()
  })

  test('img src swaps from placeholder to the real src after the image loads', async () => {
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'swap',
        height: 200,
        placeholder: 'https://example.com/placeholder.jpg',
        src: 'https://example.com/real.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    let img = container.querySelector('img')
    expect(img!.getAttribute('src')).toBe('https://example.com/placeholder.jpg')

    // Trigger intersection
    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    // Trigger image load
    const lastImg = imageInstances[imageInstances.length - 1]
    await act(async () => {
      if (lastImg.onload) lastImg.onload()
    })

    img = container.querySelector('img')
    expect(img!.getAttribute('src')).toBe('https://example.com/real.jpg')

    // @ts-expect-error - mock
    globalThis.Image = OrigMockImage
    cleanup()
  })

  test('placeholder overlay is still rendered (default branch)', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test',
        height: 200,
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const placeholder = container.querySelector('span[data-slot="placeholder"]')
    expect(placeholder).not.toBeNull()
    cleanup()
  })

  test('aria-hidden on img is not set when alt is provided (driven by alt presence)', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test',
        height: 200,
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    // With `alt` present the image is informational — no aria-hidden.
    expect(img!.getAttribute('aria-hidden')).toBeNull()
    cleanup()
  })

  test('aria-hidden on img is "true" when alt is empty (decorative)', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: '',
        height: 200,
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.getAttribute('aria-hidden')).toBe('true')
    cleanup()
  })

  test('root div has relative overflow-hidden class', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test',
        height: 200,
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const rootDiv = container.firstElementChild as HTMLDivElement
    expect(rootDiv).not.toBeNull()
    expect(rootDiv.className).toContain('relative')
    expect(rootDiv.className).toContain('overflow-hidden')
    cleanup()
  })

  test('root div no longer applies translate3d (cargo-culted GPU promotion removed)', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'test',
        height: 200,
        src: 'https://example.com/img.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const rootDiv = container.firstElementChild as HTMLDivElement
    // translate3d was removed from both wrapper and img; modern browsers auto-promote
    // <img> with loading="lazy".
    expect(rootDiv.style.transform).toBe('')
    cleanup()
  })

  test('custom width and height are applied to img', async () => {
    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'sized',
        height: 480,
        src: 'https://example.com/img.jpg',
        width: 640,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    const img = container.querySelector('img')
    expect(img!.getAttribute('width')).toBe('640')
    expect(img!.getAttribute('height')).toBe('480')
    cleanup()
  })
})

// =====================================================================
// DuckLazyImage loaded transitions
// =====================================================================

describe('DuckLazyImage loaded transitions', () => {
  beforeEach(() => {
    observerInstances = []
    latestObserver = undefined as unknown as ObserverInstance
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

    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'transition test',
        height: 200,
        placeholder: 'https://example.com/tiny.jpg',
        src: 'https://example.com/real.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    let img = container.querySelector('img')
    expect(img!.className).toContain('opacity-0')

    // Trigger intersection
    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    // Simulate Image onload
    const lastImg = imageInstances[imageInstances.length - 1]
    await act(async () => {
      if (lastImg.onload) lastImg.onload()
    })

    img = container.querySelector('img')
    expect(img!.className).toContain('opacity-100')

    // @ts-expect-error - restore
    globalThis.Image = OrigMockImage
    cleanup()
  })

  test('img aria-hidden is driven by `alt` presence, not load state', async () => {
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'aria test',
        height: 200,
        src: 'https://example.com/real.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    // Informational image (alt present): no aria-hidden before load.
    let img = container.querySelector('img')
    expect(img!.getAttribute('aria-hidden')).toBeNull()

    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    const lastImg = imageInstances[imageInstances.length - 1]
    await act(async () => {
      if (lastImg.onload) lastImg.onload()
    })

    // After load: still null (alt unchanged → presentation unchanged).
    img = container.querySelector('img')
    expect(img!.getAttribute('aria-hidden')).toBeNull()

    // @ts-expect-error - restore
    globalThis.Image = OrigMockImage
    cleanup()
  })

  test('placeholder overlay opacity transitions to opacity-0 + bg-transparent after load', async () => {
    const imageInstances: MockImage[] = []
    const OrigMockImage = MockImage
    // @ts-expect-error - mock
    globalThis.Image = class extends OrigMockImage {
      constructor() {
        super()
        imageInstances.push(this)
      }
    }

    function TC() {
      return React.createElement(DuckLazyImage, {
        alt: 'opacity test',
        height: 200,
        src: 'https://example.com/real.jpg',
        width: 200,
      })
    }

    const { container, cleanup } = await mount(React.createElement(TC))

    let placeholder = container.querySelector('span[data-slot="placeholder"]')
    expect(placeholder!.className).toContain('opacity-100')
    expect(placeholder!.className).toContain('bg-muted')

    await act(async () => {
      latestObserver.callback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    const lastImg = imageInstances[imageInstances.length - 1]
    await act(async () => {
      if (lastImg.onload) lastImg.onload()
    })

    placeholder = container.querySelector('span[data-slot="placeholder"]')
    expect(placeholder!.className).toContain('opacity-0')
    expect(placeholder!.className).toContain('bg-transparent')

    // @ts-expect-error - restore
    globalThis.Image = OrigMockImage
    cleanup()
  })
})
