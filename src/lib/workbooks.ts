import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const QIANCHENG_WORKBOOK_SLUG =
  "qiancheng-yusuan-workbook-2026-08-16-youll-get-how-it--works-once-youve-read-it-qianchengniubi";

export function getWorkbook(name: string): {
  title: string;
  date: string;
  description: string;
  content: string;
} | null {
  const filePath = path.join(process.cwd(), "content", "workbooks", `${name}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    title: String(data.title || "Untitled"),
    date: String(data.date || data.published_date || ""),
    description: String(data.description || ""),
    content,
  };
}
