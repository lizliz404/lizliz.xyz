"use client";

import { useT } from "@/i18n";

export default function SkipLink() {
  const t = useT();
  return (
    <a href="#main-content" className="skip-link">
      {t["a11y.skip_to_content"]}
    </a>
  );
}
