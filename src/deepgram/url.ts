import { DEEPGRAM_PROXY } from "../config";

export function makeUrl(sourceLanguage: string): string {
  let params: { [key: string]: string } = {
    punctuate: "true",
    filler_words: "true",
    interim_results: "true",
    language: sourceLanguage,
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
  const deepgramUrl: string = `${DEEPGRAM_PROXY}/v1/listen?${queryString}`;

  return deepgramUrl;
}

export const supportedLanguages = new Map<string, string>([
  ["zh", "Chinese"],
  ["zh-CN", "Chinese (China)"],
  ["zh-TW", "Chinese (Taiwan)"],
  ["da", "Danish"],
  ["nl", "Dutch"],
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
  ["id", "Indonesian"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["no", "Norwegian"],
  ["pl", "Polish"],
  ["pt", "Portuguese"],
  ["pt-BR", "Portuguese (Brazil)"],
  ["ru", "Russian"],
  ["es", "Spanish"],
  ["es-419", "Spanish (Latin America and Caribbean)"],
  ["sv", "Swedish"],
  ["taq", "Tamasheq"],
  ["ta", "Tamil"],
  ["tr", "Turkish"],
  ["uk", "Ukrainian"],
]);
