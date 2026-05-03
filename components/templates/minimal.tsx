import type { ResumeData } from "@/types/resume";

export function renderMinimalTemplate(resume: ResumeData, themeColor?: string): string {
  const color = themeColor || "#2563eb";
  const { personal, summary, experience, education, projects, skills } = resume;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personal.name} - 简历</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 32px; }
    header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid ${color}; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
    .title { font-size: 18px; color: ${color}; margin-bottom: 12px; }
    .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; font-size: 14px; color: #666; }
    .contact a { color: ${color}; text-decoration: none; }
    section { margin-bottom: 28px; }
    h2 { font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: ${color}; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
    .exp-item { margin-bottom: 20px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
    .exp-title { font-weight: 600; }
    .exp-company { color: #666; }
    .exp-date { font-size: 14px; color: #888; }
    ul { padding-left: 20px; }
    li { font-size: 14px; margin-bottom: 4px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 16px; }
    .skill-group { flex: 1; min-width: 200px; }
    .skill-category { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .skill-items { font-size: 14px; color: #444; }
    .tag { display: inline-block; padding: 2px 8px; margin: 2px; border-radius: 4px; font-size: 12px; background: #f3f4f6; }
    .project-item { margin-bottom: 16px; }
    .project-name { font-weight: 600; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${personal.name}</h1>
      <div class="title">${personal.title}</div>
      <div class="contact">
        ${personal.email ? `<span>${personal.email}</span>` : ""}
        ${personal.phone ? `<span>${personal.phone}</span>` : ""}
        ${personal.location ? `<span>${personal.location}</span>` : ""}
        ${personal.github ? `<a href="${personal.github}" target="_blank">GitHub</a>` : ""}
        ${personal.website ? `<a href="${personal.website}" target="_blank">网站</a>` : ""}
      </div>
    </header>

    ${summary ? `<section><h2>个人简介</h2><p style="font-size:14px">${summary}</p></section>` : ""}

    ${experience.length > 0 ? `
    <section>
      <h2>工作经历</h2>
      ${experience.map((exp) => `
        <div class="exp-item">
          <div class="exp-header">
            <div><span class="exp-title">${exp.position}</span><span class="exp-company"> · ${exp.company}</span></div>
            <span class="exp-date">${exp.startDate} - ${exp.current ? "至今" : exp.endDate}</span>
          </div>
          <ul>${exp.description.map((d) => `<li>${d}</li>`).join("")}</ul>
        </div>
      `).join("")}
    </section>` : ""}

    ${education.length > 0 ? `
    <section>
      <h2>教育背景</h2>
      ${education.map((edu) => `
        <div class="exp-item">
          <div class="exp-header">
            <div><span class="exp-title">${edu.school}</span><span class="exp-company"> · ${edu.degree} ${edu.major}</span></div>
            <span class="exp-date">${edu.startDate} - ${edu.endDate}</span>
          </div>
          ${edu.gpa ? `<p style="font-size:14px;color:#666">GPA: ${edu.gpa}</p>` : ""}
        </div>
      `).join("")}
    </section>` : ""}

    ${projects.length > 0 ? `
    <section>
      <h2>项目经历</h2>
      ${projects.map((proj) => `
        <div class="project-item">
          <div class="exp-header">
            <span class="project-name">${proj.name}</span>
            ${proj.link ? `<a href="${proj.link}" style="font-size:14px;color:${color}" target="_blank">链接</a>` : ""}
          </div>
          <p style="font-size:14px;margin-bottom:4px">${proj.description}</p>
          <div>${proj.techStack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      `).join("")}
    </section>` : ""}

    ${skills.length > 0 ? `
    <section>
      <h2>技能</h2>
      <div class="skills-grid">
        ${skills.map((group) => `
          <div class="skill-group">
            <div class="skill-category">${group.category}</div>
            <div class="skill-items">${group.items.join(" · ")}</div>
          </div>
        `).join("")}
      </div>
    </section>` : ""}
  </div>
</body>
</html>`;
}
