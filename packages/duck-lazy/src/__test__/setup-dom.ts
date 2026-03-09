import { JSDOM } from 'jsdom'

function set_global(name: PropertyKey, value: unknown) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value,
    writable: true,
  })
}

if (typeof document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')
  const { window } = dom

  set_global('window', window)
  set_global('document', window.document)
  set_global('navigator', window.navigator)
  set_global('Node', window.Node)
  set_global('Element', window.Element)
  set_global('HTMLElement', window.HTMLElement)
  set_global('MutationObserver', window.MutationObserver)
  set_global('getComputedStyle', window.getComputedStyle.bind(window))
  set_global('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 16))
  set_global('cancelAnimationFrame', (handle: number) => clearTimeout(handle))
}
