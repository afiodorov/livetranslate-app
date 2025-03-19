import { ResponseData } from "./deepgram/response";
import { makeUrl } from "./deepgram/url";
import { AsyncQueue } from "./queue";
import { translate, extractCode } from "./translate";
import { FixedSizeQueue } from "./fixed_queue";

export class Transcriber {
  private sourceLanguage: string;
  private targetLanguage: string | null;
  private setMsg: (msg: string) => void;
  private queue: AsyncQueue | null = null;
  private contextQueue = new FixedSizeQueue<string>();
  public stopped: boolean = false;

  private _recorder: MediaRecorder | null;
  private _ws: WebSocket | null;

  private onDataAvailableHandler: (_: BlobEvent) => void;
  private onMessageHandler: (_: MessageEvent) => void;
  private onErrorHandler: (_: Event) => void;
  private onCloseHandler: (_: Event) => void;

  private lag: number;

  private deepgramToken: string;
  private deeplToken: string;
  private useDeepLPro: boolean;

  constructor(
    sourceLanguage: string,
    targetLanguage: string,
    setMsg: (msg: string) => void,
    deepgramToken: string,
    deeplToken: string,
    useDeepLPro: boolean,
  ) {
    this.sourceLanguage = sourceLanguage;
    this.targetLanguage = targetLanguage || null;
    this.setMsg = setMsg;

    this._recorder = null;
    this._ws = null;

    this.onDataAvailableHandler = this.onDataAvailable.bind(this);
    this.onMessageHandler = this.onMessage.bind(this);
    this.onErrorHandler = this.onError.bind(this);
    this.onCloseHandler = this.onClose.bind(this);
    this.lag = 100; // start with 100ms lag

    this.deepgramToken = deepgramToken;
    this.deeplToken = deeplToken;
    this.useDeepLPro = useDeepLPro;
  }

  onDataAvailable(event: BlobEvent) {
    if (this._ws && this._ws.readyState === WebSocket.OPEN && event.data) {
      this._ws.send(event.data);
    }
  }

  onClose(_: Event) {
    this.clearForRestart();
    console.log("WebSocket connection closed");
    if (!this.stopped) {
      console.log("restarting");
      if (this.lag < 1_000) {
        this.lag = 1_000;
      } else if (this.lag < 1_500) {
        this.lag = 1_500;
      }

      this.start();
    }
  }

  onError(event: Event) {
    console.error("WebSocket error:", event);
  }

  onMessage(event: MessageEvent) {
    let res: ResponseData;
    try {
      res = JSON.parse(event.data);
    } catch (error) {
      console.error("Error parsing JSON:", error);

      return;
    }

    const transcript: string = res.channel?.alternatives?.[0]?.transcript ?? "";
    if (!res.channel) {
      console.log("Unexpected res", JSON.stringify(res));
      return;
    }

    if (!transcript) {
      console.log("No transcript found");
      return;
    }

    if (res.is_final) {
      this.contextQueue.enqueue(transcript);
    }

    if (this.queue && this.targetLanguage) {
      const targetLang = this.targetLanguage;

      this.queue.enqueue(async () => {
        const translation = await translate(
          transcript,
          extractCode(this.sourceLanguage),
          targetLang,
          this.contextQueue.toArray().join(" "),
          this.deeplToken,
          this.useDeepLPro,
        );
        if (translation) {
          this.setMsg(translation);
        }
      });
    } else {
      this.setMsg(transcript);
    }
  }

  async start() {
    let stream;
    const constraints = { video: false, audio: true };

    if (this.targetLanguage) {
      this.queue = new AsyncQueue();
    }

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Check if this is likely Safari on iOS
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;

      if (isIOS) {
        this.setMsg(
          "⚠️ iOS requires HTTPS for microphone access. Please use a secure connection.",
        );
      } else {
        this.setMsg("⚠️ Your browser doesn't support microphone access");
      }

      return; // Exit without trying to access media
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      if (error instanceof Error) {
        // Handle common permission errors with user-friendly messages
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          this.setMsg(
            "⚠️ Microphone permission denied. Please allow microphone access.",
          );
        } else if (error.name === "NotFoundError") {
          this.setMsg(
            "⚠️ No microphone found. Please connect a microphone and try again.",
          );
        } else if (error.name === "NotReadableError") {
          this.setMsg("⚠️ Microphone is in use by another application.");
        } else {
          this.setMsg(`⚠️ Microphone error: ${error.message}`);
        }

        console.error(`
          MediaDevices.getUserMedia() threw an error.
          Stream did not open.
          ${error.name} -
          ${error.message}
        `);
        return; // Exit without proceeding further
      } else {
        this.setMsg("⚠️ An unknown error occurred accessing the microphone");
        console.error("An unknown error occurred in getUserMedia");
        return; // Exit without proceeding further
      }
    }

    const deepgramUrl = makeUrl(this.sourceLanguage, this.deepgramToken);
    this._ws = new WebSocket(deepgramUrl, ["token", this.deepgramToken]);

    await new Promise((resolve) => {
      if (this._ws) {
        this._ws.onopen = resolve;
      }
    });

    this._recorder = new MediaRecorder(stream);

    this._recorder.addEventListener(
      "dataavailable",
      this.onDataAvailableHandler,
    );

    this._ws.onmessage = this.onMessageHandler;
    this._ws.onerror = this.onErrorHandler;
    this._ws.onclose = this.onCloseHandler;

    this._recorder.start(this.lag);
  }

  clearForRestart() {
    if (this._ws) {
      this._ws.removeEventListener("message", this.onMessageHandler);
      this._ws.removeEventListener("error", this.onErrorHandler);
      this._ws.removeEventListener("close", this.onCloseHandler);
      this._ws.close();
      this._ws = null;
    }

    if (this._recorder && this._recorder.stream) {
      this._recorder.stream.getTracks().forEach((track) => track.stop());
    }

    if (this._recorder) {
      this._recorder.removeEventListener(
        "dataavailable",
        this.onDataAvailableHandler,
      );
      this._recorder.stop();
      this._recorder = null;
    }

    if (this.queue) {
      this.queue.terminate();
    }

    this.contextQueue.clear();
  }
}
