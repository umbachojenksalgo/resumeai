"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dropzone } from "@/components/upload/dropzone";
import { FilePreview } from "@/components/upload/file-preview";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ModelSelector } from "@/components/model-selector";
import { useResumeStore, emptyResume } from "@/lib/store";
import { parsePdfClientSide } from "@/lib/parser/pdf";
import { parseDocxClientSide } from "@/lib/parser/docx";
import type { ResumeData, DifficultyLevel, ChatMessage } from "@/types/resume";

const difficultyOptions: { value: DifficultyLevel; label: string; description: string; color: string }[] = [
  { value: "gentle", label: "温和", description: "引导式提问，温和有建设性", color: "bg-secondary text-foreground" },
  { value: "standard", label: "标准", description: "模拟真实面试，专业追问", color: "bg-muted text-foreground" },
  { value: "hell", label: "地狱", description: "极限施压，暴露所有弱点", color: "bg-foreground text-background" },
];

export default function RoastPage() {
  const { resume, setResume, isLoading, setLoading, error, setError } = useResumeStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [model, setModel] = useState("mimo-v2-flash");
  const [activeTab, setActiveTab] = useState("upload");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("standard");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

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
        setActiveTab("roast");
        startRoast(JSON.parse(jsonMatch[0]), difficulty);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "解析失败");
    } finally {
      setLoading(false);
    }
  }, [model, setResume, setLoading, setError]);

  const startRoast = async (resumeData: ResumeData, diff: DifficultyLevel) => {
    setIsChatLoading(true);
    setMessages([]);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeData, difficulty: diff, model }),
      });

      if (!res.ok) throw new Error("拷打启动失败");

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

      setMessages([{ role: "assistant", content: result }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "拷打失败");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const previousMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          difficulty,
          model,
          previousMessages,
        }),
      });

      if (!res.ok) throw new Error("回复失败");

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

      setMessages([...updatedMessages, { role: "assistant", content: result }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "回复失败");
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">AI 拷打简历</h1>
        <p className="mt-2 text-sm text-muted-foreground">模拟面试场景，AI 对你的简历进行犀利拷问</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI 模型</span>
          <ModelSelector value={model} onChange={setModel} feature="roast" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">难度</span>
          {difficultyOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant={difficulty === opt.value ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setDifficulty(opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upload">上传简历</TabsTrigger>
          <TabsTrigger value="roast" disabled={!resume}>开始拷打</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <div className="space-y-4">
            <Dropzone onFileAccepted={handleFileAccepted} isLoading={isLoading} />
            {uploadedFile && (
              <FilePreview fileName={uploadedFile.name} fileSize={uploadedFile.size} fileType={uploadedFile.type} />
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </TabsContent>

        <TabsContent value="roast" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">简历内容</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {resume && (
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
                  )}
                </CardContent>
              </Card>

              <div className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      {difficultyOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setDifficulty(opt.value);
                            if (resume) startRoast(resume, opt.value);
                          }}
                          className={`cursor-pointer rounded-lg border p-2 transition-colors ${
                            difficulty === opt.value ? "border-primary" : ""
                          }`}
                        >
                          <Badge className={opt.color}>{opt.label}</Badge>
                          <p className="mt-1 text-xs text-muted-foreground">{opt.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-[700px] flex flex-col">
                <CardHeader className="shrink-0">
                  <CardTitle className="text-base">AI 面试官</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isChatLoading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
