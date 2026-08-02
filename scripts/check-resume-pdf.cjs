const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src/features/resume/resume.json");
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-pdf-check-"));

function fail(message) {
  console.error(`Resume PDF check failed: ${message}`);
  process.exit(1);
}

try {
  JSON.parse(fs.readFileSync(dataPath, "utf8"));
} catch (error) {
  fail(`${dataPath} is not valid JSON: ${error.message}`);
}

const result = spawnSync(process.execPath, [path.join(root, "scripts/generate-resume-pdf.cjs")], {
  cwd: root,
  env: {
    ...process.env,
    RESUME_PDF_OUT_DIR: tmpDir,
    FORCE_RESUME_PDF: "1",
  },
  encoding: "utf8",
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) fail("generator exited non-zero");

const pdfPath = path.join(tmpDir, "resume.pdf");
const hashPath = path.join(tmpDir, "resume.pdf.sha256");
if (!fs.existsSync(pdfPath)) fail("generator did not produce resume.pdf");
if (!fs.existsSync(hashPath)) fail("generator did not produce resume.pdf.sha256");

const pdfHeader = fs.readFileSync(pdfPath).subarray(0, 4).toString("utf8");
if (pdfHeader !== "%PDF") fail("resume.pdf is not a PDF file");

// Hash covers resume.json + portrait + channel images (same formula as generator).
const resume = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const hash = crypto.createHash("sha256");
const sourcePaths = [dataPath];
if (resume.basic_info?.portrait?.src) {
  sourcePaths.push(path.join(root, "public", resume.basic_info.portrait.src.replace(/^\/+/, "")));
}
for (const channel of resume.channels || []) {
  if (channel?.image?.src) {
    sourcePaths.push(path.join(root, "public", channel.image.src.replace(/^\/+/, "")));
  }
}
for (const filePath of sourcePaths) {
  if (!fs.existsSync(filePath)) fail(`missing source image/data: ${filePath}`);
  hash.update(filePath);
  hash.update("\0");
  hash.update(fs.readFileSync(filePath));
  hash.update("\0");
}
const expectedHash = hash.digest("hex");
const actualHash = fs.readFileSync(hashPath, "utf8").trim();
if (actualHash !== expectedHash) {
  fail(`hash mismatch: expected ${expectedHash}, got ${actualHash}`);
}

console.log(`Resume PDF check passed: ${pdfPath}`);
