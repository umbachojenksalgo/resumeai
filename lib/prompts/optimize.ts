import type { ResumeData, OptimizeFocus } from "@/types/resume";

export function buildOptimizePrompt(
  resume: ResumeData,
  targetJob?: string,
  focus: OptimizeFocus[] = ["all"]
): { role: "system" | "user"; content: string }[] {
  const focusMap: Record<OptimizeFocus, string> = {
    structure: "结构优化：使用STAR法则优化经历描述，采用倒金字塔结构，确保逻辑清晰",
    wording: "措辞增强：使用强动词开头，避免被动语态，提升专业表达力",
    keywords: "关键词匹配：针对目标岗位JD，补充缺失的关键技术词汇和行业术语",
    quantify: "量化成果：将模糊描述转为具体数字，如'提升了性能'→'性能提升40%'",
    all: "全面优化：综合以上所有维度进行优化",
  };

  const focusDesc = focus.includes("all")
    ? focusMap.all
    : focus.map((f) => focusMap[f]).join("；");

  const resumeText = JSON.stringify(resume, null, 2);

  return [
    {
      role: "system",
      content: `你是一位资深HR和简历优化专家，拥有10年以上互联网行业招聘经验。你的任务是帮助求职者优化简历，使其在ATS（简历筛选系统）和HR审核中脱颖而出。

优化原则：
1. 每条经历描述必须遵循STAR法则（情境-任务-行动-结果）
2. 使用强动词开头（如：主导、设计、优化、推动），避免"负责"、"参与"等弱动词
3. 尽可能量化成果，用具体数字替代模糊描述
4. 确保关键词与目标岗位JD高度匹配
5. 保持简洁，每条经历3-5个要点
6. ATS友好：避免表格、图片、特殊字符

输出格式要求（严格JSON）：
{
  "score": <整体评分1-100>,
  "overallFeedback": "<总体评价>",
  "suggestions": [
    {
      "category": "structure|wording|keywords|quantify",
      "original": "<原文>",
      "optimized": "<优化后>",
      "reason": "<优化理由>"
    }
  ],
  "optimizedResume": <优化后的完整简历JSON，结构与输入一致>,
  "missingKeywords": ["<缺失的关键词>"],
  "strengths": ["<简历亮点>"],
  "weaknesses": ["<需要改进的地方>"]
}`,
    },
    {
      role: "user",
      content: `请优化以下简历：

【目标岗位】${targetJob || "未指定（请根据简历内容推断合适岗位）"}

【优化重点】${focusDesc}

【简历内容】
${resumeText}

请严格按照JSON格式输出优化结果。`,
    },
  ];
}
