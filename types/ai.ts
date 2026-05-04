export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  supportedFeatures: ("optimize" | "roast" | "extract" | "generate")[];
}

export interface ChatParams {
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIProviderConfig {
  name: string;
  apiKeyEnvVar: string;
  baseUrl?: string;
  models: AIModel[];
}

export interface StreamChunk {
  type: "content" | "error" | "done";
  content?: string;
  error?: string;
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    name: "openai",
    apiKeyEnvVar: "OPENAI_API_KEY",
    models: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: "openai",
        description: "OpenAI 最强模型，适合复杂简历分析",
        maxTokens: 128000,
        supportedFeatures: ["optimize", "roast", "extract", "generate"],
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        provider: "openai",
        description: "轻量快速，适合简单优化",
        maxTokens: 128000,
        supportedFeatures: ["optimize", "roast", "extract", "generate"],
      },
    ],
  },
  {
    name: "anthropic",
    apiKeyEnvVar: "ANTHROPIC_API_KEY",
    models: [
      {
        id: "claude-sonnet-4-20250514",
        name: "Claude Sonnet 4",
        provider: "anthropic",
        description: "长文本理解优秀，适合简历深度分析",
        maxTokens: 200000,
        supportedFeatures: ["optimize", "roast", "extract", "generate"],
      },
    ],
  },
  {
    name: "deepseek",
    apiKeyEnvVar: "DEEPSEEK_API_KEY",
    baseUrl: "https://api.deepseek.com",
    models: [
      {
        id: "deepseek-chat",
        name: "DeepSeek Chat",
        provider: "deepseek",
        description: "国产高性价比模型",
        maxTokens: 64000,
        supportedFeatures: ["optimize", "roast", "extract", "generate"],
      },
    ],
  },
  {
    name: "qwen",
    apiKeyEnvVar: "DASHSCOPE_API_KEY",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    models: [
      {
        id: "qwen-plus",
        name: "通义千问 Plus",
        provider: "qwen",
        description: "阿里云大模型，国内直连",
        maxTokens: 128000,
        supportedFeatures: ["optimize", "roast", "extract", "generate"],
      },
    ],
  },
  {
    name: "mimo",
    apiKeyEnvVar: "MIMO_API_KEY",
    baseUrl: "https://api.xiaomimimo.com/v1",
    models: [
      {
        id: "mimo-v2-flash",
        name: "MiMo V2 Flash",
        provider: "mimo",
        description: "小米大模型，快速高效",
        maxTokens: 65536,
        supportedFeatures: ["optimize", "roast", "extract", "generate"],
      },
      {
        id: "mimo-v2-pro",
        name: "MiMo V2 Pro",
        provider: "mimo",
        description: "小米大模型，深度推理",
        maxTokens: 65536,
        supportedFeatures: ["optimize", "roast", "extract", "generate"],
      },
    ],
  },
];

export function getAllModels(): AIModel[] {
  return AI_PROVIDERS.flatMap((p) => p.models);
}

export function getModelById(id: string): AIModel | undefined {
  return getAllModels().find((m) => m.id === id);
}

export function getProviderForModel(modelId: string): AIProviderConfig | undefined {
  return AI_PROVIDERS.find((p) => p.models.some((m) => m.id === modelId));
}
