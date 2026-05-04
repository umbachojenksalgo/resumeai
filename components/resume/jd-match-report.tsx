"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JdMatchResult } from "@/types/resume";

interface JdMatchReportProps {
  result: JdMatchResult;
}

export function JdMatchReport({ result }: JdMatchReportProps) {
  const { matchScore, matchAnalysis, suggestions } = result;
  const { matchedKeywords, missingKeywords, matchedResponsibilities, gapAnalysis } = matchAnalysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-foreground";
    if (score >= 60) return "text-muted-foreground";
    return "text-muted-foreground/60";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "优秀匹配";
    if (score >= 60) return "良好匹配";
    if (score >= 40) return "一般匹配";
    return "匹配度较低";
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (matchScore / 100) * circumference;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">匹配度评分</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="currentColor" strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className={getScoreColor(matchScore)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(matchScore)}`}>{matchScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <Badge variant="outline" className={`mt-2 ${getScoreColor(matchScore)}`}>
              {getScoreLabel(matchScore)}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">关键词匹配</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="mb-1 text-sm font-medium text-green-600">已匹配 ({matchedKeywords.length})</p>
              <div className="flex flex-wrap gap-1">
                {matchedKeywords.map((kw, i) => (
                  <Badge key={i} variant="default" className="bg-secondary text-foreground hover:bg-secondary/80">
                    {kw}
                  </Badge>
                ))}
                {matchedKeywords.length === 0 && <span className="text-sm text-muted-foreground">无</span>}
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-red-600">缺失 ({missingKeywords.length})</p>
              <div className="flex flex-wrap gap-1">
                {missingKeywords.map((kw, i) => (
                  <Badge key={i} variant="outline" className="text-muted-foreground">
                    {kw}
                  </Badge>
                ))}
                {missingKeywords.length === 0 && <span className="text-sm text-muted-foreground">无</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {matchedResponsibilities.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">匹配的职责</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {matchedResponsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {gapAnalysis.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">差距分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {gapAnalysis.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">改进建议</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {suggestions.map((item, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg bg-secondary/50 p-2">
                  <span className="mt-0.5 shrink-0 text-muted-foreground">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
