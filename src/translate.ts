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

  const url = `http://${DEEPL_PROXY}/v2/translate`;

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
  ["de", [null, "en", "es", "fr", "ja", "it", "pl", "nl", "zh", "ru", "pt"]],
  ["en", [null, "es", "de", "fr", "ja", "it", "pl", "nl", "zh", "ru", "pt"]],
  ["es", [null, "en", "de", "fr", "ja", "it", "pl", "nl", "zh", "ru", "pt"]],
  ["fr", [null, "en", "de", "es", "ja", "it", "pl", "nl", "zh", "ru", "pt"]],
  ["it", [null, "en", "de", "es", "fr", "ja", "pl", "nl", "zh", "ru", "pt"]],
  ["ja", [null, "en", "de", "es", "fr", "it", "pl", "nl", "zh", "ru", "pt"]],
  ["nl", [null, "en", "de", "es", "fr", "ja", "it", "pl", "zh", "ru", "pt"]],
  ["pl", [null, "en", "de", "es", "fr", "ja", "it", "nl", "zh", "ru", "pt"]],
  ["pt", [null, "en", "de", "es", "fr", "ja", "it", "pl", "nl", "zh", "ru"]],
  ["ru", [null, "en", "de", "es", "fr", "ja", "it", "pl", "nl", "zh", "pt"]],
  ["zh", [null, "en", "de", "es", "fr", "ja", "it", "pl", "nl", "ru", "pt"]],
]);

export const displayName = new Map<string | null, string>([
  [null, "Transcription"],
  ["de", "German"],
  ["en", "English"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["nl", "Dutch"],
  ["pl", "Polish"],
  ["pt", "Portuguese"],
  ["ru", "Russian"],
  ["zh", "Chinese"],
]);
