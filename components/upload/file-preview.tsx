"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilePreviewProps {
  fileName: string;
  fileSize: number;
  fileType: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileTypeLabel(type: string): string {
  if (type.includes("pdf")) return "PDF";
  if (type.includes("word") || type.includes("document")) return "Word";
  if (type.includes("image")) return "图片";
  return "文件";
}

export function FilePreview({ fileName, fileSize, fileType }: FilePreviewProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
      <div className="rounded-md bg-primary/10 p-2">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{fileName}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(fileSize)}
        </p>
      </div>
      <Badge variant="secondary">{getFileTypeLabel(fileType)}</Badge>
    </div>
  );
}
