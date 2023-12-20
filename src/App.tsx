import "./App.css";
import { useContext, useState, useEffect } from "react";
import { ctx, StreamingContext } from "./context";
import LanguageSelector from "./selector";
import { SettingsForm, useInit } from "./settings";

function App() {
  const [msg, setMsg] = useState("...");
  const [msg2, setMsg2] = useState("...");
  const [sourceLanguage, setSourceLanguage] = useState<string>("es");
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [sourceLanguage2, setSourceLanguage2] = useState<string>("es");
  const [targetLanguage2, setTargetLanguage2] = useState<string>("");
  const {
    startStreaming,
    stopStreaming,
    active,
    screenManager,
    appRef,
    speakerAdded,
    setSpeakerAdded,
    settingsShown,
    setSettingsShown,
    deeplToken,
    setDeepLToken,
    deepgramToken,
    setDeepgramToken,
    useDeepLPro,
    setUseDeepLPro,
  } = useContext(StreamingContext) as ctx;

  useEffect(() => {
    screenManager.setIsFullScreenSupported(
      document?.documentElement?.requestFullscreen !== undefined
    );
  }, [screenManager]);

  useInit(setDeepLToken, setDeepgramToken, setUseDeepLPro);

  return (
    <div className="App">
      <img src="logo.jpg" alt="LiveTranslate" />
      <LanguageSelector
        sourceLanguage={sourceLanguage}
        setSourceLanguage={setSourceLanguage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
        deeplToken={deeplToken}
      />

      {speakerAdded && (
        <div style={{ margin: "8px" }}>
          <LanguageSelector
            sourceLanguage={sourceLanguage2}
            setSourceLanguage={setSourceLanguage2}
            targetLanguage={targetLanguage2}
            setTargetLanguage={setTargetLanguage2}
            deeplToken={deeplToken}
          />
        </div>
      )}

      {active ? (
        <button onClick={stopStreaming}>Stop</button>
      ) : (
        <button
          onClick={() =>
            startStreaming(
              sourceLanguage,
              targetLanguage,
              setMsg,
              sourceLanguage2,
              targetLanguage2,
              setMsg2,
              deepgramToken,
              deeplToken,
              useDeepLPro
            )
          }
          disabled={!deepgramToken}
        >
          LiveTranslate 🎤
        </button>
      )}
      {screenManager.isFullScreenSupported && (
        <button onClick={screenManager.goFullScreen}>Fullscreen ⛶</button>
      )}
      {speakerAdded ? (
        <button onClick={() => setSpeakerAdded(false)} disabled={active}>
          Remove Speaker 🧑
        </button>
      ) : (
        <button onClick={() => setSpeakerAdded(true)} disabled={active}>
          Add Speaker 🧑
        </button>
      )}
      <button onClick={() => setSettingsShown(!settingsShown)}>
        Settings ⚙️
      </button>
      <div
        ref={appRef}
        style={{ display: screenManager.isFullScreen ? "flex" : "none" }}
        className={screenManager.isFullScreen ? "fullScreenDiv" : ""}
      >
        {speakerAdded && <span className="fullScreenText">{msg2}</span>}
        <span className="fullScreenText">{msg}</span>
      </div>
      {settingsShown && (
        <SettingsForm
          deeplToken={deeplToken}
          setDeepLToken={setDeepLToken}
          deepgramToken={deepgramToken}
          setDeepgramToken={setDeepgramToken}
          useDeepLPro={useDeepLPro}
          setUseDeepLPro={setUseDeepLPro}
        />
      )}
      {speakerAdded && <p className="sub-top">{msg2}</p>}
      <p className="sub-bottom">{msg}</p>
    </div>
  );
}

export default App;
