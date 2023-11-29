import "./App.css";
import { useContext, useState, useEffect } from "react";
import { supportedLanguages } from "./deepgram/url";
import { ctx, StreamingContext } from "./context";
import { supportedPairs, displayName, extractCode } from "./translate";

function App() {
  const [msg, setMsg] = useState("Starting Text");
  const [sourceLanguage, setSourceLanguage] = useState<string>("es");
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [targetOptions, setTargetOptions] = useState<Array<string | null>>([]);
  const { startStreaming, stopStreaming, active } = useContext(
    StreamingContext
  ) as ctx;

  // Update target options when source language changes
  useEffect(() => {
    const targets = supportedPairs.get(extractCode(sourceLanguage)) || [];
    setTargetOptions(targets);
    setTargetLanguage(targets[0] || ""); // Set default target language
  }, [sourceLanguage]);

  const languageOptions = Array.from(supportedLanguages.entries()).map(
    ([code, name]) => (
      <option key={code} value={code}>
        {name}
      </option>
    )
  );

  // Create language options for the target language dropdown
  const targetLanguageOptions = targetOptions.map((code) => (
    <option key={code} value={code || ""}>
      {displayName.get(code)}
    </option>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <img src="logo.jpg" alt="LiveTranslate" />
        <label htmlFor="language-select">From Language</label>
        <select
          id="language-select"
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
        >
          {languageOptions}
        </select>

        <label htmlFor="target-language-select">To Language</label>
        <select
          id="target-language-select"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          {targetLanguageOptions}
        </select>

        {active ? (
          <button onClick={stopStreaming}>Stop</button>
        ) : (
          <button
            onClick={() =>
              startStreaming(sourceLanguage, targetLanguage, setMsg)
            }
          >
            Start
          </button>
        )}
      </header>
      <p>{msg}</p>
    </div>
  );
}

export default App;
