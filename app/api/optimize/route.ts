export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/ai";
import { buildOptimizePrompt } from "@/lib/prompts/optimize";
import type { ResumeData, OptimizeFocus } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, targetJob, focus, model } = body as {
      resume: ResumeData;
      targetJob?: string;
      focus: OptimizeFocus[];
      model: string;
    };

    if (!resume) {
      return NextResponse.json({ error: "缺少简历数据" }, { status: 400 });
    }

    const modelId = model || "mimo-v2-flash";
    const messages = buildOptimizePrompt(resume, targetJob, focus);

    const result = await streamChat(modelId, messages, {
      temperature: 0.7,
      maxTokens: 4096,
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
    const message = err instanceof Error ? err.message : "优化失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
