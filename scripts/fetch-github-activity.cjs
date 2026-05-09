#!/usr/bin/env node
/** Fetch FULL year of GitHub contribution data at build time. */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function getToken() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN.trim();
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();

  try {
    const token = execSync("gh auth token", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (token) return token;
  } catch {}

  try {
    const tokenPath = "/home/ubuntu/.gh_token";
    if (fs.existsSync(tokenPath)) {
      const token = fs.readFileSync(tokenPath, "utf-8").trim();
      if (token) return token;
    }
  } catch {}

  return "";
}

const TOKEN = getToken();

// Get contributions from Jan 1 to today (current year)
const now = new Date();
const from = `${now.getFullYear()}-01-01T00:00:00`;
const to = now.toISOString();

const QUERY = `
query($from: DateTime!, $to: DateTime!) {
  user(login: "lizliz404") {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount date color weekday } }
      }
    }
  }
}`;

async function main() {
  if (!TOKEN) {
    console.warn("github-heatmap fetch skipped: no GH_TOKEN/GITHUB_TOKEN, gh auth token, or local token file");
    return;
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { from, to } }),
  });
  const json = await res.json();
  const calendar =
    json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("No contribution data");

  const outDir = path.join(__dirname, "..", "public");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "github-heatmap.json"),
    JSON.stringify({ total: calendar.totalContributions, weeks: calendar.weeks })
  );
  console.log(
    `Heatmap: ${calendar.totalContributions} contributions, ${calendar.weeks.length} weeks`
  );
}

main().catch((e) => {
  console.error("github-heatmap fetch failed (non-fatal):", e.message);
});
