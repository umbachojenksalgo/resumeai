export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/ai";
import { buildGeneratePrompt } from "@/lib/prompts/generate";
import type { GenerateInput } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, model } = body as {
      input: GenerateInput;
      model: string;
    };

    if (!input || !input.targetJob) {
      return NextResponse.json({ error: "缺少必要信息" }, { status: 400 });
    }

    const modelId = model || "mimo-v2-flash";
    const messages = buildGeneratePrompt(input);

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
    const message = err instanceof Error ? err.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
