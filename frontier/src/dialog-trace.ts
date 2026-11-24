import type { DialogOpenChangeDetails } from '@ui-sdk/solid/dialog';
function label(node: EventTarget | null): string {
  if (!(node instanceof Element)) return node instanceof Window ? 'window' : node instanceof Document ? 'document' : 'other';
  return `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${node.getAttribute('data-slot') ? `[data-slot=${node.getAttribute('data-slot')}]` : ''}`;
}
function elementState(element: Element | null) {
  if (!(element instanceof HTMLElement)) return null;
  const rect = element.getBoundingClientRect();
  let open = false;
  try { open = element.matches(':popover-open'); } catch { /* Unsupported in jsdom/older engines. */ }
  return { target: label(element), rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, popover: element.getAttribute('popover'), nativeOpen: open,
    inertAncestors: Array.from(function* () { for (let node: HTMLElement | null = element; node; node = node.parentElement) if (node.inert) yield label(node); }()) };
}
function eventSnapshot(event: Event, phase: 'capture' | 'after-task') {
  const pointer = event instanceof MouseEvent ? { x: event.clientX, y: event.clientY, detail: event.detail, buttons: event.buttons, button: event.button,
    pointerType: 'pointerType' in event ? String(event.pointerType) : 'not-provided', pointerId: 'pointerId' in event ? Number(event.pointerId) : null } : null;
  const hit = pointer && document.elementsFromPoint ? document.elementsFromPoint(pointer.x, pointer.y).slice(0, 5).map(label) : [];
  return { kind: 'event', phase, type: event.type, trusted: event.isTrusted, prevented: event.defaultPrevented,
    target: label(event.target), path: event.composedPath().slice(0, 6).map(label), pointer, hit,
    panel: elementState(document.querySelector('[data-slot=dialog-content]')), backdrop: elementState(document.querySelector('[data-slot=dialog-backdrop]')),
    selectionLength: document.getSelection()?.toString().length ?? 0 } satisfies { kind: 'event'; phase: string; type: string; trusted: boolean; prevented: boolean; target: string; path: string[]; pointer: unknown; hit: string[]; panel: unknown; backdrop: unknown; selectionLength: number };
}
function changeSnapshot(open: boolean, details: DialogOpenChangeDetails) {
  return { kind: 'sdk-change', open, reason: details.reason, eventType: details.event?.type ?? null } satisfies { kind: 'sdk-change'; open: boolean; reason: string; eventType: string | null };
}
type Entry = ReturnType<typeof eventSnapshot> | ReturnType<typeof changeSnapshot>;
export interface DialogTrace { version: 1; path: string; stylesheets: string[]; scripts: string[]; events: (Entry & { at: number })[] }
declare global { interface Window { __lizDialogTrace?: DialogTrace } }
let append: ((entry: Entry) => void) | undefined;
export function traceDialogChange(open: boolean, details: DialogOpenChangeDetails) { append?.(changeSnapshot(open, details)); }
/** Read-only, opt-in observer. Never cancels events, moves focus or changes SDK behavior. */
export function installDialogTrace() {
  if (new URLSearchParams(location.search).get('traceDialog') !== '1') return;
  const trace: DialogTrace = { version: 1, path: location.pathname,
    stylesheets: Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')).map(link => link.href),
    scripts: Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]')).map(script => script.src), events: [] };
  window.__lizDialogTrace = trace;
  const write = (entry: Entry) => {
    trace.events.push({ ...entry, at: performance.now() }); if (trace.events.length > 240) trace.events.shift();
    try { sessionStorage.setItem('liz-frontier-dialog-trace', JSON.stringify(trace)); } catch { /* Diagnostics remain available in memory. */ }
  };
  append = write;
  const observe = (event: Event) => {
    write(eventSnapshot(event, 'capture'));
    // Native dispatch can checkpoint microtasks between listeners; use the next task.
    // Paths are only available in capture; a navigation may prevent this later snapshot.
    setTimeout(() => write(eventSnapshot(event, 'after-task')), 0);
  };
  const events = ['pointerdown', 'pointerup', 'pointercancel', 'click', 'gotpointercapture', 'lostpointercapture'];
  events.forEach(type => window.addEventListener(type, observe, { capture: true, passive: true }));
  return () => { events.forEach(type => window.removeEventListener(type, observe, true)); if (append === write) append = undefined; };
}
