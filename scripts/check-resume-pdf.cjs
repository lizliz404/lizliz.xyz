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

const expectedHash = crypto.createHash("sha256").update(fs.readFileSync(dataPath)).digest("hex");
const actualHash = fs.readFileSync(hashPath, "utf8").trim();
if (actualHash !== expectedHash) {
  fail(`hash mismatch: expected ${expectedHash}, got ${actualHash}`);
}

console.log(`Resume PDF check passed: ${pdfPath}`);
