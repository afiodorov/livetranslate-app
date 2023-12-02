import "./App.css";
import { useContext, useState, useEffect, useRef } from "react";
import { supportedLanguages } from "./deepgram/url";
import { ctx, StreamingContext } from "./context";
import { supportedPairs, displayName, extractCode } from "./translate";

function App() {
  const appRef = useRef<HTMLDivElement>(null);

  const [msg, setMsg] = useState("...");
  const [sourceLanguage, setSourceLanguage] = useState<string>("es");
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [targetOptions, setTargetOptions] = useState<Array<string | null>>([]);
  const { startStreaming, stopStreaming, active } = useContext(
    StreamingContext
  ) as ctx;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFullScreenSupported, setIsFullScreenSupported] =
    useState<boolean>(false);

  useEffect(() => {
    setIsFullScreenSupported(
      document?.documentElement?.requestFullscreen !== undefined
    );
  }, []);

  // Update target options when source language changes
  useEffect(() => {
    const targets = supportedPairs.get(extractCode(sourceLanguage)) || [null];
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

  const handleFullScreenChange = () => {
    const isCurrentlyFullScreen = document.fullscreenElement === appRef.current;
    setIsFullScreen(isCurrentlyFullScreen);
  };

  const goFullScreen = () => {
    if (appRef.current) {
      if (appRef.current.requestFullscreen) {
        setIsFullScreen(true);
        appRef.current.requestFullscreen();
      }

      document.addEventListener("fullscreenchange", handleFullScreenChange);
    }
  };
  return (
    <div className="App">
      <img src="logo.jpg" alt="LiveTranslate" />
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

      {active ? (
        <button onClick={stopStreaming}>Stop</button>
      ) : (
        <button
          onClick={() => startStreaming(sourceLanguage, targetLanguage, setMsg)}
        >
          LiveTranslate 🎤
        </button>
      )}
      {isFullScreenSupported && (
        <button onClick={goFullScreen}>Go Fullscreen</button>
      )}
      <div
        ref={appRef}
        style={{ display: isFullScreen ? "block" : "none" }}
        className={isFullScreen ? "fullScreenDiv" : ""}
      >
        <span className="fullScreenText">{msg}</span>
      </div>
      <p>{msg}</p>
    </div>
  );
}

export default App;
