import type { ResumeData } from "@/types/resume";

export function renderTechTemplate(resume: ResumeData, themeColor?: string): string {
  const color = themeColor || "#525252";
  const { personal, summary, experience, education, projects, skills } = resume;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personal.name} - 简历</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace; color: #e0e0e0; line-height: 1.6; background: #0d1117; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 32px; }
    header { margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #30363d; }
    h1 { font-size: 28px; color: ${color}; margin-bottom: 4px; }
    .title { font-size: 16px; color: #8b949e; }
    .contact { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; font-size: 13px; color: #8b949e; }
    .contact a { color: ${color}; text-decoration: none; }
    .contact a:hover { text-decoration: underline; }
    section { margin-bottom: 28px; }
    h2 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: ${color}; margin-bottom: 16px; }
    h2::after { content: ''; display: block; width: 40px; height: 2px; background: ${color}; margin-top: 8px; }
    .exp-item { margin-bottom: 20px; padding: 12px; background: #161b22; border-radius: 6px; border: 1px solid #30363d; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
    .exp-title { font-weight: 600; color: #e0e0e0; }
    .exp-company { color: #8b949e; }
    .exp-date { font-size: 12px; color: #6e7681; }
    ul { padding-left: 20px; }
    li { font-size: 13px; margin-bottom: 4px; color: #c9d1d9; }
    li::marker { color: ${color}; }
    .tag { display: inline-block; padding: 2px 8px; margin: 2px; border-radius: 4px; font-size: 11px; background: ${color}20; color: ${color}; border: 1px solid ${color}40; }
    .project-item { margin-bottom: 14px; padding: 12px; background: #161b22; border-radius: 6px; border: 1px solid #30363d; }
    .project-name { font-weight: 600; color: #e0e0e0; }
    .edu-item { margin-bottom: 12px; padding: 8px 12px; background: #161b22; border-radius: 6px; border: 1px solid #30363d; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-group { background: #161b22; border-radius: 6px; padding: 10px 14px; border: 1px solid #30363d; }
    .skill-category { font-size: 12px; font-weight: 600; color: ${color}; margin-bottom: 4px; }
    .skill-items { font-size: 12px; color: #8b949e; }
    .terminal-prompt { color: ${color}; }
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
        ${personal.website ? `<a href="${personal.website}" target="_blank">Website</a>` : ""}
      </div>
    </header>

    ${summary ? `<section><h2>// About</h2><p style="font-size:14px;color:#c9d1d9">${summary}</p></section>` : ""}

    ${experience.length > 0 ? `
    <section>
      <h2>// Experience</h2>
      ${experience.map((exp) => `
        <div class="exp-item">
          <div class="exp-header">
            <div><span class="exp-title">${exp.position}</span><span class="exp-company"> @ ${exp.company}</span></div>
            <span class="exp-date">${exp.startDate} - ${exp.current ? "Present" : exp.endDate}</span>
          </div>
          <ul>${exp.description.map((d) => `<li>${d}</li>`).join("")}</ul>
        </div>
      `).join("")}
    </section>` : ""}

    ${education.length > 0 ? `
    <section>
      <h2>// Education</h2>
      ${education.map((edu) => `
        <div class="edu-item">
          <div class="exp-header">
            <div><span class="exp-title">${edu.school}</span><span class="exp-company"> · ${edu.degree} ${edu.major}</span></div>
            <span class="exp-date">${edu.startDate} - ${edu.endDate}</span>
          </div>
          ${edu.gpa ? `<p style="font-size:13px;color:#8b949e">GPA: ${edu.gpa}</p>` : ""}
        </div>
      `).join("")}
    </section>` : ""}

    ${projects.length > 0 ? `
    <section>
      <h2>// Projects</h2>
      ${projects.map((proj) => `
        <div class="project-item">
          <div class="exp-header">
            <span class="project-name">${proj.name}</span>
            ${proj.link ? `<a href="${proj.link}" style="font-size:12px;color:${color}" target="_blank">Demo →</a>` : ""}
          </div>
          <p style="font-size:13px;color:#c9d1d9;margin:6px 0">${proj.description}</p>
          <div>${proj.techStack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      `).join("")}
    </section>` : ""}

    ${skills.length > 0 ? `
    <section>
      <h2>// Tech Stack</h2>
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
