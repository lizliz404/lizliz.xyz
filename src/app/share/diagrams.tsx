/**
 * 定价页与 GTM 页的核心 diagram-design 可视化组件（SVG）。
 *
 * 严格遵循 diagram-design 规范：
 * 1. Accessible SVG contract: role="img", aria-labelledby="<slug>-title <slug>-desc", <title> 为首子元素。
 * 2. 4px 网格坐标，正交圆角连线 (r=8)，箭头在节点前绘制。
 * 3. 标签遮罩 (label mask) 与连线保持 6–10px 间距，且不压在后续绘制的节点上。
 * 4. 单一焦点色 (Blue #2563eb)，其余走 ink / muted / soft 语义层。
 * 5. 底部统一水平图例条 (Legend strip)，不浮在画布内。
 */

import React from "react";

/* ═══════════════════════════════════════════════════════════════════════════
 * 定价页专属图谱 (Pricing Diagrams)
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 图 1：市场价格带与购买边界分层图 (Market Landscape & Value Boundary)
 * 对应 diagram-design: Grouped Horizontal Bar + Boundary Split
 * 把「独立站自建资产」与「B2B 平台租流量」在同一张架构图里划清边界并对比量级。
 */
export function PricingLandscapeSvg() {
  return (
    <div className="dd-diagram-wrap">
      <div className="dd-diagram-head">
        <span className="dd-eyebrow">FIGURE 01 · MARKET LANDSCAPE &amp; ASSET BOUNDARY</span>
        <span className="dd-caption">同赛道首年投入对比（人民币）：左侧攒自有站点资产，右侧租平台内流量</span>
      </div>
      <div className="dd-svg-scroll">
        <svg
          viewBox="0 0 1000 540"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="pricing-landscape-title pricing-landscape-desc"
          className="dd-svg"
        >
          <title id="pricing-landscape-title">出海建站与外贸平台首年投入及资产归属对比图</title>
          <desc id="pricing-landscape-desc">
            分上下两区对比首年投入：上区为独立站赛道（资产归客户，从 AllinCMS 399 元到星谷云约 2.5 万元），其中 Foundry 代建 B 档以 5800 元处于高性价比代建锚点；下区为 B2B 平台与全包代运营（3.58 万至 6.98 万元，本质是租流量或含广告代投）。
          </desc>
          <defs>
            <pattern id="dd-dots-pl" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.85" fill="rgba(45,49,66,0.10)" />
            </pattern>
          </defs>

          {/* Paper background */}
          <rect width="1000" height="540" fill="#ffffff" />
          <rect width="1000" height="540" fill="url(#dd-dots-pl)" opacity="0.55" />

          {/* Zone A: Own Site Assets (Track A) */}
          <rect
            x="24"
            y="24"
            width="952"
            height="288"
            rx="8"
            fill="rgba(45,49,66,0.02)"
            stroke="rgba(45,49,66,0.12)"
            strokeWidth="1"
          />
          <rect x="40" y="16" width="268" height="16" rx="2" fill="#ffffff" />
          <text
            x="48"
            y="28"
            fill="#111418"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-sans), sans-serif"
          >
            赛道 A · 独立站与建站服务（站点与域名归客户）
          </text>

          {/* Scale Gridlines inside Track A & B (x from 260 to 920; max = 70,000) */}
          {/* 0 -> 260, 5k -> 308, 10k -> 356, 20k -> 452, 40k -> 640, 70k -> 920 (non-linear segmented scale for readability, marked explicitly) */}
          <line x1="260" y1="48" x2="260" y2="464" stroke="rgba(45,49,66,0.22)" strokeWidth="1" />
          <line x1="380" y1="48" x2="380" y2="464" stroke="rgba(45,49,66,0.08)" strokeWidth="0.8" strokeDasharray="4,4" />
          <line x1="520" y1="48" x2="520" y2="464" stroke="rgba(45,49,66,0.08)" strokeWidth="0.8" strokeDasharray="4,4" />
          <line x1="680" y1="48" x2="680" y2="464" stroke="rgba(45,49,66,0.08)" strokeWidth="0.8" strokeDasharray="4,4" />
          <line x1="900" y1="48" x2="900" y2="464" stroke="rgba(45,49,66,0.08)" strokeWidth="0.8" strokeDasharray="4,4" />

          {/* Axis Ticks at top */}
          <text x="260" y="42" fill="#8a93a0" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">¥0</text>
          <text x="380" y="42" fill="#8a93a0" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">¥3,800</text>
          <text x="520" y="42" fill="#8a93a0" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">¥10,000</text>
          <text x="680" y="42" fill="#8a93a0" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">¥25,000</text>
          <text x="900" y="42" fill="#8a93a0" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">¥70,000</text>

          {/* Row 1: AllinCMS */}
          <text x="244" y="72" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            AllinCMS（拼团 / 挂牌）
          </text>
          <text x="244" y="88" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            多租户 SaaS 自助 · 人工≈0
          </text>
          <rect x="260" y="60" width="24" height="24" rx="3" fill="rgba(79,93,117,0.18)" stroke="#4b5563" strokeWidth="1" />
          <text x="292" y="76" fill="#4b5563" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
            ¥399–500/年
          </text>
          <text x="388" y="76" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)">
            + 来发信组合 ≈ ¥900/年（裂变地板价）
          </text>

          {/* Row 2: Foundry A */}
          <text x="244" y="116" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            Foundry A · 自助建站
          </text>
          <text x="244" y="132" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            我们 · 含后台与托管 · 自助
          </text>
          <rect x="260" y="104" width="44" height="24" rx="3" fill="rgba(46,90,168,0.14)" stroke="#1e40af" strokeWidth="1" />
          <text x="312" y="120" fill="#1e40af" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
            ¥1,050 首年
          </text>
          <text x="404" y="120" fill="#4b5563" fontSize="11" fontFamily="var(--font-sans)">
            ¥500 开站（含首月）+ ¥50/月 × 11；不靠低价肉搏
          </text>

          {/* Row 3: Ueeshop */}
          <text x="244" y="160" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            Ueeshop B2B / 易营宝
          </text>
          <text x="244" y="176" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            传统中档明码 SaaS
          </text>
          <rect x="260" y="148" width="120" height="24" rx="3" fill="rgba(79,93,117,0.18)" stroke="#4b5563" strokeWidth="1" />
          <text x="388" y="164" fill="#4b5563" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
            ¥3,800–9,800/年
          </text>
          <text x="504" y="164" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)">
            标准模板自建为主，定制设计另加费
          </text>

          {/* Row 4: Foundry B (FOCAL) */}
          <rect x="36" y="186" width="928" height="44" rx="6" fill="rgba(37,99,235,0.06)" />
          <text x="244" y="204" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="end">
            ★ Foundry B · 代建主推
          </text>
          <text x="244" y="220" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            我们替建 + 3个月维护 · 域名归客户
          </text>
          <rect x="260" y="192" width="168" height="26" rx="4" fill="rgba(37,99,235,0.18)" stroke="#2563eb" strokeWidth="1.5" />
          <text x="436" y="209" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">
            ¥5,800 起（建站 ¥4,300 + 维护 ¥500×3）
          </text>
          <text x="736" y="209" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">
            <tspan fill="#2563eb" fontWeight="700">（草案）</tspan>
            ← 先看成品再付，小满 1/3 价
          </text>

          {/* Row 5: Xiaoman Self-operated */}
          <text x="244" y="248" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            小满 OKKI · 独立站自运营
          </text>
          <text x="244" y="264" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            阿里系 · 客户自己运营
          </text>
          <rect x="260" y="236" width="336" height="24" rx="3" fill="rgba(79,93,117,0.18)" stroke="#4b5563" strokeWidth="1" />
          <text x="604" y="252" fill="#4b5563" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
            ¥16,800/年
          </text>
          <text x="688" y="252" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)">
            每年续同价 · 不能试用 · 不交源码
          </text>

          {/* Row 6: Singoo Cloud */}
          <text x="244" y="292" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            星谷云（AI 智能体套件）
          </text>
          <text x="244" y="306" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            中档直接对手 · 官网不公开价
          </text>
          <rect
            x="260"
            y="280"
            width="420"
            height="24"
            rx="3"
            fill="rgba(79,93,117,0.08)"
            stroke="#4b5563"
            strokeWidth="1"
            strokeDasharray="5,4"
          />
          <text x="688" y="296" fill="#4b5563" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
            量级示意 ~¥2–3万/年（未公开）
          </text>
          <text x="868" y="296" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)">
            只演示不试用
          </text>

          {/* Zone B: Platform Memberships & Full Agency (Track B) */}
          <rect
            x="24"
            y="332"
            width="952"
            height="140"
            rx="8"
            fill="rgba(45,49,66,0.04)"
            stroke="rgba(45,49,66,0.16)"
            strokeWidth="1"
            strokeDasharray="6,4"
          />
          <rect x="40" y="324" width="420" height="16" rx="2" fill="#ffffff" />
          <text
            x="48"
            y="336"
            fill="#4b5563"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-sans), sans-serif"
          >
            赛道 B · 平台会员与含投流大包（不同物种：租平台内流量 / 含广告充值，站不归己）
          </text>

          {/* Row 7: Alibaba / Global Sources / MIC */}
          <text x="244" y="372" fill="#4b5563" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            阿里国际站 / 环球资源
          </text>
          <text x="244" y="388" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            B2B 平台入驻会员费
          </text>
          <rect x="260" y="360" width="496" height="22" rx="3" fill="rgba(122,131,153,0.16)" stroke="#8a93a0" strokeWidth="1" />
          <text x="764" y="375" fill="#4b5563" fontSize="11" fontFamily="var(--font-mono)">
            ¥35,800–40,000+/年（另加直通车）
          </text>

          {/* Row 8: Made-in-China Diamond */}
          <text x="244" y="412" fill="#4b5563" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            中国制造网 · 钻石会员
          </text>
          <text x="244" y="428" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            焦点科技财报口径 · 金牌 ¥3.11万
          </text>
          <rect x="260" y="400" width="584" height="22" rx="3" fill="rgba(122,131,153,0.16)" stroke="#8a93a0" strokeWidth="1" />
          <text x="852" y="415" fill="#4b5563" fontSize="11" fontFamily="var(--font-mono)">
            ¥59,800/年
          </text>

          {/* Row 9: Xiaoman Full Agency */}
          <text x="244" y="450" fill="#4b5563" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            小满 OKKI Shops · 专业版全包
          </text>
          <text x="244" y="464" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="end">
            含 ¥1万 Google 广告费 · 不保询盘
          </text>
          <rect x="260" y="438" width="640" height="22" rx="3" fill="rgba(122,131,153,0.16)" stroke="#8a93a0" strokeWidth="1" />
          <text x="908" y="453" fill="#4b5563" fontSize="11" fontFamily="var(--font-mono)">
            ¥69,800/年
          </text>

          {/* Bottom Legend Strip */}
          <line x1="24" y1="492" x2="976" y2="492" stroke="rgba(45,49,66,0.14)" strokeWidth="0.8" />
          <text x="24" y="516" fill="#4b5563" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="0.12em">
            LEGEND
          </text>
          <rect x="96" y="506" width="14" height="10" rx="2" fill="rgba(37,99,235,0.18)" stroke="#2563eb" strokeWidth="1.4" />
          <text x="116" y="515" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">
            Foundry 主推锚点（B 代建）
          </text>
          <rect x="276" y="506" width="14" height="10" rx="2" fill="rgba(46,90,168,0.14)" stroke="#1e40af" strokeWidth="1" />
          <text x="296" y="515" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">
            Foundry 自助档（A）
          </text>
          <rect x="424" y="506" width="14" height="10" rx="2" fill="rgba(79,93,117,0.08)" stroke="#4b5563" strokeWidth="1" strokeDasharray="3,2" />
          <text x="444" y="515" fill="#4b5563" fontSize="11" fontFamily="var(--font-sans)">
            未公开标价（量级示意）
          </text>
          <text x="608" y="515" fill="#8a93a0" fontSize="11" fontStyle="italic" fontFamily="var(--font-serif)">
            注：横轴为分段比例尺，兼顾 ¥399 与 ¥69,800 同屏可读。
          </text>
        </svg>
      </div>
    </div>
  );
}

/**
 * 图 2：竞争定位四象限 (2x2 Positioning Quadrant)
 * 对应 diagram-design: Standard + Consultant Quadrant
 * X 轴：首年投入（低 → 高）
 * Y 轴：交付省心度 / 服务商人工介入（客户自助 → 替客户干）
 */
export function CompetitorQuadrantSvg() {
  return (
    <div className="dd-diagram-wrap">
      <div className="dd-diagram-head">
        <span className="dd-eyebrow">FIGURE 02 · COMPETITIVE POSITIONING QUADRANT</span>
        <span className="dd-caption">横轴看客户首年掏多少钱，纵轴看活是谁干的（纯工具自助 vs 服务商代建代运营）</span>
      </div>
      <div className="dd-svg-scroll">
        <svg
          viewBox="0 0 1000 560"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="comp-quad-title comp-quad-desc"
          className="dd-svg"
        >
          <title id="comp-quad-title">同赛道竞争对手定位四象限图</title>
          <desc id="comp-quad-desc">
            横轴为首年客单价从低到高，纵轴为人工介入度从客户自己干到服务商替你干。左下为 AllinCMS 与 Foundry A 自助区；左上至中区为 Foundry B 代建与 C 代运营甜蜜区（以中档预算获得省心交付）；右上为星谷云与小满全包高价区。
          </desc>
          <defs>
            <marker id="quad-end" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill="#111418" />
            </marker>
            <marker id="quad-start" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto">
              <polygon points="9 0, 0 3.5, 9 7" fill="#111418" />
            </marker>
          </defs>

          <rect width="1000" height="560" fill="#ffffff" />

          {/* Quadrant Background Tints */}
          {/* Top-Left / Center-Left Sweet Spot Zone */}
          <rect
            x="100"
            y="56"
            width="400"
            height="204"
            rx="6"
            fill="rgba(37,99,235,0.05)"
            stroke="rgba(37,99,235,0.28)"
            strokeWidth="1"
            strokeDasharray="5,4"
          />
          <text x="116" y="78" fill="#2563eb" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="0.1em">
            01 · SWEET SPOT / 省心代建甜蜜区
          </text>
          <text x="116" y="96" fill="#4b5563" fontSize="11" fontFamily="var(--font-sans)">
            不拼 ¥399 地板价，比年费数万的套件透明、资产归客户
          </text>

          {/* Top-Right Zone */}
          <rect x="500" y="56" width="400" height="204" rx="6" fill="rgba(45,49,66,0.02)" />
          <text x="884" y="78" fill="#8a93a0" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" textAnchor="end" letterSpacing="0.1em">
            02 · ENTERPRISE SUITE / 重度全包与年费套件
          </text>

          {/* Bottom-Left Zone */}
          <rect x="100" y="260" width="400" height="204" rx="6" fill="rgba(45,49,66,0.02)" />
          <text x="116" y="448" fill="#8a93a0" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="0.1em">
            03 · SELF-SERVE FLOOR / 自助工具地板区（价格战红海）
          </text>

          {/* Bottom-Right Zone */}
          <rect x="500" y="260" width="400" height="204" rx="6" fill="rgba(45,49,66,0.02)" />
          <text x="884" y="448" fill="#8a93a0" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" textAnchor="end" letterSpacing="0.1em">
            04 · HIGH-TICKET TOOL / 高价自运营工具
          </text>

          {/* Axes Cross */}
          <line
            x1="88"
            y1="260"
            x2="912"
            y2="260"
            stroke="#111418"
            strokeWidth="1.2"
            markerStart="url(#quad-start)"
            markerEnd="url(#quad-end)"
          />
          <line
            x1="500"
            y1="44"
            x2="500"
            y2="476"
            stroke="#111418"
            strokeWidth="1.2"
            markerStart="url(#quad-start)"
            markerEnd="url(#quad-end)"
          />

          {/* Axis Endpoint Labels (Jobs-minimal outside arrow tips) */}
          <text x="500" y="28" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            服务商替你干（代建 / 代运营）
          </text>
          <text x="500" y="496" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            客户自己干（纯软件工具）
          </text>
          <text x="76" y="264" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            低客单
          </text>
          <text x="924" y="264" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="start">
            高客单
          </text>

          {/* Plotted Nodes */}
          {/* 1. AllinCMS */}
          <circle cx="164" cy="404" r="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1.5" />
          <text x="178" y="402" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">AllinCMS</text>
          <text x="178" y="416" fill="#8a93a0" fontSize="10" fontFamily="var(--font-mono)">¥399–500 · 纯自助裂变</text>

          {/* 2. Laifaxin */}
          <circle cx="204" cy="348" r="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1.5" />
          <text x="218" y="346" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">来发信</text>
          <text x="218" y="360" fill="#8a93a0" fontSize="10" fontFamily="var(--font-mono)">≈¥399 · 获客工具</text>

          {/* 3. Foundry A */}
          <circle cx="280" cy="380" r="6" fill="rgba(46,90,168,0.2)" stroke="#1e40af" strokeWidth="1.8" />
          <text x="294" y="378" fill="#1e40af" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">Foundry A（自助）</text>
          <text x="294" y="392" fill="#4b5563" fontSize="10" fontFamily="var(--font-mono)">¥1,050 首年 · 留作线索入口</text>

          {/* 4. Ueeshop */}
          <circle cx="384" cy="324" r="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1.5" />
          <text x="398" y="322" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">Ueeshop B2B</text>
          <text x="398" y="336" fill="#8a93a0" fontSize="10" fontFamily="var(--font-mono)">¥3,800 起 · 明码 SaaS</text>

          {/* 5. Foundry B (FOCAL) */}
          <circle cx="372" cy="196" r="8" fill="#2563eb" stroke="#111418" strokeWidth="1.5" />
          <rect x="236" y="144" width="244" height="38" rx="4" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
          <text x="246" y="161" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            ★ Foundry B（代建主推 · ¥5,800）
          </text>
          <text x="246" y="175" fill="#4b5563" fontSize="10" fontFamily="var(--font-mono)">
            建站 ¥4,300 + 3月维护 · 域名归客户
          </text>

          {/* 6. Foundry C */}
          <circle cx="468" cy="116" r="7" fill="rgba(37,99,235,0.25)" stroke="#2563eb" strokeWidth="1.5" />
          <text x="454" y="114" fill="#111418" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="end">
            Foundry C（季度代运营）
          </text>
          <text x="454" y="128" fill="#4b5563" fontSize="10" fontFamily="var(--font-mono)" textAnchor="end">
            +¥1.5–2k/月 · 写死每期清单
          </text>

          {/* 7. Singoo Cloud */}
          <circle cx="640" cy="156" r="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="654" y="154" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
            星谷云（中档直接对手）
          </text>
          <text x="654" y="168" fill="#4b5563" fontSize="10" fontFamily="var(--font-mono)">
            AI 套件年费（不公开）· 只演示不试用
          </text>

          {/* 8. Xiaoman Self */}
          <circle cx="660" cy="328" r="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1.5" />
          <text x="674" y="326" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
            小满 OKKI · 自运营
          </text>
          <text x="674" y="340" fill="#8a93a0" fontSize="10" fontFamily="var(--font-mono)">
            ¥16,800/年 · 客户自己管后台
          </text>

          {/* 9. Xiaoman Full */}
          <circle cx="828" cy="104" r="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1.5" />
          <text x="814" y="102" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="end">
            小满 Shops · 全包代运营
          </text>
          <text x="814" y="116" fill="#8a93a0" fontSize="10" fontFamily="var(--font-mono)" textAnchor="end">
            ¥69,800/年 · 含 ¥1万 Google 广告
          </text>

          {/* Bottom Legend Strip */}
          <line x1="24" y1="516" x2="976" y2="516" stroke="rgba(45,49,66,0.14)" strokeWidth="0.8" />
          <text x="24" y="540" fill="#4b5563" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="0.12em">
            LEGEND
          </text>
          <circle cx="104" cy="536" r="5" fill="#2563eb" stroke="#111418" strokeWidth="1" />
          <text x="116" y="540" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">Foundry 核心发力档位（B / C）</text>
          <circle cx="312" cy="536" r="5" fill="rgba(46,90,168,0.2)" stroke="#1e40af" strokeWidth="1.5" />
          <text x="324" y="540" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">Foundry 自助档（A）</text>
          <circle cx="468" cy="536" r="5" fill="#ffffff" stroke="#4b5563" strokeWidth="1.5" />
          <text x="480" y="540" fill="#4b5563" fontSize="11" fontFamily="var(--font-sans)">外部竞品（公开可核维度）</text>
        </svg>
      </div>
    </div>
  );
}

/**
 * 图 3：Foundry 模块化拆价与产能飞轮图 (Pricing Decomposition & Productization Loop)
 * 左侧：B 档 ¥5,800 如何按客户需求拆解组合（只买代建 / +3月维护 / +6月维护 / 转 C 代运营）
 * 右侧：代建如何喂养自助档（代建收钱 → 记工时与重复动作 → ≥3次抽成模板 → 反哺 A 档）
 */
export function PricingArchitectureSvg() {
  return (
    <div className="dd-diagram-wrap">
      <div className="dd-diagram-head">
        <span className="dd-eyebrow">FIGURE 03 · MODULAR PRICING &amp; PRODUCTIZATION FLYWHEEL</span>
        <span className="dd-caption">左：把 ¥5,800 拆成可自由拼装的积木，消除报价盲区；右：用高接触代建喂养低边际成本产品</span>
      </div>
      <div className="dd-svg-scroll">
        <svg
          viewBox="0 0 1000 440"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="pricing-arch-title pricing-arch-desc"
          className="dd-svg"
        >
          <title id="pricing-arch-title">Foundry 模块化计费拆解与代建反哺产品飞轮图</title>
          <desc id="pricing-arch-desc">
            左半区展示一次性代建基座 4300 元如何叠加 0 个月、3 个月（合 5800 元）、6 个月（合 7300 元）维护包或升级季度代运营；右半区展示每单代建记工时，重复 3 次以上的动作沉淀为后台自动化模块，反哺自助档并压低每单工时。
          </desc>
          <defs>
            <marker id="pa-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4b5563" />
            </marker>
            <marker id="pa-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
            </marker>
          </defs>

          <rect width="1000" height="440" fill="#ffffff" />

          {/* Left Zone: Modular Pricing Equation */}
          <rect
            x="24"
            y="24"
            width="540"
            height="356"
            rx="8"
            fill="rgba(45,49,66,0.02)"
            stroke="rgba(45,49,66,0.12)"
            strokeWidth="1"
          />
          <rect x="40" y="16" width="248" height="16" rx="2" fill="#ffffff" />
          <text x="48" y="28" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">
            A · 模块化拆价公式（客户任意组合都能算）（草案）
          </text>

          {/* Connectors Left (drawn before boxes) */}
          {/* Base box right edge x=216, y=196. Fan attach points to 4 options on right (x=288) */}
          <path d="M 216,172 H 248 Q 256,172 256,164 V 88 Q 256,80 264,80 H 288" fill="none" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#pa-arrow)" />
          <path d="M 216,188 H 248 Q 256,188 256,180 V 168 Q 256,160 264,160 H 288" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#pa-arrow-accent)" />
          <path d="M 216,204 H 248 Q 256,204 256,212 V 236 Q 256,244 264,244 H 288" fill="none" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#pa-arrow)" />
          <path d="M 216,220 H 248 Q 256,220 256,228 V 316 Q 256,324 264,324 H 288" fill="none" stroke="#4b5563" strokeWidth="1.2" strokeDasharray="5,4" markerEnd="url(#pa-arrow)" />

          {/* Base Node: 一次性代建基座 */}
          <rect x="44" y="140" width="172" height="112" rx="6" fill="#ffffff" stroke="#111418" strokeWidth="1.2" />
          <rect x="52" y="148" width="52" height="14" rx="2" fill="rgba(45,49,66,0.08)" />
          <text x="78" y="158" fill="#111418" fontSize="8" fontWeight="600" fontFamily="var(--font-mono)" textAnchor="middle">BASE</text>
          <text x="130" y="182" fill="#111418" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            一次性代建基座
          </text>
          <text x="130" y="204" fill="#2563eb" fontSize="16" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">
            ¥4,300
          </text>
          <text x="130" y="224" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            ≤50 商品条目 · 1轮设计
          </text>
          <text x="130" y="240" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            域名买在客户名下
          </text>

          {/* Option 1: 只要代建 */}
          <rect x="288" y="52" width="272" height="56" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="304" y="76" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
            ① 只要代建（不买维护）
          </text>
          <text x="544" y="76" fill="#111418" fontSize="13" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="end">
            ¥4,300
          </text>
          <text x="304" y="96" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)">
            交付上线即结清；后续转 A 档 ¥50/月托管
          </text>

          {/* Option 2: 标准 B 档 (FOCAL) */}
          <rect x="288" y="132" width="272" height="56" rx="6" fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="1.5" />
          <text x="304" y="156" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            ★ ② 主推 B 档（+3 个月维护）
          </text>
          <text x="544" y="156" fill="#2563eb" fontSize="14" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="end">
            ¥5,800
          </text>
          <text x="304" y="176" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            ¥4,300 + ¥500/月 × 3（每月 1 次小更新）
          </text>

          {/* Option 3: 6 个月维护 */}
          <rect x="288" y="216" width="272" height="56" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="304" y="240" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
            ③ 延长维护（+6 个月维护）
          </text>
          <text x="544" y="240" fill="#111418" fontSize="13" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="end">
            ¥7,300
          </text>
          <text x="304" y="260" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)">
            ¥4,300 + ¥500/月 × 6（不需代运营但求稳）
          </text>

          {/* Option 4: C 档季度代运营 */}
          <rect x="288" y="296" width="272" height="64" rx="6" fill="#ffffff" stroke="#111418" strokeWidth="1" strokeDasharray="5,4" />
          <text x="304" y="320" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
            ④ C 档代运营（按季签清单）
          </text>
          <text x="544" y="320" fill="#111418" fontSize="12" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="end">
            ¥1.5–2k/月
          </text>
          <text x="304" y="338" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            3 个月一期期初付 · 写死上新 N / 修改 M
          </text>
          <text x="304" y="352" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)">
            同时最多 5 家 · 锁住创始人时间期权风险
          </text>

          {/* Right Zone: Time -> Product Flywheel */}
          <rect
            x="584"
            y="24"
            width="392"
            height="356"
            rx="8"
            fill="rgba(45,49,66,0.02)"
            stroke="rgba(45,49,66,0.12)"
            strokeWidth="1"
          />
          <rect x="600" y="16" width="256" height="16" rx="2" fill="#ffffff" />
          <text x="608" y="28" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">
            B · 代建怎么变成可复用能力（少卖纯时间）
          </text>

          {/* Flywheel Orthogonal Loop Arrows */}
          {/* Top node (780, 60..112) -> Right -> Middle node (780, 148..200) -> Bottom node (780, 236..288) -> Left loop back to A/B */}
          <line x1="780" y1="112" x2="780" y2="148" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#pa-arrow)" />
          <line x1="780" y1="200" x2="780" y2="236" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#pa-arrow-accent)" />
          <line x1="780" y1="288" x2="780" y2="316" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#pa-arrow)" />
          {/* Return loop on left of right zone */}
          <path
            d="M 652,340 H 616 Q 608,340 608,332 V 92 Q 608,84 616,84 H 652"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.2"
            strokeDasharray="5,4"
            markerEnd="url(#pa-arrow-accent)"
          />

          {/* Step 1 */}
          <rect x="652" y="60" width="256" height="52" rx="6" fill="#ffffff" stroke="#111418" strokeWidth="1" />
          <text x="780" y="82" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            1. 接 B / C 档真单（当下收现金）
          </text>
          <text x="780" y="100" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            签单前谈死需求边界与完成标准
          </text>

          {/* Step 2 */}
          <rect x="652" y="148" width="256" height="52" rx="6" fill="#ffffff" stroke="#111418" strokeWidth="1" />
          <text x="780" y="170" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            2. 逐单记录真实工时与重复动作
          </text>
          <text x="780" y="188" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            校准「每单 ≤8h」假设 · 识别高频卡点
          </text>

          {/* Step 3 (Focal) */}
          <rect x="652" y="236" width="256" height="52" rx="6" fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="1.4" />
          <text x="780" y="258" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            3. 重复 ≥3 次动作 → 抽成后台模块
          </text>
          <text x="780" y="276" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            PDF 导商品、AI 洗图、多语种、行业模板
          </text>

          {/* Step 4 */}
          <rect x="652" y="316" width="256" height="48" rx="6" fill="#ffffff" stroke="#1e40af" strokeWidth="1" />
          <text x="780" y="338" fill="#1e40af" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            4. 代建工时下降 + A 自助档能力变强
          </text>
          <text x="780" y="354" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            交付过程同步录屏 → 变成前端获客素材
          </text>

          {/* Bottom Legend Strip */}
          <line x1="24" y1="396" x2="976" y2="396" stroke="rgba(45,49,66,0.14)" strokeWidth="0.8" />
          <text x="24" y="420" fill="#4b5563" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="0.12em">
            LEGEND
          </text>
          <rect x="96" y="410" width="14" height="10" rx="2" fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="1.4" />
          <text x="116" y="419" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">主推路径 / 核心杠杆点</text>
          <line x1="268" y1="415" x2="296" y2="415" stroke="#4b5563" strokeWidth="1.2" strokeDasharray="4,3" />
          <text x="304" y="419" fill="#4b5563" fontSize="11" fontFamily="var(--font-sans)">可选升级，或沉淀后再用到自助档</text>
          <text x="480" y="419" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)">
            到期去向：A / B / C 任意档到期后均可自由升降档或停用，站点与域名主权始终归客户。
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * GTM 页专属图谱 (GTM Diagrams)
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 图 1：GTM 渠道与打法五路全景图 (5 Strategic Routes in WeChat / Douyin & B2B)
 * 直接回应核心问题：「在这些场景、这些平台下，我们到底有几条路子？」
 * 拆解出 5 条正交可组合的路径，每条标清：平台入口 → 核心动作 → 承接载体 → 变现闭环 → 适用阶段。
 */
export function GtmRoutesSwimlaneSvg() {
  return (
    <div className="dd-diagram-wrap">
      <div className="dd-diagram-head">
        <span className="dd-eyebrow">FIGURE 01 · FIVE GTM ROUTES ACROSS SCENARIOS &amp; PLATFORMS</span>
        <span className="dd-caption">在微信、抖音与产业带场景下，到底有哪 5 条路子？从触达、承接到成交的完整路径对比</span>
      </div>
      <div className="dd-svg-scroll">
        <svg
          viewBox="0 0 1040 580"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="gtm-routes-title gtm-routes-desc"
          className="dd-svg"
        >
          <title id="gtm-routes-title">GTM 五条路径泳道对比图：从流量入口到收款成交</title>
          <desc id="gtm-routes-desc">
            将 GTM 拆解为五条具体路径：路径1应用内搜索拦截（AEO搜品类词，P0主线）；路径2创始人IP与反哺型矩阵（被喜欢与建立信任，P0主线）；路径3小店标品自成交闪电链（先付小钱筛精准客户，需匹配咨询/诊断类目）；路径4产业带展会与群主分销（B2B暖流量）；路径5付费投流（验证CAC后开启）。
          </desc>
          <defs>
            <pattern id="dd-dots-gtm" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.85" fill="rgba(45,49,66,0.10)" />
            </pattern>
            <marker id="gr-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4b5563" />
            </marker>
            <marker id="gr-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
            </marker>
          </defs>

          <rect width="1040" height="580" fill="#ffffff" />
          <rect width="1040" height="580" fill="url(#dd-dots-gtm)" opacity="0.5" />

          {/* Column Stage Headers */}
          <rect x="200" y="16" width="184" height="24" rx="4" fill="rgba(45,49,66,0.06)" />
          <text x="292" y="32" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            STAGE 1 · 触达入口（人在哪）
          </text>

          <rect x="412" y="16" width="204" height="24" rx="4" fill="rgba(45,49,66,0.06)" />
          <text x="514" y="32" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            STAGE 2 · 内容/钩子机制
          </text>

          <rect x="644" y="16" width="184" height="24" rx="4" fill="rgba(45,49,66,0.06)" />
          <text x="736" y="32" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            STAGE 3 · 承接与筛选
          </text>

          <rect x="856" y="16" width="164" height="24" rx="4" fill="rgba(45,49,66,0.06)" />
          <text x="938" y="32" fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            STAGE 4 · 成交动作
          </text>

          {/* Swimlane Dividers */}
          <line x1="20" y1="52" x2="1020" y2="52" stroke="rgba(45,49,66,0.22)" strokeWidth="1" />
          <line x1="20" y1="144" x2="1020" y2="144" stroke="rgba(45,49,66,0.12)" strokeWidth="1" />
          <line x1="20" y1="236" x2="1020" y2="236" stroke="rgba(45,49,66,0.12)" strokeWidth="1" />
          <line x1="20" y1="328" x2="1020" y2="328" stroke="rgba(45,49,66,0.12)" strokeWidth="1" />
          <line x1="20" y1="420" x2="1020" y2="420" stroke="rgba(45,49,66,0.12)" strokeWidth="1" />
          <line x1="20" y1="512" x2="1020" y2="512" stroke="rgba(45,49,66,0.22)" strokeWidth="1" />
          <line x1="188" y1="52" x2="188" y2="512" stroke="rgba(45,49,66,0.22)" strokeWidth="1" />

          {/* Focal Lane Highlights (Lane 1 & Lane 2) */}
          <rect x="20" y="52" width="1000" height="92" fill="rgba(37,99,235,0.04)" />
          <rect x="20" y="144" width="1000" height="92" fill="rgba(37,99,235,0.04)" />

          {/* ── LANE 1: 应用内搜索拦截 (AEO 品类词占位) ── */}
          <text x="32" y="84" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            路子 1 · 搜索拦截
          </text>
          <text x="32" y="102" fill="#111418" fontSize="10.5" fontWeight="600" fontFamily="var(--font-sans)">
            应用内搜索（AEO）
          </text>
          <text x="32" y="120" fill="#2563eb" fontSize="9.5" fontWeight="600" fontFamily="var(--font-mono)">
            [P0 主线 · 主动高意图]
          </text>

          <line x1="384" y1="98" x2="412" y2="98" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#gr-arrow-accent)" />
          <line x1="616" y1="98" x2="644" y2="98" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#gr-arrow-accent)" />
          <line x1="828" y1="98" x2="856" y2="98" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#gr-arrow-accent)" />

          <rect x="200" y="66" width="184" height="64" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.4" />
          <text x="292" y="90" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            微信搜一搜 / 抖音搜索
          </text>
          <text x="292" y="108" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            次选：小红书搜 / 豆包 ChatGPT
          </text>

          <rect x="412" y="66" width="204" height="64" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.4" />
          <text x="514" y="90" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            答案型标题 + 认证主体
          </text>
          <text x="514" y="108" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            「外贸独立站多少钱/详解」+ 近期更新
          </text>

          <rect x="644" y="66" width="184" height="64" rx="6" fill="#ffffff" stroke="#111418" strokeWidth="1" />
          <text x="736" y="90" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            主页挂微信 / 公众号承接
          </text>
          <text x="736" y="108" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            带着明确建站问题进私域
          </text>

          <rect x="856" y="66" width="164" height="64" rx="6" fill="rgba(37,99,235,0.10)" stroke="#2563eb" strokeWidth="1.4" />
          <text x="938" y="90" fill="#2563eb" fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            看成品草稿 → 签 B/C 档
          </text>
          <text x="938" y="108" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
            ¥5,800 / 季度代运营
          </text>

          {/* ── LANE 2: 个人 IP 内容与反哺矩阵 ── */}
          <text x="32" y="176" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            路子 2 · IP 与矩阵
          </text>
          <text x="32" y="194" fill="#111418" fontSize="10.5" fontWeight="600" fontFamily="var(--font-sans)">
            创始人内容导回主号
          </text>
          <text x="32" y="212" fill="#2563eb" fontSize="9.5" fontWeight="600" fontFamily="var(--font-mono)">
            [P0 主线 · 信任复利]
          </text>

          <line x1="384" y1="190" x2="412" y2="190" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#gr-arrow-accent)" />
          <line x1="616" y1="190" x2="644" y2="190" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#gr-arrow-accent)" />
          <line x1="828" y1="190" x2="856" y2="190" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#gr-arrow-accent)" />

          <rect x="200" y="158" width="184" height="64" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.4" />
          <text x="292" y="182" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            视频号 + 抖音（两人四号）
          </text>
          <text x="292" y="200" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            Liz + Hanzi · 小红书/B站顺手同步
          </text>

          <rect x="412" y="158" width="204" height="64" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.4" />
          <text x="514" y="182" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            60s 交付录屏 + 鲜明人设口播
          </text>
          <text x="514" y="200" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            丢 PDF→出站演示 · 前端内容自带筛选
          </text>

          <rect x="644" y="158" width="184" height="64" rx="6" fill="#ffffff" stroke="#111418" strokeWidth="1" />
          <text x="736" y="182" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            私信自动回 / 微信深聊
          </text>
          <text x="736" y="200" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            记 30 天询单台账；满负荷再请小时工
          </text>

          <rect x="856" y="158" width="164" height="64" rx="6" fill="rgba(37,99,235,0.10)" stroke="#2563eb" strokeWidth="1.4" />
          <text x="938" y="182" fill="#2563eb" fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            文字/电话建信 → 定制报价
          </text>
          <text x="938" y="200" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
            种子高客单主路径
          </text>

          {/* ── LANE 3: 小店标品自成交闪电链 ── */}
          <text x="32" y="268" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
            路子 3 · 小店闪电链
          </text>
          <text x="32" y="286" fill="#4b5563" fontSize="10.5" fontFamily="var(--font-sans)">
            先付钱投票再服务
          </text>
          <text x="32" y="304" fill="#1e40af" fontSize="9.5" fontWeight="600" fontFamily="var(--font-mono)">
            [P1 筛选器 · 需换商品形态]
          </text>

          <line x1="384" y1="282" x2="412" y2="282" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#gr-arrow)" />
          <line x1="616" y1="282" x2="644" y2="282" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#gr-arrow)" />
          <line x1="828" y1="282" x2="856" y2="282" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#gr-arrow)" />

          <rect x="200" y="250" width="184" height="64" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="292" y="274" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            视频号主页挂微信小店
          </text>
          <text x="292" y="292" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            对标 Don&apos;t Be Silent（已售 1,410）
          </text>

          <rect x="412" y="250" width="204" height="64" rx="6" fill="#ffffff" stroke="#1e40af" strokeWidth="1" strokeDasharray="4,3" />
          <text x="514" y="274" fill="#1e40af" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            挂「付费咨询 / 建站诊断 / 社群」
          </text>
          <text x="514" y="292" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            注：小店无软件开发类目，须走教培咨询
          </text>

          <rect x="644" y="250" width="184" height="64" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="736" y="274" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            ¥99–599 自助下单即筛选
          </text>
          <text x="736" y="292" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            用真金白银过滤白嫖党
          </text>

          <rect x="856" y="250" width="164" height="64" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="938" y="274" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            加微信交付 → 升单 B/C
          </text>
          <text x="938" y="292" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
            前端现金流 + 后端大单
          </text>

          {/* ── LANE 4: 渠道分销与产业带现场 ── */}
          <text x="32" y="360" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
            路子 4 · 分销与展会
          </text>
          <text x="32" y="378" fill="#4b5563" fontSize="10.5" fontFamily="var(--font-sans)">
            借别人信任与线下高密度
          </text>
          <text x="32" y="396" fill="#4b5563" fontSize="9.5" fontWeight="600" fontFamily="var(--font-mono)">
            [P1 暖流量 · 3伙伴起测]
          </text>

          <line x1="384" y1="374" x2="412" y2="374" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#gr-arrow)" />
          <line x1="616" y1="374" x2="644" y2="374" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#gr-arrow)" />
          <line x1="828" y1="374" x2="856" y2="374" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#gr-arrow)" />

          <rect x="200" y="342" width="184" height="64" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="292" y="366" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            外贸培训老师 / 社群群主
          </text>
          <text x="292" y="384" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            + 宁波/义乌产业带展会当面演示
          </text>

          <rect x="412" y="342" width="204" height="64" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="514" y="366" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            专属归属链接 + 3分钟真机演示
          </text>
          <text x="514" y="384" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            全球统一价 · 分销商无权改价
          </text>

          <rect x="644" y="342" width="184" height="64" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="736" y="366" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            扫码加微信 + 关注视频号
          </text>
          <text x="736" y="384" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            现场片段回流线上当素材
          </text>

          <rect x="856" y="342" width="164" height="64" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="938" y="366" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            按 A/B/C 档阶梯分佣
          </text>
          <text x="938" y="384" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
            钱进我们账户再结算
          </text>

          {/* ── LANE 5: 商业广告投流 ── */}
          <text x="32" y="452" fill="#8a93a0" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">
            路子 5 · 付费投流
          </text>
          <text x="32" y="470" fill="#8a93a0" fontSize="10.5" fontFamily="var(--font-sans)">
            平台加热与搜索广告
          </text>
          <text x="32" y="488" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-mono)">
            [P2 放大器 · 暂不启动]
          </text>

          <line x1="384" y1="466" x2="412" y2="466" stroke="#8a93a0" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#gr-arrow)" />
          <line x1="616" y1="466" x2="644" y2="466" stroke="#8a93a0" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#gr-arrow)" />
          <line x1="828" y1="466" x2="856" y2="466" stroke="#8a93a0" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#gr-arrow)" />

          <rect x="200" y="434" width="184" height="64" rx="6" fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.22)" strokeWidth="1" strokeDasharray="4,3" />
          <text x="292" y="458" fill="#4b5563" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            微信豆 / 抖音 DOU+ / 聚光
          </text>
          <text x="292" y="476" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            开户首充多在 ¥2,000–10,000
          </text>

          <rect x="412" y="434" width="204" height="64" rx="6" fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.22)" strokeWidth="1" strokeDasharray="4,3" />
          <text x="514" y="458" fill="#4b5563" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            只投已被自然流量验证的爆款
          </text>
          <text x="514" y="476" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            不投冷启动硬广（纯粹买曝光）
          </text>

          <rect x="644" y="434" width="184" height="64" rx="6" fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.22)" strokeWidth="1" strokeDasharray="4,3" />
          <text x="736" y="458" fill="#4b5563" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            企业微信获客助手 / 留资卡
          </text>
          <text x="736" y="476" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            按成功添加或有效留资计费
          </text>

          <rect x="856" y="434" width="164" height="64" rx="6" fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.22)" strokeWidth="1" strokeDasharray="4,3" />
          <text x="938" y="458" fill="#4b5563" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            单客获客成本跑通后再开
          </text>
          <text x="938" y="476" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
            现阶段优先级最低
          </text>

          {/* Bottom Legend Strip */}
          <line x1="20" y1="532" x2="1020" y2="532" stroke="rgba(45,49,66,0.14)" strokeWidth="0.8" />
          <text x="20" y="556" fill="#4b5563" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="0.12em">
            LEGEND
          </text>
          <rect x="92" y="546" width="14" height="10" rx="2" fill="rgba(37,99,235,0.10)" stroke="#2563eb" strokeWidth="1.4" />
          <text x="112" y="555" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">P0 立即执行主线（路子 1 + 路子 2）</text>
          <rect x="332" y="546" width="14" height="10" rx="2" fill="#ffffff" stroke="#1e40af" strokeWidth="1" strokeDasharray="3,2" />
          <text x="352" y="555" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">类目改造卡点（建站诊断/咨询可上小店，纯工程不可）</text>
          <rect x="668" y="546" width="14" height="10" rx="2" fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.22)" strokeWidth="1" strokeDasharray="3,2" />
          <text x="688" y="555" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)">P2 暂缓路径（待转化率跑通后再投）</text>
        </svg>
      </div>
    </div>
  );
}

/**
 * 图 2：应用内搜索两场仗与排名前排机制解构图
 * 直观对比：搜名字（认识你的人）vs 搜品类词（挑供应商的人），以及为什么赞 1–77 排在赞 118 前面。
 */
export function SearchMechanismSvg() {
  return (
    <div className="dd-diagram-wrap">
      <div className="dd-diagram-head">
        <span className="dd-eyebrow">FIGURE 02 · IN-APP SEARCH (AEO) MECHANISM DECONSTRUCTION</span>
        <span className="dd-caption">搜名字 vs 搜品类词是两套完全不同的算法；品类词前排不看点赞，看三项对齐</span>
      </div>
      <div className="dd-svg-scroll">
        <svg
          viewBox="0 0 1000 390"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="search-mech-title search-mech-desc"
          className="dd-svg"
        >
          <title id="search-mech-title">应用内搜索两类搜索词与排名机制对比图</title>
          <desc id="search-mech-desc">
            对比搜人名（如 yiwei 出海，矩阵多号有效）与搜品类词（如品牌出海 SEO，前排点赞仅 1 至 77，后排点赞 118 却掉队）。揭示品类词排名前排的三个决定因子：答案型标题含精确品类词、账号主体认证且名字对齐、微信侧 48 小时内近期活跃。
          </desc>
          <defs>
            <marker id="sm-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4b5563" />
            </marker>
            <marker id="sm-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
            </marker>
          </defs>

          <rect width="1000" height="460" fill="#ffffff" />

          {/* Left Track: 搜名字 (Brand/Person Query) */}
          <rect x="24" y="24" width="356" height="364" rx="8" fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.14)" strokeWidth="1" />
          <rect x="40" y="16" width="212" height="16" rx="2" fill="#ffffff" />
          <text x="48" y="28" fill="#4b5563" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">
            战役 A · 搜名字（已有认知，找入口）
          </text>

          <line x1="202" y1="104" x2="202" y2="140" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#sm-arrow)" />
          <line x1="202" y1="212" x2="202" y2="248" stroke="#4b5563" strokeWidth="1.2" markerEnd="url(#sm-arrow)" />

          <rect x="52" y="52" width="300" height="52" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="202" y="74" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            搜索框输入：「yiwei 出海」「Don&apos;t Be Silent」
          </text>
          <text x="202" y="92" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            买家已经听说过你，来核实身份或加联系方式
          </text>

          <rect x="52" y="140" width="300" height="72" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="202" y="164" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            生效机制：账号昵称带业务词占位
          </text>
          <text x="202" y="182" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            实测（截图 03/04/05）：同脸多号在名字搜索下霸屏
          </text>
          <text x="202" y="198" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
            粉丝 0 / 8 / 14 / 57 也能排出来
          </text>

          <rect x="52" y="248" width="300" height="116" rx="6" fill="rgba(45,49,66,0.04)" stroke="#4b5563" strokeWidth="1" />
          <text x="202" y="272" fill="#111418" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            矩阵在这里的真实作用与边界
          </text>
          <text x="72" y="294" fill="#111418" fontSize="10.5" fontFamily="var(--font-sans)">
            ✓ 学：主号 + 工具箱 + 手记，流量导回同一人
          </text>
          <text x="84" y="310" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            不同内容形态全部导回同一个主 IP，强化辨识度
          </text>
          <text x="72" y="332" fill="#8a93a0" fontSize="10.5" fontFamily="var(--font-sans)">
            ✗ 反面做法（关键词堆号）：单平台开 8–11 个同质号
          </text>
          <text x="84" y="348" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)">
            搜品类词时全部排在后面，且观感像批量垃圾号
          </text>

          {/* Right Track: 搜品类词 (Category Query - FOCAL) */}
          <rect x="404" y="24" width="572" height="364" rx="8" fill="rgba(37,99,235,0.03)" stroke="#2563eb" strokeWidth="1.2" />
          <rect x="420" y="16" width="296" height="16" rx="2" fill="#ffffff" />
          <text x="428" y="28" fill="#2563eb" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">
            ★ 战役 B · 搜品类词（陌生买家挑供应商 · 核心增量）
          </text>

          <line x1="690" y1="104" x2="690" y2="136" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#sm-arrow-accent)" />

          <rect x="432" y="52" width="516" height="52" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
          <text x="690" y="74" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            搜索框输入：「品牌出海 SEO」「外贸独立站多少钱」（截图 07/08 实测）
          </text>
          <text x="690" y="92" fill="#2563eb" fontSize="10.5" fontWeight="600" fontFamily="var(--font-mono)" textAnchor="middle">
            反直觉事实：前排点赞仅 1、2、4、10、12、22、45、77；排后面的反而有 118 赞！
          </text>

          {/* 3 Pillars of Category Ranking */}
          <rect x="432" y="136" width="164" height="132" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
          <rect x="444" y="148" width="24" height="16" rx="3" fill="rgba(37,99,235,0.16)" />
          <text x="456" y="159" fill="#2563eb" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">01</text>
          <text x="444" y="182" fill="#111418" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            标题含精确词+答案型
          </text>
          <text x="444" y="202" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            前排：「独立站 SEO 详解」
          </text>
          <text x="444" y="218" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            「选关键词的 4 条铁律」
          </text>
          <text x="444" y="240" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)">
            后排掉队：口播讲抽象观点、
          </text>
          <text x="444" y="254" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)">
            标题缺「品牌出海」词根
          </text>

          <rect x="608" y="136" width="164" height="132" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
          <rect x="620" y="148" width="24" height="16" rx="3" fill="rgba(37,99,235,0.16)" />
          <text x="632" y="159" fill="#2563eb" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">02</text>
          <text x="620" y="182" fill="#111418" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            主体认证 + 词义对齐
          </text>
          <text x="620" y="202" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            微信认证页明文：「搜索排前，
          </text>
          <text x="620" y="218" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            优先展示认证账号」
          </text>
          <text x="620" y="240" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)">
            账号名带词 + 标题同义词，
          </text>
          <text x="620" y="254" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)">
            平台才判定主体垂直
          </text>

          <rect x="784" y="136" width="164" height="132" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
          <rect x="796" y="148" width="24" height="16" rx="3" fill="rgba(37,99,235,0.16)" />
          <text x="808" y="159" fill="#2563eb" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">03</text>
          <text x="796" y="182" fill="#111418" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            平台时效权重差异
          </text>
          <text x="796" y="202" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            微信搜一搜：极看近期活跃
          </text>
          <text x="796" y="218" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            （前排几乎全在 1–2 天内）
          </text>
          <text x="796" y="240" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)">
            小红书搜索：长尾保留久
          </text>
          <text x="796" y="254" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)">
            （半年前干货仍在首屏）
          </text>

          {/* Actionable Zero-Cost Verification Box */}
          <rect x="432" y="288" width="516" height="76" rx="6" fill="rgba(37,99,235,0.10)" stroke="#2563eb" strokeWidth="1.2" />
          <text x="448" y="312" fill="#2563eb" fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)">
            零成本实测动作（本周直接跑）：
          </text>
          <text x="448" y="332" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">
            1. 选定 3 个买方高频词（「外贸独立站多少钱」「品牌出海建站」「外贸建站避坑」）；
          </text>
          <text x="448" y="350" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">
            2. 同一交付录屏改标题为「精确词 + 详解/清单/多少钱」，隔 7 天跨微信与抖音核对排位。
          </text>

        </svg>
      </div>
    </div>
  );
}

/**
 * 图 3：两条信息流严格解耦图 (Two Strictly Decoupled Pipelines)
 * 彻底理清之前混成一团的两套流向：
 * 上半图：我们自己的 GTM 获客与收款漏斗（视频号/抖音/搜索 → 内容前端筛选 → 小店或微信深聊 → 签单）
 * 下半图：客户出海独立站的海外买家询盘流（海外买家 → 客户独立站表单 → 询盘落客户自己邮箱/WhatsApp + 通知提醒客户）
 */
export function DualPipelineSvg() {
  return (
    <div className="dd-diagram-wrap">
      <div className="dd-diagram-head">
        <span className="dd-eyebrow">FIGURE 03 · TWO DECOUPLED FLOWS: OUR GTM FUNNEL VS. CLIENT OVERSEAS INQUIRY</span>
        <span className="dd-caption">彻底分清两件事：上半图是「我们怎么获客收钱」，下半图是「客户的海外买家询盘落到哪」</span>
      </div>
      <div className="dd-svg-scroll">
        <svg
          viewBox="0 0 1000 440"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="dual-pipe-title dual-pipe-desc"
          className="dd-svg"
        >
          <title id="dual-pipe-title">Foundry 自身获客漏斗与客户海外买家询盘流向解耦图</title>
          <desc id="dual-pipe-desc">
            上半图展示 Foundry 自身获客与筛选漏斗：100人看内容，前端内容自动劝退不匹配者，5-10人加私域或拍小店诊断，最终1人成交代建/代运营；下半图展示客户出海独立站的询盘流：海外买家用邮件或 WhatsApp 填表，询盘本身直接落客户自己的邮箱与 WhatsApp，绝不经过我们的企业微信。
          </desc>
          <defs>
            <marker id="dp-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4b5563" />
            </marker>
            <marker id="dp-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
            </marker>
            <marker id="dp-arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#1e40af" />
            </marker>
          </defs>

          <rect width="1000" height="440" fill="#ffffff" />

          {/* ── PIPELINE A: 我们自己的国内获客与筛选漏斗 ── */}
          <rect x="24" y="24" width="952" height="172" rx="8" fill="rgba(37,99,235,0.03)" stroke="rgba(37,99,235,0.28)" strokeWidth="1" />
          <rect x="40" y="16" width="380" height="16" rx="2" fill="#ffffff" />
          <text x="48" y="28" fill="#2563eb" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">
            流向 A · 我们自己的获客与成交链（国内社媒 → 我们的私域/小店 → 我们收服务费）
          </text>

          {/* Arrows A */}
          <line x1="232" y1="108" x2="268" y2="108" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#dp-arrow-accent)" />
          <line x1="476" y1="108" x2="512" y2="108" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#dp-arrow-accent)" />
          <line x1="728" y1="108" x2="764" y2="108" stroke="#2563eb" strokeWidth="1.4" markerEnd="url(#dp-arrow-accent)" />

          {/* Step A1 */}
          <rect x="44" y="64" width="188" height="88" rx="6" fill="#ffffff" stroke="#111418" strokeWidth="1" />
          <text x="138" y="88" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            1. 观众看到内容（~100人）
          </text>
          <text x="138" y="108" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            视频号 / 抖音 / 搜一搜
          </text>
          <text x="138" y="126" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            丢 PDF→出站录屏 + 明确立场
          </text>

          {/* Step A2 (Focal Filter) */}
          <rect x="268" y="64" width="208" height="88" rx="6" fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="1.4" />
          <text x="372" y="88" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            2. 前端内容自带销售筛选
          </text>
          <text x="372" y="108" fill="#111418" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            讲清边界与价格锚点，劝退白嫖
          </text>
          <text x="372" y="126" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            「付钱的人就是精准的」
          </text>

          {/* Step A3 */}
          <rect x="512" y="64" width="216" height="88" rx="6" fill="#ffffff" stroke="#111418" strokeWidth="1" />
          <text x="620" y="88" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            3. 进私域或拍小店（~5–10人）
          </text>
          <text x="620" y="108" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            路 A：小店拍诊断/咨询先付小钱
          </text>
          <text x="620" y="126" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            路 B：加微信文字/电话深聊建信
          </text>

          {/* Step A4 */}
          <rect x="764" y="64" width="192" height="88" rx="6" fill="rgba(37,99,235,0.12)" stroke="#2563eb" strokeWidth="1.5" />
          <text x="860" y="88" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            4. 成交签约（~1人）
          </text>
          <text x="860" y="108" fill="#111418" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            先看首页草稿 → 对公/企微收款
          </text>
          <text x="860" y="126" fill="#4b5563" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
            记入月度私聊询单台账
          </text>

          {/* ── PIPELINE B: 客户独立站的海外买家询盘流 ── */}
          <rect x="24" y="220" width="952" height="156" rx="8" fill="rgba(46,90,168,0.03)" stroke="rgba(46,90,168,0.28)" strokeWidth="1" />
          <rect x="40" y="212" width="448" height="16" rx="2" fill="#ffffff" />
          <text x="48" y="224" fill="#1e40af" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">
            流向 B · 客户出海站的海外买家询盘链（客户的客户 → 客户自己的邮箱/WhatsApp）
          </text>

          {/* Arrows B */}
          <line x1="232" y1="298" x2="268" y2="298" stroke="#1e40af" strokeWidth="1.4" markerEnd="url(#dp-arrow-link)" />
          <line x1="476" y1="282" x2="528" y2="282" stroke="#1e40af" strokeWidth="1.4" markerEnd="url(#dp-arrow-link)" />
          <line x1="476" y1="316" x2="528" y2="316" stroke="#4b5563" strokeWidth="1.2" strokeDasharray="5,4" markerEnd="url(#dp-arrow)" />

          {/* Step B1 */}
          <rect x="44" y="256" width="188" height="84" rx="6" fill="#ffffff" stroke="#1e40af" strokeWidth="1" />
          <text x="138" y="282" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            海外采购商（Buyer）
          </text>
          <text x="138" y="302" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            从 Google / ChatGPT 搜到
          </text>
          <text x="138" y="320" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-sans)" textAnchor="middle">
            在客户独立站提交 RFQ 询盘
          </text>

          {/* Step B2 */}
          <rect x="268" y="256" width="208" height="84" rx="6" fill="#ffffff" stroke="#1e40af" strokeWidth="1.2" />
          <text x="372" y="282" fill="#1e40af" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            Foundry 站点后台处理
          </text>
          <text x="372" y="302" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
            落库 + 触发分发路由
          </text>
          <text x="372" y="320" fill="#8a93a0" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
            绝不推到我们的企业微信！
          </text>

          {/* Step B3 Top: 询盘本身 */}
          <rect x="528" y="248" width="428" height="44" rx="6" fill="rgba(46,90,168,0.08)" stroke="#1e40af" strokeWidth="1.2" />
          <text x="544" y="268" fill="#1e40af" fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)">
            ① 询盘本身（采购内容）：直接落客户自己的邮箱 + WhatsApp
          </text>
          <text x="544" y="284" fill="#4b5563" fontSize="10" fontFamily="var(--font-sans)">
            海外买家不用微信；客户在邮箱 / WhatsApp 里直接跟买家谈单（已核实）
          </text>

          {/* Step B3 Bottom: 询盘通知 */}
          <rect x="528" y="304" width="428" height="44" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" strokeDasharray="4,3" />
          <text x="544" y="324" fill="#111418" fontSize="11.5" fontWeight="600" fontFamily="var(--font-sans)">
            ② 询盘通知（提醒老板「来新单了」）：按客户习惯选推送渠道
          </text>
          <text x="544" y="340" fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)">
            邮件 / 短信 / 私信提醒；高阶：WhatsApp 侧接 AI Agent 甄别真假买家
          </text>

          {/* Bottom Legend Strip */}
          <line x1="24" y1="396" x2="976" y2="396" stroke="rgba(45,49,66,0.14)" strokeWidth="0.8" />
          <text x="24" y="420" fill="#4b5563" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="0.12em">
            KEY DISTINCTION
          </text>
          <text x="148" y="420" fill="#111418" fontSize="11" fontFamily="var(--font-sans)">
            微信 / 小店是我们国内获客收钱的工具（流向 A）；邮箱 / WhatsApp 是客户做海外生意的交付通道（流向 B）。两套主权严格隔离。
          </text>
        </svg>
      </div>
    </div>
  );
}


/**
 * 产能阶梯：B 档整包价 vs C 档月费，两套计量单位分立。
 */
export function CapacityLadderSvg({
  bPoints,
  cPoints,
}: {
  bPoints: { label: string; value: number; display: string; sub?: string }[];
  cPoints: { label: string; value: number; display: string; sub?: string }[];
}) {
  const bMax = Math.max(...bPoints.map((p) => p.value));
  const cMax = Math.max(...cPoints.map((p) => p.value));
  const baseY = 220;
  const barMaxH = 140;

  const bar = (
    points: typeof bPoints,
    max: number,
    originX: number,
    accent: boolean,
  ) =>
    points.map((pt, i) => {
      const h = Math.max((pt.value / max) * barMaxH, 28);
      const x = originX + i * 92;
      const y = baseY - h;
      const fill = accent && i === 0 ? "rgba(37,99,235,0.16)" : "rgba(45,49,66,0.08)";
      const stroke = accent && i === 0 ? "#2563eb" : "#4b5563";
      return (
        <g key={`${originX}-${pt.label}`}>
          <rect x={x} y={y} width="72" height={h} rx="4" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <text x={x + 36} y={y - 10} fill="#111418" fontSize="12" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">
            {pt.display}
          </text>
          <text x={x + 36} y={baseY + 18} fill="#111418" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            {pt.label}
          </text>
          {pt.sub ? (
            <text x={x + 36} y={baseY + 34} fill="#8a93a0" fontSize="10" fontFamily="var(--font-sans)" textAnchor="middle">
              {pt.sub}
            </text>
          ) : null}
        </g>
      );
    });

  return (
    <div className="dd-diagram-wrap">
      <div className="dd-diagram-head">
        <span className="dd-eyebrow">FIGURE · CAPACITY LADDER</span>
        <span className="dd-caption">B 按单整包阶梯 · C 按家月费阶梯 · 满额进等候名单（（草案））</span>
      </div>
      <div className="dd-svg-scroll">
        <svg
          viewBox="0 0 760 280"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="cap-ladder-title cap-ladder-desc"
          className="dd-svg"
        >
          <title id="cap-ladder-title">B 档与 C 档产能阶梯对比</title>
          <desc id="cap-ladder-desc">
            左：B 档代建本季 6 单，价格从 5800 递进到 7800。右：C 档代运营同时最多 5 家，月费从 1500 递进到 2000。
          </desc>
          <rect width="760" height="280" fill="#ffffff" />

          <rect x="24" y="16" width="340" height="248" rx="8" fill="rgba(37,99,235,0.03)" stroke="rgba(37,99,235,0.22)" strokeWidth="1" />
          <text x="40" y="40" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            B · 代建整包（本季限 6 单）
          </text>
          {bar(bPoints, bMax, 48, true)}

          <rect x="396" y="16" width="340" height="248" rx="8" fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.14)" strokeWidth="1" />
          <text x="412" y="40" fill="#111418" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            C · 代运营月费（同时限 5 家）
          </text>
          {bar(cPoints, cMax, 420, false)}
        </svg>
      </div>
    </div>
  );
}

/**
 * 反哺主 IP vs 关键词堆号 —— 小对比图，替代长散文表。
 */
export function MatrixChoiceSvg() {
  return (
    <div className="dd-diagram-wrap">
      <div className="dd-diagram-head">
        <span className="dd-eyebrow">FIGURE · MATRIX CHOICE</span>
        <span className="dd-caption">同样开多号：导回主号（学） vs 关键词堆号（避）</span>
      </div>
      <div className="dd-svg-scroll">
        <svg
          viewBox="0 0 1000 220"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="matrix-choice-title matrix-choice-desc"
          className="dd-svg"
        >
          <title id="matrix-choice-title">反哺型矩阵与关键词堆号对比</title>
          <desc id="matrix-choice-desc">
            左侧：主号加工具箱加手记，不同体裁导回同一主 IP，辨识度高可带动小店自成交。右侧：同质关键词号铺开，搜品类词排不上且观感像垃圾营销。
          </desc>
          <defs>
            <marker id="mc-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
            </marker>
          </defs>
          <rect width="1000" height="220" fill="#ffffff" />

          {/* Left: learn */}
          <rect x="24" y="20" width="460" height="180" rx="8" fill="rgba(37,99,235,0.04)" stroke="#2563eb" strokeWidth="1.2" />
          <text x="40" y="44" fill="#2563eb" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            ✓ 学：多号服务同一主号（Don&apos;t Be Silent 型）
          </text>
          <rect x="48" y="64" width="120" height="44" rx="6" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
          <text x="108" y="90" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">主号·口播</text>
          <rect x="196" y="64" width="120" height="44" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="256" y="90" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">工具箱</text>
          <rect x="344" y="64" width="120" height="44" rx="6" fill="#ffffff" stroke="#4b5563" strokeWidth="1" />
          <text x="404" y="90" fill="#111418" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">手记/白板</text>
          <line x1="108" y1="108" x2="108" y2="136" stroke="#2563eb" strokeWidth="1.2" markerEnd="url(#mc-arrow)" />
          <line x1="256" y1="108" x2="180" y2="136" stroke="#2563eb" strokeWidth="1.2" markerEnd="url(#mc-arrow)" />
          <line x1="404" y1="108" x2="240" y2="136" stroke="#2563eb" strokeWidth="1.2" markerEnd="url(#mc-arrow)" />
          <rect x="120" y="140" width="220" height="40" rx="6" fill="rgba(37,99,235,0.12)" stroke="#2563eb" strokeWidth="1.4" />
          <text x="230" y="164" fill="#2563eb" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" textAnchor="middle">
            同一主 IP · 信任复利
          </text>

          {/* Right: avoid */}
          <rect x="516" y="20" width="460" height="180" rx="8" fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.18)" strokeWidth="1" />
          <text x="532" y="44" fill="#4b5563" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
            ✗ 避：关键词堆号（同质后缀铺开）
          </text>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={540 + i * 100}
              y="72"
              width="84"
              height="40"
              rx="6"
              fill="#ffffff"
              stroke="#8a93a0"
              strokeWidth="1"
              strokeDasharray="4,3"
            />
          ))}
          <text x="582" y="96" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)" textAnchor="middle">出海SEO</text>
          <text x="682" y="96" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)" textAnchor="middle">GEO号</text>
          <text x="782" y="96" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)" textAnchor="middle">独立站…</text>
          <text x="882" y="96" fill="#8a93a0" fontSize="11" fontFamily="var(--font-sans)" textAnchor="middle">…×N</text>
          <rect x="560" y="140" width="360" height="40" rx="6" fill="rgba(45,49,66,0.06)" stroke="#4b5563" strokeWidth="1" />
          <text x="740" y="164" fill="#4b5563" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" textAnchor="middle">
            品类词排不上 · 观感像批量营销
          </text>
        </svg>
      </div>
    </div>
  );
}

