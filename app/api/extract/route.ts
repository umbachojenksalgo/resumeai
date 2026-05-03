export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/ai";
import { buildExtractPrompt } from "@/lib/prompts/extract";

export async function POST(req: NextRequest) {
  try {
    const { text, model } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "缺少简历文本" }, { status: 400 });
    }

    const modelId = model || "mimo-v2-flash";
    const messages = buildExtractPrompt(text);

    const result = await streamChat(modelId, messages, {
      temperature: 0.1,
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
    const message = err instanceof Error ? err.message : "提取失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
