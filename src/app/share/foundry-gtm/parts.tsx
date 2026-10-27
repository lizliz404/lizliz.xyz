/* 分享页用的几个简单版式块。只吃 props，不含文案；无客户端 JS。
 * 备注：桌面悬停显示，手机点按（<details>）显示。 */
import type { ReactNode } from "react";
import type { Bar, MapPoint } from "./content";

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="fg-section">
      <h2>{heading}</h2>
      {children}
    </section>
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
        <details key={b.label} className="fg-bar" data-us={b.us || undefined} data-estimate={b.estimate || undefined}>
          <summary title={b.meta}>
            <span className="fg-bar-label">{b.label}</span>
            <span className="fg-bar-track">
              <span className="fg-bar-fill" style={{ width: `${Math.max((b.value / max) * 100, 0.8)}%` }} />
            </span>
            <span className="fg-bar-value">{b.display}</span>
          </summary>
          <p className="fg-note">{b.meta}</p>
        </details>
      ))}
      <p className="fg-hint">悬停或点按一条看口径。斜线条＝不公开，只示意量级。</p>
    </div>
  );
}

export function Matrix({ x, y, points }: { x: readonly [string, string]; y: readonly [string, string]; points: MapPoint[] }) {
  return (
    <div className="fg-card fg-matrix-card">
      <div className="fg-matrix">
        <span className="fg-axis fg-axis-y1">↑ {y[1]}</span>
        <span className="fg-axis fg-axis-y0">{y[0]}</span>
        {points.map((p) => (
          <details
            key={p.label}
            className="fg-pt"
            data-us={p.us || undefined}
            data-right={p.x > 0.6 || undefined}
            style={p.x > 0.6 ? { right: `${(1 - p.x) * 100}%`, bottom: `${p.y * 100}%` } : { left: `${p.x * 100}%`, bottom: `${p.y * 100}%` }}
          >
            <summary title={p.note}>
              <span className="fg-pt-dot" />
              <span className="fg-pt-label">{p.label}</span>
            </summary>
            <p className="fg-note">{p.note}</p>
          </details>
        ))}
      </div>
      <div className="fg-axis-x">
        <span>← {x[0]}</span>
        <span>{x[1]} →</span>
      </div>
    </div>
  );
}

export function Metrics({ metrics }: { metrics: { value: string; label: string; detail: string; main?: boolean }[] }) {
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

export function Table({ columns, rows, emphasis }: { columns: string[]; rows: string[][]; emphasis?: number }) {
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
    <div className="fg-card fg-columns">
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

export function ProsCons(props: { prosHeading: string; consHeading: string; pros: string[]; cons: string[] }) {
  return (
    <div className="fg-proscons">
      <div className="fg-card">
        <h3 className="fg-pros-h">✓ {props.prosHeading}</h3>
        <ul>
          {props.pros.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <div className="fg-card">
        <h3 className="fg-cons-h">– {props.consHeading}</h3>
        <ul>
          {props.cons.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Flow({ nodes }: { nodes: { label: string; detail: string; terminal?: boolean }[] }) {
  return (
    <ol className="fg-flow">
      {nodes.map((n) => (
        <li key={n.label} className="fg-card fg-flow-node" data-terminal={n.terminal || undefined}>
          <strong>{n.label}</strong>
          <span>{n.detail}</span>
        </li>
      ))}
    </ol>
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
