"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FairDetail } from "./FairDetail";
import {
  MONTHS,
  TIERS,
  monthKey,
  monthLabel,
  monthNotes,
  monthsOf,
  tierClass,
  tierDashed,
  toDate,
  type City,
  type Fair,
  type Tier,
} from "./fairs";

const CITIES: City[] = ["宁波", "义乌", "广州", "上海"];

/** 查过且确实没有展的月份。没查过的月份不要放进来。 */
const GAP = new Set(["2027-01"]);

/** 年历默认只画「值得去 / 看情况」，弱和不去收起来，但会显示还有几场。 */
const KEEP: Tier[] = ["强", "中"];

const chipClass = (f: Fair) => (f.kind === "exact" ? tierClass[f.tier] : tierDashed[f.tier]);

const monthShort = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  if (key === "2026-10") return "10月末";
  if (m === 1) return `27·1月`;
  return `${m}月`;
};

const startInMonth = (f: Fair, key: string) => {
  for (const [a, b] of f.spans) {
    const s = toDate(a);
    const e = toDate(b);
    const first = toDate(`${key}-01`);
    if (monthKey(s) === key) return s.getTime();
    if (s < first && e >= first) return first.getTime();
  }
  return Number.MAX_SAFE_INTEGER;
};

/** 清单里的日期：只显示落在当月的那几段；惯例 / 没核实的日期前面加 ≈。 */
const listDate = (f: Fair, key: string) => {
  if (f.kind === "month") return monthLabel(f.month ?? key);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  const parts = f.spans
    .filter(([a, b]) => monthKey(toDate(a)) <= key && monthKey(toDate(b)) >= key)
    .map(([a, b]) => {
      const s = toDate(a);
      const e = toDate(b);
      const end = s.getMonth() === e.getMonth() ? String(e.getDate()) : fmt(e);
      return `${fmt(s)}–${end}`;
    });
  return (f.kind === "approx" ? "≈" : "") + parts.join("、");
};

/** 下一场还赶得上的「值得去 / 看情况」的展，用它所在的月份做默认视图。 */
const nextMonth = (fairs: Fair[], todayMillis: number | null) => {
  if (!todayMillis) return "2026-11";
  const upcoming = fairs
    .filter((f) => KEEP.includes(f.tier) && f.spans.length)
    .filter((f) => Math.max(...f.spans.map(([, b]) => toDate(b).getTime())) >= todayMillis)
    .sort((a, b) => toDate(a.spans[0][0]).getTime() - toDate(b.spans[0][0]).getTime());
  return upcoming.length ? monthKey(toDate(upcoming[0].spans[0][0])) : MONTHS[MONTHS.length - 1];
};

/** 这场展是不是已经结束（只有确定日期才判断）。 */
const ended = (f: Fair, todayMillis: number | null) => {
  if (!todayMillis || f.kind === "month" || !f.spans.length) return false;
  return Math.max(...f.spans.map(([, b]) => toDate(b).getTime())) < todayMillis;
};

export function FairExplorer({ fairs }: { fairs: Fair[] }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 服务端先按 2026-11 渲染，挂载后再跳到「下一场还赶得上的展」所在月份，避免 hydration 不一致。
  useEffect(() => setMounted(true), []);

  const todayMillis = useMemo(() => {
    if (!mounted) return null;
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }, [mounted]);

  const month = useMemo(() => {
    if (picked) return picked;
    return nextMonth(fairs, todayMillis);
  }, [picked, todayMillis, fairs]);

  const visible = useMemo(
    () => (showAll ? fairs : fairs.filter((f) => KEEP.includes(f.tier))),
    [fairs, showAll],
  );

  const byMonth = useMemo(() => {
    const map: Record<string, Fair[]> = {};
    for (const key of MONTHS) map[key] = [];
    for (const f of visible) for (const key of monthsOf(f)) map[key]?.push(f);
    for (const key of MONTHS) {
      map[key].sort((a, b) => {
        if ((a.kind === "month") !== (b.kind === "month")) return a.kind === "month" ? 1 : -1;
        return startInMonth(a, key) - startInMonth(b, key);
      });
    }
    return map;
  }, [visible]);

  const hidden = useMemo(() => {
    const byMonth: Record<string, number> = {};
    const byCell: Record<string, number> = {};
    for (const key of MONTHS) byMonth[key] = 0;
    if (showAll) return { byMonth, byCell };
    for (const f of fairs) {
      if (KEEP.includes(f.tier)) continue;
      for (const key of monthsOf(f)) {
        if (byMonth[key] === undefined) continue;
        byMonth[key] += 1;
        const cellKey = `${key}|${f.city}`;
        byCell[cellKey] = (byCell[cellKey] ?? 0) + 1;
      }
    }
    return { byMonth, byCell };
  }, [fairs, showAll]);

  const list = byMonth[month] ?? [];
  const dated = list.filter((f) => f.kind !== "month");
  const monthOnly = list.filter((f) => f.kind === "month");
  const idx = MONTHS.indexOf(month);

  const jump = (key: string, id?: string) => {
    setPicked(key);
    if (id) setOpenId(id);
  };

  const chip = (f: Fair, key: string) => (
    <button
      key={f.id + key}
      type="button"
      onClick={() => jump(key, f.id)}
      onMouseEnter={() => setHoverId(f.id)}
      onMouseLeave={() => setHoverId(null)}
      onFocus={() => setHoverId(f.id)}
      onBlur={() => setHoverId(null)}
      aria-label={`${f.dates} ${f.city} ${f.name}（${f.tier}）`}
      className={cn(
        "block w-full truncate rounded px-1.5 py-1 text-left text-[13px] leading-snug transition-shadow",
        chipClass(f),
        hoverId === f.id && "ring-2 ring-sky-500 ring-offset-1 ring-offset-background",
      )}
    >
      {f.short}
    </button>
  );

  const cell = (key: string, city: City, compact = false) => {
    const items = byMonth[key].filter((f) => f.city === city);
    const hiddenHere = hidden.byCell[`${key}|${city}`] ?? 0;
    return (
      <div
        key={city}
        className={cn(
          "space-y-1.5 border-b border-l p-1.5",
          key === month && "bg-muted/50",
          GAP.has(key) && "bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--color-muted)_6px_8px)]",
        )}
      >
        {items.map((f) => chip(f, key))}
        {hiddenHere ? (
          <button
            type="button"
            onClick={() => {
              setShowAll(true);
              jump(key);
            }}
            className="block w-full truncate rounded px-1.5 text-left text-xs text-muted-foreground hover:underline"
          >
            +{hiddenHere} 场弱/不推荐
          </button>
        ) : null}
        {compact && !items.length && !hiddenHere && !GAP.has(key) ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-4" data-slot="fair-explorer">
      {/* ── 全年一览：城市 × 月份 ── */}
      <div>
        <div className="hidden overflow-hidden rounded-lg border md:block">
          <div className="grid grid-cols-[4rem_repeat(13,minmax(0,1fr))] text-sm">
            <div className="border-b bg-muted/40" />
            {MONTHS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => jump(key)}
                className={cn(
                  "border-b border-l px-1 py-2.5 text-center font-medium tabular-nums transition-colors hover:bg-muted",
                  key === month ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted/40",
                )}
              >
                {monthShort(key)}
              </button>
            ))}
            {CITIES.map((city) => (
              <div key={city} className="contents">
                <div className="flex items-start border-b px-2 py-2.5 text-[13px] font-medium last:border-b-0">{city}</div>
                {MONTHS.map((key) => cell(key, city))}
              </div>
            ))}
          </div>
        </div>

        {/* 窄屏：月份做行，四城做列；列太窄就横向滑，不压字号 */}
        <div className="overflow-hidden rounded-lg border md:hidden">
          <div className="overflow-x-auto">
          <div className="grid min-w-[34rem] grid-cols-[4.25rem_repeat(4,minmax(0,1fr))] text-sm">
            <div className="border-b bg-muted/40" />
            {CITIES.map((city) => (
              <div key={city} className="border-b border-l bg-muted/40 px-1 py-2.5 text-center font-medium">
                {city}
              </div>
            ))}
            {MONTHS.map((key) => (
              <div key={key} className="contents">
                <button
                  type="button"
                  onClick={() => jump(key)}
                  className={cn(
                    "border-b px-1.5 py-2.5 text-left font-medium tabular-nums",
                    key === month && "bg-foreground text-background",
                  )}
                >
                  {monthShort(key)}
                </button>
                {CITIES.map((city) => cell(key, city, true))}
              </div>
            ))}
          </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          {TIERS.map((t) => (
            <Badge key={t} className={tierClass[t]}>
              {t}
            </Badge>
          ))}
          <Badge className={tierDashed["弱"]}>虚线 = 惯例 / 没核实</Badge>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm bg-[repeating-linear-gradient(135deg,transparent_0_3px,var(--color-border)_3px_5px)] ring-1 ring-border" />
            空档
          </span>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded border px-2 py-0.5 hover:bg-muted"
            aria-pressed={showAll}
          >
            {showAll ? "只看值得去的" : "把弱/不推荐也显示出来"}
          </button>
          <span className="w-full sm:w-auto sm:ml-auto">手机上年历可左右滑 · 点月份 = 看那个月的清单</span>
        </div>
      </div>

      {/* ── 当月清单 ── */}
      <div className="rounded-lg border">
        <div className="flex items-baseline justify-between gap-3 border-b bg-muted/40 px-4 py-3">
          <h3 className="text-base font-semibold">
            {monthLabel(month, true)}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {list.length ? `${list.length} 场` : "没有在列的展"}
            </span>
          </h3>
          <div className="flex gap-1.5 text-sm">
            <button
              type="button"
              disabled={idx <= 0}
              onClick={() => jump(MONTHS[idx - 1])}
              className="rounded-md border px-2 py-1 hover:bg-muted disabled:opacity-40"
            >
              上个月
            </button>
            <button
              type="button"
              disabled={idx >= MONTHS.length - 1}
              onClick={() => jump(MONTHS[idx + 1])}
              className="rounded-md border px-2 py-1 hover:bg-muted disabled:opacity-40"
            >
              下个月
            </button>
          </div>
        </div>

        <div className="px-4 py-3">
          {monthNotes[month] ? <p className="mb-3 text-base text-muted-foreground">{monthNotes[month]}</p> : null}
          {list.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">
              {GAP.has(month) ? "这个月三城没有在列的出口／跨境类展。" : "这个月未查到三城的出口／跨境类展。"}
            </p>
          ) : (
            <ul className="divide-y" aria-live="polite">
              {dated.map((f) => (
                <FairItem
                  key={f.id}
                  fair={f}
                  open={openId === f.id}
                  onToggle={() => setOpenId((o) => (o === f.id ? null : f.id))}
                  onHover={setHoverId}
                  month={month}
                  todayMillis={todayMillis}
                />
              ))}
              {monthOnly.length ? (
                <li className="py-2.5 text-sm text-muted-foreground">只知道月份，没有具体日子</li>
              ) : null}
              {monthOnly.map((f) => (
                <FairItem
                  key={f.id}
                  fair={f}
                  open={openId === f.id}
                  onToggle={() => setOpenId((o) => (o === f.id ? null : f.id))}
                  onHover={setHoverId}
                  month={month}
                  todayMillis={todayMillis}
                />
              ))}
            </ul>
          )}
          {hidden.byMonth[month] && !showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-3 text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              这个月另有 {hidden.byMonth[month]} 场弱／不推荐，显示出来
            </button>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">点一行展开细节（日期、场馆、入场、截止、费用、链接）。</p>
        </div>
      </div>
    </div>
  );
}

function FairItem({
  fair: f,
  open,
  onToggle,
  onHover,
  month,
  todayMillis,
}: {
  fair: Fair;
  open: boolean;
  onToggle: () => void;
  onHover: (id: string | null) => void;
  month: string;
  todayMillis: number | null;
}) {
  const date = listDate(f, month);
  const past = ended(f, todayMillis);
  return (
    <li className={cn("transition-colors", past && "opacity-60")} onMouseEnter={() => onHover(f.id)} onMouseLeave={() => onHover(null)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 px-0 py-3.5 text-left sm:grid-cols-[6.5rem_minmax(0,1fr)_auto]"
      >
        <span className="hidden pt-0.5 text-base font-medium tabular-nums sm:block">{date}</span>
        <span className="min-w-0">
          <span className="block text-sm text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums sm:hidden">{date} · </span>
            {f.city}
            {past ? " · 已结束" : null}
          </span>
          <span className="block text-base font-medium leading-snug">{f.name}</span>
          <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">{f.advice}</span>
        </span>
        <span className="flex items-center gap-1.5 pt-0.5">
          <span className="hidden flex-wrap justify-end gap-1 sm:flex">
            {f.flags.map((fl) => (
              <Badge key={fl} variant="outline" className="border-dashed">
                {fl}
              </Badge>
            ))}
          </span>
          <Badge className={f.kind === "exact" ? tierClass[f.tier] : tierDashed[f.tier]}>{f.tier}</Badge>
          <ChevronDownIcon
            className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </span>
      </button>
      {f.flags.length ? (
        <div className="-mt-1 flex flex-wrap gap-1 pb-2 sm:hidden">
          {f.flags.map((fl) => (
            <Badge key={fl} variant="outline" className="border-dashed">
              {fl}
            </Badge>
          ))}
        </div>
      ) : null}
      {open ? <FairDetail fair={f} className="pb-4 sm:pl-[calc(6.5rem+1.5rem)]" /> : null}
    </li>
  );
}
