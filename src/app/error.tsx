"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useT } from "@/i18n";
import { ICON } from "@/lib/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-24 outline-none" id="main-content" tabIndex={-1}>
      <div className="w-full max-w-lg flex flex-col gap-5">
        <h1
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          {t["error.title"]}
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
          {t["error.body"]}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2 text-sm">
          <button
            type="button"
            onClick={() => reset()}
            className="font-medium hover:opacity-70 transition-opacity"
            style={{
              fontFamily: "var(--font-poppins)",
              color: "var(--fg)",
              background: "none",
              border: 0,
              padding: 0,
              cursor: "pointer",
            }}
          >
            {t["error.retry"]}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            {t["error.home"]}
            <ArrowRightIcon className={ICON} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
