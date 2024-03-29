// code from sipc

import axios from "axios";
import { getErrorMessage } from "@/pages/api/lib/utils";

export class Qwen {
  public apiUrl: string;
  public key: string;
  public model: string;

  constructor(
    apiUrl = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    key: string,
    model = "qwen-turbo",
  ) {
    this.apiUrl = apiUrl;
    this.key = key;
    this.model = model;
  }

  async translate(text: string, target: string, source: string = "auto") {
    if (target === "classical-chinese") {
      target = "文言文";
      if (source === "zh") {
        source = "白话文";
      }
    }
    if (source === "classical-chinese") {
      source = "文言文";
      if (target === "zh") {
        target = "白话文";
      }
    }
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`,
      };
      const data = JSON.stringify({
        model: this.model,
        input: {
          messages: [
            {
              role: "system",
              content: `You are a professional, authentic translation engine, only returns translations.`,
            },
            {
              role: "user",
              content: `Please translate the text from ${source} to ${target} language,Translation will be enclosed within <start></end> tags, and they should not be included in the output.`,
            },
            {
              role: "assistant",
              content: "OK",
            },
            {
              role: "user",
              content: `<start>${text}</end>`,
            },
          ],
        },
      });
      const response = await axios.post(this.apiUrl, data, { headers });
      return response.data.output.text;
    } catch (error: any) {
      console.log(error.response);

      throw new Error(
        `Error while translating: ${getErrorMessage(error.response.data)}`,
      );
    }
  }
}

export const QwenInstance = new Qwen(
  process.env.QWEN_API_ENDPOINT!,
  process.env.QWEN_API_KEY!,
  process.env.QWEN_MODEL!,
);
