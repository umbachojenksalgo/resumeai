export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  languages: Language[];
  certifications: string[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export type DifficultyLevel = "gentle" | "standard" | "hell";

export type OptimizeFocus = "structure" | "wording" | "keywords" | "quantify" | "all";

export interface OptimizeRequest {
  resume: ResumeData;
  targetJob?: string;
  focus: OptimizeFocus[];
  model: string;
}

export interface RoastRequest {
  resume: ResumeData;
  difficulty: DifficultyLevel;
  model: string;
  sessionId?: string;
}

export interface WebifyRequest {
  resume: ResumeData;
  templateId: string;
  themeColor?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface RoastSession {
  id: string;
  resume: ResumeData;
  difficulty: DifficultyLevel;
  messages: ChatMessage[];
  model: string;
  createdAt: number;
}

export interface GenerateInput {
  name: string;
  targetJob: string;
  experience: string;
  skills: string;
  education?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface JdMatchInput {
  jd: string;
  resume: ResumeData;
}

export interface JdMatchAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedResponsibilities: string[];
  gapAnalysis: string[];
}

export interface JdMatchResult {
  matchScore: number;
  matchAnalysis: JdMatchAnalysis;
  tailoredResume: ResumeData;
  suggestions: string[];
}
