#!/usr/bin/env node
/**
 * Push showcase copy (title/description) from scripts/showcase-copy-registry.cjs
 * back into each product repo's OG meta — reverse control: edit the registry,
 * run this, and every product's social/search meta follows.
 *
 * Usage (from lizliz.xyz repo root):
 *   node scripts/sync-og-copy.cjs            # patch + commit + push all repos
 *   node scripts/sync-og-copy.cjs --dry-run  # show what would change, touch nothing
 *
 * Safety: stages ONLY the OG file per repo, never `git add -A`. Skips repos
 * already in sync. A failed push reports and continues.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { COPY } = require("./showcase-copy-registry.cjs");

const DRY = process.argv.includes("--dry-run");
const STAGE = process.argv.includes("--stage"); // write + git add, no commit/push
const ROOT = "/home/ubuntu/projects";
const COMMIT_MSG = "og: sync title/description from lizliz.xyz showcase registry";

/** url → { repo dir, OG file (source, never dist/out), patch kind } */
const REPO_MAP = [
  { url: "https://holopinch.lizliz.xyz/", repo: "holopinch", file: "index.html", kind: "html" },
  { url: "https://reddit-viral.lizliz.xyz/", repo: "reddit-viral", file: "index.html", kind: "html" },
  { url: "https://flappybird.lizliz.xyz/", repo: "flappybird-2026", file: "index.html", kind: "html" },
  { url: "https://brainrush.run/", repo: "BrainRush", file: "index.html", kind: "html" },
  { url: "https://pep-words.brainrush.run/", repo: "pep-words", file: "index.html", kind: "html" },
  { url: "https://shelfplan.lizliz.xyz/", repo: "retail-space-planner", file: "frontend/index.html", kind: "html" },
  { url: "https://cutting-die.lizliz.xyz/", repo: "dieline-generator", file: "index.html", kind: "html" },
  { url: "https://bitcoin-whitepaper.lizliz.xyz/", repo: "bitcoin-whitepaper-chinese-translation-2025", file: "index.html", kind: "html" },
  { url: "https://pausey.lizliz.xyz/", repo: "pausey", file: "index.html", kind: "html" },
  { url: "https://vibe-gba.lizliz.xyz/", repo: "vibe-gba", file: "site/index.html", kind: "html" },
  { url: "https://carver.lizliz.xyz/", repo: "carver", file: "app/layout.tsx", kind: "carver" },
  { url: "https://agent-crm.lizliz.xyz/", repo: "agent-crm", file: "src/app/layout.tsx", kind: "agentcrm" },
  { url: "https://acriva.lizliz.xyz/", repo: "acriva", file: "src/lib/data.ts", kind: "acriva" },
];

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** Replace content="..." inside a <meta ... attr="key" ...> tag (either attr order). */
function setMeta(html, attr, key, value) {
  const v = escHtml(value);
  const re = new RegExp(`<meta\\b[^>]*\\b${attr}="${key}"[^>]*>`, "i");
  const rev = new RegExp(`<meta\\b[^>]*content="[^"]*"[^>]*\\b${attr}="${key}"[^>]*>`, "i");
  const tag = (html.match(rev) || html.match(re))?.[0];
  if (!tag) return html;
  return html.replace(tag, tag.replace(/content="[^"]*"/i, `content="${v}"`));
}

function patchHtml(html, copy) {
  let out = html;
  if (/<title[^>]*>/i.test(out)) {
    out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escHtml(copy.title)}</title>`);
  }
  out = setMeta(out, "name", "description", copy.description);
  out = setMeta(out, "property", "og:title", copy.title);
  out = setMeta(out, "property", "og:description", copy.description);
  out = setMeta(out, "name", "twitter:title", copy.title);
  out = setMeta(out, "name", "twitter:description", copy.description);
  return out;
}

/** Replace `const name = "..."` (single- or multi-line string, ends with `";`). */
function patchTsConst(src, constName, value) {
  const re = new RegExp(`(const ${constName} =)\\s*"[\\s\\S]*?";`);
  if (!re.test(src)) return src;
  return src.replace(re, `$1 "${value}";`);
}

function patchCarver(src, copy) {
  let out = patchTsConst(src, "description", copy.description);
  if (!/default: "[^"]*"/.test(out)) return src;
  return out.replace(/(default: ")[^"]*(")/, `$1${copy.title}$2`);
}

function patchAgentCrm(src, copy) {
  let out = patchTsConst(src, "title", copy.title);
  return patchTsConst(out, "description", copy.description);
}

/** acriva: og:title is composed from product.zhName + product.taglineAlt (already in sync). */
function patchAcriva(src, copy) {
  const re = /(description:\s*")[\s\S]*?(")/;
  if (!re.test(src)) return src;
  return src.replace(re, `$1${copy.description}$2`);
}

function sh(cmd) {
  try {
    return { ok: true, out: execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).trim() };
  } catch (e) {
    return { ok: false, out: (e.stderr || e.message || "").toString().trim() };
  }
}

function main() {
  let synced = 0;
  let skipped = 0;
  let failed = 0;

  for (const { url, repo, file, kind } of REPO_MAP) {
    const copy = COPY[url];
    if (!copy) {
      console.log(`SKIP  ${repo}: no registry copy for ${url}`);
      skipped++;
      continue;
    }
    const abs = path.join(ROOT, repo);
    const filePath = path.join(abs, file);
    if (!fs.existsSync(filePath)) {
      console.log(`FAIL  ${repo}: missing ${file}`);
      failed++;
      continue;
    }
    const before = fs.readFileSync(filePath, "utf8");
    let after;
    if (kind === "html") after = patchHtml(before, copy);
    else if (kind === "carver") after = patchCarver(before, copy);
    else if (kind === "agentcrm") after = patchAgentCrm(before, copy);
    else if (kind === "acriva") after = patchAcriva(before, copy);
    else after = before;

    if (after === before) {
      console.log(`OK    ${repo}: already in sync`);
      skipped++;
      continue;
    }
    if (DRY) {
      const lines = after.split("\n");
      const diffLines = [];
      before.split("\n").forEach((l, i) => {
        if (lines[i] !== l) diffLines.push(`${i + 1}: ${l}  →  ${lines[i]}`);
      });
      console.log(`DRY   ${repo}: ${diffLines.length} line(s) would change in ${file}`);
      for (const d of diffLines.slice(0, 4)) console.log(`        ${d}`);
      synced++;
      continue;
    }

    fs.writeFileSync(filePath, after);
    const git = `git -C ${abs}`;
    sh(`${git} add ${file}`);
    if (STAGE) {
      console.log(`STAGE ${repo}: ${file} staged — review with: git -C ${abs} diff --cached -- ${file}`);
      synced++;
      continue;
    }
    const staged = sh(`${git} diff --cached --quiet ${file}`);
    if (staged.ok) {
      // nothing staged (shouldn't happen after write) — treat as already in sync
      console.log(`OK    ${repo}: no staged change after patch (already in sync)`);
      skipped++;
      continue;
    }
    const commit = sh(`${git} commit -m "${COMMIT_MSG}"`);
    if (!commit.ok) {
      console.log(`FAIL  ${repo}: commit — ${commit.out}`);
      failed++;
      continue;
    }
    const push = sh(`${git} push`);
    if (!push.ok) {
      console.log(`FAIL  ${repo}: push — ${push.out}`);
      failed++;
      continue;
    }
    console.log(`PUSH  ${repo}: ${file} synced (${commit.out.split("\n")[0]})`);
    synced++;
  }

  console.log(`\n${DRY ? "DRY-RUN" : "DONE"}: ${synced} synced, ${skipped} skipped/already-sync, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
