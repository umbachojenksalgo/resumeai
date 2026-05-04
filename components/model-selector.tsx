"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllModels } from "@/types/ai";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  feature?: "optimize" | "roast" | "extract" | "generate";
}

export function ModelSelector({ value, onChange, feature }: ModelSelectorProps) {
  const models = feature
    ? getAllModels().filter((m) => m.supportedFeatures.includes(feature))
    : getAllModels();

  return (
    <Select value={value} onValueChange={(v) => { if (v) onChange(v); }}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="选择模型" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col">
              <span>{model.name}</span>
              <span className="text-xs text-muted-foreground">{model.provider}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
