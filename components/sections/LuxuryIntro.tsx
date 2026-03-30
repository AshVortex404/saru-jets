"use client";

import { motion, type Variants } from "framer-motion";
import { CTAButton } from "@/components/cta-button";
import { copy } from "@/lib/copy";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export function LuxuryIntro() {
  return (
    <section
      id="about"
      className="relative bg-[#050505] py-32 md:py-44 px-8 md:px-14 lg:px-24 overflow-hidden"
      aria-label="Luxury intro section"
    >
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Big headline */}
        <div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="overflow-hidden"
          >
            <motion.p
              variants={fadeUp}
              className="text-[10px] uppercase tracking-[0.24em] text-white/40 mb-7"
            >
              The Experience
            </motion.p>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
              className="text-[clamp(4rem,9vw,8rem)] font-extralight leading-[0.95] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)" }}
            >
              <span className="block">{copy.intro.headlineLine1}</span>
              <span className="block italic text-white/85">{copy.intro.headlineLine2}</span>
            </motion.h2>
          </div>
        </div>

        {/* Right: Body + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.25 }}
          className="space-y-10"
        >
          <p className="text-[16px] md:text-[17px] leading-[1.85] text-white/72 max-w-sm">
            {copy.intro.body}
          </p>

          <div className="flex items-center gap-6">
            <CTAButton
              label={copy.intro.cta}
              href="#fleet"
              id="intro-cta"
              size="md"
            />
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Hairline separator */}
          <div className="border-t border-white/[0.08] pt-8">
            <p className="text-[12px] uppercase tracking-[0.18em] text-white/45">
              Charter &middot; Membership &middot; Concierge
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
