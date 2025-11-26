export {};

declare global {
  interface MediaTrackConstraintSet {
    torch?: boolean;
    zoom?: number;
  }

  interface MediaTrackCapabilities {
    torch?: boolean;
    zoom?: {
      min: number;
      max: number;
      step?: number;
    };
  }

  interface MediaTrackSettings {
    torch?: boolean;
    zoom?: number;
  }
}
