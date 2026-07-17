"use client";

import { useEffect, useState } from "react";
import { useT } from "@/i18n";

interface Day {
  contributionCount: number;
  date: string;
  weekday: number;
}

interface Week {
  contributionDays: Day[];
}

// Levels: 0=none, 1=low, 2=medium, 3=high, 4=max
function getLevel(count: number, max: number): number {
  if (count === 0) return 0;
  if (count <= max * 0.25) return 1;
  if (count <= max * 0.5) return 2;
  if (count <= max * 0.75) return 3;
  return 4;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function GithubHeatmap() {
  const t = useT();
  const [data, setData] = useState<{ total: number; weeks: Week[] } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/github-heatmap.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <a
        href="https://github.com/lizliz404"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm"
        style={{ color: "var(--fg-secondary)", opacity: 0.6 }}
      >
        {t["heatmap.error"]} →
      </a>
    );
  }

  if (!data) return null;

  const allDays = data.weeks.flatMap((w) => w.contributionDays);
  if (allDays.length === 0) return null;

  const maxCount = Math.max(...allDays.map((d) => d.contributionCount), 1);

  // Build month labels from first day of each month
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  data.weeks.forEach((week, wi) => {
    week.contributionDays.forEach((day) => {
      const m = new Date(day.date).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ label: MONTHS[m], col: wi });
        lastMonth = m;
      }
    });
  });

  return (
    <a
      href="https://github.com/lizliz404"
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "var(--fg-secondary)", opacity: 0.4, fontFamily: "var(--font-poppins)" }}
        >
          github
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--fg-secondary)", opacity: 0.4 }}
        >
          {data.total} contributions this year
        </span>
      </div>

      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-[2px]" style={{ paddingLeft: "14px" }}>
          <div className="flex gap-[2px]" style={{ minWidth: data.weeks.length * 13 }}>
            {monthLabels.map((ml, i) => (
              <span
                key={i}
                className="text-[9px]"
                style={{
                  position: "relative",
                  left: `${ml.col * 13}px`,
                  color: "var(--fg-secondary)",
                  opacity: 0.3,
                  fontFamily: "var(--font-poppins)",
                }}
              >
                {ml.label}
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex gap-[2px]">
          {/* Weekday labels */}
          <div className="flex flex-col gap-[2px] pr-1" style={{ width: "12px" }}>
            {["","M","","W","","F",""].map((label, i) => (
              <div
                key={i}
                className="text-[8px] flex items-center justify-end"
                style={{
                  height: "11px",
                  color: "var(--fg-secondary)",
                  opacity: label ? 0.25 : 0,
                  fontFamily: "var(--font-poppins)",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Contribution squares */}
          <div className="flex gap-[2px]">
            {data.weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.contributionDays.map((day, di) => {
                  const level = getLevel(day.contributionCount, maxCount);
                  return (
                    <div
                      key={di}
                      className="rounded-sm transition-all group-hover:brightness-90"
                      style={{
                        width: "11px",
                        height: "11px",
                        backgroundColor:
                          level === 0
                            ? "var(--color-muted)"
                            : level === 1
                              ? "color-mix(in oklab, var(--color-green) 25%, var(--color-muted))"
                              : level === 2
                                ? "color-mix(in oklab, var(--color-green) 50%, var(--color-muted))"
                                : level === 3
                                  ? "color-mix(in oklab, var(--color-green) 75%, var(--color-muted))"
                                  : "var(--color-green)",
                        opacity: level === 0 ? 0.4 : 1,
                      }}
                      title={`${day.contributionCount} contributions on ${day.date}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
