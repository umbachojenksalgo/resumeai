export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { parseFileServerSide } from "@/lib/parser/server-parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "未提供文件" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小超过10MB限制" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "不支持的文件格式" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseFileServerSide(buffer, file.type);

    return NextResponse.json({ text, fileName: file.name });
  } catch (err) {
    const message = err instanceof Error ? err.message : "文件解析失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
