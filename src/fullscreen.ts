import { RefObject } from "react";
export class ScreenManager {
  private wakeLock: WakeLockSentinel | null = null;
  private isFullScreenChangeListenerAdded = false;

  public isFullScreen: boolean;
  private setIsFullScreen: (_: boolean) => void;
  public isFullScreenSupported: boolean;
  public setIsFullScreenSupported: (_: boolean) => void;

  constructor(
    private appRef: RefObject<HTMLDivElement>,
    isFullScreen: boolean,
    setIsFullScreen: (_: boolean) => void,
    isFullScreenSupported: boolean,
    setIsFullScreenSupported: (_: boolean) => void
  ) {
    this.isFullScreen = isFullScreen;
    this.setIsFullScreen = setIsFullScreen;
    this.isFullScreenSupported = isFullScreenSupported;
    this.setIsFullScreenSupported = setIsFullScreenSupported;
  }

  async requestWakeLock() {
    if ("wakeLock" in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request("screen");
        console.log("Wake Lock is active");
      } catch (err) {
        console.error(`Failed to acquire wake lock: ${err}`);
      }
    }
  }

  async releaseWakeLock() {
    if (this.wakeLock) {
      await this.wakeLock.release();
      this.wakeLock = null;
      console.log("Wake Lock was released");
    }
  }

  private wakeLockListener = async () => {
    if (this.wakeLock !== null && document.visibilityState === "visible") {
      await this.requestWakeLock();
    }
  };

  handleFullScreenChange = async () => {
    const isCurrentlyFullScreen =
      document.fullscreenElement === this.appRef.current;
    this.setIsFullScreen(isCurrentlyFullScreen);

    if (isCurrentlyFullScreen) {
      await this.requestWakeLock();
      document.addEventListener("visibilitychange", this.wakeLockListener);
    } else {
      document.removeEventListener("visibilitychange", this.wakeLockListener);
      await this.releaseWakeLock();
    }
  };

  goFullScreen = () => {
    if (this.appRef.current) {
      if (this.appRef.current.requestFullscreen) {
        this.setIsFullScreen(true);
        this.appRef.current.requestFullscreen();
      }

      if (!this.isFullScreenChangeListenerAdded) {
        document.addEventListener(
          "fullscreenchange",
          this.handleFullScreenChange
        );
        this.isFullScreenChangeListenerAdded = true;
      }
    }
  };
}
