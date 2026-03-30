"use client";

import { useRef, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import { buildSequenceUrls, getFrameIndex } from "@/lib/utils";
import { SEQUENCE_2_PATH, SEQUENCE_2_TOTAL } from "@/lib/constants";
import { copy } from "@/lib/copy";

const urls = buildSequenceUrls(SEQUENCE_2_PATH, SEQUENCE_2_TOTAL);

export function PlaneMorph() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameRef = useRef<number>(-1);

  const { images, loaded } = useImagePreloader(urls);
  const progress = useScrollProgress(containerRef);
  useCanvasSize(canvasRef);

  const frameIndex = useTransform(progress, (p) =>
    getFrameIndex(p, SEQUENCE_2_TOTAL)
  );

  useEffect(() => {
    return frameIndex.on("change", (idx: number) => {
      if (!loaded || !canvasRef.current) return;
      if (idx === lastFrameRef.current) return;
      lastFrameRef.current = idx;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || !images[idx]) return;

      const img = images[idx];
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    });
  }, [frameIndex, images, loaded]);

  // Draw first frame on load
  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || !images[0]) return;
    const img = images[0];
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width || 1;
    const ih = img.naturalHeight || img.height || 1;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    lastFrameRef.current = 0;
  }, [loaded, images]);

  return (
    <section
      ref={containerRef}
      id="fleet"
      className="relative h-[400vh]"
      aria-label="Plane morph animation section"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        {/* Top fade */}
        <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-[#050505] to-transparent z-10" />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-[#050505]/20 z-10 pointer-events-none" />

        {/* Bottom fade */}
        <div className="absolute left-0 right-0 bottom-0 h-36 bg-gradient-to-t from-[#050505] to-transparent z-10" />

        {/* Text overlay */}
        <div className="relative z-20 h-full flex flex-col justify-end pb-[10vh] px-8 md:px-14 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-3">
              {copy.plane.eyebrow}
            </p>
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-light tracking-[-0.01em] text-white leading-[1.05] mb-4">
              {copy.plane.headline}
            </h2>
            <p className="text-[14px] leading-relaxed text-white/60 max-w-sm">
              {copy.plane.sub}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
