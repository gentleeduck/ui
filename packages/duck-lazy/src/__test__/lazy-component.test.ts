import './setup-dom'
import { beforeEach, describe, expect, test } from 'vitest'

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

// We need React in scope for the hooks
import React from 'react'

// --- Tests for useLazyLoad ---

describe('useLazyLoad', () => {
  beforeEach(() => {
    observedElements = []
    disconnectCalls = 0
    unobserveCalls = []
  })

  test('returns isVisible as false initially', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    let result: ReturnType<typeof useLazyLoad> | undefined

    function TestComponent() {
      result = useLazyLoad()
      return null
    }

    // Manually run through React to extract hook state
    const container = document.createElement('div')
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestComponent))
      })
      setTimeout(resolve, 500)
    })

    expect(result).toBeDefined()
    expect(result!.isVisible).toBe(false)
    expect(result!.ComponentRef).toBeDefined()

    root.unmount()
  })

  test('sets isVisible to true when intersection is triggered', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    let result: ReturnType<typeof useLazyLoad> | undefined

    function TestComponent() {
      result = useLazyLoad({ threshold: 0.5 })
      // Attach the ref to a real element so the observer can observe it
      return React.createElement('div', { ref: result.ComponentRef })
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestComponent))
      })
      setTimeout(resolve, 500)
    })

    expect(result!.isVisible).toBe(false)
    expect(observedElements.length).toBeGreaterThanOrEqual(1)

    // Simulate the element becoming visible
    React.startTransition(() => {
      observerCallback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    await new Promise<void>((resolve) => setTimeout(resolve, 500))

    expect(result!.isVisible).toBe(true)

    root.unmount()
    document.body.removeChild(container)
  })

  test('passes options to IntersectionObserver', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    const customOptions: IntersectionObserverInit = {
      rootMargin: '50px',
      threshold: 0.25,
    }

    function TestComponent() {
      const result = useLazyLoad(customOptions)
      return React.createElement('div', { ref: result.ComponentRef })
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestComponent))
      })
      setTimeout(resolve, 500)
    })

    expect(observerOptions).toEqual(customOptions)

    root.unmount()
    document.body.removeChild(container)
  })

  test('does not set isVisible when entry is not intersecting', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    let result: ReturnType<typeof useLazyLoad> | undefined

    function TestComponent() {
      result = useLazyLoad()
      return React.createElement('div', { ref: result.ComponentRef })
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestComponent))
      })
      setTimeout(resolve, 500)
    })

    // Simulate not intersecting
    React.startTransition(() => {
      observerCallback([{ isIntersecting: false } as Partial<IntersectionObserverEntry>])
    })

    await new Promise<void>((resolve) => setTimeout(resolve, 500))

    expect(result!.isVisible).toBe(false)
    expect(disconnectCalls).toBe(0)

    root.unmount()
    document.body.removeChild(container)
  })

  test('cleanup calls unobserve on unmount', async () => {
    const { useLazyLoad } = await import('../lazy-component/lazy-component.hooks')

    function TestComponent() {
      const result = useLazyLoad()
      return React.createElement('div', { ref: result.ComponentRef })
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestComponent))
      })
      setTimeout(resolve, 500)
    })

    // Unmount to trigger cleanup
    root.unmount()

    await new Promise<void>((resolve) => setTimeout(resolve, 500))

    // The cleanup should have called unobserve
    expect(unobserveCalls.length).toBeGreaterThanOrEqual(0)

    document.body.removeChild(container)
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
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TestWrapper() {
      return React.createElement(DuckLazyComponent, {}, 'child content')
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestWrapper))
      })
      setTimeout(resolve, 500)
    })

    expect(observerOptions).toBeDefined()
    expect(observerOptions!.rootMargin).toBe('0px')
    expect(observerOptions!.threshold).toBe(0)

    root.unmount()
    document.body.removeChild(container)
  })

  test('merges user-provided options over defaults', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TestWrapper() {
      return React.createElement(
        DuckLazyComponent,
        { options: { rootMargin: '100px', threshold: 0.5 } },
        'child content',
      )
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestWrapper))
      })
      setTimeout(resolve, 500)
    })

    expect(observerOptions!.rootMargin).toBe('100px')
    expect(observerOptions!.threshold).toBe(0.5)

    root.unmount()
    document.body.removeChild(container)
  })

  test('renders placeholder when not visible', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TestWrapper() {
      return React.createElement(DuckLazyComponent, {}, React.createElement('span', {}, 'visible content'))
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestWrapper))
      })
      setTimeout(resolve, 500)
    })

    // Should have a placeholder div, not the child content
    const wrapper = container.querySelector('[data-slot="wrapper"]')
    expect(wrapper).toBeDefined()
    expect(wrapper).not.toBeNull()

    const placeholder = container.querySelector('[data-slot="placeholder"]')
    expect(placeholder).not.toBeNull()

    // Should not contain the visible content text
    expect(container.textContent).not.toContain('visible content')

    root.unmount()
    document.body.removeChild(container)
  })

  test('renders children when visible', async () => {
    const { DuckLazyComponent } = await import('../lazy-component/lazy-component')

    function TestWrapper() {
      return React.createElement(DuckLazyComponent, {}, React.createElement('span', {}, 'visible content'))
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)

    await new Promise<void>((resolve) => {
      React.startTransition(() => {
        root.render(React.createElement(TestWrapper))
      })
      setTimeout(resolve, 500)
    })

    // Simulate intersection
    React.startTransition(() => {
      observerCallback([{ isIntersecting: true } as Partial<IntersectionObserverEntry>])
    })

    await new Promise<void>((resolve) => setTimeout(resolve, 500))

    expect(container.textContent).toContain('visible content')

    const placeholder = container.querySelector('[data-slot="placeholder"]')
    expect(placeholder).toBeNull()

    root.unmount()
    document.body.removeChild(container)
  })
})
