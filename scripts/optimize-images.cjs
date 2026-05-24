#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..", "public", "images");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

async function maybeWrite(input, output, format) {
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs) return;
  let pipeline = sharp(input).rotate();
  if (format === "webp") pipeline = pipeline.webp({ quality: 82, effort: 5 });
  if (format === "avif") pipeline = pipeline.avif({ quality: 50, effort: 4 });
  await pipeline.toFile(output);
}

async function main() {
  let count = 0;
  for await (const input of walk(ROOT)) {
    const parsed = path.parse(input);
    await maybeWrite(input, path.join(parsed.dir, `${parsed.name}.webp`), "webp");
    await maybeWrite(input, path.join(parsed.dir, `${parsed.name}.avif`), "avif");
    count += 1;
  }
  console.log(`Optimized article images: ${count}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
