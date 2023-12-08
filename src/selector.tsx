import React, { useState, useEffect } from "react";
import { supportedPairs, displayName, extractCode } from "./translate";
import { supportedLanguages } from "./deepgram/url";

type LanguageSelectorProps = {
  sourceLanguage: string;
  setSourceLanguage: (language: string) => void;
  targetLanguage: string;
  setTargetLanguage: (language: string) => void;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
}) => {
  const [targetOptions, setTargetOptions] = useState<Array<string | null>>([]);

  useEffect(() => {
    const targets = supportedPairs.get(extractCode(sourceLanguage)) || [null];
    setTargetOptions(targets);
    setTargetLanguage(targets[0] || "");
  }, [sourceLanguage, setTargetLanguage]);

  const languageOptions = Array.from(supportedLanguages.entries()).map(
    ([code, name]) => (
      <option key={code} value={code}>
        {name}
      </option>
    )
  );

  const targetLanguageOptions = targetOptions.map((code) => (
    <option key={code} value={code || ""}>
      {displayName.get(code)}
    </option>
  ));

  return (
    <div>
      <select
        id="language-select"
        value={sourceLanguage}
        onChange={(e) => setSourceLanguage(e.target.value)}
      >
        {languageOptions}
      </select>
      <label htmlFor="target-language-select">to</label>
      <select
        id="target-language-select"
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
      >
        {targetLanguageOptions}
      </select>
    </div>
  );
};

export default LanguageSelector;
