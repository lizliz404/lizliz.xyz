import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import { App } from '../src/App';
let dispose: (() => void) | undefined;
const settle = async () => { flush(); await new Promise(resolve => setTimeout(resolve, 30)); flush(); };
function pointer(target: Element, type: string, pointerType: 'mouse' | 'touch', x: number, y: number) {
  const event = new MouseEvent(type, { bubbles: true, composed: true, cancelable: true, button: 0, clientX: x, clientY: y });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  target.dispatchEvent(event); return event;
}
function click(target: Element, x: number, y: number) {
  const event = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, button: 0, detail: 1, clientX: x, clientY: y });
  target.dispatchEvent(event); return event;
}
function hasInertAncestor(el: Element | null) {
  for (let node = el; node; node = node.parentElement) if (node instanceof HTMLElement && node.inert) return true;
  return false;
}
async function open() {
  // Exercise SDK's native-capability branch (no Portal-to-body fallback).
  // This is NOT a browser implementation of popovers, hit testing, pointer capture or inert.
  Object.defineProperty(HTMLElement.prototype, 'showPopover', { configurable: true, value() {} });
  Object.defineProperty(HTMLElement.prototype, 'hidePopover', { configurable: true, value() {} });
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('[]'));
  const root = document.createElement('div'); document.body.append(root);
  dispose = render(() => <App path="/"/>, root); await settle();
  const trigger = root.querySelector<HTMLButtonElement>('button[aria-keyshortcuts]'); if (!trigger) throw new Error('Missing trigger');
  trigger.click(); await settle();
  const panel = document.querySelector<HTMLElement>('[role=dialog]');
  const backdrop = document.querySelector<HTMLElement>('[data-slot=dialog-backdrop]');
  const intro = document.querySelector<HTMLElement>('[data-slot=dialog-description]');
  if (!panel || !backdrop || !intro) throw new Error('Missing real SDK parts');
  vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(new DOMRect(14, 112.5, 347, 760));
  return { root, panel, backdrop, intro };
}
afterEach(() => {
  dispose?.(); document.body.replaceChildren();
  Reflect.deleteProperty(HTMLElement.prototype, 'showPopover'); Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover'); vi.restoreAllMocks();
});
describe('full gesture contracts in SDK native-capability path (semantic, not browser proof)', () => {
  it('keeps panel and backdrop interactive and the underlying navigation inert', async () => {
    const { root, panel, backdrop, intro } = await open();
    expect(hasInertAncestor(panel)).toBe(false); expect(hasInertAncestor(backdrop)).toBe(false); expect(hasInertAncestor(intro)).toBe(false);
    expect(hasInertAncestor(root.querySelector('nav a'))).toBe(true);
  });
  it.each([[5, 500], [190, 930]])('dismisses a complete touch tap outside at %s,%s and consumes its click', async (x, y) => {
    const { backdrop } = await open();
    pointer(backdrop, 'pointerdown', 'touch', x, y); pointer(backdrop, 'pointerup', 'touch', x, y);
    const completed = click(backdrop, x, y); await settle();
    expect(document.querySelector('[role=dialog]')).toBeNull(); expect(completed.defaultPrevented).toBe(true);
  });
  it('dismisses a touch tap retargeted by a native ::backdrop to the panel outside its bounds', async () => {
    const { panel } = await open();
    pointer(panel, 'pointerdown', 'touch', 5, 500); pointer(panel, 'pointerup', 'touch', 5, 500);
    const completed = click(panel, 5, 500); await settle();
    expect(document.querySelector('[role=dialog]')).toBeNull(); expect(completed.defaultPrevented).toBe(true);
  });
  it.each(['mouse', 'touch'] satisfies ('mouse' | 'touch')[])('keeps a %s text-start drag open through compatibility click and underlying links inert', async pointerType => {
    const { root, intro, backdrop } = await open();
    pointer(intro, 'pointerdown', pointerType, 60, 180);
    pointer(backdrop, 'pointermove', pointerType, 5, 90);
    pointer(backdrop, 'pointerup', pointerType, 5, 90);
    click(backdrop, 5, 90); await settle();
    expect(document.querySelector('[role=dialog]')).not.toBeNull();
    expect(hasInertAncestor(root.querySelector('nav a'))).toBe(true);
  });
});
