import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import { Callout, Section, Takeaway, Text, Toc } from "../parts";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FairCalendar } from "./FairCalendar";
import { tierClass, toFairs } from "./fairs";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

const sections = [c.oct, c.novEarly, c.clash, c.dec, c.guangzhou];
const fairs = sections.flatMap((sec) => toFairs(sec.rows, sec.tiers));

/** Generic text table on shadcn Table; long cells wrap instead of scrolling. */
function DataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="my-4 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col} className="bg-muted/40">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.join("|")}>
              {row.map((cell, i) => (
                <TableCell
                  key={i}
                  className={i === 0 ? "align-top font-medium" : "align-top whitespace-normal"}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/** Fair rows (columns = c.fairColumns) with the tier badge in 对我们. */
function FairTable({ rows, tiers }: { rows: string[][]; tiers: c.Tier[] }) {
  return (
    <div className="my-4 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {c.fairColumns.map((col) => (
              <TableHead key={col} className="bg-muted/40">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([date, city, name, fit, advice, cost], i) => (
            <TableRow key={date + name}>
              <TableCell className="align-top font-medium">{date}</TableCell>
              <TableCell className="align-top">{city}</TableCell>
              <TableCell className="min-w-40 align-top whitespace-normal">{name}</TableCell>
              <TableCell className="min-w-36 align-top whitespace-normal">
                <Badge className={tierClass[tiers[i]]}>{tiers[i]}</Badge>
                <span className="mt-1 block text-muted-foreground">{fit}</span>
              </TableCell>
              <TableCell className="min-w-36 align-top font-medium whitespace-normal">{advice}</TableCell>
              <TableCell className="min-w-32 align-top whitespace-normal">{cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="fg-bullets">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export default function TradeFairs2026Q4SharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <header className="fg-head">
          <p className="fg-eyebrow">{c.meta.eyebrow}</p>
          <h1>{c.meta.title}</h1>
          <p className="fg-summary">{c.meta.summary}</p>
          <p className="fg-meta">{c.meta.note}</p>
        </header>

        <Takeaway items={c.takeaway} />

        <section id="calendar" aria-labelledby="calendar-h" className="my-10">
          <h2 id="calendar-h" className="mb-1 text-xl font-semibold">
            11–12 月日历
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            颜色 = 对我们的价值 / 建议（强 · 中 · 弱 · 不去）；红点 = 同日多展。点日期看当天的展。
          </p>
          <FairCalendar fairs={fairs} />
        </section>

        <Toc items={c.toc} />

        <Section
          id="oct"
          n={1}
          heading="10 月末：窗口已过 / 不建议"
          lede={c.oct.lede}
        >
          <FairTable rows={c.oct.rows} tiers={c.oct.tiers} />
        </Section>

        <Section
          id="nov-early"
          n={2}
          heading="11 上旬中旬：五金机电练手"
          lede={c.novEarly.lede}
          emphasis
        >
          <FairTable rows={c.novEarly.rows} tiers={c.novEarly.tiers} />
          <Callout lead="预登记（已核实入口）">{c.novEarly.hardwareNote}</Callout>
        </Section>

        <Section
          id="clash"
          n={3}
          heading="11/25–27 撞期：宁波中小工厂展 vs 义乌跨境"
          lede={c.clash.lede}
          emphasis
        >
          <FairTable rows={c.clash.rows} tiers={c.clash.tiers} />
          <Text>{c.clash.ningboDetail}</Text>
          <Text>{c.clash.yiwuDetail}</Text>
          <DataTable columns={c.clash.plans.columns} rows={c.clash.plans.rows} />
        </Section>

        <Section
          id="dec"
          n={4}
          heading="12/10–12：义乌外贸工厂展"
          lede={c.dec.lede}
        >
          <FairTable rows={c.dec.rows} tiers={c.dec.tiers} />
          <Text>{c.dec.schedule}</Text>
        </Section>

        <Section
          id="guangzhou"
          n={5}
          heading="广州：近期不去"
          lede={c.guangzhou.lede}
        >
          <FairTable rows={c.guangzhou.rows} tiers={c.guangzhou.tiers} />
        </Section>

        <Section
          id="steps"
          n={6}
          heading="最少必要步骤"
          lede={c.steps.lede}
          emphasis
        >
          <DataTable columns={c.steps.columns} rows={c.steps.rows} />
        </Section>

        <Section id="play" n={7} heading="打法一句话" lede={c.play.lede}>
          <Text>{c.play.body}</Text>
        </Section>

        <Section id="costs" n={8} heading="费用一眼看" lede={c.costs.lede}>
          <DataTable columns={c.costs.columns} rows={c.costs.rows} />
        </Section>

        <Section id="open" n={9} heading="还没定的事" lede={c.open.lede}>
          <Bullets items={c.open.items} />
          <p className="fg-caveat">{c.sourceLine}</p>
        </Section>
      </div>
    </main>
  );
}
