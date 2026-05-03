export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { kvSet } from "@/lib/kv";
import type { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, templateId, themeColor } = body as {
      resume: ResumeData;
      templateId: string;
      themeColor?: string;
    };

    if (!resume || !templateId) {
      return NextResponse.json({ error: "缺少简历数据或模板ID" }, { status: 400 });
    }

    const id = nanoid(10);
    await kvSet(
      `resume:${id}`,
      { resume, templateId, themeColor, createdAt: Date.now() },
      86400 * 30
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${appUrl}/api/resume/${id}`;

    return NextResponse.json({ id, shareUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
