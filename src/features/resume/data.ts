import resume from "./resume.json";
import type { ResumeData } from "./types";

export const resumeData = resume as ResumeData;
export const resumeJson = JSON.stringify(resumeData, null, 2);
