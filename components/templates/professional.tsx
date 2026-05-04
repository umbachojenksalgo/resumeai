import type { ResumeData } from "@/types/resume";

export function renderProfessionalTemplate(resume: ResumeData, themeColor?: string): string {
  const color = themeColor || "#171717";
  const { personal, summary, experience, education, projects, skills } = resume;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personal.name} - 简历</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', 'Times New Roman', serif; color: #1a1a1a; line-height: 1.6; background: #fff; }
    .sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 260px; background: ${color}; color: #fff; padding: 40px 24px; overflow-y: auto; }
    .main { margin-left: 260px; padding: 40px 36px; max-width: 600px; }
    .sidebar h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .sidebar .title { font-size: 14px; opacity: 0.85; margin-bottom: 20px; }
    .sidebar .contact-item { font-size: 13px; margin-bottom: 6px; opacity: 0.9; }
    .sidebar .contact-item a { color: #fff; text-decoration: none; }
    .sidebar-section { margin-top: 24px; }
    .sidebar-section h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.3); }
    .sidebar-section .skill-item { font-size: 13px; margin-bottom: 3px; }
    .sidebar-section .cert-item { font-size: 13px; margin-bottom: 3px; }
    .main section { margin-bottom: 28px; }
    .main h2 { font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: ${color}; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${color}; }
    .exp-item { margin-bottom: 18px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
    .exp-title { font-weight: 700; font-size: 15px; }
    .exp-company { color: #555; font-size: 14px; }
    .exp-date { font-size: 13px; color: #888; font-style: italic; }
    ul { padding-left: 18px; }
    li { font-size: 14px; margin-bottom: 3px; }
    .edu-item { margin-bottom: 12px; }
    .edu-school { font-weight: 700; font-size: 15px; }
    .edu-detail { color: #555; font-size: 14px; }
    .project-item { margin-bottom: 14px; }
    .project-name { font-weight: 700; font-size: 15px; }
    .tag { display: inline-block; padding: 2px 8px; margin: 2px; border-radius: 3px; font-size: 11px; background: #f0f0f0; color: #333; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .sidebar { position: absolute; } }
    @media (max-width: 768px) { .sidebar { position: relative; width: 100%; } .main { margin-left: 0; } }
  </style>
</head>
<body>
  <div class="sidebar">
    <h1>${personal.name}</h1>
    <div class="title">${personal.title}</div>
    ${personal.email ? `<div class="contact-item">${personal.email}</div>` : ""}
    ${personal.phone ? `<div class="contact-item">${personal.phone}</div>` : ""}
    ${personal.location ? `<div class="contact-item">${personal.location}</div>` : ""}
    ${personal.github ? `<div class="contact-item"><a href="${personal.github}" target="_blank">GitHub</a></div>` : ""}
    ${personal.website ? `<div class="contact-item"><a href="${personal.website}" target="_blank">网站</a></div>` : ""}
    ${personal.linkedin ? `<div class="contact-item"><a href="${personal.linkedin}" target="_blank">LinkedIn</a></div>` : ""}

    ${skills.length > 0 ? `
    <div class="sidebar-section">
      <h3>技能</h3>
      ${skills.map((group) => `
        <div style="margin-bottom:8px">
          <div style="font-size:12px;font-weight:600;margin-bottom:3px">${group.category}</div>
          ${group.items.map((item) => `<div class="skill-item">${item}</div>`).join("")}
        </div>
      `).join("")}
    </div>` : ""}

    ${resume.certifications.length > 0 ? `
    <div class="sidebar-section">
      <h3>证书</h3>
      ${resume.certifications.map((cert) => `<div class="cert-item">${cert}</div>`).join("")}
    </div>` : ""}

    ${resume.languages.length > 0 ? `
    <div class="sidebar-section">
      <h3>语言</h3>
      ${resume.languages.map((lang) => `<div class="skill-item">${lang.name} - ${lang.proficiency}</div>`).join("")}
    </div>` : ""}
  </div>

  <div class="main">
    ${summary ? `<section><h2>个人简介</h2><p style="font-size:14px;line-height:1.7">${summary}</p></section>` : ""}

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
            <span class="edu-school">${edu.school}</span>
            <span class="exp-date">${edu.startDate} - ${edu.endDate}</span>
          </div>
          <div class="edu-detail">${edu.degree} · ${edu.major}</div>
          ${edu.gpa ? `<div class="edu-detail">GPA: ${edu.gpa}</div>` : ""}
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
            ${proj.link ? `<a href="${proj.link}" style="font-size:13px;color:${color}" target="_blank">链接</a>` : ""}
          </div>
          <p style="font-size:14px;margin-bottom:4px">${proj.description}</p>
          <div>${proj.techStack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      `).join("")}
    </section>` : ""}
  </div>
</body>
</html>`;
}
