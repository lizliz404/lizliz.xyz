import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import { Glossary, Section, Table, Text } from "../parts";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

export default function GtmSharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <header className="fg-head">
          <p className="fg-eyebrow">GTM 讨论稿</p>
          <h1>{c.meta.title}</h1>
          <p className="fg-summary">{c.meta.summary}</p>
          <p className="fg-meta">{c.meta.note}</p>
          <p className="fg-cross">
            怎么定价 → <a href="/share/pricing/">定价讨论稿</a>
          </p>
        </header>

        <Section heading="词义：本页用到的名词，先定义再使用">
          <Glossary items={c.glossary} />
        </Section>

        {c.blocks.map((b) => (
          <Section key={b.heading} heading={b.heading}>
            <Text>{b.body}</Text>
          </Section>
        ))}

        <Section heading="还没核实的说法（不写成方案）">
          <Table columns={c.pending.columns} rows={c.pending.rows} />
          <Text>{c.pending.text}</Text>
        </Section>
      </div>
    </main>
  );
}
