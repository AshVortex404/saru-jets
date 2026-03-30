"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import { buildSequenceUrls, getFrameIndex } from "@/lib/utils";
import { SEQUENCE_1_PATH, SEQUENCE_1_TOTAL } from "@/lib/constants";
import { CTAButton } from "@/components/cta-button";
import { copy } from "@/lib/copy";
import { BookingModal } from "@/components/BookingModal";

const urls = buildSequenceUrls(SEQUENCE_1_PATH, SEQUENCE_1_TOTAL);

export function HeroScroll() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameRef = useRef<number>(-1);

  const { images, loaded } = useImagePreloader(urls);
  const progress = useScrollProgress(containerRef);
  useCanvasSize(canvasRef);

  const frameIndex = useTransform(progress, (p) =>
    getFrameIndex(p, SEQUENCE_1_TOTAL)
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
      // object-cover style draw
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh);
    });
  }, [frameIndex, images, loaded]);

  // Draw first frame on load
  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = images[0];
    if (!img) return;
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
      id="hero"
      className="relative h-[400vh]"
      aria-label="Hero cinematic section"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Bottom fade */}
        <div className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10" />

        {/* Loading indicator */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-1 h-16 bg-white/10 rounded-full overflow-hidden">
              <div className="w-full bg-white/40 rounded-full animate-pulse h-1/3" />
            </div>
          </div>
        )}

        {/* Content overlay */}
        <div className="relative z-20 flex flex-col items-center justify-end h-full pb-[12vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="text-center px-6"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-6">
              {copy.tagline}
            </p>
            <CTAButton
              label={copy.hero.cta}
              id="hero-cta"
              size="lg"
              onClick={() => setBookingOpen(true)}
            />
          </motion.div>
        </div>


      </div>
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
