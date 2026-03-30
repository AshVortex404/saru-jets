"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ADVANTAGES, STATS } from "@/lib/constants";

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof ADVANTAGES)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-t border-white/[0.08]">
      <button
        id={`advantage-${item.id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-6">
          <span className="text-[11px] uppercase tracking-[0.16em] text-white/40 font-mono w-8">
            {item.id}
          </span>
          <span className="text-[16px] md:text-[18px] font-light tracking-[-0.01em] text-white/90 group-hover:text-white transition-colors duration-200">
            {item.title}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-white/40 text-2xl font-thin ml-4 flex-shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="text-[15px] leading-relaxed text-white/70 pb-6 pl-14 max-w-md">
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Advantages() {
  const [openId, setOpenId] = useState<string | null>("01");

  return (
    <section
      id="advantages"
      className="relative bg-[#0b0b0b] py-32 md:py-44 px-8 md:px-14 lg:px-24"
      aria-label="Advantages section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mb-16 flex items-end justify-between flex-wrap gap-8"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/55 mb-4">
              Why Choose Us
            </p>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light tracking-[-0.02em] text-white">
              The Standard
            </h2>
          </div>

          {/* Stats */}
          <div className="flex gap-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-right">
                <p className="text-[2.2rem] font-extralight tracking-[-0.03em] text-white">
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/55 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {ADVANTAGES.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
          <div className="border-t border-white/[0.08]" />
        </motion.div>
      </div>
    </section>
  );
}
