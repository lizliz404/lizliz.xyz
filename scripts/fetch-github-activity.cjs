#!/usr/bin/env node
/** Fetch FULL year of GitHub contribution data at build time. */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const TOKEN = execSync("gh auth token", { encoding: "utf-8" }).trim();

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
