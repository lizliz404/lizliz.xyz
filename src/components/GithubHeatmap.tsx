"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

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

const WEEK_COUNT = 52;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildRollingWeeks(days: Day[]): { weeks: Week[]; total: number } {
  const byDate = new Map(days.map((day) => [day.date, day]));
  const latest = days.length > 0
    ? new Date(days[days.length - 1].date + "T00:00:00Z")
    : new Date();
  const end = new Date(latest);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - (WEEK_COUNT * 7 - 1));

  const weeks: Week[] = [];
  let total = 0;
  for (let wi = 0; wi < WEEK_COUNT; wi += 1) {
    const contributionDays: Day[] = [];
    for (let di = 0; di < 7; di += 1) {
      const date = new Date(start.getTime() + (wi * 7 + di) * MS_PER_DAY);
      const dateKey = toIsoDate(date);
      const existing = byDate.get(dateKey);
      const contributionCount = existing?.contributionCount ?? 0;
      total += contributionCount;
      contributionDays.push({
        contributionCount,
        date: dateKey,
        weekday: date.getUTCDay(),
      });
    }
    weeks.push({ contributionDays });
  }

  return { weeks, total };
}

export default function GithubHeatmap() {
  const [data, setData] = useState<{ total: number; weeks: Week[] } | null>(null);

  useEffect(() => {
    fetch("/github-heatmap.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const sourceDays = useMemo(
    () => data?.weeks.flatMap((w) => w.contributionDays) ?? [],
    [data],
  );
  const { weeks, total } = useMemo(() => buildRollingWeeks(sourceDays), [sourceDays]);

  if (!data || sourceDays.length === 0) return null;

  const allDays = weeks.flatMap((w) => w.contributionDays);
  const maxCount = Math.max(...allDays.map((d) => d.contributionCount), 1);
  const heatmapWidth = weeks.length * 13;
  const heatmapScaleStyle = {
    "--heatmap-width": `${heatmapWidth}px`,
  } as CSSProperties;

  // Build month labels from first day of each month in the rolling window.
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    week.contributionDays.forEach((day) => {
      const m = new Date(day.date + "T00:00:00Z").getUTCMonth();
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
      data-heatmap="github"
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
          {total} contributions in 52 weeks
        </span>
      </div>

      <div className="w-full overflow-hidden">
        {/* Month labels */}
        <div className="flex mb-[2px]" style={{ paddingLeft: "14px" }}>
          <div
            className="github-heatmap-scale flex gap-[2px] origin-left"
            style={heatmapScaleStyle}
          >
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
          <div className="github-heatmap-scale flex gap-[2px] origin-left" style={heatmapScaleStyle} data-heatmap-grid="weeks">
            {weeks.map((week, wi) => (
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
