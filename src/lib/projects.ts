import projectPreviews from "@/generated/project-previews.json";

export type ProjectMeta = {
  title: string;
  url: string;
  description: string;
  iconUrl: string;
  /** OpenGraph image for richer previews when available. */
  ogImage?: string;
};

export function getProjects(): ProjectMeta[] {
  return projectPreviews;
}
