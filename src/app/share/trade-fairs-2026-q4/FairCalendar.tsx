"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { DateRange } from "react-day-picker";
import { zhCN } from "react-day-picker/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Tier } from "./content";
import { TIERS, tierClass, type Fair } from "./fairs";

const YEAR = 2026;
const day = ([m, d]: [number, number]) => new Date(YEAR, m - 1, d);
const covers = (f: Fair, date: Date) => date >= day(f.from) && date <= day(f.to);

// "Today" is only known in the browser; the static HTML renders without it,
// and the client fills it in after hydration (no mismatch).
const subscribe = () => () => {};
const todayKey = () => new Date().toDateString();
const noToday = () => null;

const tierModifier: Record<Tier, string> = { 强: "strong", 中: "medium", 弱: "weak", 不去: "skip" };

export function FairCalendar({ fairs }: { fairs: Fair[] }) {
  const [selected, setSelected] = useState<Date | undefined>();
  const todayStr = useSyncExternalStore(subscribe, todayKey, noToday);

  // One colour per day: when fairs overlap, the strongest tier wins and the
  // day also gets a "multi" dot.
  const modifiers = useMemo(() => {
    const byTier: Record<string, DateRange[]> = {};
    for (const tier of TIERS) {
      byTier[tierModifier[tier]] = fairs
        .filter((f) => f.tier === tier)
        .map((f) => ({ from: day(f.from), to: day(f.to) }));
    }
    const stronger: Record<Tier, Tier[]> = { 强: [], 中: ["强"], 弱: ["强", "中"], 不去: ["强", "中", "弱"] };
    const result: Record<string, (date: Date) => boolean> = {};
    for (const tier of TIERS) {
      result[tierModifier[tier]] = (date) =>
        fairs.some((f) => f.tier === tier && covers(f, date)) &&
        !fairs.some((f) => stronger[tier].includes(f.tier) && covers(f, date));
    }
    result.multi = (date) => fairs.filter((f) => covers(f, date)).length > 1;
    return result;
  }, [fairs]);

  const modifiersClassNames = {
    strong: cn("rounded-md", tierClass["强"]),
    medium: cn("rounded-md", tierClass["中"]),
    weak: cn("rounded-md", tierClass["弱"]),
    skip: cn("rounded-md", tierClass["不去"], "[&_button]:line-through"),
    multi:
      "after:pointer-events-none after:absolute after:top-0.5 after:right-0.5 after:z-20 after:size-1.5 after:rounded-full after:bg-red-500",
  };

  const onDay = selected ? fairs.filter((f) => covers(f, selected)) : [];

  return (
    <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start" data-slot="fair-calendar">
      <div className="space-y-3">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          locale={zhCN}
          weekStartsOn={1}
          numberOfMonths={2}
          defaultMonth={new Date(YEAR, 10, 1)}
          startMonth={new Date(YEAR, 10, 1)}
          endMonth={new Date(YEAR, 11, 1)}
          today={todayStr ? new Date(todayStr) : new Date(YEAR - 1, 0, 1)}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-lg border [--cell-size:--spacing(9)]"
        />
        <ul className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-label="图例">
          {TIERS.map((t) => (
            <li key={t}>
              <Badge className={tierClass[t]}>{t}</Badge>
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-red-500" aria-hidden />
            同日多展
          </li>
        </ul>
      </div>

      <div aria-live="polite" className="space-y-3">
        {!selected ? (
          <p className="text-sm text-muted-foreground">
            点日历上的任一天，看当天有哪些展、对我们有没有用、建议去不去。
          </p>
        ) : onDay.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {selected.getMonth() + 1}/{selected.getDate()} 这天没有在列的展。
          </p>
        ) : (
          onDay.map((f) => (
            <Card key={f.label + f.name} size="sm">
              <CardHeader>
                <CardDescription>
                  {f.label} · {f.city}
                </CardDescription>
                <CardTitle className="flex flex-wrap items-center gap-2">
                  {f.name}
                  <Badge className={tierClass[f.tier]}>{f.tier}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="text-muted-foreground">对我们</dt>
                  <dd>{f.fit}</dd>
                  <dt className="text-muted-foreground">建议</dt>
                  <dd className="font-medium">{f.advice}</dd>
                  <dt className="text-muted-foreground">费用（2人）</dt>
                  <dd>{f.cost}</dd>
                </dl>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
