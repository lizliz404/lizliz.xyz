/* 分享页版式块：只吃 props，不含文案。悬停说明用自定义 tip，不用原生 title。 */
import type { ReactNode } from "react";

export type Bar = {
  label: string;
  value: number;
  display: string;
  desc: string;
  href?: string;
  us?: boolean;
  estimate?: boolean;
};

export type MapPoint = {
  label: string;
  x: number;
  y: number;
  note: string;
  us?: boolean;
  /** 垂直微调（百分点），用于避让相邻点。 */
  dy?: number;
  /** 锚定方向："left" = 从左边缘定位、标签在点右侧（默认）；
   *  "right" = 从右边缘定位、标签在点左侧（靠右边界的点用这个）。 */
  side?: "left" | "right";
};

export function Section({
  id,
  n,
  heading,
  lede,
  emphasis: isKey,
  children,
}: {
  id?: string;
  n?: number;
  heading: string;
  lede?: string;
  /** 标记本页的重点节：加一道左边线和标签，让它在扫读时能被一眼认出来。
   *  注意不能叫 key —— React 保留字段。 */
  emphasis?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="fg-section" id={id} data-key={isKey || undefined}>
      <h2>
        {n ? <span className="fg-sec-n">{n}</span> : null}
        <span className="fg-sec-t">{heading}</span>
        {isKey ? <span className="fg-key-tag">重点</span> : null}
      </h2>
      {lede ? <p className="fg-lede">{lede}</p> : null}
      {children}
    </section>
  );
}

export function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="fg-toc" aria-label="本页目录">
      <p className="fg-toc-h">本页看什么</p>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`}>
              <span className="fg-toc-n">{i + 1}</span>
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Cards({
  items,
}: {
  items: { n: string; title: string; detail: string }[];
}) {
  return (
    <div className="fg-cards">
      {items.map((it) => (
        <div key={it.n} className="fg-card fg-mini">
          <span className="fg-mini-n">{it.n}</span>
          <strong>{it.title}</strong>
          <p>{it.detail}</p>
        </div>
      ))}
    </div>
  );
}

export function Takeaway({ items }: { items: string[] }) {
  return (
    <div className="fg-takeaway">
      <p className="fg-takeaway-h">十秒版</p>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export function Text({ children }: { children: ReactNode }) {
  return <p className="fg-text">{children}</p>;
}

export function Callout({ lead, children }: { lead: string; children: ReactNode }) {
  return (
    <div className="fg-callout">
      <strong>{lead}</strong>
      <p>{children}</p>
    </div>
  );
}

export function Bars({ bars }: { bars: Bar[] }) {
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div className="fg-card fg-bars">
      {bars.map((b) => (
        <div
          key={b.label}
          className="fg-bar fg-bar-row"
          data-us={b.us || undefined}
          data-estimate={b.estimate || undefined}
        >
          <div className="fg-bar-name">
            <span className="fg-bar-label">
              {b.href ? (
                <a href={b.href} target="_blank" rel="noopener noreferrer">
                  {b.label}
                </a>
              ) : (
                b.label
              )}
            </span>
            <span className="fg-bar-desc">{b.desc}</span>
          </div>
          <span className="fg-bar-track">
            <span
              className="fg-bar-fill"
              style={{ width: `${Math.max((b.value / max) * 100, 0.8)}%` }}
            />
          </span>
          <span className="fg-bar-value">{b.display}</span>
        </div>
      ))}
      <p className="fg-hint">蓝色＝Foundry。斜线条＝无公开价，只示意量级。左侧可点的名字跳到对标关键页。</p>
    </div>
  );
}

export function Matrix({
  x,
  y,
  points,
  legendHeading,
}: {
  x: readonly [string, string];
  y: readonly [string, string];
  points: MapPoint[];
  legendHeading?: string;
}) {
  return (
    <div className="fg-card fg-matrix-card">
      <div className="fg-matrix">
        <span className="fg-axis fg-axis-y1">↑ {y[1]}</span>
        <span className="fg-axis fg-axis-y0">{y[0]}</span>
        {points.map((p) => {
          const right = (p.side ?? (p.x > 0.55 ? "right" : "left")) === "right";
          return (
            <div
              key={p.label}
              className="fg-pt fg-tip"
              data-us={p.us || undefined}
              data-right={right || undefined}
              style={
                right
                  ? {
                      right: `${(1 - p.x) * 100}%`,
                      bottom: `${p.y * 100 + (p.dy ?? 0)}%`,
                    }
                  : {
                      left: `${p.x * 100}%`,
                      bottom: `${p.y * 100 + (p.dy ?? 0)}%`,
                    }
              }
              tabIndex={0}
            >
              <span className="fg-pt-dot" />
              <span className="fg-pt-label">{p.label}</span>
              <span className="fg-tip-body">{p.note}</span>
            </div>
          );
        })}
      </div>
      <div className="fg-axis-x">
        <span>← {x[0]}</span>
        <span>{x[1]} →</span>
      </div>
      <div className="fg-map-legend">
        <p className="fg-map-legend-h">{legendHeading ?? "每个点具体是什么"}</p>
        <ul>
          {points.map((p) => (
            <li key={p.label} data-us={p.us || undefined}>
              <span className="fg-map-legend-name">{p.label}</span>
              <span className="fg-map-legend-note">{p.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Metrics({
  metrics,
}: {
  metrics: { value: string; label: string; detail: string; main?: boolean }[];
}) {
  return (
    <div className="fg-metrics">
      {metrics.map((m) => (
        <div key={m.label} className="fg-card fg-metric" data-main={m.main || undefined}>
          <div className="fg-metric-label">{m.label}</div>
          <div className="fg-metric-value">{m.value}</div>
          <div className="fg-metric-detail">{m.detail}</div>
        </div>
      ))}
    </div>
  );
}

export function Table({
  columns,
  rows,
  emphasis,
}: {
  columns: string[];
  rows: string[][];
  emphasis?: number;
}) {
  return (
    <div className="fg-card fg-table-wrap">
      <table className="fg-table">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} data-em={i === emphasis || undefined}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, i) => (
                <td key={i} data-em={i === emphasis || undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Columns({ points }: { points: { label: string; value: number; display: string }[] }) {
  const max = Math.max(...points.map((p) => p.value));
  return (
    <div
      className="fg-card fg-columns"
      style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
    >
      {points.map((p, i) => (
        <div key={p.label} className="fg-col" data-first={i === 0 || undefined}>
          <span className="fg-col-value">{p.display}</span>
          <span className="fg-col-bar" style={{ height: `${(p.value / max) * 100}%` }} />
          <span className="fg-col-label">{p.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Steps({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="fg-steps">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="fg-step-n">{i + 1}</span>
          <div>
            <strong>{s.title}</strong>
            <p>{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Glossary({ items }: { items: { term: string; def: string }[] }) {
  return (
    <dl className="fg-card fg-glossary">
      {items.map((i) => (
        <div key={i.term} className="fg-gloss">
          <dt>{i.term}</dt>
          <dd>{i.def}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Rows({ heading, rows }: { heading: string; rows: { title: string; detail?: string }[] }) {
  return (
    <div className="fg-card fg-rows">
      <h3>{heading}</h3>
      {rows.map((r) => (
        <div key={r.title} className="fg-row">
          <span className="fg-row-t">{r.title}</span>
          {r.detail ? <span className="fg-row-d">{r.detail}</span> : null}
        </div>
      ))}
    </div>
  );
}
