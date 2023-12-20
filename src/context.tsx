import React, { createContext, useState, useRef, RefObject } from "react";
import { Transcriber } from "./transcript";
import { ScreenManager } from "./fullscreen";

interface Props {
  children: React.ReactNode;
}

export type ctx = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;

  startStreaming: (
    sourceLang: string,
    targetLang: string,
    setMsg: (_: string) => void,
    sourceLang2: string,
    targetLang2: string,
    setMsg2: (_: string) => void,
    deepgramToken: string,
    deeplToken: string,
    useDeepLPro: boolean
  ) => void;
  stopStreaming: () => void;

  screenManager: ScreenManager;
  appRef: RefObject<HTMLDivElement>;

  speakerAdded: boolean;
  setSpeakerAdded: (_: boolean) => void;

  settingsShown: boolean;
  setSettingsShown: (_: boolean) => void;

  deeplToken: string;
  setDeepLToken: (token: string) => void;
  deepgramToken: string;
  setDeepgramToken: (token: string) => void;
  useDeepLPro: boolean;
  setUseDeepLPro: (usePro: boolean) => void;
};

export const StreamingContext = createContext<ctx | null>(null);

export const StreamingProvider: React.FC<Props> = ({ children }) => {
  const [transcriber, setTranscriber] = useState<Transcriber | null>(null);
  const [transcriber2, setTranscriber2] = useState<Transcriber | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [speakerAdded, setSpeakerAdded] = useState<boolean>(false);
  const [settingsShown, setSettingsShown] = useState<boolean>(false);

  const [deeplToken, setDeepLToken] = useState("");
  const [deepgramToken, setDeepgramToken] = useState("");
  const [useDeepLPro, setUseDeepLPro] = useState(false);

  const startStreaming = (
    sourceLanguage: string,
    targetLanguage: string,
    setMsg: (_: string) => void,
    sourceLanguage2: string,
    targetLanguage2: string,
    setMsg2: (_: string) => void,
    deepgramToken: string,
    deeplToken: string,
    useDeepLPro: boolean
  ) => {
    if (active) {
      return;
    }
    if (!transcriber) {
      const newTranscriber = new Transcriber(
        sourceLanguage,
        targetLanguage,
        setMsg,
        deepgramToken,
        deeplToken,
        useDeepLPro
      );
      setTranscriber(newTranscriber);
      newTranscriber.start();
    }

    if (speakerAdded && !transcriber2) {
      const newTranscriber = new Transcriber(
        sourceLanguage2,
        targetLanguage2,
        setMsg2,
        deepgramToken,
        deeplToken,
        useDeepLPro
      );
      setTranscriber2(newTranscriber);
      newTranscriber.start();
    }

    setActive(true);
  };

  const stopStreaming = () => {
    if (transcriber) {
      transcriber.stopped = true;
      transcriber.clearForRestart();
      setTranscriber(null);
    }

    if (transcriber2) {
      transcriber2.stopped = true;
      transcriber2.clearForRestart();
      setTranscriber2(null);
    }

    setActive(false);
  };

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isFullScreenSupported, setIsFullScreenSupported] =
    useState<boolean>(false);

  const appRef = useRef<HTMLDivElement>(null);

  const screenManager = new ScreenManager(
    appRef,
    isFullScreen,
    setIsFullScreen,
    isFullScreenSupported,
    setIsFullScreenSupported
  );

  return (
    <StreamingContext.Provider
      value={{
        startStreaming,
        stopStreaming,
        active,
        setActive,
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
      }}
    >
      {children}
    </StreamingContext.Provider>
  );
};
