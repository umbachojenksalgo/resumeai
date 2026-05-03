"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dropzone } from "@/components/upload/dropzone";
import { FilePreview } from "@/components/upload/file-preview";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { ResumePreview } from "@/components/resume/resume-preview";
import { ModelSelector } from "@/components/model-selector";
import { useResumeStore, emptyResume } from "@/lib/store";
import { parsePdfClientSide } from "@/lib/parser/pdf";
import { parseDocxClientSide } from "@/lib/parser/docx";
import type { ResumeData } from "@/types/resume";

const templates = [
  { id: "minimal", name: "极简", description: "简洁清爽，适合技术岗" },
  { id: "creative", name: "创意", description: "独特设计，适合设计岗" },
  { id: "professional", name: "专业", description: "商务风格，适合管理岗" },
  { id: "tech", name: "技术", description: "极客风格，适合开发岗" },
];

const themeColors = [
  { value: "#2563eb", label: "蓝色" },
  { value: "#059669", label: "绿色" },
  { value: "#dc2626", label: "红色" },
  { value: "#7c3aed", label: "紫色" },
  { value: "#ea580c", label: "橙色" },
  { value: "#0891b2", label: "青色" },
];

export default function WebifyPage() {
  const { resume, setResume, isLoading, setLoading, error, setError } = useResumeStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [model, setModel] = useState("mimo-v2-flash");
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [shareUrl, setShareUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileAccepted = useCallback(async (file: File) => {
    setUploadedFile(file);
    setLoading(true);
    setError(null);

    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await parsePdfClientSide(file);
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        text = await parseDocxClientSide(file);
      } else {
        setError("暂不支持该格式");
        return;
      }

      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model }),
      });

      if (!extractRes.ok) throw new Error("提取失败");

      const reader = extractRes.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
      }

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setResume(JSON.parse(jsonMatch[0]));
        setActiveTab("edit");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "解析失败");
    } finally {
      setLoading(false);
    }
  }, [model, setResume, setLoading, setError]);

  const handleGenerate = async () => {
    if (!resume) return;
    setIsGenerating(true);
    setShareUrl("");

    try {
      const res = await fetch("/api/webify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          templateId: selectedTemplate,
          themeColor: selectedColor,
        }),
      });

      if (!res.ok) throw new Error("生成失败");

      const data = await res.json();
      setShareUrl(data.shareUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">简历网页化</h1>
        <p className="mt-2 text-muted-foreground">将简历转换为精美的在线网页，一键分享</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upload">上传</TabsTrigger>
          <TabsTrigger value="edit" disabled={!resume}>编辑 & 预览</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <div className="space-y-4">
            <Dropzone onFileAccepted={handleFileAccepted} isLoading={isLoading} />
            {uploadedFile && (
              <FilePreview fileName={uploadedFile.name} fileSize={uploadedFile.size} fileType={uploadedFile.type} />
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="text-center">
              <Button variant="link" onClick={() => { setResume(emptyResume); setActiveTab("edit"); }}>
                或手动输入简历信息
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ResumeEditor resume={resume || emptyResume} onChange={(r) => setResume(r)} />
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">选择模板</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {templates.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        selectedTemplate === t.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.description}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">主题色</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {themeColors.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setSelectedColor(c.value)}
                        className={`h-8 w-8 rounded-full border-2 transition-transform ${
                          selectedColor === c.value ? "scale-110 border-foreground" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
                {isGenerating ? "生成中..." : "生成网页简历"}
              </Button>

              {shareUrl && (
                <Card>
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-sm font-medium">分享链接</p>
                    <div className="flex gap-2">
                      <Input value={shareUrl} readOnly className="text-xs" />
                      <Button size="sm" onClick={handleCopyLink}>复制</Button>
                    </div>
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      在新窗口打开 →
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
