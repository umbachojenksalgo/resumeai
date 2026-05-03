"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

interface Suggestion {
  category: "structure" | "wording" | "keywords" | "quantify";
  original: string;
  optimized: string;
  reason: string;
}

interface DiffViewProps {
  suggestions: Suggestion[];
  score?: number;
  overallFeedback?: string;
  strengths?: string[];
  weaknesses?: string[];
  missingKeywords?: string[];
  onApply?: (optimized: string) => void;
}

const categoryLabels: Record<string, string> = {
  structure: "结构",
  wording: "措辞",
  keywords: "关键词",
  quantify: "量化",
};

const categoryColors: Record<string, string> = {
  structure: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  wording: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  keywords: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  quantify: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export function DiffView({
  suggestions,
  score,
  overallFeedback,
  strengths,
  weaknesses,
  missingKeywords,
}: DiffViewProps) {
  return (
    <div className="space-y-6">
      {score !== undefined && (
        <Card>
          <CardContent className="flex items-center gap-6 pt-6">
            <div className="flex flex-col items-center">
              <div className={`text-4xl font-bold ${score >= 70 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-500"}`}>
                {score}
              </div>
              <div className="text-sm text-muted-foreground">综合评分</div>
            </div>
            {overallFeedback && (
              <p className="flex-1 text-sm leading-relaxed">{overallFeedback}</p>
            )}
          </CardContent>
        </Card>
      )}

      {strengths && strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-green-600">亮点</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {weaknesses && weaknesses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-600">待改进</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-red-600 dark:text-red-400">• {w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {missingKeywords && missingKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">缺失关键词</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">优化建议</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.map((s, i) => (
            <div key={i} className="rounded-lg border p-3 space-y-2">
              <Badge className={categoryColors[s.category]}>
                {categoryLabels[s.category]}
              </Badge>
              <div className="flex items-start gap-2 text-sm">
                <div className="flex-1 rounded bg-red-50 p-2 dark:bg-red-950/30">
                  <span className="text-xs text-muted-foreground">原文</span>
                  <p className="line-through">{s.original}</p>
                </div>
                <ArrowRight className="mt-4 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 rounded bg-green-50 p-2 dark:bg-green-950/30">
                  <span className="text-xs text-muted-foreground">优化后</span>
                  <p className="font-medium">{s.optimized}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">💡 {s.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
