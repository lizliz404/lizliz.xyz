export type ResumeBasicInfo = {
  name: string;
  birth_date?: string;
  email?: string;
  phone?: string;
  location?: string;
  portrait?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type ResumeEducation = {
  school: string;
  start_date?: string;
  end_date?: string;
  major?: string;
  current_status?: string;
};

export type ResumeSkill = {
  name: string;
  description?: string;
};

export type ResumeLink = {
  label: string;
  url: string;
};

export type ResumeProject = {
  name: string;
  description?: string;
  links?: ResumeLink[];
};

export type ResumeProfile = {
  network: string;
  description?: string;
  url: string;
};

export type ResumeData = {
  basic_info: ResumeBasicInfo;
  education?: ResumeEducation[];
  skills?: ResumeSkill[];
  projects?: ResumeProject[];
  profiles?: ResumeProfile[];
  meta?: Record<string, unknown>;
};
