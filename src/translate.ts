import { DEEPL_PROXY } from "./config";

export function extractCode(language: string): string {
  return language.split("-")[0];
}

export async function translate(
  text: string,
  sourceLang: string,
  targetLang: string,
  context: string
): Promise<string> {
  const payload = {
    text: [text],
    source_lang: sourceLang,
    target_lang: targetLang,
    context: context,
  };

  const url = `${DEEPL_PROXY}/v2/translate`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
      return "";
    }

    const result = await response.json();
    const translatedText: string = result.translations[0].text;
    return translatedText;
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return "";
  }
}

export const supportedPairs = new Map<string, Array<string | null>>([
  ["de", [null, "zh", "nl", "en", "fr", "it", "ja", "pl", "pt", "ru", "es"]],
  ["en", [null, "zh", "nl", "fr", "de", "it", "ja", "pl", "pt", "ru", "es"]],
  ["es", [null, "zh", "nl", "en", "fr", "de", "it", "ja", "pl", "pt", "ru"]],
  ["fr", [null, "zh", "nl", "en", "de", "it", "ja", "pl", "pt", "ru", "es"]],
  ["it", [null, "zh", "nl", "en", "fr", "de", "ja", "pl", "pt", "ru", "es"]],
  ["ja", [null, "zh", "nl", "en", "fr", "de", "it", "pl", "pt", "ru", "es"]],
  ["nl", [null, "zh", "en", "fr", "de", "it", "ja", "pl", "pt", "ru", "es"]],
  ["pl", [null, "zh", "nl", "en", "fr", "de", "it", "ja", "pt", "ru", "es"]],
  ["pt", [null, "zh", "nl", "en", "fr", "de", "it", "ja", "pl", "ru", "es"]],
  ["ru", [null, "zh", "nl", "en", "fr", "de", "it", "ja", "pl", "pt", "es"]],
  ["zh", [null, "nl", "en", "fr", "de", "it", "ja", "pl", "pt", "ru", "es"]],
]);

export const displayName = new Map<string | null, string>([
  [null, "Transcription"],
  ["zh", "Chinese"],
  ["nl", "Dutch"],
  ["en", "English"],
  ["fr", "French"],
  ["de", "German"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["pl", "Polish"],
  ["pt", "Portuguese"],
  ["ru", "Russian"],
  ["es", "Spanish"],
]);
