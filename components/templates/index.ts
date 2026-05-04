import type { ResumeData } from "@/types/resume";
import { renderMinimalTemplate } from "./minimal";
import { renderProfessionalTemplate } from "./professional";
import { renderCreativeTemplate } from "./creative";
import { renderTechTemplate } from "./tech";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  render: (resume: ResumeData, themeColor?: string) => string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "minimal",
    name: "极简",
    description: "简洁清爽，适合技术岗",
    render: renderMinimalTemplate,
  },
  {
    id: "professional",
    name: "专业",
    description: "商务风格，适合管理岗",
    render: renderProfessionalTemplate,
  },
  {
    id: "creative",
    name: "创意",
    description: "独特设计，适合设计岗",
    render: renderCreativeTemplate,
  },
  {
    id: "tech",
    name: "技术",
    description: "极客风格，适合开发岗",
    render: renderTechTemplate,
  },
];

export function renderTemplate(templateId: string, resume: ResumeData, themeColor?: string): string {
  const template = TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return renderMinimalTemplate(resume, themeColor);
  }
  return template.render(resume, themeColor);
}

export function getTemplateById(id: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
