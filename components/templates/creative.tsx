import type { ResumeData } from "@/types/resume";

export function renderCreativeTemplate(resume: ResumeData, themeColor?: string): string {
  const color = themeColor || "#262626";
  const { personal, summary, experience, education, projects, skills } = resume;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personal.name} - 简历</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', 'Helvetica Neue', sans-serif; color: #1a1a1a; line-height: 1.6; }
    .hero { background: linear-gradient(135deg, ${color}, ${color}cc); color: #fff; padding: 48px 32px 32px; text-align: center; }
    .hero h1 { font-size: 36px; font-weight: 800; letter-spacing: 1px; }
    .hero .title { font-size: 18px; opacity: 0.9; margin-top: 4px; }
    .hero .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-top: 16px; font-size: 14px; opacity: 0.85; }
    .hero .contact a { color: #fff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.4); }
    .container { max-width: 800px; margin: 0 auto; padding: 32px; }
    section { margin-bottom: 32px; }
    h2 { font-size: 18px; font-weight: 700; color: ${color}; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    h2::before { content: ''; display: inline-block; width: 4px; height: 20px; background: ${color}; border-radius: 2px; }
    .exp-item { margin-bottom: 20px; padding-left: 16px; border-left: 2px solid #e5e7eb; }
    .exp-item:hover { border-left-color: ${color}; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
    .exp-title { font-weight: 700; font-size: 16px; }
    .exp-company { color: #666; }
    .exp-date { font-size: 13px; color: #999; }
    ul { padding-left: 20px; }
    li { font-size: 14px; margin-bottom: 4px; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
    .skill-group { background: #f9fafb; border-radius: 8px; padding: 12px; }
    .skill-category { font-weight: 600; font-size: 14px; color: ${color}; margin-bottom: 6px; }
    .skill-items { font-size: 13px; color: #444; }
    .tag { display: inline-block; padding: 3px 10px; margin: 2px; border-radius: 20px; font-size: 12px; background: ${color}15; color: ${color}; border: 1px solid ${color}30; }
    .project-item { margin-bottom: 16px; background: #f9fafb; border-radius: 8px; padding: 16px; }
    .project-name { font-weight: 700; font-size: 15px; }
    .edu-item { margin-bottom: 12px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .hero { padding: 24px; } }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${personal.name}</h1>
    <div class="title">${personal.title}</div>
    <div class="contact">
      ${personal.email ? `<span>${personal.email}</span>` : ""}
      ${personal.phone ? `<span>${personal.phone}</span>` : ""}
      ${personal.location ? `<span>${personal.location}</span>` : ""}
      ${personal.github ? `<a href="${personal.github}" target="_blank">GitHub</a>` : ""}
      ${personal.website ? `<a href="${personal.website}" target="_blank">网站</a>` : ""}
    </div>
  </div>

  <div class="container">
    ${summary ? `<section><h2>关于我</h2><p style="font-size:15px;line-height:1.8">${summary}</p></section>` : ""}

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
        <div class="edu-item">
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
            ${proj.link ? `<a href="${proj.link}" style="font-size:13px;color:${color}" target="_blank">查看 →</a>` : ""}
          </div>
          <p style="font-size:14px;margin:6px 0">${proj.description}</p>
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
