"use client";

import { useEffect, useRef, useState } from "react";

// Module-level cache so images aren't re-fetched across re-renders
const imageCache = new Map<string, HTMLImageElement>();

export function useImagePreloader(urls: string[]): {
  images: HTMLImageElement[];
  loaded: boolean;
  progress: number;
} {
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const urlsRef = useRef(urls);

  useEffect(() => {
    if (urls.length === 0) return;

    const toLoad = urls.filter((u) => !imageCache.has(u));
    const cached = urls.filter((u) => imageCache.has(u));

    if (toLoad.length === 0) {
      setImages(urls.map((u) => imageCache.get(u)!));
      setProgress(1);
      setLoaded(true);
      return;
    }

    let loadedCount = cached.length;

    const allImages: HTMLImageElement[] = urls.map((u) => {
      if (imageCache.has(u)) return imageCache.get(u)!;
      const img = new Image();
      img.decoding = "async";
      imageCache.set(u, img);
      return img;
    });

    const onProgress = () => {
      loadedCount++;
      setProgress(loadedCount / urls.length);
      if (loadedCount >= urls.length) {
        setImages(allImages);
        setLoaded(true);
      }
    };

    toLoad.forEach((url) => {
      const img = imageCache.get(url)!;
      if (img.complete && img.naturalWidth > 0) {
        onProgress();
      } else {
        img.onload = onProgress;
        img.onerror = onProgress; // Don't block on error
        img.src = url;
      }
    });

    // Immediately update with whatever is already cached
    setProgress(cached.length / urls.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { images, loaded, progress };
}
