import './setup-dom'
import React, { act } from 'react'
import { beforeEach, describe, expect, test } from 'vitest'
import { DuckLazyComponent } from '../lazy-component/lazy-component'
import { useLazyLoad } from '../lazy-component/lazy-component.hooks'

// --- IntersectionObserver mock ---

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

let observerCallback: IntersectionCallback
let observerOptions: IntersectionObserverInit | undefined
let observedElements: Element[]
let disconnectCalls: number
let unobserveCalls: Element[]

class MockIntersectionObserver {
  constructor(callback: IntersectionCallback, options?: IntersectionObserverInit) {
    observerCallback = callback
    observerOptions = options
    observedElements = []
  }
  observe(el: Element) {
    observedElements.push(el)
  }
  unobserve(el: Element) {
    unobserveCalls.push(el)
  }
  disconnect() {
    disconnectCalls++
  }
}

// @ts-expect-error - mock
globalThis.IntersectionObserver = MockIntersectionObserver

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

// --- Tests for useLazyLoad ---

describe('useLazyLoad', () => {
  beforeEach(() => {
    observedElements = []
    disconnectCalls = 0
    unobserveCalls = []
  })

  test('returns isVisible as false initially', async () => {
    let result: ReturnType<typeof useLazyLoad> | undefined

    function TestComponent() {
      result = useLazyLoad()
      return null
    }

    const { cleanup } = await mount(React.createElement(TestComponent))

    expect(result).toBeDefined()
    expect(result!.isVisible).toBe(false)
    expect(result!.ref).toBeDefined()
    cleanup()
  })

  test('sets isVisible to true when intersection is triggered', async () => {
    let result: ReturnType<typeof useLazyLoad> | undefined

    function TestComponent() {
      result = useLazyLoad({ threshold: 0.5 })
      return React.createElement('div', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TestComponent))

    expect(result!.isVisible).toBe(false)
    expect(observedElements.length).toBeGreaterThanOrEqual(1)

    await act(async () => {
      observerCallback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    expect(result!.isVisible).toBe(true)
    cleanup()
  })

  test('passes options to IntersectionObserver', async () => {
    const customOptions: IntersectionObserverInit = {
      rootMargin: '50px',
      threshold: 0.25,
    }

    function TestComponent() {
      const result = useLazyLoad(customOptions)
      return React.createElement('div', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TestComponent))

    expect(observerOptions?.rootMargin).toBe('50px')
    expect(observerOptions?.threshold).toBe(0.25)
    cleanup()
  })

  test('does not set isVisible when entry is not intersecting', async () => {
    let result: ReturnType<typeof useLazyLoad> | undefined

    function TestComponent() {
      result = useLazyLoad()
      return React.createElement('div', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TestComponent))

    await act(async () => {
      observerCallback([{ isIntersecting: false } as Partial<IntersectionObserverEntry>])
    })

    expect(result!.isVisible).toBe(false)
    expect(disconnectCalls).toBe(0)
    cleanup()
  })

  test('cleanup calls unobserve on unmount', async () => {
    function TestComponent() {
      const result = useLazyLoad()
      return React.createElement('div', { ref: result.ref })
    }

    const { cleanup } = await mount(React.createElement(TestComponent))

    const observedBefore = observedElements.length
    cleanup()

    // unobserve should be called for each observed element during cleanup
    expect(unobserveCalls.length).toBeGreaterThanOrEqual(observedBefore)
  })
})

// --- Tests for DuckLazyComponent ---

describe('DuckLazyComponent', () => {
  beforeEach(() => {
    observedElements = []
    disconnectCalls = 0
    unobserveCalls = []
  })

  test('applies default options (rootMargin "0px", threshold 0)', async () => {
    function TestWrapper() {
      return React.createElement(DuckLazyComponent, {}, 'child content')
    }

    const { cleanup } = await mount(React.createElement(TestWrapper))

    expect(observerOptions).toBeDefined()
    expect(observerOptions!.rootMargin).toBe('0px')
    expect(observerOptions!.threshold).toBe(0)
    cleanup()
  })

  test('merges user-provided options over defaults', async () => {
    function TestWrapper() {
      return React.createElement(
        DuckLazyComponent,
        { options: { rootMargin: '100px', threshold: 0.5 } },
        'child content',
      )
    }

    const { cleanup } = await mount(React.createElement(TestWrapper))

    expect(observerOptions!.rootMargin).toBe('100px')
    expect(observerOptions!.threshold).toBe(0.5)
    cleanup()
  })

  test('renders placeholder when not visible', async () => {
    function TestWrapper() {
      return React.createElement(DuckLazyComponent, {}, React.createElement('span', {}, 'visible content'))
    }

    const { container, cleanup } = await mount(React.createElement(TestWrapper))

    const wrapper = container.querySelector('[data-slot="wrapper"]')
    expect(wrapper).not.toBeNull()

    const placeholder = container.querySelector('[data-slot="placeholder"]')
    expect(placeholder).not.toBeNull()

    expect(container.textContent).not.toContain('visible content')
    cleanup()
  })

  test('renders children when visible', async () => {
    function TestWrapper() {
      return React.createElement(DuckLazyComponent, {}, React.createElement('span', {}, 'visible content'))
    }

    const { container, cleanup } = await mount(React.createElement(TestWrapper))

    await act(async () => {
      observerCallback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    expect(container.textContent).toContain('visible content')

    const placeholder = container.querySelector('[data-slot="placeholder"]')
    expect(placeholder).toBeNull()
    cleanup()
  })
})
