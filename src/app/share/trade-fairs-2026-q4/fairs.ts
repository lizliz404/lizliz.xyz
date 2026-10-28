import type { Tier } from "./content";

/** 一场展的日历数据：全部取自 content.ts 各段 rows，年份为 2026。 */
export type Fair = {
  label: string;
  from: [number, number];
  to: [number, number];
  city: string;
  name: string;
  fit: string;
  advice: string;
  cost: string;
  tier: Tier;
};

export const TIERS: Tier[] = ["强", "中", "弱", "不去"];

/** 档位配色：日历格子、徽章、图例共用。 */
export const tierClass: Record<Tier, string> = {
  强: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950",
  中: "bg-amber-200 text-amber-950 dark:bg-amber-300",
  弱: "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-100",
  不去: "bg-transparent text-muted-foreground line-through decoration-1 ring-1 ring-inset ring-border",
};

/** "11/12–14" 或 "10/30–11/1" → 起止 [月, 日]；无法解析（如「近窗」）返回 null。 */
export function parseRange(label: string): Pick<Fair, "from" | "to"> | null {
  const m = label.match(/^(\d{1,2})\/(\d{1,2})[–-](?:(\d{1,2})\/)?(\d{1,2})$/);
  if (!m) return null;
  const fromMonth = Number(m[1]);
  const toMonth = m[3] ? Number(m[3]) : fromMonth;
  return { from: [fromMonth, Number(m[2])], to: [toMonth, Number(m[4])] };
}

/** 把一段 rows（列序同 fairColumns）+ tiers 转成日历条目。 */
export function toFairs(rows: string[][], tiers: Tier[]): Fair[] {
  return rows.flatMap((row, i) => {
    const range = parseRange(row[0]);
    if (!range) return [];
    const [label, city, name, fit, advice, cost] = row;
    return [{ label, city, name, fit, advice, cost, tier: tiers[i], ...range }];
  });
}
