"use client";

import Link from "next/link";
import { Sparkles, Globe, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI 简历优化",
    description: "智能分析简历结构、措辞、关键词，提供专业优化建议，让你的简历脱颖而出",
    href: "/optimize",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Globe,
    title: "简历网页化",
    description: "将传统简历转换为精美的在线网页，支持多种模板，一键分享",
    href: "/webify",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Flame,
    title: "AI 拷打简历",
    description: "模拟面试场景，AI 针对简历提出犀利问题，帮你提前暴露弱点",
    href: "/roast",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            ResumeAI
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/optimize" className="text-sm text-muted-foreground hover:text-foreground">优化</Link>
            <Link href="/webify" className="text-sm text-muted-foreground hover:text-foreground">网页化</Link>
            <Link href="/roast" className="text-sm text-muted-foreground hover:text-foreground">AI拷打</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            让 AI 帮你打造
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
              完美简历
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            上传简历，AI 帮你优化措辞、生成网页、模拟面试拷打。
            支持多种大模型，边缘函数驱动，极速响应。
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/optimize">
              <Button size="lg">开始优化</Button>
            </Link>
            <Link href="/roast">
              <Button size="lg" variant="outline">试试拷打</Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.href} className="group cursor-pointer transition-shadow hover:shadow-lg">
                <Link href={feature.href}>
                  <CardHeader>
                    <div className={`mb-2 inline-flex rounded-lg p-3 ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t bg-muted/50 py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-2xl font-bold">为什么选择 ResumeAI？</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-4">
              {[
                { title: "多模型支持", desc: "OpenAI / Claude / DeepSeek / 通义千问，自由切换" },
                { title: "边缘函数", desc: "Vercel Edge Functions 全球部署，毫秒级响应" },
                { title: "流式输出", desc: "SSE 实时流式响应，无需等待完整结果" },
                { title: "隐私安全", desc: "敏感信息自动脱敏，数据不持久化存储" },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          ResumeAI · 基于 Vercel Edge Functions · 多模型 AI 驱动
        </div>
      </footer>
    </div>
  );
}
