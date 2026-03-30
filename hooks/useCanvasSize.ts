"use client";

import { useEffect, useRef, useState } from "react";

export function useCanvasSize(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        setSize({ width: canvas.width, height: canvas.height });
      }
    });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef]);

  return size;
}
