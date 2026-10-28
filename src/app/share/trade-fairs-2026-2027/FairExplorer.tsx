"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { zhCN } from "react-day-picker/locale";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FairDetail } from "./FairDetail";
import {
  MONTHS,
  TIERS,
  covers,
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

const CITIES: City[] = ["宁波", "义乌", "广州"];
const GAP = new Set(["2027-01", "2027-02", "2027-07", "2027-08"]);

// "Today" is only known in the browser; static HTML renders without it.
const subscribe = () => () => {};
const todayKey = () => new Date().toDateString();
const noToday = () => null;

const tierModifier: Record<Tier, string> = { 强: "strong", 中: "medium", 弱: "weak", 不去: "skip" };
const stronger: Record<Tier, Tier[]> = { 强: [], 中: ["强"], 弱: ["强", "中"], 不去: ["强", "中", "弱"] };

const chipClass = (f: Fair) => (f.kind === "exact" ? tierClass[f.tier] : tierDashed[f.tier]);

function startInMonth(f: Fair, key: string) {
  for (const [a, b] of f.spans) {
    const s = toDate(a);
    const e = toDate(b);
    const first = toDate(`${key}-01`);
    if (monthKey(s) === key) return s.getTime();
    if (s < first && e >= first) return first.getTime();
  }
  return Number.MAX_SAFE_INTEGER;
}

/** 清单里的日期：只显示落在当月的那几段；惯例 / 未核实日期前面加 ≈。 */
function listDate(f: Fair, key: string) {
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
}

function monthShort(key: string) {
  const [y, m] = key.split("-").map(Number);
  if (key === "2026-10") return "10月末";
  if (m === 1) return `${y}·1月`;
  return `${m}月`;
}

export function FairExplorer({ fairs }: { fairs: Fair[] }) {
  const [month, setMonth] = useState("2026-11");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverDay, setHoverDay] = useState<Date | null>(null);
  const [pinDay, setPinDay] = useState<Date | null>(null);
  const todayStr = useSyncExternalStore(subscribe, todayKey, noToday);
  const calRef = useRef<HTMLDivElement>(null);

  const byMonth = useMemo(() => {
    const map: Record<string, Fair[]> = {};
    for (const key of MONTHS) map[key] = [];
    for (const f of fairs) for (const key of monthsOf(f)) map[key]?.push(f);
    for (const key of MONTHS) {
      map[key].sort((a, b) => {
        if ((a.kind === "month") !== (b.kind === "month")) return a.kind === "month" ? 1 : -1;
        return startInMonth(a, key) - startInMonth(b, key);
      });
    }
    return map;
  }, [fairs]);

  const focusId = hoverId ?? openId;
  const focusFair = fairs.find((f) => f.id === focusId);
  const dayFocus = hoverDay ?? pinDay;

  const modifiers = useMemo(() => {
    const exact = fairs.filter((f) => f.kind === "exact");
    const approx = fairs.filter((f) => f.kind === "approx");
    const result: Record<string, (date: Date) => boolean> = {};
    for (const tier of TIERS) {
      result[tierModifier[tier]] = (date) =>
        exact.some((f) => f.tier === tier && covers(f, date)) &&
        !exact.some((f) => stronger[tier].includes(f.tier) && covers(f, date));
    }
    result.approx = (date) => !exact.some((f) => covers(f, date)) && approx.some((f) => covers(f, date));
    result.multi = (date) => fairs.filter((f) => covers(f, date)).length > 1;
    return result;
  }, [fairs]);

  const focusModifiers = useMemo(
    () => ({
      focus: (date: Date) => (focusFair ? covers(focusFair, date) : false),
      pin: (date: Date) => (pinDay ? date.toDateString() === pinDay.toDateString() : false),
    }),
    [focusFair, pinDay],
  );

  const modifiersClassNames = {
    strong: cn("rounded-md", tierClass["强"]),
    medium: cn("rounded-md", tierClass["中"]),
    weak: cn("rounded-md", tierClass["弱"]),
    skip: cn("rounded-md", tierClass["不去"], "[&_button]:line-through"),
    approx: "rounded-md outline-1 outline-dashed -outline-offset-2 outline-stone-400",
    multi:
      "after:pointer-events-none after:absolute after:top-0.5 after:right-0.5 after:z-20 after:size-1.5 after:rounded-full after:bg-red-500",
    focus: "z-10 rounded-md ring-2 ring-sky-500 ring-offset-1 ring-offset-background",
    pin: "rounded-md ring-2 ring-foreground",
  };

  const jump = (key: string, id?: string) => {
    setMonth(key);
    setPinDay(null);
    if (id) setOpenId(id);
    calRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const list = byMonth[month] ?? [];
  const dated = list.filter((f) => f.kind !== "month");
  const monthOnly = list.filter((f) => f.kind === "month");
  const idx = MONTHS.indexOf(month);

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
        "block w-full truncate rounded px-1 py-0.5 text-left text-[11px] leading-tight transition-shadow",
        chipClass(f),
        focusId === f.id && "ring-2 ring-sky-500 ring-offset-1 ring-offset-background",
      )}
    >
      {f.short}
    </button>
  );

  return (
    <div className="space-y-6" data-slot="fair-explorer">
      {/* ── 全年一览：城市 × 月份 ── */}
      <div>
        <div className="hidden overflow-hidden rounded-lg border md:block">
          <div className="grid grid-cols-[3.25rem_repeat(13,minmax(0,1fr))] text-xs">
            <div className="border-b bg-muted/40" />
            {MONTHS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => jump(key)}
                className={cn(
                  "border-b border-l px-1 py-1.5 text-center font-medium tabular-nums transition-colors hover:bg-muted",
                  key === month ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted/40",
                )}
              >
                {monthShort(key)}
              </button>
            ))}
            {CITIES.map((city) => (
              <div key={city} className="contents">
                <div className="flex items-start border-b px-2 py-2 font-medium last:border-b-0">{city}</div>
                {MONTHS.map((key) => {
                  const items = byMonth[key].filter((f) => f.city === city);
                  return (
                    <div
                      key={key}
                      className={cn(
                        "min-h-14 space-y-1 border-b border-l p-1",
                        key === month && "bg-muted/50",
                        GAP.has(key) &&
                          "bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--color-muted)_6px_8px)]",
                      )}
                    >
                      {items.map((f) => chip(f, key))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 窄屏：月份做行，城市做列 */}
        <div className="overflow-hidden rounded-lg border md:hidden">
          <div className="grid grid-cols-[3.75rem_repeat(3,minmax(0,1fr))] text-xs">
            <div className="border-b bg-muted/40" />
            {CITIES.map((city) => (
              <div key={city} className="border-b border-l bg-muted/40 px-1 py-1.5 text-center font-medium">
                {city}
              </div>
            ))}
            {MONTHS.map((key) => (
              <div key={key} className="contents">
                <button
                  type="button"
                  onClick={() => jump(key)}
                  className={cn(
                    "border-b px-1.5 py-1.5 text-left font-medium tabular-nums",
                    key === month && "bg-foreground text-background",
                  )}
                >
                  {monthShort(key)}
                </button>
                {CITIES.map((city) => {
                  const items = byMonth[key].filter((f) => f.city === city);
                  return (
                    <div
                      key={city}
                      className={cn(
                        "space-y-1 border-b border-l p-1",
                        key === month && "bg-muted/50",
                        GAP.has(key) &&
                          "bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--color-muted)_6px_8px)]",
                      )}
                    >
                      {items.map((f) => chip(f, key))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {TIERS.map((t) => (
            <Badge key={t} className={tierClass[t]}>
              {t}
            </Badge>
          ))}
          <Badge className={tierDashed["弱"]}>虚线 = 惯例 / 未核实日期</Badge>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm bg-[repeating-linear-gradient(135deg,transparent_0_3px,var(--color-border)_3px_5px)] ring-1 ring-border" />
            空档
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-red-500" aria-hidden />
            同日多展
          </span>
          <span className="w-full sm:w-auto sm:ml-auto">点任一格跳到那个月</span>
        </div>
      </div>

      {/* ── 月历 + 当月清单 ── */}
      <div
        ref={calRef}
        className="grid scroll-mt-6 gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-start"
      >
        <div className="md:sticky md:top-4">
          <Calendar
            month={toDate(`${month}-01`)}
            onMonthChange={(d) => {
              setMonth(monthKey(d));
              setPinDay(null);
            }}
            locale={zhCN}
            weekStartsOn={1}
            startMonth={toDate("2026-10-01")}
            endMonth={toDate("2027-10-01")}
            today={todayStr ? new Date(todayStr) : new Date(2000, 0, 1)}
            showOutsideDays={false}
            modifiers={{ ...modifiers, ...focusModifiers }}
            modifiersClassNames={modifiersClassNames}
            onDayClick={(d) => setPinDay((p) => (p && p.toDateString() === d.toDateString() ? null : d))}
            onDayMouseEnter={(d) => setHoverDay(d)}
            onDayMouseLeave={() => setHoverDay(null)}
            className="mx-auto rounded-lg border [--cell-size:--spacing(10)]"
          />
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h3 className="text-base font-semibold">
              {monthLabel(month, true)}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {list.length ? `${list.length} 场` : "无在列的展"}
              </span>
            </h3>
            <div className="flex gap-1 text-xs">
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
          {monthNotes[month] ? (
            <p className="mb-2 text-sm text-muted-foreground">{monthNotes[month]}</p>
          ) : null}
          {list.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              这个月尽调里没有三城的出口／跨境类展。
            </p>
          ) : (
            <ul className="divide-y rounded-lg border" aria-live="polite">
              {dated.map((f) => (
                <FairItem
                  key={f.id}
                  fair={f}
                  open={openId === f.id}
                  lit={focusId === f.id || (!!dayFocus && covers(f, dayFocus))}
                  onToggle={() => setOpenId((o) => (o === f.id ? null : f.id))}
                  onHover={setHoverId}
                  month={month}
                />
              ))}
              {monthOnly.length ? (
                <li className="bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                  只知道月份，日历上不标具体日子
                </li>
              ) : null}
              {monthOnly.map((f) => (
                <FairItem
                  key={f.id}
                  fair={f}
                  open={openId === f.id}
                  lit={focusId === f.id}
                  onToggle={() => setOpenId((o) => (o === f.id ? null : f.id))}
                  onHover={setHoverId}
                  month={month}
                />
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            悬停一行，日历上会框出它的日子；悬停或点日历上的一天，当天的展会高亮。点一行展开细节。
          </p>
        </div>
      </div>
    </div>
  );
}

function FairItem({
  fair: f,
  open,
  lit,
  onToggle,
  onHover,
  month,
}: {
  fair: Fair;
  open: boolean;
  lit: boolean;
  onToggle: () => void;
  onHover: (id: string | null) => void;
  month: string;
}) {
  const date = listDate(f, month);
  return (
    <li
      className={cn("transition-colors", lit && "bg-sky-50 dark:bg-sky-950/40")}
      onMouseEnter={() => onHover(f.id)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 px-3 py-2.5 text-left sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]"
      >
        <span className="hidden pt-0.5 text-sm font-medium tabular-nums sm:block">{date}</span>
        <span className="min-w-0">
          <span className="block text-xs text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums sm:hidden">{date} · </span>
            {f.city}
          </span>
          <span className="block font-medium">{f.name}</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{f.advice}</span>
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
        <div className="-mt-1 flex flex-wrap gap-1 px-3 pb-2 sm:hidden">
          {f.flags.map((fl) => (
            <Badge key={fl} variant="outline" className="border-dashed">
              {fl}
            </Badge>
          ))}
        </div>
      ) : null}
      {open ? <FairDetail fair={f} className="px-3 pb-3 sm:pl-[calc(5.5rem+1.5rem)]" /> : null}
    </li>
  );
}
