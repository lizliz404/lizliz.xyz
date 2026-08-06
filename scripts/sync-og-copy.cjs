#!/usr/bin/env node
/**
 * Bidirectional OG copy sync between the showcase registry and product repos.
 *
 * Shared copy lives in scripts/showcase-copy-registry.cjs (COPY).
 * Last-synced baseline: scripts/.og-sync-state.json (like git refs).
 *
 * Usage (from lizliz.xyz repo root):
 *   node scripts/sync-og-copy.cjs status
 *   node scripts/sync-og-copy.cjs push [--dry-run] [--stage]
 *   node scripts/sync-og-copy.cjs pull [--dry-run]
 *   node scripts/sync-og-copy.cjs            # same as push
 *   node scripts/sync-og-copy.cjs --dry-run  # same as push --dry-run
 *
 * Status: in-sync | registry-only | product-only | conflict | missing
 * Conflict: product != state AND registry != state (and product != registry).
 * Push: registry wins → products. Pull: product wins → registry (+ regenerate JSON).
 *
 * Safety: stages ONLY the OG file per repo, never `git add -A`. Skips repos
 * already in sync. A failed push reports and continues. Pull does not commit.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { COPY } = require("./showcase-copy-registry.cjs");

const argv = process.argv.slice(2);
const FLAGS = new Set(argv.filter((a) => a.startsWith("--")));
const POS = argv.filter((a) => !a.startsWith("--"));
const DRY = FLAGS.has("--dry-run");
const STAGE = FLAGS.has("--stage");
const CMD = POS[0] || "push";

const ROOT = "/home/ubuntu/projects";
const LIZLIZ = path.join(__dirname, "..");
const STATE_PATH = path.join(__dirname, ".og-sync-state.json");
const REGISTRY_PATH = path.join(__dirname, "showcase-copy-registry.cjs");
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

function decodeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function sameCopy(a, b) {
  if (!a || !b) return false;
  return a.title === b.title && a.description === b.description;
}

function snap(copy) {
  return { title: copy.title, description: copy.description };
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

function getMeta(html, attr, key) {
  const re = new RegExp(`<meta\\b[^>]*\\b${attr}="${key}"[^>]*>`, "i");
  const rev = new RegExp(`<meta\\b[^>]*content="[^"]*"[^>]*\\b${attr}="${key}"[^>]*>`, "i");
  const tag = (html.match(rev) || html.match(re))?.[0];
  if (!tag) return "";
  return decodeHtml(tag.match(/content="([^"]*)"/i)?.[1] || "");
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

function readHtml(html) {
  const title =
    getMeta(html, "property", "og:title") ||
    decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
  const description =
    getMeta(html, "property", "og:description") || getMeta(html, "name", "description") || "";
  return { title, description };
}

/** Replace `const name = "..."` (single- or multi-line string, ends with `";`). */
function patchTsConst(src, constName, value) {
  const re = new RegExp(`(const ${constName} =)\\s*"[\\s\\S]*?";`);
  if (!re.test(src)) return src;
  return src.replace(re, `$1 "${value}";`);
}

function readTsConst(src, constName) {
  const m = src.match(new RegExp(`const ${constName} =\\s*"([\\s\\S]*?)";`));
  return m?.[1] || "";
}

function patchCarver(src, copy) {
  let out = patchTsConst(src, "description", copy.description);
  if (!/default: "[^"]*"/.test(out)) return src;
  return out.replace(/(default: ")[^"]*(")/, `$1${copy.title}$2`);
}

function readCarver(src) {
  return {
    title: src.match(/default:\s*"([^"]*)"/)?.[1] || "",
    description: readTsConst(src, "description"),
  };
}

function patchAgentCrm(src, copy) {
  let out = patchTsConst(src, "title", copy.title);
  return patchTsConst(out, "description", copy.description);
}

function readAgentCrm(src) {
  return {
    title: readTsConst(src, "title"),
    description: readTsConst(src, "description"),
  };
}

/** acriva: og:title is composed from product.zhName + product.taglineAlt (already in sync). */
function patchAcriva(src, copy) {
  const re = /(description:\s*")[\s\S]*?(")/;
  if (!re.test(src)) return src;
  return src.replace(re, `$1${copy.description}$2`);
}

function readAcriva(src) {
  const zhName = src.match(/zhName:\s*"([^"]*)"/)?.[1] || "";
  const taglineAlt = src.match(/taglineAlt:\s*"([^"]*)"/)?.[1] || "";
  const description =
    src.match(/export const product = \{[\s\S]*?\bdescription:\s*"([\s\S]*?)"/)?.[1] || "";
  const title = zhName && taglineAlt ? `${zhName} — ${taglineAlt}` : "";
  return { title, description };
}

function readProduct(kind, src) {
  if (kind === "html") return readHtml(src);
  if (kind === "carver") return readCarver(src);
  if (kind === "agentcrm") return readAgentCrm(src);
  if (kind === "acriva") return readAcriva(src);
  return { title: "", description: "" };
}

function patchProduct(kind, src, copy) {
  if (kind === "html") return patchHtml(src, copy);
  if (kind === "carver") return patchCarver(src, copy);
  if (kind === "agentcrm") return patchAgentCrm(src, copy);
  if (kind === "acriva") return patchAcriva(src, copy);
  return src;
}

function sh(cmd) {
  try {
    return {
      ok: true,
      out: execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).trim(),
    };
  } catch (e) {
    return { ok: false, out: (e.stderr || e.message || "").toString().trim() };
  }
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) return null;
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

/** First run: assume registry == baseline so product-only drifts surface correctly. */
function ensureState() {
  let state = loadState();
  if (state) return { state, backfilled: false };
  state = {};
  for (const { url } of REPO_MAP) {
    const copy = COPY[url];
    if (copy) state[url] = snap(copy);
  }
  saveState(state);
  console.log(
    `state: backfilled ${Object.keys(state).length} urls from registry → scripts/.og-sync-state.json`,
  );
  return { state, backfilled: true };
}

function classify(registry, product, state) {
  if (!product) return "missing";
  if (!state) {
    // Should not happen after ensureState; treat missing state as registry baseline.
    return sameCopy(registry, product) ? "in-sync" : "product-only";
  }
  const regDrift = !sameCopy(registry, state);
  const prodDrift = !sameCopy(product, state);
  if (!regDrift && !prodDrift) return "in-sync";
  if (regDrift && prodDrift) {
    // Both moved to the same values → not a conflict; state is just stale.
    if (sameCopy(registry, product)) return "in-sync";
    return "conflict";
  }
  if (regDrift) return "registry-only";
  return "product-only";
}

function resolveEntry(entry, state) {
  const { url, repo, file, kind } = entry;
  const registry = COPY[url] ? snap(COPY[url]) : null;
  const abs = path.join(ROOT, repo);
  const filePath = path.join(abs, file);
  if (!registry) {
    return { url, repo, file, kind, filePath, registry: null, product: null, status: "missing", note: "no registry copy" };
  }
  if (!fs.existsSync(abs) || !fs.existsSync(filePath)) {
    return {
      url,
      repo,
      file,
      kind,
      filePath,
      registry,
      product: null,
      status: "missing",
      note: !fs.existsSync(abs) ? "repo absent" : `missing ${file}`,
    };
  }
  const src = fs.readFileSync(filePath, "utf8");
  const product = readProduct(kind, src);
  const baseline = state[url] || null;
  const status = classify(registry, product, baseline);
  return { url, repo, file, kind, filePath, registry, product, src, status, baseline };
}

function short(s, n = 72) {
  const t = String(s || "").replace(/\s+/g, " ");
  return t.length <= n ? t : t.slice(0, n - 1) + "…";
}

function printDrift(label, from, to) {
  if (from.title !== to.title) {
    console.log(`        title: ${short(from.title)}  →  ${short(to.title)}`);
  }
  if (from.description !== to.description) {
    console.log(`        desc:  ${short(from.description)}  →  ${short(to.description)}`);
  }
}

/** Update one COPY entry in showcase-copy-registry.cjs; preserve structure/comments. */
function writeRegistryEntry(url, copy) {
  let src = fs.readFileSync(REGISTRY_PATH, "utf8");
  const urlLit = JSON.stringify(url);
  const start = src.indexOf(urlLit);
  if (start < 0) throw new Error(`registry missing url ${url}`);
  const brace = src.indexOf("{", start);
  if (brace < 0) throw new Error(`registry malformed around ${url}`);
  let depth = 0;
  let end = -1;
  for (let i = brace; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) throw new Error(`registry unclosed block for ${url}`);
  let block = src.slice(brace, end + 1);
  if (!/title:\s*"/.test(block) || !/description:\s*"/.test(block)) {
    throw new Error(`registry block missing title/description for ${url}`);
  }
  block = block.replace(/(title:\s*)"[\s\S]*?"/, `$1${JSON.stringify(copy.title)}`);
  block = block.replace(/(description:\s*)"[\s\S]*?"/, `$1${JSON.stringify(copy.description)}`);
  fs.writeFileSync(REGISTRY_PATH, src.slice(0, brace) + block + src.slice(end + 1));
  // Refresh in-memory COPY for subsequent iterations in this process.
  COPY[url].title = copy.title;
  COPY[url].description = copy.description;
}

function regeneratePreviews() {
  execSync("node scripts/fetch-project-previews.cjs", {
    cwd: LIZLIZ,
    stdio: "inherit",
  });
}

function cmdStatus() {
  const { state } = ensureState();
  const counts = { "in-sync": 0, "registry-only": 0, "product-only": 0, conflict: 0, missing: 0 };

  for (const entry of REPO_MAP) {
    const r = resolveEntry(entry, state);
    counts[r.status] = (counts[r.status] || 0) + 1;
    const pad = r.status.padEnd(13);
    if (r.status === "missing") {
      console.log(`${pad} ${r.repo}: ${r.note}`);
      continue;
    }
    console.log(`${pad} ${r.repo}`);
    if (r.status === "registry-only") {
      printDrift("registry", r.baseline, r.registry);
    } else if (r.status === "product-only") {
      printDrift("product", r.baseline, r.product);
    } else if (r.status === "conflict") {
      console.log(`        registry: ${short(r.registry.title)} | ${short(r.registry.description)}`);
      console.log(`        product:  ${short(r.product.title)} | ${short(r.product.description)}`);
      console.log(`        state:    ${short(r.baseline?.title)} | ${short(r.baseline?.description)}`);
    }
  }

  console.log(
    `\nstatus: ${counts["in-sync"]} in-sync, ${counts["registry-only"]} registry-only, ${counts["product-only"]} product-only, ${counts.conflict} conflict, ${counts.missing} missing`,
  );
  return counts.missing + counts.conflict > 0 ? 1 : 0;
}

function cmdPush() {
  const { state } = ensureState();
  let synced = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of REPO_MAP) {
    const { url, repo, file, kind } = entry;
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
    const product = readProduct(kind, before);
    const after = patchProduct(kind, before, copy);

    if (after === before) {
      // File bytes match registry patch; align state baseline.
      if (!DRY && !sameCopy(state[url], copy)) {
        state[url] = snap(copy);
      }
      console.log(`OK    ${repo}: already in sync`);
      skipped++;
      continue;
    }

    if (DRY) {
      console.log(`DRY   ${repo}: would update ${file}`);
      printDrift("push", product, copy);
      synced++;
      continue;
    }

    fs.writeFileSync(filePath, after);
    const git = `git -C ${JSON.stringify(abs)}`;
    // Stage ONLY the OG file (path relative to repo).
    const add = sh(`${git} add -- ${JSON.stringify(file)}`);
    if (!add.ok) {
      console.log(`FAIL  ${repo}: git add — ${add.out}`);
      failed++;
      continue;
    }
    if (STAGE) {
      console.log(`STAGE ${repo}: ${file} staged — review with: git -C ${abs} diff --cached -- ${file}`);
      synced++;
      continue;
    }
    const staged = sh(`${git} diff --cached --quiet -- ${JSON.stringify(file)}`);
    if (staged.ok) {
      console.log(`OK    ${repo}: no staged change after patch (already in sync)`);
      state[url] = snap(copy);
      skipped++;
      continue;
    }
    const commit = sh(`${git} commit -m ${JSON.stringify(COMMIT_MSG)}`);
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
    state[url] = snap(copy);
    console.log(`PUSH  ${repo}: ${file} synced (${commit.out.split("\n")[0]})`);
    synced++;
  }

  if (!DRY && !STAGE) saveState(state);
  // --stage writes files but does not record state (push not complete).
  console.log(
    `\n${DRY ? "DRY-RUN" : STAGE ? "STAGED" : "DONE"}: ${synced} synced, ${skipped} skipped/already-sync, ${failed} failed`,
  );
  return failed > 0 ? 1 : 0;
}

function cmdPull() {
  const { state } = ensureState();
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const pending = [];

  for (const entry of REPO_MAP) {
    const r = resolveEntry(entry, state);
    if (r.status === "missing") {
      console.log(`MISS  ${r.repo}: ${r.note}`);
      failed++;
      continue;
    }
    if (r.status === "in-sync") {
      console.log(`OK    ${r.repo}: already in sync`);
      skipped++;
      continue;
    }
    // product wins for product-only, conflict, and registry-only
    if (DRY) {
      console.log(`DRY   ${r.repo}: would update registry from ${r.file}`);
      printDrift("pull", r.registry, r.product);
      updated++;
      continue;
    }
    try {
      writeRegistryEntry(r.url, r.product);
      state[r.url] = snap(r.product);
      pending.push(r.repo);
      console.log(`PULL  ${r.repo}: registry ← ${r.file}`);
      printDrift("pull", r.registry, r.product);
      updated++;
    } catch (e) {
      console.log(`FAIL  ${r.repo}: ${e.message}`);
      failed++;
    }
  }

  if (!DRY) {
    saveState(state);
    if (updated > 0) {
      console.log(`\nregenerating project-previews.json…`);
      regeneratePreviews();
    }
  }

  console.log(
    `\n${DRY ? "DRY-RUN" : "DONE"}: ${updated} pulled, ${skipped} skipped/already-sync, ${failed} failed` +
      (pending.length ? ` (${pending.join(", ")})` : ""),
  );
  return failed > 0 ? 1 : 0;
}

function main() {
  if (!["status", "push", "pull"].includes(CMD)) {
    console.error(`Unknown command "${CMD}". Use: status | push | pull`);
    process.exit(2);
  }
  if (CMD === "pull" && STAGE) {
    console.error("pull does not support --stage (pull only updates the registry in lizliz.xyz)");
    process.exit(2);
  }
  let code = 0;
  if (CMD === "status") code = cmdStatus();
  else if (CMD === "push") code = cmdPush();
  else code = cmdPull();
  process.exit(code);
}

main();
