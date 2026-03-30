import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Pad number to 3 digits: 1 → "001" */
export function padFrame(n: number): string {
  return String(n).padStart(3, "0");
}

/** Build a list of public paths for a frame sequence */
export function buildSequenceUrls(basePath: string, total: number): string[] {
  return Array.from({ length: total }, (_, i) => `${basePath}${padFrame(i + 1)}.jpg`);
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Convert scroll progress [0,1] to frame index */
export function getFrameIndex(progress: number, totalFrames: number): number {
  return Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
}
