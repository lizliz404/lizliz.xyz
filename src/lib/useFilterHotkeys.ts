"use client";

import { useEffect, type RefObject } from "react";

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/** Connect <details> or the projects marquee peek — existing Esc owners. */
function overlayBlocksHotkey(): boolean {
  return Boolean(
    document.querySelector("details[open], [data-show='1']"),
  );
}

function firstFocusable(root: HTMLElement): HTMLElement | null {
  const current = root.querySelector<HTMLElement>("[aria-current]");
  if (current) return current;
  const expanded = root.querySelector<HTMLElement>("[aria-expanded='true']");
  if (expanded) return expanded;
  return root.querySelector<HTMLElement>(
    "a[href],button:not([disabled]),[tabindex]:not([tabindex='-1'])",
  );
}

/**
 * `/` focuses the page filter (chips or list). Esc blurs it or lets
 * the caller close/clear. Does not add ⌘K.
 */
export function useFilterHotkeys({
  focusRef,
  onEscape,
}: {
  focusRef: RefObject<HTMLElement | null>;
  onEscape?: () => boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;

      if (e.key === "/" && !e.repeat) {
        if (isTypingTarget(e.target)) return;
        if (overlayBlocksHotkey()) return;
        const root = focusRef.current;
        const target = root ? firstFocusable(root) : null;
        if (!target) return;
        e.preventDefault();
        target.focus();
        return;
      }

      if (e.key !== "Escape") return;
      if (overlayBlocksHotkey()) return;
      if (isTypingTarget(e.target)) {
        (e.target as HTMLElement).blur();
        e.preventDefault();
        return;
      }
      if (onEscape?.()) e.preventDefault();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusRef, onEscape]);
}
