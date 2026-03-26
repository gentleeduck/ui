import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
})

Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  HTMLDivElement: dom.window.HTMLDivElement,
  HTMLButtonElement: dom.window.HTMLButtonElement,
  HTMLSpanElement: dom.window.HTMLSpanElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  Event: dom.window.Event,
  MouseEvent: dom.window.MouseEvent,
  KeyboardEvent: dom.window.KeyboardEvent,
  CustomEvent: dom.window.CustomEvent,
  MutationObserver: dom.window.MutationObserver,
  getComputedStyle: dom.window.getComputedStyle,
  requestAnimationFrame: dom.window.requestAnimationFrame,
  cancelAnimationFrame: dom.window.cancelAnimationFrame,
  DocumentFragment: dom.window.DocumentFragment,
  Text: dom.window.Text,
  HTMLCollection: dom.window.HTMLCollection,
  NodeList: dom.window.NodeList,
  NodeFilter: dom.window.NodeFilter,
  ResizeObserver:
    dom.window.ResizeObserver ??
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
})
