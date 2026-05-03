import { streamText, generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { getProviderForModel } from "@/types/ai";

type Message = { role: "system" | "user" | "assistant"; content: string };

function getProviderClient(providerName: string, apiKey: string, baseUrl?: string) {
  switch (providerName) {
    case "openai":
      return createOpenAI({ apiKey });
    case "anthropic":
      return createAnthropic({ apiKey });
    case "deepseek":
      return createOpenAI({ apiKey, baseURL: baseUrl || "https://api.deepseek.com" });
    case "qwen":
      return createOpenAI({
        apiKey,
        baseURL: baseUrl || "https://dashscope.aliyuncs.com/compatible-mode/v1",
      });
    case "mimo":
      return createOpenAI({
        apiKey,
        baseURL: baseUrl || "https://api.xiaomimimo.com/v1",
      });
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

function resolveApiKey(providerName: string): string {
  const provider = getProviderForModel("");
  const envVar =
    provider?.apiKeyEnvVar ||
    {
      openai: "OPENAI_API_KEY",
      anthropic: "ANTHROPIC_API_KEY",
      deepseek: "DEEPSEEK_API_KEY",
      qwen: "DASHSCOPE_API_KEY",
      mimo: "MIMO_API_KEY",
    }[providerName];

  const key = process.env[envVar || ""];
  if (!key) {
    throw new Error(`Missing API key: ${envVar}`);
  }
  return key;
}

export async function streamChat(
  modelId: string,
  messages: Message[],
  options?: { temperature?: number; maxTokens?: number }
) {
  const providerConfig = getProviderForModel(modelId);
  if (!providerConfig) throw new Error(`Unknown model: ${modelId}`);

  const apiKey = resolveApiKey(providerConfig.name);
  const client = getProviderClient(providerConfig.name, apiKey, providerConfig.baseUrl);

  const result = streamText({
    model: client(modelId),
    messages,
    temperature: options?.temperature ?? 0.7,
    maxOutputTokens: options?.maxTokens ?? 4096,
  });

  return result;
}

export async function generateChat(
  modelId: string,
  messages: Message[],
  options?: { temperature?: number; maxTokens?: number }
) {
  const providerConfig = getProviderForModel(modelId);
  if (!providerConfig) throw new Error(`Unknown model: ${modelId}`);

  const apiKey = resolveApiKey(providerConfig.name);
  const client = getProviderClient(providerConfig.name, apiKey, providerConfig.baseUrl);

  const result = await generateText({
    model: client(modelId),
    messages,
    temperature: options?.temperature ?? 0.7,
    maxOutputTokens: options?.maxTokens ?? 4096,
  });

  return result.text;
}
