"use client";

import Link from "next/link";
import { Sparkles, Globe, Flame, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Wand2,
    title: "AI 简历生成",
    description: "输入基本信息或粘贴 JD，AI 自动生成专业简历，支持 JD 匹配分析",
    href: "/generate",
  },
  {
    icon: Sparkles,
    title: "AI 简历优化",
    description: "智能分析简历结构、措辞、关键词，提供专业优化建议",
    href: "/optimize",
  },
  {
    icon: Globe,
    title: "简历网页化",
    description: "将传统简历转换为精美的在线网页，支持多种模板，一键分享",
    href: "/webify",
  },
  {
    icon: Flame,
    title: "AI 拷打简历",
    description: "模拟面试场景，AI 针对简历提出犀利问题，帮你提前暴露弱点",
    href: "/roast",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ResumeAI
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/generate" className="text-sm text-muted-foreground transition-colors hover:text-foreground">生成</Link>
            <Link href="/optimize" className="text-sm text-muted-foreground transition-colors hover:text-foreground">优化</Link>
            <Link href="/webify" className="text-sm text-muted-foreground transition-colors hover:text-foreground">网页化</Link>
            <Link href="/roast" className="text-sm text-muted-foreground transition-colors hover:text-foreground">拷打</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-32 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            让 AI 帮你打造
            <br />
            <span className="text-muted-foreground">完美简历</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            AI 生成、优化简历，匹配 JD 定制，生成网页、模拟面试拷打。
            支持多种大模型，边缘函数驱动。
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link href="/generate">
              <Button size="lg" className="h-11 px-6">AI 生成简历</Button>
            </Link>
            <Link href="/optimize">
              <Button size="lg" variant="outline" className="h-11 px-6">优化简历</Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-32">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">核心功能</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.href} className="group cursor-pointer border-0 bg-secondary/50 transition-colors hover:bg-secondary">
                <Link href={feature.href}>
                  <CardHeader className="pb-2">
                    <div className="mb-3 inline-flex rounded-md bg-background p-2.5 ring-1 ring-border">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <CardTitle className="text-sm font-semibold">{feature.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t py-24">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="mb-12 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">为什么选择 ResumeAI</p>
            <div className="grid gap-12 md:grid-cols-4">
              {[
                { title: "多模型支持", desc: "OpenAI / Claude / DeepSeek / 通义千问" },
                { title: "边缘函数", desc: "Vercel Edge Functions 全球部署" },
                { title: "流式输出", desc: "SSE 实时响应，无需等待" },
                { title: "隐私安全", desc: "敏感信息脱敏，数据不持久化" },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          ResumeAI · 基于 Vercel Edge Functions
        </div>
      </footer>
    </div>
  );
}
