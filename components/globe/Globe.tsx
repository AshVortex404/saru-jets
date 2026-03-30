"use client";

import { motion } from "framer-motion";
import { GLOBE_VIDEO_PATH, CONTACT } from "@/lib/constants";
import { copy } from "@/lib/copy";

export function Globe() {
  return (
    <section
      id="global"
      className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col justify-end"
      aria-label="Globe footer section"
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          id="globe-video"
          src={GLOBE_VIDEO_PATH}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 to-transparent" />
      </div>

      {/* Oversized background text */}
      <div
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="text-[clamp(6rem,20vw,18rem)] font-extralight tracking-[-0.04em] text-white/[0.03] select-none whitespace-nowrap">
          GLOBAL
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-14 lg:px-24 pb-20 pt-48">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/40 mb-6">
              {copy.globe.eyebrow}
            </p>
            <h2 className="text-[clamp(2.2rem,5.5vw,5rem)] font-light tracking-[-0.015em] text-white leading-[1.05] mb-6 max-w-xl">
              {copy.globe.headline}
            </h2>
            <p className="text-[14px] leading-relaxed text-white/55 max-w-sm mb-12">
              {copy.globe.sub}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-white/[0.08] pt-10"
          >
            {/* Inquiries */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3">
                {copy.globe.inquiries}
              </p>
              <a
                href={`mailto:${CONTACT.email}`}
                id="footer-email"
                className="text-[14px] text-white/70 hover:text-white transition-colors duration-200"
              >
                {CONTACT.email}
              </a>
              <br />
              <a
                href={`tel:${CONTACT.phone}`}
                id="footer-phone"
                className="text-[14px] text-white/70 hover:text-white transition-colors duration-200"
              >
                {CONTACT.phone}
              </a>
            </div>

            {/* Locations */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3">
                Operations
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {copy.globe.locations.map((loc) => (
                  <span key={loc} className="text-[13px] text-white/55">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* Brand statement */}
            <div className="md:text-right">
              <p className="text-[13px] text-white/40 italic leading-relaxed">
                &ldquo;Wherever you need to be,<br />we are already there.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
