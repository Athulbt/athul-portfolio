import { access } from "node:fs/promises";
import path from "node:path";
import { GUIDE_POSES, MEDIA_FILES, type GuidePose, type MediaAsset, type MediaManifest } from "@/models/media.model";

const MEDIA_DIR = path.join(process.cwd(), "public", "media");

async function url(file: string): Promise<string | undefined> {
  try {
    await access(path.join(MEDIA_DIR, file));
    return `/media/${file}`;
  } catch {
    return undefined;
  }
}

async function poseAsset(pose: GuidePose): Promise<MediaAsset | undefined> {
  for (const file of MEDIA_FILES.guidePose(pose)) {
    const src = await url(file);
    if (src) return { src, kind: file.endsWith(".mp4") ? "video" : "image" };
  }
  return undefined;
}

/** Checks which media files are present in /public/media. */
export async function getMediaManifest(): Promise<MediaManifest> {
  const assets = await Promise.all(GUIDE_POSES.map(async (pose) => [pose, await poseAsset(pose)] as const));

  const [base, hand, visor] = await Promise.all([
    url(MEDIA_FILES.live.base),
    url(MEDIA_FILES.live.hand),
    url(MEDIA_FILES.live.visor),
  ]);

  return {
    live: base && hand && visor ? { base, hand, visor } : undefined,
    cityVideo: await url(MEDIA_FILES.cityVideo),
    cityStill: await url(MEDIA_FILES.cityStill),
    guidePortrait: await url(MEDIA_FILES.guidePortrait),
    guide: Object.fromEntries(assets.filter(([, a]) => a)),
  };
}
