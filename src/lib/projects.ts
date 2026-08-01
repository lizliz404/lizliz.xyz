import projectPreviews from "@/generated/project-previews.json";

export type ProjectKind = "site" | "skill";

export type ProjectMeta = {
  title: string;
  url: string;
  description: string;
  iconUrl: string;
  /** OpenGraph image for richer previews when available. */
  ogImage?: string;
  /** site = live product/demo; skill = downloadable skill pack. */
  kind?: ProjectKind;
};

export function getProjects(): ProjectMeta[] {
  return projectPreviews as ProjectMeta[];
}

export function getSiteProjects(): ProjectMeta[] {
  return getProjects().filter((p) => (p.kind ?? "site") !== "skill");
}

export function getSkillProjects(): ProjectMeta[] {
  return getProjects().filter((p) => p.kind === "skill");
}
