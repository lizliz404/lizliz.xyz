/* 分享页版式块：只吃 props，不含文案。最大化使用 @heroicons/react 与 diagram-design 规范。 */
import type { ReactNode } from "react";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  BookOpenIcon,
  ArrowsRightLeftIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

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
  dy?: number;
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
  emphasis?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="fg-section" id={id} data-key={isKey || undefined}>
      <div className="fg-sec-head">
        <h2>
          {n ? <span className="fg-sec-n">{String(n).padStart(2, "0")}</span> : null}
          <span className="fg-sec-t">{heading}</span>
          {isKey ? (
            <span className="fg-key-tag">
              <SparklesIcon className="fg-icon-xs" aria-hidden="true" />
              核心抓手
            </span>
          ) : null}
        </h2>
        {lede ? <p className="fg-lede">{lede}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="fg-toc" aria-label="本页架构目录">
      <div className="fg-toc-head">
        <BookOpenIcon className="fg-icon-sm" aria-hidden="true" />
        <p className="fg-toc-h">ARCHITECTURE &amp; SECTIONS · 逻辑架构</p>
      </div>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`}>
              <span className="fg-toc-n">{String(i + 1).padStart(2, "0")}</span>
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * diagram-design §8 Summary Card Pattern:
 * Asymmetric column widths (1.1fr 1fr 0.9fr when 3 cards), colored semantic dots, hairline borders, no shadows.
 */
export function Cards({
  items,
}: {
  items: { n: string; title: string; detail: string; focal?: boolean; meta?: string }[];
}) {
  return (
    <div className="fg-cards" data-count={items.length}>
      {items.map((it, idx) => {
        const focal = it.focal ?? idx === 0;
        return (
          <div key={it.n} className="fg-card fg-mini" data-focal={focal || undefined}>
            <div className="fg-mini-head">
              <span className="fg-mini-dot" data-focal={focal || undefined} />
              <span className="fg-mini-n">{it.n}</span>
              {it.meta ? <span className="fg-mini-meta">{it.meta}</span> : null}
            </div>
            <strong>{it.title}</strong>
            <p>{it.detail}</p>
          </div>
        );
      })}
    </div>
  );
}

export function Takeaway({ items }: { items: string[] }) {
  return (
    <div className="fg-takeaway">
      <div className="fg-takeaway-top">
        <BoltIcon className="fg-icon-sm" aria-hidden="true" />
        <p className="fg-takeaway-h">EXECUTIVE SUMMARY · 30秒核心结论</p>
      </div>
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

export function Callout({
  lead,
  tone = "accent",
  children,
}: {
  lead: string;
  tone?: "accent" | "quiet";
  children: ReactNode;
}) {
  return (
    <div className={`fg-callout ${tone === "quiet" ? "fg-callout-quiet" : ""}`}>
      <strong>
        {tone === "quiet" ? (
          <ExclamationTriangleIcon className="fg-icon-xs" aria-hidden="true" />
        ) : (
          <CheckCircleIcon className="fg-icon-xs" aria-hidden="true" />
        )}
        <span>{lead}</span>
      </strong>
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
                  <span>{b.label}</span>
                  <ArrowTopRightOnSquareIcon className="fg-ext-icon" aria-hidden="true" />
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
              style={{ width: `${Math.max((b.value / max) * 100, 1.5)}%` }}
            />
          </span>
          <span className="fg-bar-value">{b.display}</span>
        </div>
      ))}
      <p className="fg-hint">
        蓝色＝我们的方案 · 虚线斜纹＝官网未公开标价（仅示意量级） · 点击品牌名可直达官方价格/规则页。
      </p>
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
  metrics: { value: string; label: string; detail: string; main?: boolean; tag?: string }[];
}) {
  return (
    <div className="fg-metrics">
      {metrics.map((m) => (
        <div key={m.label} className="fg-card fg-metric" data-main={m.main || undefined}>
          <div className="fg-metric-top">
            <span className="fg-metric-label">{m.label}</span>
            {m.tag ? <span className="fg-metric-tag">{m.tag}</span> : null}
          </div>
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

export function Columns({
  points,
  title,
  subtitle,
}: {
  points: { label: string; value: number; display: string; sub?: string }[];
  title?: string;
  subtitle?: string;
}) {
  const max = Math.max(...points.map((p) => p.value));
  return (
    <div className="fg-card fg-columns-card">
      {title ? (
        <div className="fg-columns-head">
          <strong>{title}</strong>
          {subtitle ? <span>{subtitle}</span> : null}
        </div>
      ) : null}
      <div
        className="fg-columns"
        style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
      >
        {points.map((p, i) => (
          <div key={p.label} className="fg-col" data-first={i === 0 || undefined}>
            <span className="fg-col-value">{p.display}</span>
            <span className="fg-col-bar" style={{ height: `${Math.max((p.value / max) * 100, 18)}%` }} />
            <span className="fg-col-label">{p.label}</span>
            {p.sub ? <span className="fg-col-sub">{p.sub}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Steps({
  steps,
}: {
  steps: { title: string; detail: string; tag?: string }[];
}) {
  return (
    <ol className="fg-steps">
      {steps.map((s, i) => (
        <li key={s.title} className="fg-card fg-step-card">
          <span className="fg-step-n">{String(i + 1).padStart(2, "0")}</span>
          <div className="fg-step-body">
            <div className="fg-step-title-row">
              <strong>{s.title}</strong>
              {s.tag ? <span className="fg-step-tag">{s.tag}</span> : null}
            </div>
            <p>{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Glossary({ items }: { items: { term: string; def: string }[] }) {
  return (
    <details className="fg-card fg-glossary-details">
      <summary className="fg-glossary-summary">
        <span>展开查看：本页核心概念与边界定义（{items.length} 项）</span>
        <span className="fg-glossary-hint">点击展开 / 收起</span>
      </summary>
      <dl className="fg-glossary">
        {items.map((i) => (
          <div key={i.term} className="fg-gloss">
            <dt>{i.term}</dt>
            <dd>{i.def}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

export function Rows({
  heading,
  rows,
}: {
  heading: string;
  rows: { title: string; detail?: string; badge?: string }[];
}) {
  return (
    <div className="fg-card fg-rows">
      <h3>{heading}</h3>
      {rows.map((r) => (
        <div key={r.title} className="fg-row">
          <div className="fg-row-main">
            <span className="fg-row-t">{r.title}</span>
            {r.badge ? <span className="fg-row-badge">{r.badge}</span> : null}
          </div>
          {r.detail ? <span className="fg-row-d">{r.detail}</span> : null}
        </div>
      ))}
    </div>
  );
}

export function ChipStrip({
  items,
}: {
  items: { label: string; meta?: string; focal?: boolean }[];
}) {
  return (
    <ul className="fg-chips" aria-label="路径优先级">
      {items.map((it) => (
        <li key={it.label} className="fg-chip" data-focal={it.focal || undefined}>
          <span className="fg-chip-label">{it.label}</span>
          {it.meta ? <span className="fg-chip-meta">{it.meta}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export function MicroStrip({
  items,
}: {
  items: { n: string; title: string }[];
}) {
  return (
    <ol className="fg-micro-strip">
      {items.map((it) => (
        <li key={it.n} className="fg-micro-item">
          <span className="fg-micro-n">{it.n}</span>
          <span className="fg-micro-t">{it.title}</span>
        </li>
      ))}
    </ol>
  );
}

export function CrossNav({
  current,
}: {
  current: "pricing" | "gtm";
}) {
  return (
    <nav className="fg-cross-bar" aria-label="两份关联方案切换">
      <div className="fg-cross-label">
        <ArrowsRightLeftIcon className="fg-icon-xs" aria-hidden="true" />
        <span>配套简报切换</span>
      </div>
      <div className="fg-cross-pills">
        <a
          href="/share/overseas-site-pricing-and-retainer-service/"
          className="fg-cross-pill"
          aria-current={current === "pricing" ? "page" : undefined}
        >
          <span className="fg-pill-num">01</span>
          <span>定价架构与阶梯模型</span>
        </a>
        <a
          href="/share/plain-gtm-where-buyers-search-and-pay/"
          className="fg-cross-pill"
          aria-current={current === "gtm" ? "page" : undefined}
        >
          <span className="fg-pill-num">02</span>
          <span>GTM 五条路径与获客漏斗</span>
        </a>
      </div>
    </nav>
  );
}
