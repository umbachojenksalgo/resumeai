export function buildExtractPrompt(rawText: string): {
  role: "system" | "user";
  content: string;
}[] {
  return [
    {
      role: "system",
      content: `你是一位简历信息提取专家。你的任务是从非结构化的简历文本中提取结构化信息。

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
1. 日期格式统一为 YYYY-MM 或 YYYY
2. 如果信息缺失，使用空字符串
3. 技能按类别分组（如：编程语言、框架、工具、软技能）
4. 经历描述拆分为独立的要点
5. 只提取文本中明确存在的信息，不要推测`,
    },
    {
      role: "user",
      content: `请从以下简历文本中提取结构化信息：

${rawText}`,
    },
  ];
}
