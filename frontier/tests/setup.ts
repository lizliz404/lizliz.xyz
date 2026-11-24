import { vi } from 'vitest';
if (typeof window !== 'undefined') {
Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {} })) });
// jsdom lacks layout. Native dialog top-layer/focus/scroll behavior is reserved for real browser QA.
if (!window.ResizeObserver) window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

// No animation engine in jsdom; exercise SDK presence with zero active animations.
if (!Element.prototype.getAnimations) Element.prototype.getAnimations = () => [];

}
