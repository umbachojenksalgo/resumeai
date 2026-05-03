import { put } from "@vercel/blob";

export async function uploadToBlob(filename: string, data: Blob): Promise<string> {
  const result = await put(filename, data, {
    access: "public",
    addRandomSuffix: true,
  });
  return result.url;
}
