import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom has no layout engine or observers. These no-ops let components mount; tests override them when they care.
afterEach(cleanup);

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
Object.assign(globalThis, { ResizeObserver: NoopObserver, IntersectionObserver: NoopObserver });

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }),
});

Element.prototype.scrollIntoView = () => {};
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};

// Canvas: any method call is a no-op, any property read gives back a function, so drawing code runs without a real context.
const noopContext = new Proxy({}, { get: (_t, key) => (key === 'canvas' ? undefined : () => ({ width: 0 })), set: () => true });
HTMLCanvasElement.prototype.getContext = (() => noopContext) as unknown as HTMLCanvasElement['getContext'];

URL.createObjectURL = () => 'blob:jsdom';
URL.revokeObjectURL = () => {};

// jsdom has no layout, so every element reports "not rendered". Say it is rendered; tests override this for hidden elements.
Element.prototype.getClientRects = function (this: Element) {
  return [this.getBoundingClientRect()] as unknown as DOMRectList;
};
