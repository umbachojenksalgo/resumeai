export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/ai";
import { buildRoastPrompt } from "@/lib/prompts/roast";
import type { ResumeData, DifficultyLevel, ChatMessage } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, difficulty, model, previousMessages } = body as {
      resume: ResumeData;
      difficulty: DifficultyLevel;
      model: string;
      previousMessages?: ChatMessage[];
    };

    if (!resume) {
      return NextResponse.json({ error: "缺少简历数据" }, { status: 400 });
    }

    const modelId = model || "mimo-v2-flash";
    const messages = buildRoastPrompt(resume, difficulty, previousMessages);

    const result = await streamChat(modelId, messages, {
      temperature: difficulty === "hell" ? 0.9 : 0.7,
      maxTokens: 2048,
    });

    const stream = result.textStream;

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "拷打失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
