import { visit } from "unist-util-visit";
import type { Root, Text } from "mdast";

interface ParentNode {
  children?: unknown[];
}

const highlightPattern = /==([^=\n][\s\S]*?[^=\n])==/g;

export default function remarkHighlight() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index: number | undefined, parent: ParentNode | undefined) => {
      if (!parent || typeof index !== "number" || !node.value.includes("==")) return;

      const parts: unknown[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      highlightPattern.lastIndex = 0;
      while ((match = highlightPattern.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: "text", value: node.value.slice(lastIndex, match.index) });
        }
        parts.push({
          type: "html",
          value: `<mark>${escapeHtml(match[1])}</mark>`,
        });
        lastIndex = match.index + match[0].length;
      }

      if (parts.length === 0) return;
      if (lastIndex < node.value.length) {
        parts.push({ type: "text", value: node.value.slice(lastIndex) });
      }

      parent.children?.splice(index, 1, ...parts);
    });
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
