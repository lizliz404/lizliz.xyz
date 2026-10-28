import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import { Cards, Glossary, Section, Table, Takeaway, Text, Toc } from "../parts";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="fg-bullets">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

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
            怎么定价 → <a href="/share/pricing/">这类服务，价格是怎么定的</a>
          </p>
        </header>

        <Takeaway items={c.takeaway} />
        <Toc items={c.toc} />

        <Section
          id="where"
          n={1}
          heading="人在哪，就在哪发内容：微信和抖音，视频优先"
          lede="选平台只看一件事：目标客户每天待在哪。不看平台新不新。"
        >
          <Text>{c.where.body}</Text>
          <Text>{c.where.note}</Text>
        </Section>

        <Section
          id="glossary"
          n={2}
          heading="词义：本页用到的每个名词，先定义再使用"
          lede="上一版有几个词没定义就用了（AEO、AI 矩阵）。这一节把用到的词固定下来，正文只用这里的意思。"
        >
          <Glossary items={c.glossary} />
        </Section>

        <Section
          id="pay"
          n={3}
          heading="最短成交：给一个不费力就能付钱的口子"
          lede="重点在「先收钱」这个动作，不在某个平台功能。平台允许什么，得先分清。"
        >
          <Text>{c.pay.body}</Text>
        </Section>

        <Section
          id="matrix"
          n={4}
          heading="矩阵：它唯一确定的作用，以及什么时候该做"
          lede="矩阵不是起点。它只在「已经有人搜你名字」的时候放大效果。"
        >
          <Text>{c.matrix.body}</Text>
        </Section>

        <Section
          id="precision"
          n={5}
          heading="「精准」到底指什么：付钱的人就是精准的"
          lede="这个词很容易把力气用错地方——从前端内容，错用到后端筛询盘。"
        >
          <Text>{c.precision.body}</Text>
        </Section>

        <Section
          id="search"
          n={6}
          heading="搜商：搜同一个品类词，为什么是这批排在前面"
          lede="这是本页最该学的一节。答案反直觉：跟内容好坏、跟点赞多少都没关系。"
          emphasis
        >
          <Text>{c.search.body}</Text>
          <div className="fg-callout fg-callout-quiet">
            <strong>反直觉的地方</strong>
            <p>{c.search.surprise}</p>
          </div>
          <Table columns={c.search.compare.columns} rows={c.search.compare.rows} />
          <Cards items={c.search.mechanisms} />
          <Bullets items={c.search.evidence} />
          <Text>{c.search.verify}</Text>
          <p className="fg-caveat">{c.search.caveat}</p>
        </Section>

        <Section
          id="ads"
          n={7}
          heading="广告：为什么现在不做，以及什么情况下会改"
          lede="不是否定广告，是当前阶段排不上。"
        >
          <Text>{c.ads.body}</Text>
        </Section>

        <Section
          id="moat"
          n={8}
          heading="「大家都在讲」不等于「它不再是差异点」"
          lede="这一条之前写反过，现在改回来。"
        >
          <Text>{c.moat.body}</Text>
        </Section>

        <Section
          id="inquiry"
          n={9}
          heading="询盘落到哪里：把「询盘」和「询盘通知」分开"
          lede="之前写成「询盘推企微」，一句话混了两件事，而且渠道和能力都不对。"
        >
          <Text>{c.inquiry.body}</Text>
        </Section>

        <Section
          id="now"
          n={10}
          heading="现在手上有什么，私聊这一段怎么起步"
          lede="种子客户已经在合作了。这一段要解决的是「接得住」，不是「显得专业」。"
        >
          <Text>{c.now.body}</Text>
          <Text>{c.now.chat}</Text>
        </Section>

        <Section
          id="pending"
          n={11}
          heading="还没核实的说法：先标待核，不写成方案"
          lede="写「待核」比写一个自己都没搞清的概念强。"
        >
          <Table columns={c.pending.columns} rows={c.pending.rows} />
          <Text>{c.pending.text}</Text>
        </Section>
      </div>
    </main>
  );
}
