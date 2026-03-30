"use client";

import { motion } from "framer-motion";
import { copy } from "@/lib/copy";
import { NAV_LINKS } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="relative bg-[#050505] border-t border-white/[0.06] px-8 md:px-14 lg:px-24 py-10"
      role="contentinfo"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <p className="text-[11px] text-white/30 tracking-wide">{copy.footer.copy}</p>

        <div className="flex items-center gap-6">
          {copy.footer.links.map((link) => (
            <Link
              key={link}
              href="#"
              id={`footer-${link.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.14em] text-white/30 hover:text-white/70 transition-colors duration-200"
            >
              {link}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-white/30">
          {NAV_LINKS.map((l, i) => (
            <span key={l.label}>
              <Link href={l.href} className="hover:text-white/60 transition-colors duration-200">
                {l.label}
              </Link>
              {i < NAV_LINKS.length - 1 && <span className="ml-4 opacity-30">/</span>}
            </span>
          ))}
        </div>
      </motion.div>
    </footer>
  );
}
