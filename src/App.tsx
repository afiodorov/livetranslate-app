import "./App.css";
import { useContext, useState, useEffect } from "react";
import { ctx, StreamingContext } from "./context";
import LanguageSelector from "./selector";
import { SettingsForm, useInit } from "./settings";

// Fullscreen component to handle fullscreen content
const FullscreenContent = ({
  isFullScreen,
  speakerAdded,
  msg,
  msg2,
  onExit,
}: {
  isFullScreen: boolean;
  speakerAdded: boolean;
  msg: string;
  msg2: string;
  onExit: () => void;
}) => {
  // Only show content when in fullscreen mode
  if (!isFullScreen) return null;

  // Check if we're on iOS (for special exit button)
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fullScreenDiv" style={{ display: "flex" }}>
      {speakerAdded && <span className="fullScreenText">{msg2}</span>}
      <span className="fullScreenText">{msg}</span>

      {/* iOS-specific exit button */}
      {isIOS && (
        <button
          className="exit-fullscreen-button"
          onClick={onExit}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
          }}
        >
          ❌ Exit
        </button>
      )}
    </div>
  );
};

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
    // Always enable fullscreen button regardless of device
    screenManager.setIsFullScreenSupported(true);
  }, [screenManager]);

  useInit(setDeepLToken, setDeepgramToken, setUseDeepLPro);

  // Determine if we should show or hide UI based on fullscreen state
  const showMainUI = !screenManager.isFullScreen;

  return (
    <div className="App">
      {/* Only show main UI when not in fullscreen */}
      {showMainUI && (
        <>
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
            <button
              onClick={() => {
                stopStreaming();
                // Reset message displays after stopping
                setMsg("...");
                setMsg2("...");
              }}
            >
              Stop
            </button>
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
                  useDeepLPro,
                )
              }
              disabled={!deepgramToken}
            >
              LiveTranslate 🎤
            </button>
          )}
          {screenManager.isFullScreenSupported && (
            <button
              onClick={screenManager.goFullScreen}
              className="fullscreen-button"
            >
              Fullscreen ⛶
            </button>
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
        </>
      )}

      {/* Fullscreen content with React component */}
      <div
        ref={appRef}
        style={{ display: screenManager.isFullScreen ? "block" : "none" }}
      >
        <FullscreenContent
          isFullScreen={screenManager.isFullScreen}
          speakerAdded={speakerAdded}
          msg={msg}
          msg2={msg2}
          onExit={() => screenManager.goFullScreen()}
        />
      </div>
    </div>
  );
}

export default App;
