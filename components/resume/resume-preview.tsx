"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ResumeData } from "@/types/resume";

interface ResumePreviewProps {
  resume: ResumeData;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const { personal, summary, experience, education, projects, skills } = resume;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 shadow-lg dark:bg-zinc-900 print:shadow-none">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">{personal.name || "姓名"}</h1>
        <p className="text-lg text-muted-foreground">{personal.title || "职位"}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.github && (
            <a href={personal.github} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
          {personal.website && (
            <a href={personal.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              网站
            </a>
          )}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">个人简介</h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">工作经历</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-semibold">{exp.position}</span>
                  <span className="text-muted-foreground"> · {exp.company}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {exp.startDate} - {exp.current ? "至今" : exp.endDate}
                </span>
              </div>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {exp.description.map((desc, j) => (
                  <li key={j} className="leading-relaxed">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">教育背景</h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-semibold">{edu.school}</span>
                  <span className="text-muted-foreground"> · {edu.degree} {edu.major}</span>
                </div>
                <span className="text-sm text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
              </div>
              {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">项目经历</h2>
          {projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">{proj.name}</span>
                {proj.link && (
                  <a href={proj.link} className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    链接
                  </a>
                )}
              </div>
              <p className="text-sm leading-relaxed">{proj.description}</p>
              {proj.techStack.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {proj.techStack.map((tech, j) => (
                    <Badge key={j} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">技能</h2>
          <div className="space-y-2">
            {skills.map((group, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium min-w-[80px]">{group.category}:</span>
                {group.items.map((skill, j) => (
                  <Badge key={j} variant="outline" className="text-xs">{skill}</Badge>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
