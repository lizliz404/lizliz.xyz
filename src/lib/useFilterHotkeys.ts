"use client";

import { useEffect, type RefObject } from "react";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

/** Connect menu, dialogs, and other overlays that already own Escape. */
export function isOverlayOpen(): boolean {
  if (document.querySelector("details[open]")) return true;
  if (document.querySelector("[data-show='1']")) return true;
  for (const el of document.querySelectorAll<HTMLElement>("[role='dialog'], [aria-modal='true']")) {
    if (el.getAttribute("aria-hidden") === "true") continue;
    const state = el.getAttribute("data-state");
    if (state === "closed") continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return true;
  }
  return false;
}

function focusFilter(root: HTMLElement | null) {
  if (!root) return;
  if (root instanceof HTMLInputElement || root instanceof HTMLTextAreaElement) {
    root.focus();
    root.select();
    return;
  }
  const current = root.querySelector<HTMLElement>("[aria-current]");
  const first = root.querySelector<HTMLElement>(
    "input, textarea, a, button, [tabindex]:not([tabindex='-1'])",
  );
  (current ?? first ?? root).focus();
}

/** `/` focuses a list filter; Escape blurs it unless a dialog/menu is open. */
export function useFilterHotkeys<T extends HTMLElement>(
  focusRef: RefObject<T | null>,
  onEscape?: () => boolean,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.isComposing || e.key === "Process") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "/" && !e.shiftKey) {
        if (isEditableTarget(e.target)) return;
        if (isOverlayOpen()) return;
        const root = focusRef.current;
        if (!root) return;
        e.preventDefault();
        focusFilter(root);
        return;
      }

      if (e.key !== "Escape") return;
      if (isOverlayOpen()) return;
      const root = focusRef.current;
      const active = document.activeElement;
      if (root && active instanceof HTMLElement && (active === root || root.contains(active))) {
        e.preventDefault();
        active.blur();
        return;
      }
      onEscape?.();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusRef, onEscape]);
}
