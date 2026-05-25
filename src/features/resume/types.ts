export type ResumeBasics = {
  name: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  };
  profiles?: Array<{
    network: string;
    username?: string;
    url?: string;
  }>;
};

export type ResumeEntry = {
  name?: string;
  position?: string;
  company?: string;
  institution?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  summary?: string;
  description?: string;
  url?: string;
  highlights?: string[];
};

export type ResumeSkill = {
  name: string;
  level?: string;
  keywords?: string[];
};

export type ResumeData = {
  basics: ResumeBasics;
  work?: ResumeEntry[];
  volunteer?: ResumeEntry[];
  education?: ResumeEntry[];
  awards?: ResumeEntry[];
  certificates?: ResumeEntry[];
  publications?: ResumeEntry[];
  skills?: ResumeSkill[];
  languages?: Array<{ language: string; fluency?: string }>;
  interests?: Array<{ name: string; keywords?: string[] }>;
  projects?: ResumeEntry[];
  meta?: Record<string, unknown>;
};
