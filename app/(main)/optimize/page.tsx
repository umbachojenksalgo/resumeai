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
import { DiffView } from "@/components/resume/diff-view";
import { ModelSelector } from "@/components/model-selector";
import { useResumeStore, emptyResume } from "@/lib/store";
import { parsePdfClientSide } from "@/lib/parser/pdf";
import { parseDocxClientSide } from "@/lib/parser/docx";
import type { ResumeData, OptimizeFocus } from "@/types/resume";

const focusOptions: { value: OptimizeFocus; label: string }[] = [
  { value: "all", label: "全面优化" },
  { value: "structure", label: "结构优化" },
  { value: "wording", label: "措辞增强" },
  { value: "keywords", label: "关键词匹配" },
  { value: "quantify", label: "量化成果" },
];

export default function OptimizePage() {
  const { resume, setResume, isLoading, setLoading, error, setError } = useResumeStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [targetJob, setTargetJob] = useState("");
  const [focus, setFocus] = useState<OptimizeFocus[]>(["all"]);
  const [model, setModel] = useState("mimo-v2-flash");
  const [optimizeResult, setOptimizeResult] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

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
        setActiveTab("edit");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "解析失败");
    } finally {
      setLoading(false);
    }
  }, [model, setResume, setLoading, setError]);

  const handleOptimize = async () => {
    if (!resume) return;
    setIsOptimizing(true);
    setOptimizeResult("");

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, targetJob, focus, model }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "优化失败");
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

      setOptimizeResult(result);
      setActiveTab("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "优化失败");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleResumeChange = (updated: ResumeData) => {
    setResume(updated);
  };

  const toggleFocus = (value: OptimizeFocus) => {
    if (value === "all") {
      setFocus(["all"]);
      return;
    }
    const newFocus = focus.filter((f) => f !== "all");
    if (newFocus.includes(value)) {
      const filtered = newFocus.filter((f) => f !== value);
      setFocus(filtered.length === 0 ? ["all"] : filtered);
    } else {
      setFocus([...newFocus, value]);
    }
  };

  let parsedResult: any = null;
  if (optimizeResult) {
    const jsonMatch = optimizeResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedResult = JSON.parse(jsonMatch[0]);
      } catch {}
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI 简历优化</h1>
        <p className="mt-2 text-muted-foreground">上传简历，AI 帮你全方位优化</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">AI 模型</span>
          <ModelSelector value={model} onChange={setModel} feature="optimize" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">目标岗位</span>
          <Input
            placeholder="如：前端工程师"
            value={targetJob}
            onChange={(e) => setTargetJob(e.target.value)}
            className="w-48"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">优化重点</span>
          {focusOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant={focus.includes(opt.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFocus(opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upload">上传</TabsTrigger>
          <TabsTrigger value="edit" disabled={!resume}>编辑</TabsTrigger>
          <TabsTrigger value="result" disabled={!optimizeResult}>结果</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <div className="space-y-4">
            <Dropzone onFileAccepted={handleFileAccepted} isLoading={isLoading} />
            {uploadedFile && (
              <FilePreview
                fileName={uploadedFile.name}
                fileSize={uploadedFile.size}
                fileType={uploadedFile.type}
              />
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  setResume(emptyResume);
                  setActiveTab("edit");
                }}
              >
                或手动输入简历信息
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ResumeEditor resume={resume || emptyResume} onChange={handleResumeChange} />
            <div className="space-y-4">
              <ResumePreview resume={resume || emptyResume} />
              <Button onClick={handleOptimize} disabled={isOptimizing} className="w-full" size="lg">
                {isOptimizing ? "AI 正在优化中..." : "开始 AI 优化"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="result" className="mt-6">
          {parsedResult ? (
            <DiffView
              suggestions={parsedResult.suggestions || []}
              score={parsedResult.score}
              overallFeedback={parsedResult.overallFeedback}
              strengths={parsedResult.strengths}
              weaknesses={parsedResult.weaknesses}
              missingKeywords={parsedResult.missingKeywords}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <pre className="whitespace-pre-wrap text-sm">{optimizeResult}</pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
