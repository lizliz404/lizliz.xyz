export type ProjectMeta = {
  repo: string;
  title: string;
  url: string;
  description: string;
  iconUrl: string;
  /** OpenGraph image for link preview */
  ogImage?: string;
};

/** Static project metadata — no runtime API calls, build-time only.
 *  For OG images, each project site should serve its own og:image meta tag.
 *  We reference those URLs here for rich link previews.
 */
const PROJECTS: ProjectMeta[] = [
  {
    repo: "lizliz404/pep-words",
    title: "PEP Words",
    url: "https://pep-words.lizliz.xyz/",
    description: "A lightweight PEP English vocabulary study site.",
    iconUrl: "https://github.com/lizliz404.png?size=64",
    ogImage: "https://pep-words.lizliz.xyz/og-image.png",
  },
  {
    repo: "lizliz404/BrainRush",
    title: "Brain Rush",
    url: "https://brainrush.lizliz.xyz/",
    description: "飞机大战 / 躲避接物 × 小学算术训练",
    iconUrl: "https://github.com/lizliz404.png?size=64",
    ogImage: "https://brainrush.lizliz.xyz/og-image.png",
  },
];

export function getProjects(): ProjectMeta[] {
  return PROJECTS;
}
