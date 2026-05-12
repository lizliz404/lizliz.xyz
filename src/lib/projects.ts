export type ProjectMeta = {
  repo: string;
  title: string;
  url: string;
  description: string;
  iconUrl: string;
};

const PROJECT_REPOS = ["lizliz404/pep-words", "lizliz404/BrainRush"] as const;

const FALLBACKS: Record<(typeof PROJECT_REPOS)[number], ProjectMeta> = {
  "lizliz404/pep-words": {
    repo: "lizliz404/pep-words",
    title: "PEP Words",
    url: "https://pep-words.lizliz.xyz/",
    description: "A lightweight PEP English vocabulary study site.",
    iconUrl: "https://github.com/lizliz404.png?size=64",
  },
  "lizliz404/BrainRush": {
    repo: "lizliz404/BrainRush",
    title: "Brain Rush",
    url: "https://brainrush.lizliz.xyz/",
    description: "飞机大战 / 躲避接物 × 小学算术训练",
    iconUrl: "https://github.com/lizliz404.png?size=64",
  },
};

function displayName(repoName: string) {
  return repoName
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function fetchRepoProject(repo: (typeof PROJECT_REPOS)[number]): Promise<ProjectMeta> {
  const fallback = FALLBACKS[repo];

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "lizliz.xyz-static-build",
      },
    });

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as {
      name?: string;
      description?: string | null;
      homepage?: string | null;
      html_url?: string;
      owner?: { avatar_url?: string | null };
    };

    return {
      repo,
      title: data.name ? displayName(data.name) : fallback.title,
      url: data.homepage || data.html_url || fallback.url,
      description: data.description || fallback.description,
      iconUrl: data.owner?.avatar_url || fallback.iconUrl,
    };
  } catch {
    return fallback;
  }
}

export async function getProjects(): Promise<ProjectMeta[]> {
  return Promise.all(PROJECT_REPOS.map(fetchRepoProject));
}
