// Site media: city backdrop and guide avatar poses (images or Higgsfield-style clips). Drop files into
// /public/media with these names and the site picks them up on the next build.
// For each guide pose a video (.mp4) wins over a still image (.jpg).

export type GuidePose = "wave" | "point" | "talk" | "laugh" | "laptop" | "thumbs";

export const GUIDE_POSES: GuidePose[] = ["wave", "point", "talk", "laugh", "laptop", "thumbs"];

export const MEDIA_FILES = {
  cityVideo: "city-loop.mp4",
  cityStill: "city-still.jpg",
  guidePortrait: "guide-portrait.jpg",
  // Cinemagraph layers for the portrait: background-patched base, cut-out hand, visor mask
  live: { base: "guide-portrait-base.jpg", hand: "guide-portrait-hand.png", visor: "guide-portrait-visor.png" },
  guidePose: (pose: GuidePose) => [`guide-${pose}.mp4`, `guide-${pose}.jpg`],
};

export interface MediaAsset {
  src: string;
  kind: "video" | "image";
}

/** The media files that actually exist (missing ones are undefined). */
export interface MediaManifest {
  cityVideo?: string;
  cityStill?: string;
  guidePortrait?: string;
  live?: { base: string; hand: string; visor: string };
  guide: Partial<Record<GuidePose, MediaAsset>>;
}

/** Where the cut-out hand sits on the portrait (percent of the image box) and its wrist pivot. */
export const LIVE_LAYOUT = {
  aspect: 431 / 975,
  hand: { left: 4.18, top: 25.85, width: 24.13, height: 10.26, originX: 0.385, originY: 0.98 },
};
