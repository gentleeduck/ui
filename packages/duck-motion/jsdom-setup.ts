import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost',
})

Object.assign(globalThis, {
  CustomEvent: dom.window.CustomEvent,
  document: dom.window.document,
  Element: dom.window.Element,
  Event: dom.window.Event,
  HTMLElement: dom.window.HTMLElement,
  HTMLDivElement: dom.window.HTMLDivElement,
  HTMLButtonElement: dom.window.HTMLButtonElement,
  HTMLSpanElement: dom.window.HTMLSpanElement,
  navigator: dom.window.navigator,
  Node: dom.window.Node,
  requestAnimationFrame: dom.window.requestAnimationFrame,
  cancelAnimationFrame: dom.window.cancelAnimationFrame,
  window: dom.window,
})
