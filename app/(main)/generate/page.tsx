"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { ResumePreview } from "@/components/resume/resume-preview";
import { JdMatchReport } from "@/components/resume/jd-match-report";
import { ModelSelector } from "@/components/model-selector";
import { Dropzone } from "@/components/upload/dropzone";
import { FilePreview } from "@/components/upload/file-preview";
import { TEMPLATES } from "@/components/templates";
import { useResumeStore, emptyResume } from "@/lib/store";
import { parsePdfClientSide } from "@/lib/parser/pdf";
import { parseDocxClientSide } from "@/lib/parser/docx";
import type { ResumeData, GenerateInput, JdMatchResult } from "@/types/resume";

export default function GeneratePage() {
  const { resume, setResume, isLoading, setLoading, error, setError } = useResumeStore();
  const [model, setModel] = useState("mimo-v2-flash");
  const [mode, setMode] = useState<"scratch" | "jd-match">("scratch");
  const [activeTab, setActiveTab] = useState("input");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [selectedColor, setSelectedColor] = useState("#000000");

  const [scratchInput, setScratchInput] = useState<GenerateInput>({
    name: "",
    targetJob: "",
    experience: "",
    skills: "",
  });

  const [jdText, setJdText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jdMatchResult, setJdMatchResult] = useState<JdMatchResult | null>(null);

  const themeColors = [
    { value: "#000000", label: "黑色" },
    { value: "#171717", label: "深灰" },
    { value: "#525252", label: "中灰" },
    { value: "#dc2626", label: "红色" },
    { value: "#2563eb", label: "蓝色" },
    { value: "#059669", label: "绿色" },
  ];

  const getPreviewHtml = useCallback(() => {
    const template = TEMPLATES.find((t) => t.id === selectedTemplate);
    if (!template) return "";
    return template.render(resume || emptyResume, selectedColor);
  }, [resume, selectedTemplate, selectedColor]);

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
        setError("暂不支持该格式，请上传 PDF 或 Word 文件");
        return;
      }

      if (!text.trim()) {
        setError("文件解析结果为空，请检查文件内容");
        return;
      }

      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model }),
      });

      if (!extractRes.ok) {
        const err = await extractRes.json();
        throw new Error(err.error || "提取失败");
      }

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
        const parsed = JSON.parse(jsonMatch[0]);
        setResume(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "解析失败");
    } finally {
      setLoading(false);
    }
  }, [model, setResume, setLoading, setError]);

  const handleScratchGenerate = async () => {
    if (!scratchInput.targetJob) {
      setError("请输入目标岗位");
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: scratchInput, model }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "生成失败");
      }

      const reader = res.body?.getReader();
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
        const parsed = JSON.parse(jsonMatch[0]);
        setResume(parsed);
        setActiveTab("result");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleJdMatchGenerate = async () => {
    if (!jdText) {
      setError("请粘贴职位描述（JD）");
      return;
    }
    if (!resume) {
      setError("请先上传简历或手动输入简历信息");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setJdMatchResult(null);

    try {
      const res = await fetch("/api/generate/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: jdText, resume, model }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "JD匹配分析失败");
      }

      const reader = res.body?.getReader();
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
        const parsed = JSON.parse(jsonMatch[0]);
        setJdMatchResult(parsed);
        if (parsed.tailoredResume) {
          setResume(parsed.tailoredResume);
        }
        setActiveTab("result");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "JD匹配分析失败");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const container = document.createElement("div");
      container.innerHTML = getPreviewHtml();
      container.style.width = "800px";
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      document.body.appendChild(container);

      const filename = `${resume?.personal.name || "resume"}.pdf`;

      await html2pdf()
        .set({
          margin: 0,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(container)
        .save();

      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("PDF 导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadHtml = () => {
    const html = getPreviewHtml();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume?.personal.name || "resume"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareLink = async () => {
    try {
      const res = await fetch("/api/webify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, templateId: selectedTemplate, themeColor: selectedColor }),
      });
      if (res.ok) {
        const data = await res.json();
        await navigator.clipboard.writeText(data.shareUrl);
        alert("分享链接已复制到剪贴板！");
      }
    } catch {
      alert("生成分享链接失败，请检查网络连接");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">AI 简历生成</h1>
        <p className="mt-2 text-sm text-muted-foreground">从零生成或根据 JD 定制匹配简历</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI 模型</span>
          <ModelSelector value={model} onChange={setModel} feature="generate" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">生成模式</span>
          <Badge
            variant={mode === "scratch" ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setMode("scratch")}
          >
            从零生成
          </Badge>
          <Badge
            variant={mode === "jd-match" ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setMode("jd-match")}
          >
            JD 匹配生成
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="input">输入信息</TabsTrigger>
          <TabsTrigger value="result" disabled={!resume}>编辑 & 导出</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-6">
          {mode === "scratch" ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">基本信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="姓名"
                      value={scratchInput.name}
                      onChange={(e) => setScratchInput({ ...scratchInput, name: e.target.value })}
                    />
                    <Input
                      placeholder="目标岗位（如：前端工程师）"
                      value={scratchInput.targetJob}
                      onChange={(e) => setScratchInput({ ...scratchInput, targetJob: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="邮箱（可选）"
                        value={scratchInput.email || ""}
                        onChange={(e) => setScratchInput({ ...scratchInput, email: e.target.value })}
                      />
                      <Input
                        placeholder="电话（可选）"
                        value={scratchInput.phone || ""}
                        onChange={(e) => setScratchInput({ ...scratchInput, phone: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="所在地（可选）"
                      value={scratchInput.location || ""}
                      onChange={(e) => setScratchInput({ ...scratchInput, location: e.target.value })}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">工作经历</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="描述你的工作经历，格式自由，如：&#10;2022-2024 字节跳动 前端工程师&#10;- 负责抖音创作者平台开发&#10;- 优化页面性能，加载速度提升40%"
                      value={scratchInput.experience}
                      onChange={(e) => setScratchInput({ ...scratchInput, experience: e.target.value })}
                      rows={6}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">技能与教育</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="技能关键词（逗号分隔），如：React, TypeScript, Node.js, Git"
                      value={scratchInput.skills}
                      onChange={(e) => setScratchInput({ ...scratchInput, skills: e.target.value })}
                      rows={2}
                    />
                    <Textarea
                      placeholder="教育背景（可选），如：2018-2022 北京大学 计算机科学 本科"
                      value={scratchInput.education || ""}
                      onChange={(e) => setScratchInput({ ...scratchInput, education: e.target.value })}
                      rows={2}
                    />
                  </CardContent>
                </Card>

                <Button onClick={handleScratchGenerate} disabled={isGenerating} className="w-full" size="lg">
                  {isGenerating ? "AI 正在生成中..." : "AI 生成简历"}
                </Button>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">提示</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>1. 填写基本信息和目标岗位</p>
                    <p>2. 用自由格式描述你的工作经历</p>
                    <p>3. 列出你掌握的技能关键词</p>
                    <p>4. AI 会根据你的信息生成专业简历</p>
                    <div className="mt-4 rounded-lg bg-muted p-3">
                      <p className="font-medium text-foreground">生成效果</p>
                      <ul className="mt-2 ml-4 list-disc space-y-1">
                        <li>自动使用 STAR 法则优化描述</li>
                        <li>强动词开头，量化成果</li>
                        <li>根据目标岗位补充关键词</li>
                        <li>生成后可编辑调整</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">职位描述（JD）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="粘贴目标岗位的职位描述全文...&#10;&#10;例如：&#10;岗位职责：&#10;1. 负责公司核心产品的前端开发&#10;2. 参与技术方案设计...&#10;&#10;任职要求：&#10;1. 3年以上前端开发经验&#10;2. 精通 React/Vue..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      rows={10}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">简历信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Dropzone onFileAccepted={handleFileAccepted} isLoading={isLoading} />
                    {uploadedFile && (
                      <FilePreview
                        fileName={uploadedFile.name}
                        fileSize={uploadedFile.size}
                        fileType={uploadedFile.type}
                      />
                    )}
                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => {
                          setResume(emptyResume);
                        }}
                      >
                        或手动输入简历信息
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleJdMatchGenerate} disabled={isGenerating || !resume} className="w-full" size="lg">
                  {isGenerating ? "AI 正在分析匹配中..." : "JD 匹配生成"}
                </Button>
              </div>

              <div>
                {resume && resume.personal.name ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">当前简历</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[600px] overflow-y-auto">
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-semibold">{resume.personal.name}</p>
                          <p className="text-muted-foreground">{resume.personal.title}</p>
                        </div>
                        {resume.summary && <p className="text-muted-foreground">{resume.summary}</p>}
                        {resume.experience.map((exp, i) => (
                          <div key={i}>
                            <p className="font-medium">{exp.position} · {exp.company}</p>
                            <ul className="ml-4 list-disc text-muted-foreground">
                              {exp.description.map((d, j) => <li key={j}>{d}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">JD 匹配生成说明</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <p>1. 粘贴目标岗位的 JD 全文</p>
                      <p>2. 上传你的简历文件（PDF/Word）或手动输入</p>
                      <p>3. AI 分析 JD 关键词与简历匹配度</p>
                      <p>4. 生成针对性定制的简历</p>
                      <div className="mt-4 rounded-lg bg-muted p-3">
                        <p className="font-medium text-foreground">匹配分析包含</p>
                        <ul className="mt-2 ml-4 list-disc space-y-1">
                          <li>匹配度评分（0-100）</li>
                          <li>匹配/缺失关键词分析</li>
                          <li>针对性简历改写</li>
                          <li>改进建议</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </TabsContent>

        <TabsContent value="result" className="mt-6">
          {jdMatchResult && mode === "jd-match" && (
            <div className="mb-6">
              <JdMatchReport result={jdMatchResult} />
            </div>
          )}
          {resume && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
              <div className="space-y-4">
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pb-3">
                    <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      模板 & 主题
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      {TEMPLATES.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTemplate(t.id)}
                          className={`cursor-pointer rounded-md border p-3 transition-all ${
                            selectedTemplate === t.id
                              ? "border-foreground bg-secondary shadow-sm"
                              : "border-border/50 hover:border-foreground/30 hover:bg-secondary/30"
                          }`}
                        >
                          <div className="text-sm font-medium">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.description}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {themeColors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setSelectedColor(c.value)}
                          className={`h-7 w-7 rounded-full border-2 transition-all ${
                            selectedColor === c.value
                              ? "scale-110 border-foreground shadow-sm"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                <ResumeEditor resume={resume} onChange={(r) => setResume(r)} />

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadHtml}>下载 HTML</Button>
                  <Button variant="outline" size="sm" onClick={handleShareLink}>分享链接</Button>
                  <Button size="sm" onClick={handleExportPdf} disabled={isExporting}>
                    {isExporting ? "导出中..." : "导出 PDF"}
                  </Button>
                </div>
              </div>

              <div className="lg:sticky lg:top-8 lg:self-start">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    实时预览
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {TEMPLATES.find((t) => t.id === selectedTemplate)?.name || "极简"}
                    </Badge>
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                  <iframe
                    srcDoc={getPreviewHtml()}
                    className="h-[900px] w-full border-0"
                    title="简历预览"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
