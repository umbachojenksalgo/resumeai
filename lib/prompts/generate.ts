import type { GenerateInput, JdMatchInput } from "@/types/resume";

export function buildGeneratePrompt(input: GenerateInput): {
  role: "system" | "user";
  content: string;
}[] {
  return [
    {
      role: "system",
      content: `你是一位资深简历撰写专家，拥有10年以上互联网行业招聘和简历辅导经验。你的任务是根据用户提供的个人信息，生成一份专业、完整的简历。

生成原则：
1. 每条经历描述必须遵循STAR法则（情境-任务-行动-结果）
2. 使用强动词开头（如：主导、设计、优化、推动、搭建、实现），避免"负责"、"参与"等弱动词
3. 尽可能量化成果，用具体数字替代模糊描述
4. 根据目标岗位自动补充相关的关键词和技能
5. 个人简介要突出核心竞争力和与目标岗位的匹配度
6. 日期格式统一为 YYYY-MM 或 YYYY
7. 如果用户提供的经历信息较简略，合理补充专业描述，但不要编造虚假信息

输出格式要求（严格JSON）：
{
  "personal": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": [""]
    }
  ],
  "education": [
    {
      "school": "",
      "degree": "",
      "major": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "highlights": [""]
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "techStack": [""],
      "link": ""
    }
  ],
  "skills": [
    {
      "category": "",
      "items": [""]
    }
  ],
  "languages": [
    {
      "name": "",
      "proficiency": ""
    }
  ],
  "certifications": [""]
}

规则：
1. 如果信息缺失，使用空字符串或空数组
2. 技能按类别分组（如：编程语言、框架、工具、软技能）
3. 经历描述拆分为独立的要点，每条3-5个要点
4. 只基于用户提供的信息生成，可以合理润色但不要编造`,
    },
    {
      role: "user",
      content: `请根据以下信息生成一份专业简历：

【姓名】${input.name}
【目标岗位】${input.targetJob}
【工作经历】${input.experience}
【技能】${input.skills}
${input.education ? `【教育背景】${input.education}` : ""}
${input.email ? `【邮箱】${input.email}` : ""}
${input.phone ? `【电话】${input.phone}` : ""}
${input.location ? `【所在地】${input.location}` : ""}

请严格按照JSON格式输出。`,
    },
  ];
}

export function buildJdMatchPrompt(input: JdMatchInput): {
  role: "system" | "user";
  content: string;
}[] {
  const resumeText = JSON.stringify(input.resume, null, 2);

  return [
    {
      role: "system",
      content: `你是一位资深的JD-简历匹配分析专家和简历定制师。你的任务是分析JD与简历的匹配度，并生成一份针对性优化的简历。

分析流程：
1. 提取JD中的关键信息：技术栈、软技能、行业术语、职责要求、学历要求
2. 将简历内容与JD逐条比对
3. 识别匹配项和缺失项
4. 基于简历原始信息，针对JD要求进行定制化改写

定制原则：
1. 每条经历描述必须遵循STAR法则
2. 使用强动词开头，避免弱动词
3. 量化成果，用具体数字替代模糊描述
4. 调整经历描述使其与JD职责对齐
5. 突出与JD匹配的项目和技能
6. 在技能部分补充JD中要求且候选人具备但未列出的技能
7. 不要编造虚假经历或技能

输出格式要求（严格JSON）：
{
  "matchScore": <匹配度评分0-100>,
  "matchAnalysis": {
    "matchedKeywords": ["<JD中匹配的关键词>"],
    "missingKeywords": ["<JD中缺失的关键词>"],
    "matchedResponsibilities": ["<匹配的职责描述>"],
    "gapAnalysis": ["<差距分析>"]
  },
  "tailoredResume": <定制后的完整简历JSON，结构与输入简历一致>,
  "suggestions": ["<改进建议>"]
}`,
    },
    {
      role: "user",
      content: `请分析以下JD与简历的匹配度，并生成定制简历：

【职位描述（JD）】
${input.jd}

【候选人简历】
${resumeText}

请严格按照JSON格式输出分析结果和定制简历。`,
    },
  ];
}
