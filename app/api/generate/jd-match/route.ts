export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/ai";
import { buildJdMatchPrompt } from "@/lib/prompts/generate";
import type { JdMatchInput } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jd, resume, model } = body as {
      jd: string;
      resume: JdMatchInput["resume"];
      model: string;
    };

    if (!jd || !resume) {
      return NextResponse.json({ error: "缺少JD或简历数据" }, { status: 400 });
    }

    const modelId = model || "mimo-v2-flash";
    const messages = buildJdMatchPrompt({ jd, resume });

    const result = await streamChat(modelId, messages, {
      temperature: 0.5,
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
    const message = err instanceof Error ? err.message : "JD匹配分析失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
