import axios from "axios";

export type TranslateResult = {
  chatgpt: string;
  chatgpt4: string;
  gemini: string;
  qwen: string;
  claude: string;
  glm: string;
  deeplx: string;
  microsoft: string;
  google: string;
  transmart: string;
  niutrans: string;
  baidu: string;
};

export type Translateloader = {
  translate: boolean;
  chatgpt: boolean;
  chatgpt4: boolean;
  gemini: boolean;
  qwen: boolean;
  claude: boolean;
  glm: boolean;
  deeplx: boolean;
  microsoft: boolean;
  google: boolean;
  transmart: boolean;
  niutrans: boolean;
  baidu: boolean;
};

export type TranslateResponse = {
  status: boolean;
  message: string;
  source: string;
  data: string;
};

export const initializeTranslateState: TranslateResult = {
  chatgpt: "",
  chatgpt4: "",
  gemini: "",
  qwen: "",
  claude: "",
  glm: "",
  deeplx: "",
  microsoft: "",
  google: "",
  transmart: "",
  niutrans: "",
  baidu: "",
};

export const initializeTranslateloader: Translateloader = {
  translate: false,
  chatgpt: false,
  chatgpt4: false,
  gemini: false,
  qwen: false,
  claude: false,
  glm: false,
  deeplx: false,
  microsoft: false,
  google: false,
  transmart: false,
  niutrans: false,
  baidu: false,
};

export async function translateContent(
  content: string,
  from: string,
  to: string,
  model: string,
): Promise<TranslateResponse> {
  try {
    return (
      await axios.post("/translate", {
        text: content,
        sourceLanguage: from,
        targetLanguage: to,
        model
      })
    ).data;
  } catch (e) {
    return {
      status: false,
      message: (e as Error).message || "unknown error",
      source: "",
      data: 'null',
    };
  }
}
