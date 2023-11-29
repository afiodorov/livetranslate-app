import { DEEPGRAM_PROXY } from "../config";

export function makeUrl(sourceLanguage: string): string {
  let params: { [key: string]: string } = {
    punctuate: "true",
    filler_words: "true",
    interim_results: "true",
    language: sourceLanguage,
    encoding: "opus",
  };

  const supportedLanguagesForNova: string[] = [
    "en",
    "en-US",
    "en-AU",
    "en-GB",
    "en-NZ",
    "en-IN",
    "fr",
    "fr-CA",
    "de",
    "hi",
    "hi-Latn",
    "pt",
    "pt-BR",
    "es",
    "es-419",
  ];
  const enhancedModelLanguages: string[] = [
    "da",
    "nl",
    "it",
    "ja",
    "ko",
    "no",
    "pl",
    "sv",
    "ta",
    "taq",
  ];

  if (supportedLanguagesForNova.includes(params["language"])) {
    params["tier"] = "nova";
    params["model"] = "2-general";
  } else if (enhancedModelLanguages.includes(params["language"])) {
    params["model"] = "enhanced";
  }

  const queryString: string = new URLSearchParams(params).toString();
  const deepgramUrl: string = `ws://${DEEPGRAM_PROXY}/v1/listen?${queryString}`;

  return deepgramUrl;
}

export const supportedLanguages = new Map<string, string>([
  ["en", "English"],
  ["en-US", "English (United States)"],
  ["en-AU", "English (Australia)"],
  ["en-GB", "English (United Kingdom)"],
  ["en-NZ", "English (New Zealand)"],
  ["en-IN", "English (India)"],
  ["fr", "French"],
  ["fr-CA", "French (Canada)"],
  ["de", "German"],
  ["hi", "Hindi"],
  ["hi-Latn", "Hindi (Latin)"],
  ["pt", "Portuguese"],
  ["pt-BR", "Portuguese (Brazil)"],
  ["es", "Spanish"],
  ["es-419", "Spanish (Latin America and Caribbean)"],
  ["da", "Danish"],
  ["nl", "Dutch"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["no", "Norwegian"],
  ["pl", "Polish"],
  ["sv", "Swedish"],
  ["ta", "Tamil"],
  ["taq", "Tamasheq"],
  ["zh", "Chinese"],
  ["zh-CN", "Chinese (China)"],
  ["zh-TW", "Chinese (Taiwan)"],
  ["id", "Indonesian"],
  ["ru", "Russian"],
  ["tr", "Turkish"],
  ["uk", "Ukrainian"],
]);
