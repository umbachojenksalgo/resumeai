import type { ResumeData, DifficultyLevel } from "@/types/resume";

export function buildRoastPrompt(
  resume: ResumeData,
  difficulty: DifficultyLevel,
  previousMessages?: { role: "system" | "user" | "assistant"; content: string }[]
): { role: "system" | "user" | "assistant"; content: string }[] {
  const difficultyMap: Record<DifficultyLevel, string> = {
    gentle: `你是一位温和的导师。你的目标是帮助用户发现简历中的不足，但方式要温和有建设性。
- 以引导式提问为主，如"你觉得这段经历还能怎么更好地展示？"
- 先肯定优点，再指出改进空间
- 给出具体的改进方向而非批评
- 语气亲切，像朋友一样交流`,
    standard: `你是一位专业但严格的面试官。模拟真实的面试场景，对简历内容进行深入追问。
- 针对简历中的具体细节提出专业问题
- 追问模糊表述，如"你提到'大幅提升'，具体是多少？"
- 质疑逻辑不一致的地方
- 保持专业但有一定压力
- 每次提出2-3个问题`,
    hell: `你是一位极其严厉的面试官，你的目标是用最犀利的问题暴露简历中的所有问题。
- 直接指出简历中的每一个弱点
- 对模糊表述零容忍："这种描述毫无意义"
- 质疑每一个没有数据支撑的声明
- 模拟压力面试场景
- 使用尖锐但专业的语言
- 每次提出3-5个问题
- 不留情面，但始终围绕简历内容`,
  };

  const resumeText = JSON.stringify(resume, null, 2);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    {
      role: "system",
      content: `${difficultyMap[difficulty]}

重要规则：
1. 所有问题必须基于简历中的具体内容
2. 不要编造简历中没有的信息
3. 如果用户回答得好，可以适当认可
4. 追问机制：根据用户的回答继续深挖
5. 每次回复包含：对上一个回答的评价 + 新的追问
6. 在对话最后给出综合评估

输出格式：
对用户回答的评价 → 新的追问问题`,
    },
    {
      role: "user",
      content: `这是我的简历，请开始拷打：

${resumeText}`,
    },
  ];

  if (previousMessages) {
    for (const msg of previousMessages) {
      messages.push(msg);
    }
  }

  return messages;
}

export function buildRoastSummaryPrompt(
  resume: ResumeData,
  conversationHistory: { role: "user" | "assistant"; content: string }[]
): { role: "system" | "user"; content: string }[] {
  return [
    {
      role: "system",
      content: `你是一位资深面试评估专家。根据面试对话记录，给出综合评估报告。

输出格式（严格JSON）：
{
  "overallScore": <综合评分1-100>,
  "strengths": ["<表现好的方面>"],
  "weaknesses": ["<需要改进的方面>"],
  "suggestions": ["<具体改进建议>"],
  "riskAreas": ["<简历中的高风险区域>"],
  "summary": "<一段话总结>"
}`,
    },
    {
      role: "user",
      content: `简历内容：
${JSON.stringify(resume, null, 2)}

面试对话记录：
${conversationHistory.map((m) => `${m.role === "user" ? "候选人" : "面试官"}：${m.content}`).join("\n\n")}

请给出综合评估。`,
    },
  ];
}
