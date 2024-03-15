import axios from "axios";
import { getErrorMessage } from "@/pages/api/lib/utils";

export class Gemini {
  public keys: string[];
  public apiUrl: string;
  private currentKeyIndex: number;

  constructor(
    keys: string | string[],
    apiUrl = "https://generativelanguage.googleapis.com",
  ) {
    if (typeof keys === 'string') {
      this.keys = [keys];
    } else {
      this.keys = keys;
    }
    this.apiUrl = apiUrl;
    this.currentKeyIndex = 0;
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
      };
      const data = JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional, authentic translation engine, only returns translations.`,
              },
              {
                text: `Please translate the text from ${source} to ${target} language,Translation will be enclosed within <start></end> tags, and they should not be included in the output.`,
              },
              {
                text: `<start>${text}</end>`,
              },
            ],
          },
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      });
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
      const response = await axios.post(
        `${this.apiUrl}/v1beta/models/gemini-pro:generateContent?key=${this.keys[this.currentKeyIndex]}`,
        data,
        { headers },
      );

      if (response.data.candidates && response.data.candidates[0].content) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error(
          "No translation result, no block reason, and no finish reason available",
        );
      }
    } catch (error) {
      throw new Error(`Error while translating: ${getErrorMessage(error)}`);
    }
  }
}

export const GeminiInstance = new Gemini(
  process.env.Gemini_API_KEY!.split(','),
  process.env.Gemini_API_ENDPOINT!
);