import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface SettingsFormProps {
  deeplToken: string;
  setDeepLToken: (token: string) => void;
  deepgramToken: string;
  setDeepgramToken: (token: string) => void;
  useDeepLPro: boolean;
  setUseDeepLPro: (usePro: boolean) => void;
}

export const useInit = (
  setDeepLToken: (_: string) => void,
  setDeepgramToken: (_: string) => void,
  setUseDeepLPro: (_: boolean) => void,
) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Initialize state from URL parameters
    const deeplTokenParam = searchParams.get("deeplToken");
    const deepgramTokenParam = searchParams.get("deepgramToken");
    const useDeepLProParam = searchParams.get("useDeeplPro") === "true";

    if (deeplTokenParam) setDeepLToken(deeplTokenParam);
    if (deepgramTokenParam) setDeepgramToken(deepgramTokenParam);
    setUseDeepLPro(useDeepLProParam);
  }, [searchParams, setDeepLToken, setDeepgramToken, setUseDeepLPro]);
};

export const SettingsForm: React.FC<SettingsFormProps> = ({
  deeplToken,
  setDeepLToken,
  deepgramToken,
  setDeepgramToken,
  useDeepLPro,
  setUseDeepLPro,
}) => {
  const [, setSearchParams] = useSearchParams();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Update URL without reloading the page
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("deeplToken", deeplToken);
    newSearchParams.set("deepgramToken", deepgramToken);
    newSearchParams.set("useDeeplPro", useDeepLPro.toString());
    setSearchParams(newSearchParams);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Deepgram API Key
        <input
          style={{ margin: "8px" }}
          type="text"
          value={deepgramToken}
          onChange={(e) => setDeepgramToken(e.target.value)}
        />
      </label>
      <br />
      <label>
        DeepL API Key
        <input
          style={{ margin: "8px" }}
          type="text"
          value={deeplToken}
          onChange={(e) => setDeepLToken(e.target.value)}
        />
      </label>
      <label>
        Use DeepL Pro
        <input
          type="checkbox"
          checked={useDeepLPro}
          onChange={(e) => setUseDeepLPro(e.target.checked)}
        />
      </label>
      <br />
      <button type="submit">Save 💾</button>
    </form>
  );
};
