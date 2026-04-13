import { JSDOM } from 'jsdom'

function setGlobal(name: PropertyKey, value: unknown) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value,
    writable: true,
  })
}

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
