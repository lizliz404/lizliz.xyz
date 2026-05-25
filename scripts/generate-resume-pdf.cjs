const fs = require("fs");
const path = require("path");
const { install, resolveBuildId, detectBrowserPlatform, Browser } = require("@puppeteer/browsers");
const puppeteer = require("puppeteer-core");

const root = path.resolve(__dirname, "..");
const cacheDir = process.env.PUPPETEER_CACHE_DIR || path.join(root, ".cache", "puppeteer");
const dataPath = path.join(root, "src/features/resume/resume.json");
const outPath = path.join(root, "public/resume.pdf");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

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

function renderHtml() {
  const basic = data.basic_info || {};
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
      const links = (project.links || []).map((item) => link(`${item.label}: ${item.url}`, item.url)).join("");
      return `<div class="entry project"><strong>${escapeHtml(project.name)}</strong><p>${escapeHtml(project.description || "")}</p><div class="links">${links}</div></div>`;
    })
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Liz Resume</title><style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #111; font-family: Arial, "Noto Sans CJK SC", "Microsoft YaHei", sans-serif; font-size: 9.2pt; line-height: 1.35; }
    a { color: #111; text-decoration: none; }
    header { border-bottom: 1px solid #d6d6d6; padding-bottom: 8pt; margin-bottom: 11pt; }
    h1 { margin: 0; font-size: 23pt; line-height: 1; letter-spacing: -0.03em; }
    .headline { margin: 5pt 0 0; color: #8d3e1d; font-size: 10pt; font-weight: 600; }
    .contact, .profiles { margin-top: 5pt; color: #444; font-size: 8pt; }
    .sep::before { content: " · "; padding: 0 4pt; color: #888; }
    section { margin-top: 10pt; break-inside: avoid; }
    h2 { margin: 0 0 5pt; padding-bottom: 3pt; border-bottom: 1px solid #d6d6d6; color: #8d3e1d; font-size: 7.5pt; letter-spacing: 0.14em; text-transform: uppercase; }
    .entry { padding: 5pt 0; border-top: 1px solid #ececec; break-inside: avoid; }
    .entry:first-of-type { border-top: 0; padding-top: 0; }
    .entry-head { display: flex; justify-content: space-between; gap: 12pt; }
    strong { font-size: 9.4pt; }
    time { flex: 0 0 auto; color: #444; font-size: 7.6pt; }
    p { margin: 2pt 0 0; color: #444; }
    .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 5pt 14pt; }
    .skill { break-inside: avoid; }
    .skill p { font-size: 8.2pt; }
    .project p { font-size: 8.4pt; }
    .links { display: grid; gap: 1pt; margin-top: 2pt; font-size: 7.4pt; overflow-wrap: anywhere; }
    footer { position: fixed; left: 12mm; bottom: 6mm; color: #666; font-size: 7pt; }
  </style></head><body>
    <header>
      <h1>${escapeHtml(basic.name || "Liz")}</h1>
      <p class="headline">预防医学本科 · 英语教学 / 学术辅导 / AI 协作</p>
      <div class="contact">${contacts}</div>
      <div class="profiles">${profiles}</div>
    </header>
    <section><h2>Education</h2>${education}</section>
    <section><h2>Skills</h2><div class="skills">${skills}</div></section>
    <section><h2>Projects</h2>${projects}</section>
    <footer>Updated: ${escapeHtml(data.meta?.updated_at || "")}</footer>
  </body></html>`;
}

async function getChromeExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

  const platform = detectBrowserPlatform();
  if (!platform) throw new Error("Cannot detect browser platform for PDF generation");

  const buildId = await resolveBuildId(Browser.CHROME, platform, "stable");
  const installedBrowser = await install({ browser: Browser.CHROME, buildId, cacheDir });
  return installedBrowser.executablePath;
}

async function main() {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: await getChromeExecutablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(renderHtml(), { waitUntil: "networkidle0" });
  await page.pdf({ path: outPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log(outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
