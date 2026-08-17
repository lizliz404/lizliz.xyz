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
  return Boolean(
    document.querySelector("details[open], [role='dialog'], [aria-modal='true']"),
  );
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
      if (e.isComposing) return;

      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        if (isEditableTarget(e.target)) return;
        e.preventDefault();
        focusFilter(focusRef.current);
        return;
      }

      if (e.key !== "Escape") return;
      if (isOverlayOpen()) return;
      const root = focusRef.current;
      const active = document.activeElement;
      if (root && active instanceof HTMLElement && (active === root || root.contains(active))) {
        active.blur();
        return;
      }
      onEscape?.();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusRef, onEscape]);
}
