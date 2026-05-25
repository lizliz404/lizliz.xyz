const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const cacheDir = process.env.PUPPETEER_CACHE_DIR || path.join(root, ".cache", "puppeteer");
const dataPath = path.join(root, "src/features/resume/resume.json");
const outPath = path.join(root, "public/resume.pdf");
const hashPath = path.join(root, "public/resume.pdf.sha256");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
validateResumeData(data);

function validateResumeData(value) {
  if (!value || typeof value !== "object") throw new Error("Resume must be a JSON object");
  if (!value.basic_info || typeof value.basic_info.name !== "string" || !value.basic_info.name.trim()) {
    throw new Error("Resume must include basic_info.name");
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function link(label, url) {
  return `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;
}

function sourceHash() {
  return crypto.createHash("sha256").update(fs.readFileSync(dataPath)).digest("hex");
}

function portraitDataUri(portrait) {
  if (!portrait?.src) return "";

  const portraitPath = path.join(root, "public", portrait.src.replace(/^\/+/, ""));
  if (!fs.existsSync(portraitPath)) throw new Error(`Resume portrait not found: ${portraitPath}`);

  const ext = path.extname(portraitPath).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".avif" ? "image/avif" : "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(portraitPath).toString("base64")}`;
}

function renderHtml() {
  const basic = data.basic_info || {};
  const portrait = basic.portrait;
  const portraitSrc = portraitDataUri(portrait);
  const contacts = [basic.email, basic.phone, basic.location].filter(Boolean).map(escapeHtml).join(" · ");
  const profiles = (data.profiles || [])
    .map((profile) => link(`${profile.network}${profile.description ? ` · ${profile.description}` : ""}`, profile.url))
    .join("<span class=sep></span>");
  const education = (data.education || [])
    .map((item) => {
      const date = [item.start_date, item.end_date || "Present"].filter(Boolean).join(" — ");
      const sub = [item.major, item.current_status].filter(Boolean).join(" · ");
      return `<div class="entry"><div class="entry-head"><strong>${escapeHtml(item.school)}</strong><time>${escapeHtml(date)}</time></div><p>${escapeHtml(sub)}</p></div>`;
    })
    .join("");
  const skills = (data.skills || [])
    .map((skill) => `<div class="skill"><strong>${escapeHtml(skill.name)}</strong><p>${escapeHtml(skill.description || "")}</p></div>`)
    .join("");
  const projects = (data.projects || [])
    .map((project) => {
      const highlights = (project.highlights || [])
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
      const keywords = (project.keywords || [])
        .map((item) => `<span>${escapeHtml(item)}</span>`)
        .join("");
      const links = (project.links || []).map((item) => link(`${item.label}: ${item.url}`, item.url)).join("");
      return `<div class="entry project"><strong>${escapeHtml(project.name)}</strong><p>${escapeHtml(project.description || "")}</p>${highlights ? `<ul>${highlights}</ul>` : ""}${keywords ? `<div class="keywords">${keywords}</div>` : ""}<div class="links">${links}</div></div>`;
    })
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Liz Resume</title><style>
    @page { size: A4; margin: 11mm 12mm 10mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #111; font-family: Arial, "Noto Sans CJK SC", "Microsoft YaHei", sans-serif; font-size: 8.4pt; line-height: 1.38; }
    a { color: #111; text-decoration: none; }
    header { display: flex; justify-content: space-between; align-items: flex-start; gap: 17pt; border-bottom: 1px solid #d6d6d6; padding-bottom: 12pt; margin-bottom: 17pt; }
    .portrait { flex: 0 0 auto; width: 62pt; aspect-ratio: 3 / 4; object-fit: cover; object-position: center top; }
    h1 { margin: 0; font-size: 23pt; line-height: 1; letter-spacing: -0.03em; }
    .headline { margin: 6pt 0 0; color: #8d3e1d; font-size: 9.6pt; font-weight: 600; }
    .contact, .profiles { margin-top: 6pt; color: #444; font-size: 7.5pt; line-height: 1.42; }
    .sep::before { content: " · "; padding: 0 4pt; color: #888; }
    section { margin-top: 14pt; }
    section:not(.projects-section) { break-inside: avoid; }
    h2 { margin: 0 0 7pt; padding-bottom: 4pt; border-bottom: 1px solid #d6d6d6; color: #8d3e1d; font-size: 7.5pt; letter-spacing: 0.14em; text-transform: uppercase; }
    .entry { padding: 5pt 0; border-top: 1px solid #ececec; break-inside: avoid; }
    .entry:first-of-type { border-top: 0; padding-top: 0; }
    .entry-head { display: flex; justify-content: space-between; gap: 12pt; }
    strong { font-size: 8.7pt; }
    time { flex: 0 0 auto; color: #444; font-size: 7pt; }
    p { margin: 2pt 0 0; color: #444; }
    ul { margin: 2pt 0 0 9pt; padding: 0; color: #444; }
    li { margin-top: 1pt; }
    .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt 15pt; }
    .skill { break-inside: avoid; }
    .skill p { font-size: 7.35pt; }
    .projects { column-count: 2; column-gap: 15pt; }
    .project { display: inline-block; width: 100%; padding: 4.2pt 0; }
    .project p, .project li { font-size: 7.05pt; }
    .keywords { display: flex; flex-wrap: wrap; gap: 2pt 3pt; margin-top: 2.5pt; font-size: 6.35pt; }
    .keywords span { display: inline-block; padding: 1pt 3pt; border: 0.5pt solid #ded7d2; border-radius: 999px; color: #7a4a36; background: #fbf7f4; line-height: 1.15; }
    .keywords span::before { content: ""; }
    .links { display: grid; gap: 1pt; margin-top: 2pt; font-size: 6.3pt; overflow-wrap: anywhere; }
    footer { position: fixed; left: 12mm; bottom: 5mm; color: #666; font-size: 6.7pt; }
  </style></head><body>
    <header>
      <div>
        <h1>${escapeHtml(basic.name || "Liz")}</h1>
        <p class="headline">AI 编程 / 内容输出</p>
        <div class="contact">${contacts}</div>
        <div class="profiles">${profiles}</div>
      </div>
      ${portraitSrc ? `<img class="portrait" src="${portraitSrc}" alt="${escapeHtml(portrait.alt || "Portrait")}">` : ""}
    </header>
    <section><h2>Education</h2>${education}</section>
    <section><h2>Skills</h2><div class="skills">${skills}</div></section>
    <section class="projects-section"><h2>Projects</h2><div class="projects">${projects}</div></section>
    <footer>Updated: ${escapeHtml(data.meta?.updated_at || "")}</footer>
  </body></html>`;
}

async function getChromeExecutablePath() {
  const { install, resolveBuildId, detectBrowserPlatform, Browser } = require("@puppeteer/browsers");

  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

  const platform = detectBrowserPlatform();
  if (!platform) throw new Error("Cannot detect browser platform for PDF generation");

  const buildId = await resolveBuildId(Browser.CHROME, platform, "stable");
  const installedBrowser = await install({ browser: Browser.CHROME, buildId, cacheDir });
  return installedBrowser.executablePath;
}

function shouldRenderPdf(currentHash) {
  if (process.env.FORCE_RESUME_PDF) return true;
  if (!fs.existsSync(outPath)) return true;
  if (!fs.existsSync(hashPath)) return true;

  const previousHash = fs.readFileSync(hashPath, "utf8").trim();
  return previousHash !== currentHash;
}

async function main() {
  const currentHash = sourceHash();

  if (!shouldRenderPdf(currentHash)) {
    console.log(`${outPath} is current; resume.json unchanged`);
    return;
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const browser = await require("puppeteer-core").launch({
    executablePath: await getChromeExecutablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(renderHtml(), { waitUntil: "networkidle0" });
    await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0));
    await page.pdf({ path: outPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }

  fs.writeFileSync(hashPath, `${currentHash}\n`);
  console.log(outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
