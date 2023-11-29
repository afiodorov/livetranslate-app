import React, { createContext, useState } from "react";
import { Transcriber } from "./transcript";

interface Props {
  children: React.ReactNode;
}

export type ctx = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;

  startStreaming: (
    sourceLang: string,
    targetLang: string,
    setMsg: (_: string) => void
  ) => void;
  stopStreaming: () => void;
};

export const StreamingContext = createContext<ctx | null>(null);

export const StreamingProvider: React.FC<Props> = ({ children }) => {
  const [transcriber, setTranscriber] = useState<Transcriber | null>(null);
  const [active, setActive] = useState(false);

  const startStreaming = (
    sourceLanguage: string,
    targetLanguage: string,
    setMsg: (_: string) => void
  ) => {
    if (!transcriber) {
      const newTranscriber = new Transcriber(
        sourceLanguage,
        targetLanguage,
        setMsg,
        setActive
      );
      setTranscriber(newTranscriber);
      newTranscriber.start();
      setActive(true);
    }
  };

  const stopStreaming = () => {
    if (transcriber) {
      transcriber.stop();
      setTranscriber(null);
      setActive(false);
    }
  };

  return (
    <StreamingContext.Provider
      value={{ startStreaming, stopStreaming, active, setActive }}
    >
      {children}
    </StreamingContext.Provider>
  );
};
