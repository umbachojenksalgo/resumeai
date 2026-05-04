export const runtime = "edge";

import { NextRequest } from "next/server";
import { kvGet } from "@/lib/kv";
import { renderTemplate } from "@/components/templates";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await kvGet<{
      resume: any;
      templateId: string;
      themeColor?: string;
    }>(`resume:${id}`);

    if (!data) {
      return new Response("简历不存在或已过期", { status: 404 });
    }

    const html = renderTemplate(data.templateId, data.resume, data.themeColor);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("渲染失败", { status: 500 });
  }
}
