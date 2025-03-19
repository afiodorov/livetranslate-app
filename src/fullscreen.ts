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
    setIsFullScreenSupported: (_: boolean) => void,
  ) {
    this.isFullScreen = isFullScreen;
    this.setIsFullScreen = setIsFullScreen;
    this.isFullScreenSupported = true; // Force enable for all devices
    this.setIsFullScreenSupported = setIsFullScreenSupported;
  }

  // Detect if device is mobile (phone)
  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }

  // Set screen orientation to landscape if mobile
  async setLandscapeOrientation() {
    if (this.isMobileDevice() && window.screen && window.screen.orientation) {
      try {
        await window.screen.orientation.lock("landscape");
        console.log("Screen orientation locked to landscape");
      } catch (err) {
        console.error(`Failed to lock orientation: ${err}`);
      }
    }
  }

  // Reset screen orientation
  async resetOrientation() {
    if (this.isMobileDevice() && window.screen && window.screen.orientation) {
      try {
        await window.screen.orientation.unlock();
        console.log("Screen orientation unlocked");
      } catch (err) {
        console.error(`Failed to unlock orientation: ${err}`);
      }
    }
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
    // Detect iOS devices
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // For non-iOS devices, check actual fullscreen state
    if (!isIOS) {
      const isCurrentlyFullScreen =
        document.fullscreenElement === this.appRef.current;
      this.setIsFullScreen(isCurrentlyFullScreen);

      if (isCurrentlyFullScreen) {
        await this.requestWakeLock();
        await this.setLandscapeOrientation();
        document.addEventListener("visibilitychange", this.wakeLockListener);
      } else {
        document.removeEventListener("visibilitychange", this.wakeLockListener);
        await this.resetOrientation();
        await this.releaseWakeLock();
      }
    }
    // For iOS, we're not triggering the fullscreenchange event,
    // so this handler won't run automatically
  };

  exitIOSFullscreen() {
    this.setIsFullScreen(false);
    this.resetOrientation();
  }

  goFullScreen = async () => {
    if (this.appRef.current) {
      // Check if already in fullscreen - if so, exit
      if (this.isFullScreen) {
        // For iOS, handle exiting our fake fullscreen
        const isIOS =
          /iPad|iPhone|iPod/.test(navigator.userAgent) &&
          !(window as any).MSStream;
        if (isIOS) {
          this.exitIOSFullscreen();
        } else if (document.exitFullscreen) {
          // For other browsers, use standard API
          document.exitFullscreen();
        }
        return;
      }

      // Detect iOS devices
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;

      if (isIOS) {
        // For iOS, we can't use real fullscreen but we can fake it
        this.setIsFullScreen(true);

        // Force screen to landscape orientation
        await this.setLandscapeOrientation();
      } else if (this.appRef.current.requestFullscreen) {
        // Standard fullscreen for other browsers
        await this.appRef.current.requestFullscreen();
        this.setIsFullScreen(true);
      }

      if (!this.isFullScreenChangeListenerAdded) {
        document.addEventListener(
          "fullscreenchange",
          this.handleFullScreenChange,
        );
        this.isFullScreenChangeListenerAdded = true;
      }
    }
  };
}
