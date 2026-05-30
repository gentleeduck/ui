import { JSDOM } from 'jsdom'

function setGlobal(name: PropertyKey, value: unknown) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value,
    writable: true,
  })
}

// React 18+ requires this flag to enable `act()` warnings/support in tests.
// Without it React emits "The current testing environment is not configured to support act(...)"
// on every flush even though the tests still pass.
setGlobal('IS_REACT_ACT_ENVIRONMENT', true)

if (typeof document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')
  const { window } = dom

  setGlobal('window', window)
  setGlobal('document', window.document)
  setGlobal('navigator', window.navigator)
  setGlobal('Node', window.Node)
  setGlobal('Element', window.Element)
  setGlobal('HTMLElement', window.HTMLElement)
  setGlobal('MutationObserver', window.MutationObserver)
  setGlobal('getComputedStyle', window.getComputedStyle.bind(window))
  setGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 16))
  setGlobal('cancelAnimationFrame', (handle: number) => clearTimeout(handle))
}
